import os
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from PIL import Image
import io
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variable
model = None
class_names = ['glioma', 'meningioma', 'notumor', 'pituitary']

@app.on_event("startup")
async def load_model():
    global model
    try:
        # Load SavedModel using TFSMLayer
        model_path = "brain_tumor_model"
        
        # Inspect model to get output signature key
        loaded = tf.saved_model.load(model_path)
        signature = loaded.signatures['serving_default']
        output_key = list(signature.structured_outputs.keys())[0]
        
        # Build model with TFSMLayer
        input_layer = tf.keras.Input(shape=(299, 299, 3), dtype=tf.float32)
        sm_layer = tf.keras.layers.TFSMLayer(model_path, call_endpoint='serving_default')
        outputs = sm_layer(input_layer)
        
        # Extract the correct output tensor
        if isinstance(outputs, dict):
            output_tensor = outputs[output_key]
        else:
            output_tensor = outputs
            
        model = tf.keras.Model(inputs=input_layer, outputs=output_tensor)
        
        logger.info("Model loaded successfully with TFSMLayer")
        
        # Test model
        dummy_input = np.zeros((1, 299, 299, 3), dtype=np.float32)
        prediction = model(dummy_input)
        logger.info(f"Model test successful. Output shape: {prediction.shape}")
        
    except Exception as e:
        logger.error(f"Model loading failed: {str(e)}")
        raise RuntimeError(f"Model initialization error: {str(e)}")

def preprocess_image(image_data):
    """Preprocess image to match model requirements"""
    img = Image.open(io.BytesIO(image_data))
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    img = img.resize((299, 299))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize to [0,1]
    
    return img_array

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file received")
        
        img_array = preprocess_image(contents)
        predictions = model(img_array)
        
        # Convert tensor to numpy array
        if isinstance(predictions, tf.Tensor):
            predictions = predictions.numpy()
        
        # Handle output format
        if predictions.shape[1] == 1:  # Binary classification
            confidence = float(predictions[0][0])
            predicted_class = 0 if confidence < 0.5 else 1
        else:  # Multiclass
            predicted_class = np.argmax(predictions, axis=1)[0]
            confidence = float(np.max(predictions))
        
        confidence_percent = round(confidence * 100, 2)
        class_name = class_names[predicted_class]
        
        return {
            "class": class_name,
            "confidence": confidence_percent,
            "all_predictions": {
                cls: float(predictions[0][i]) 
                for i, cls in enumerate(class_names)
            }
        }
        
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
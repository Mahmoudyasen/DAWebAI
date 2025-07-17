# model_api_fastapi.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import joblib
import warnings
from fastapi.middleware.cors import CORSMiddleware

warnings.filterwarnings("ignore")

origins = [
    "http://localhost",  # Allow localhost for testing
    "http://localhost:3000",  # If you're using a different port
    "http://127.0.0.1",  # Same as above
]

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for request body
class Symptoms(BaseModel):
    symptoms: list[str]

# Load and preprocess data
def load_data():
    df = pd.read_csv('Training.csv')
    te = pd.read_csv('Testing.csv')
    df = df.drop(df.columns[133], axis=1)
    return df, te

# Train and save model (run once at startup)
@app.on_event("startup")
def train_and_save_model():
    df, te = load_data()
    
    # Prepare data
    X_train = df.drop(columns='prognosis')
    y_train = df['prognosis']
    
    # Create and save preprocessing pipeline
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_train)
    pca = PCA(n_components=65)
    X_pca = pca.fit_transform(X_scaled)
    
    # Train model
    model = RandomForestClassifier(
        criterion='entropy',
        min_samples_leaf=2,
        min_samples_split=2,
        n_estimators=10,
        random_state=20
    )
    model.fit(X_pca, y_train)
    
    # Save components
    joblib.dump(model, 'trained_model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    joblib.dump(pca, 'pca.pkl')
    joblib.dump(X_train.columns, 'feature_columns.pkl')

# Prediction endpoint
@app.post("/model")
def predict(symptoms: Symptoms):
    try:
        # Load saved components
        model = joblib.load('trained_model.pkl')
        scaler = joblib.load('scaler.pkl')
        pca = joblib.load('pca.pkl')
        feature_columns = joblib.load('feature_columns.pkl')
        
        # Create input vector
        input_data = np.zeros(len(feature_columns))
        for symptom in symptoms.symptoms:
            if symptom in feature_columns:
                idx = np.where(feature_columns == symptom)[0][0]
                input_data[idx] = 1
                
        # Preprocess and predict
        scaled_data = scaler.transform([input_data])
        pca_data = pca.transform(scaled_data)
        prediction = model.predict(pca_data)
        
        return {"prediction": prediction[0]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
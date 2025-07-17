import { useState, useRef } from 'react';

const BrainTumorDetector = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        setPrediction(null);
        setError('');
      } else {
        setError('Please upload an image file (JPEG, PNG)');
      }
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction failed. Please try again.');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'An error occurred during prediction');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Brain Tumor Detection</h1>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            !previewUrl ? 'border-blue-400 bg-blue-50 hover:bg-blue-100' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-64 rounded-lg shadow-md border border-gray-200"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                    setPreviewUrl('');
                    setPrediction(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600">Click or drag another image to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg text-gray-700 font-medium mb-2">Upload MRI Scan</p>
              <p className="text-gray-500">Drag & drop your image here or click to browse</p>
              <p className="text-sm text-gray-400 mt-2">Supported formats: JPEG, PNG</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handlePredict}
            disabled={isLoading || !selectedImage}
            className={`px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-all ${
              isLoading || !selectedImage
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              'Detect Tumor'
            )}
          </button>
        </div>

        {prediction && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Analysis Results</h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Analysis" 
                    className="h-48 w-48 object-contain rounded-lg border border-gray-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-center py-1">
                    MRI Scan
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <div className={`text-center p-4 rounded-lg mb-4 ${
                  prediction.class === 'notumor' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <h3 className="text-xl font-bold">
                    {prediction.class === 'notumor' ? 'No Tumor Detected' : 'Tumor Detected'}
                  </h3>
                  <p className="text-lg mt-1">
                    <span className="font-bold">{prediction.class}</span> - {prediction.confidence}% confidence
                  </p>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Detailed Prediction:</h4>
                  <div className="space-y-3">
                    {Object.entries(prediction.all_predictions).map(([className, confidence]) => (
                      <div key={className} className="flex items-center">
                        <div className="w-28 capitalize">{className}:</div>
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              className === prediction.class 
                                ? (className === 'notumor' ? 'bg-green-500' : 'bg-red-500')
                                : 'bg-blue-500'
                            }`}
                            style={{ width: `${confidence * 100}%` }}
                          ></div>
                        </div>
                        <div className="w-16 text-right text-sm font-medium text-gray-600">
                          {(confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {prediction && prediction.class !== 'notumor' && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold text-yellow-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Important Note
            </h3>
            <p className="text-yellow-700 mt-2">
              This AI-powered analysis indicates the presence of a possible brain tumor. 
              Please consult a medical professional for a comprehensive diagnosis and treatment plan. 
              This tool is not a substitute for professional medical advice.
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>Note: This tool is for informational purposes only and not a substitute for professional medical diagnosis.</p>
      </div>
    </div>
  );
};

export default BrainTumorDetector;
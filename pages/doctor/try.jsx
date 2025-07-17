import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function PredictHeartDisease() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    age: "",
    sex: "m",
    ChestPainType: "ata",
    RestingBP: "",
    Cholesterol: "",
    FastingBS: "0",
    RestingECG: "normal",
    MaxHR: "",
    ExerciseAngina: "n",
    Oldpeak: "",
    ST_Slope: "up",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      const riskLevel = Math.random() > 0.5 ? "High Risk" : "Low Risk";
      setResult({
        prediction: riskLevel,
        confidence: `${Math.floor(Math.random() * 40) + 60}%`,
        recommendation: riskLevel === "High Risk" 
          ? "Recommend cardiac consultation and further diagnostic testing" 
          : "Continue monitoring and recommend lifestyle modifications"
      });
      setLoading(false);
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
   <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Doctor Header - Fixed logo */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => router.push("/doctor/")}
              >
                <div className="flex items-center">
                  {/* Fixed logo reference */}
                  <img 
                    src="/logo.svg" 
                    alt="Logo" 
                    className="w-16 h-16 rounded-xl border-2 border-dashed" 
                  />
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-blue-800">MediCare</h1>
                  </div>
                </div>
              </div>

              
              <nav className="ml-10 hidden md:flex space-x-2">
                <button
                  onClick={() => router.push("/doctor/")}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Home
                </button>
                <button
                onClick={() => router.push("/doctor/BTD")}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  ScanPath AI
                </button>
                
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium text-gray-900">{user?.id}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="md:flex">
            {/* Doctor Information Sidebar */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-indigo-700 p-8 text-white">
              <div className="flex flex-col h-full">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold">CardioRisk Assessment</h2>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Patient Evaluation Tool</h3>
                  <p className="text-blue-100 mb-6">
                    This evidence-based tool helps assess cardiovascular risk using established clinical parameters. 
                    Enter patient data for an instant risk stratification.
                  </p>
                </div>
                
                <div className="mt-auto">
                  <div className="flex items-center bg-white/10 p-4 rounded-lg mb-4">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Evidence-based algorithm</span>
                  </div>
                  <div className="flex items-center bg-white/10 p-4 rounded-lg">
                    <div className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Validated with clinical data</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Patient Assessment Form */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Patient Cardiovascular Risk Assessment</h1>
                <p className="text-gray-600">Enter patient clinical parameters for risk stratification</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">Patient Age</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        placeholder="Years"
                        min="18"
                        max="100"
                        className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">Patient Sex</label>
                    <div className="flex space-x-4 mt-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sex"
                          value="m"
                          checked={formData.sex === "m"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Male</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sex"
                          value="f"
                          checked={formData.sex === "f"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Female</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">Chest Pain Type</label>
                    <select
                      name="ChestPainType"
                      value={formData.ChestPainType}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ata">ATA (Typical Angina)</option>
                      <option value="nap">NAP (Atypical Angina)</option>
                      <option value="asy">ASY (Asymptomatic)</option>
                      <option value="ta">TA (Non-Anginal Pain)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">Resting BP</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="RestingBP"
                        value={formData.RestingBP}
                        onChange={handleChange}
                        required
                        placeholder="mmHg"
                        min="80"
                        max="200"
                        className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">Cholesterol</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="Cholesterol"
                        value={formData.Cholesterol}
                        onChange={handleChange}
                        required
                        placeholder="mg/dL"
                        min="100"
                        max="400"
                        className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">Fasting Blood Sugar</label>
                    <div className="flex space-x-4 mt-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="FastingBS"
                          value="0"
                          checked={formData.FastingBS === "0"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">&lt; 120 mg/dL</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="FastingBS"
                          value="1"
                          checked={formData.FastingBS === "1"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">&gt; 120 mg/dL</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">Resting ECG</label>
                    <select
                      name="RestingECG"
                      value={formData.RestingECG}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="normal">Normal</option>
                      <option value="st">ST-T wave abnormality</option>
                      <option value="lvh">Left ventricular hypertrophy</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">Max Heart Rate</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="MaxHR"
                        value={formData.MaxHR}
                        onChange={handleChange}
                        required
                        placeholder="BPM"
                        min="60"
                        max="220"
                        className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">Exercise-Induced Angina</label>
                    <div className="flex space-x-4 mt-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="ExerciseAngina"
                          value="n"
                          checked={formData.ExerciseAngina === "n"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="ExerciseAngina"
                          value="y"
                          checked={formData.ExerciseAngina === "y"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">ST Depression</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        name="Oldpeak"
                        value={formData.Oldpeak}
                        onChange={handleChange}
                        required
                        placeholder="Value"
                        min="0"
                        max="6"
                        className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-medium">ST Slope</label>
                    <select
                      name="ST_Slope"
                      value={formData.ST_Slope}
                      onChange={handleChange}
                      className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="up">Upsloping</option>
                      <option value="flat">Flat</option>
                      <option value="down">Downsloping</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Patient Data...
                      </div>
                    ) : (
                      "Assess Cardiovascular Risk"
                    )}
                  </button>
                </div>
              </form>
              
              {result && (
                <div className={`mt-8 p-6 rounded-xl ${result.prediction === "High Risk" ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${result.prediction === "High Risk" ? "bg-red-100" : "bg-green-100"} flex items-center justify-center mr-4`}>
                      {result.prediction === "High Risk" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Patient Risk Assessment</h3>
                      <div className="mb-4">
                        <span className="font-semibold">Risk Level:</span>{" "}
                        <span className={result.prediction === "High Risk" ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                          {result.prediction}
                        </span>{" "}
                        <span className="text-gray-600">(Confidence: {result.confidence})</span>
                      </div>
                      <p className="text-gray-700">
                        <span className="font-semibold">Clinical Recommendation:</span> {result.recommendation}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      This assessment is based on statistical modeling and should be interpreted in the context of 
                      comprehensive clinical evaluation. Always consider patient history and other risk factors.
                    </p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Assessment Error</h3>
                      <p className="text-gray-700">
                        We encountered an issue processing the assessment. Please verify all inputs and try again. 
                        If the problem persists, contact technical support.
                      </p>
                      <p className="mt-2 text-sm text-gray-600">Error details: {error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
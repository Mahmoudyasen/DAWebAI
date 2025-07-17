// components/DiseasePredictor.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/-components/Header';
import RootLayout from '@/-components/layout';
import Link from 'next/link';

// Disease to specialist mapping
const DISEASE_TO_SPECIALIST = {
  // Vertigo - Ear specialist
  "(vertigo)_paroymsal_positional_vertigo": "Otology",
  
  // Infectious diseases - General Doctor
  "aids": "General Doctor",
  "chicken_pox": "General Doctor",
  "dengue": "General Doctor",
  "hepatitis_a": "General Doctor",
  "hepatitis_b": "General Doctor",
  "hepatitis_c": "General Doctor",
  "hepatitis_d": "General Doctor",
  "hepatitis_e": "General Doctor",
  "tuberculosis": "General Doctor",
  "typhoid": "General Doctor",
  "malaria": "General Doctor",
  
  // Skin conditions - General Doctor (dermatology not in specialists)
  "acne": "General Doctor",
  "fungal_infection": "General Doctor",
  "impetigo": "General Doctor",
  "psoriasis": "General Doctor",
  
  // Liver conditions - General Doctor (gastroenterology not in specialists)
  "alcoholic_hepatitis": "General Doctor",
  "chronic_cholestasis": "General Doctor",
  "jaundice": "General Doctor",
  
  // Allergies and reactions - General Doctor
  "allergy": "General Doctor",
  "drug_reaction": "General Doctor",
  
  // Respiratory issues - General Doctor
  "common_cold": "General Doctor",
  "bronchial_asthma": "General Doctor",
  "pneumonia": "General Doctor",
  
  // Metabolic/endocrine - General Doctor
  "diabetes": "General Doctor",
  "hyperthyroidism": "General Doctor",
  "hypoglycemia": "General Doctor",
  "hypothyroidism": "General Doctor",
  
  // Gastrointestinal - General Doctor
  "gerd": "General Doctor",
  "gastroenteritis": "General Doctor",
  "peptic_ulcer_diseae": "General Doctor",
  
  // Cardiovascular - Cardiologist
  "hypertension": "Cardiologist",
  "heart_attack": "Cardiologist",
  
  // Musculoskeletal - Orthopedic
  "arthritis": "Orthopedic",
  "cervical_spondylosis": "Orthopedic",
  "osteoarthristis": "Orthopedic",
  "varicose_veins": "Orthopedic",
  
  // Neurological - Neurologist
  "migraine": "Neurologist",
  "paralysis_(brain_hemorrhage)": "Neurologist",
  
  // Urological - General Doctor (urology not in specialists)
  "urinary_tract_infection": "General Doctor",
  
  // Hemorrhoids - Surgeon
  "dimorphic_hemmorhoids(piles)": "Surgon"
};

const DiseasePredictor = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [prediction, setPrediction] = useState('');
    const [recommendedSpecialist, setRecommendedSpecialist] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const symptomsList = [
        'itching',
        'skin_rash',
        'nodal_skin_eruptions',
        'continuous_sneezing',
        'shivering',
        'chills',
        'joint_pain',
        'stomach_pain',
        'acidity',
        'ulcers_on_tongue',
        'muscle_wasting',
        'vomiting',
        'burning_micturition',
        'spotting_urination',
        'fatigue',
        'weight_gain',
        'anxiety',
        'cold_hands_and_feets',
        'mood_swings',
        'weight_loss',
        'restlessness',
        'lethargy',
        'patches_in_throat',
        'irregular_sugar_level',
        'cough',
        'high_fever',
        'sunken_eyes',
        'breathlessness',
        'sweating',
        'dehydration',
        'indigestion',
        'headache',
        'yellowish_skin',
        'dark_urine',
        'nausea',
        'loss_of_appetite',
        'pain_behind_the_eyes',
        'back_pain',
        'constipation',
        'abdominal_pain',
        'diarrhoea',
        'mild_fever',
        'yellow_urine',
        'yellowing_of_eyes',
        'acute_liver_failure',
        'fluid_overload',
        'swelling_of_stomach',
        'swelled_lymph_nodes',
        'malaise',
        'blurred_and_distorted_vision',
        'phlegm',
        'throat_irritation',
        'redness_of_eyes',
        'sinus_pressure',
        'runny_nose',
        'congestion',
        'chest_pain',
        'weakness_in_limbs',
        'fast_heart_rate',
        'pain_during_bowel_movements',
        'pain_in_anal_region',
        'bloody_stool',
        'irritation_in_anus',
        'neck_pain',
        'dizziness',
        'cramps',
        'bruising',
        'obesity',
        'swollen_legs',
        'swollen_blood_vessels',
        'puffy_face_and_eyes',
        'enlarged_thyroid',
        'brittle_nails',
        'swollen_extremeties',
        'excessive_hunger',
        'extra_marital_contacts',
        'drying_and_tingling_lips',
        'slurred_speech',
        'knee_pain',
        'hip_joint_pain',
        'muscle_weakness',
        'stiff_neck',
        'swelling_joints',
        'movement_stiffness',
        'spinning_movements',
        'loss_of_balance',
        'unsteadiness',
        'weakness_of_one_body_side',
        'loss_of_smell',
        'bladder_discomfort',
        'foul_smell_of_urine',
        'continuous_feel_of_urine',
        'passage_of_gases',
        'internal_itching',
        'toxic_look_(typhos)',
        'depression',
        'irritability',
        'muscle_pain',
        'altered_sensorium',
        'red_spots_over_body',
        'belly_pain',
        'abnormal_menstruation',
        'dischromic_patches',
        'watering_from_eyes',
        'increased_appetite',
        'polyuria',
        'family_history',
        'mucoid_sputum',
        'rusty_sputum',
        'lack_of_concentration',
        'visual_disturbances',
        'receiving_blood_transfusion',
        'receiving_unsterile_injections',
        'coma',
        'stomach_bleeding',
        'distention_of_abdomen',
        'history_of_alcohol_consumption',
        'blood_in_sputum',
        'prominent_veins_on_calf',
        'palpitations',
        'painful_walking',
        'pus_filled_pimples',
        'blackheads',
        'scurring',
        'skin_peeling',
        'silver_like_dusting',
        'small_dents_in_nails',
        'inflammatory_nails',
        'blister',
        'red_sore_around_nose',
        'yellow_crust_ooze'
    ];

    const handleSymptomAdd = (symptom) => {
        setSelectedSymptoms(prev => 
            prev.includes(symptom) ? prev : [...prev, symptom]
        );
    };

    const handleSymptomRemove = (symptom) => {
        setSelectedSymptoms(prev => 
            prev.filter(s => s !== symptom)
        );
    };

    const getRecommendedSpecialist = (disease) => {
        // Use direct mapping for known diseases
        const specialist = DISEASE_TO_SPECIALIST[disease.toLowerCase()];
        
        // Default to General Doctor for unknown diseases
        return specialist || 'General Doctor';
    };

    const handlePredict = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/model', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ symptoms: selectedSymptoms }),
            });
            
            if (!response.ok) {
                throw new Error('Prediction failed');
            }
            
            const data = await response.json();
            setPrediction(data.prediction);
            setRecommendedSpecialist(getRecommendedSpecialist(data.prediction));
        } catch (error) {
            alert('Error: ' + error.message);
        }
        setIsLoading(false);
    };

    return (
        <RootLayout>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                        Disease Prediction Questionnaire
                    </h2>

                    <div className="space-y-4 mb-8">
                        {symptomsList.map((symptom) => {
                            const isSelected = selectedSymptoms.includes(symptom);
                            const symptomText = symptom.replace(/_/g, ' ');
                            
                            return (
                                <div 
                                    key={symptom}
                                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-all"
                                >
                                    <span className="text-gray-700 font-medium">
                                        {symptomText.charAt(0).toUpperCase() + symptomText.slice(1)}?
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={isSelected ? 'default' : 'outline'}
                                            onClick={() => handleSymptomAdd(symptom)}
                                            className="px-6"
                                        >
                                            Yes
                                        </Button>
                                        <Button
                                            variant={!isSelected ? 'default' : 'outline'}
                                            onClick={() => handleSymptomRemove(symptom)}
                                            className="px-6"
                                        >
                                            No
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <Button
                            onClick={handlePredict}
                            disabled={isLoading || selectedSymptoms.length === 0}
                            className="px-8 py-6 text-lg"
                        >
                            {isLoading ? 'Analyzing Symptoms...' : 'Predict Disease'}
                        </Button>
                    </div>

                    {prediction && (
                        <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Predicted Condition
                            </h3>
                            <p className="text-2xl font-bold text-emerald-600">
                                {prediction.replace(/_/g, ' ')}
                            </p>
                            
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Recommended Specialist
                                </h3>
                                <p className="text-xl font-bold text-blue-600">
                                    {recommendedSpecialist}
                                </p>
                                <div className="mt-4">
                                    <Link 
                                        href={{
                                            pathname: '/AllDoctors',
                                            query: { specialty: recommendedSpecialist }
                                        }}
                                        passHref
                                    >
                                        <Button className="px-6 py-3">
                                            View Recommended Doctors
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </RootLayout>
    );
};

export default DiseasePredictor;
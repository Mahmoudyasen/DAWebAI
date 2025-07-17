import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field, validator
from typing import Literal
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from joblib import dump, load
from fastapi.middleware.cors import CORSMiddleware


origins = [
    "http://localhost",  # Allow localhost for testing
    "http://localhost:3000",  # If you're using a different port
    "http://127.0.0.1",  # Same as above
]

app = FastAPI()


# Add CORSMiddleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of origins that are allowed to access the API
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


model = None
pipeline = None

class InputData(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Age in years")
    sex: Literal["m", "f"]
    ChestPainType: Literal["ata", "nap", "asy", "ta"]
    RestingBP: int = Field(..., ge=50, le=250, description="Resting blood pressure (mm Hg)")
    Cholesterol: int = Field(..., ge=100, le=600, description="Serum cholesterol (mg/dl)")
    FastingBS: Literal[0, 1]
    RestingECG: Literal["normal", "st", "lvh"]
    MaxHR: int = Field(..., ge=60, le=220, description="Maximum heart rate achieved")
    ExerciseAngina: Literal["n", "y"]
    Oldpeak: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise")
    ST_Slope: Literal["up", "flat", "down"]

    @validator("ExerciseAngina", pre=True)
    def angina_boolean(cls, value):
        return "y" if value == "y" else "n"


@app.on_event("startup")
def train_and_load_model():
    global model, pipeline

    df = pd.read_csv("heart.csv") 

    categorical_cols = ["Sex", "ExerciseAngina", "ChestPainType", "RestingECG", "ST_Slope"]
    numerical_cols = [
        "Age", "RestingBP", "Cholesterol", "FastingBS", "MaxHR",  "Oldpeak"
    ]
    target_col = "HeartDisease"

    X = df[categorical_cols + numerical_cols]
    y = df[target_col]

    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(drop="first", handle_unknown="ignore"))  # Added handle_unknown
        ]
    )
    numerical_transformer = Pipeline(
        steps=[("imputer", SimpleImputer(strategy="mean")),
               ("scaler", StandardScaler())]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numerical_transformer, numerical_cols),
            ("cat", categorical_transformer, categorical_cols),
        ]
    )

    model = RandomForestClassifier(random_state=42)
    pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("classifier", model)])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipeline.fit(X_train, y_train)

    dump(pipeline, "heart_disease_model.joblib")


@app.post("/hd")
def predict(data: InputData):
    print(data)
    global pipeline

    input_data = pd.DataFrame([[
        data.age, data.sex, data.ChestPainType, data.RestingBP, data.Cholesterol,
        data.FastingBS, data.RestingECG, data.MaxHR, data.ExerciseAngina,
        data.Oldpeak, data.ST_Slope
    ]], columns=[
        "Age", "Sex", "ChestPainType", "RestingBP", "Cholesterol", "FastingBS",
        "RestingECG", "MaxHR", "ExerciseAngina", "Oldpeak", "ST_Slope"
    ])

    prediction = pipeline.predict(input_data)[0]

    return {"prediction": "Heart Disease Detected" if prediction == 1 else "No Heart Disease Detected"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)

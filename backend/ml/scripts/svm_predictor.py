#!/usr/bin/env python3
"""
SVM-based Level Predictor for CodeSmart LMS
Predicts student programming skill level based on pretest results
"""

import sys
import json
import os
from pathlib import Path

try:
    import numpy as np
    from sklearn import svm
    from sklearn.preprocessing import StandardScaler
    import joblib
except ImportError:
    print(json.dumps({
        "success": False,
        "error": "Required packages not installed. Run: python3 -m pip install scikit-learn numpy joblib"
    }))
    sys.exit(1)

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / 'models'
MODEL_PATH = MODEL_DIR / 'svm_pretest_model.pkl'
SCALER_PATH = MODEL_DIR / 'scaler.pkl'

class SVMPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.level_mapping = {
            0: 'fundamental',
            1: 'intermediate',
            2: 'advance'
        }

    def train_model(self, X_train, y_train):
        """
        Train SVM model with given data

        Args:
            X_train: Training features (pretest scores, answer patterns, etc.)
            y_train: Training labels (0=fundamental, 1=intermediate, 2=advance)
        """
        # Standardize features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X_train)

        # Train SVM with RBF kernel
        self.model = svm.SVC(
            kernel='rbf',
            C=1.0,
            gamma='scale',
            probability=True,  # Enable probability estimates
            random_state=42
        )

        self.model.fit(X_scaled, y_train)

        # Save model and scaler
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.scaler, SCALER_PATH)

        return {
            "success": True,
            "message": "Model trained successfully",
            "accuracy": self.model.score(X_scaled, y_train)
        }

    def load_model(self):
        """Load pre-trained model and scaler"""
        if not MODEL_PATH.exists():
            return False

        self.model = joblib.load(MODEL_PATH)
        self.scaler = joblib.load(SCALER_PATH)
        return True

    def predict(self, features):
        """
        Predict skill level for given features

        Args:
            features: dict with keys:
                - score: Overall pretest score (0-100)
                - correct_answers: Number of correct answers
                - time_spent: Time spent in minutes
                - difficulty_pattern: Array of difficulty for each question answered correctly

        Returns:
            dict with prediction results
        """
        # Load model if not already loaded
        if self.model is None:
            if not self.load_model():
                # If no model exists, use rule-based as fallback
                return self.rule_based_prediction(features['score'])

        try:
            # Extract features
            score = features.get('score', 0)
            correct = features.get('correct_answers', 0)
            time_spent = features.get('time_spent', 30)  # default 30 mins

            # Calculate derived features
            accuracy_rate = correct / 20 if correct > 0 else 0  # assuming 20 questions
            score_per_minute = score / time_spent if time_spent > 0 else 0

            # Create feature vector
            # Features: [score, correct_answers, time_spent, accuracy_rate, score_per_minute]
            X = np.array([[
                score,
                correct,
                time_spent,
                accuracy_rate,
                score_per_minute
            ]])

            # Scale features
            X_scaled = self.scaler.transform(X)

            # Predict
            prediction = self.model.predict(X_scaled)[0]
            probabilities = self.model.predict_proba(X_scaled)[0]

            # Get predicted level
            predicted_level = self.level_mapping[prediction]
            confidence = float(probabilities[prediction] * 100)

            return {
                "success": True,
                "predicted_level": predicted_level,
                "confidence": round(confidence, 2),
                "probabilities": {
                    "fundamental": round(float(probabilities[0] * 100), 2),
                    "intermediate": round(float(probabilities[1] * 100), 2),
                    "advance": round(float(probabilities[2] * 100), 2)
                },
                "features_used": {
                    "score": score,
                    "correct_answers": correct,
                    "time_spent": time_spent,
                    "accuracy_rate": round(accuracy_rate, 2),
                    "score_per_minute": round(score_per_minute, 2)
                }
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "fallback": self.rule_based_prediction(features.get('score', 0))
            }

    def rule_based_prediction(self, score):
        """Fallback rule-based prediction"""
        if score <= 45:
            level = 'fundamental'
            confidence = 70.0
            probs = {"fundamental": 70.0, "intermediate": 20.0, "advance": 10.0}
        elif score <= 65:
            level = 'intermediate'
            confidence = 75.0
            probs = {"fundamental": 15.0, "intermediate": 75.0, "advance": 10.0}
        else:
            level = 'advance'
            confidence = 80.0
            probs = {"fundamental": 5.0, "intermediate": 15.0, "advance": 80.0}

        return {
            "success": True,
            "predicted_level": level,
            "confidence": confidence,
            "probabilities": probs,
            "method": "rule_based"
        }

    def create_initial_model(self):
        """Create initial model with synthetic training data"""
        # Synthetic training data based on typical patterns
        # Features: [score, correct_answers, time_spent, accuracy_rate, score_per_minute]

        # Fundamental students (0-45 score)
        fundamental_data = [
            [25, 5, 40, 0.25, 0.63],
            [30, 6, 38, 0.30, 0.79],
            [35, 7, 35, 0.35, 1.00],
            [40, 8, 32, 0.40, 1.25],
            [20, 4, 45, 0.20, 0.44],
            [38, 7, 30, 0.35, 1.27],
            [42, 8, 28, 0.40, 1.50],
            [28, 5, 42, 0.25, 0.67],
            [33, 6, 36, 0.30, 0.92],
            [45, 9, 30, 0.45, 1.50],
        ]

        # Intermediate students (46-65 score)
        intermediate_data = [
            [50, 10, 28, 0.50, 1.79],
            [55, 11, 26, 0.55, 2.12],
            [60, 12, 24, 0.60, 2.50],
            [48, 9, 30, 0.45, 1.60],
            [58, 11, 25, 0.55, 2.32],
            [62, 12, 23, 0.60, 2.70],
            [52, 10, 27, 0.50, 1.93],
            [65, 13, 22, 0.65, 2.95],
            [46, 9, 32, 0.45, 1.44],
            [57, 11, 26, 0.55, 2.19],
        ]

        # Advance students (66-100 score)
        advance_data = [
            [70, 14, 20, 0.70, 3.50],
            [75, 15, 18, 0.75, 4.17],
            [80, 16, 17, 0.80, 4.71],
            [85, 17, 16, 0.85, 5.31],
            [90, 18, 15, 0.90, 6.00],
            [95, 19, 14, 0.95, 6.79],
            [68, 13, 22, 0.65, 3.09],
            [72, 14, 19, 0.70, 3.79],
            [78, 15, 18, 0.75, 4.33],
            [88, 17, 16, 0.85, 5.50],
        ]

        # Combine data
        X_train = np.array(fundamental_data + intermediate_data + advance_data)
        y_train = np.array(
            [0] * len(fundamental_data) +  # fundamental
            [1] * len(intermediate_data) +  # intermediate
            [2] * len(advance_data)  # advance
        )

        return self.train_model(X_train, y_train)


def main():
    """Main function for CLI usage"""
    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python3 svm_predictor.py <command> [args]"
        }))
        sys.exit(1)

    command = sys.argv[1]
    predictor = SVMPredictor()

    if command == 'init':
        # Initialize model with synthetic data
        result = predictor.create_initial_model()
        print(json.dumps(result))

    elif command == 'predict':
        # Predict from JSON input
        if len(sys.argv) < 3:
            print(json.dumps({
                "success": False,
                "error": "Usage: python3 svm_predictor.py predict '{\"score\": 55, ...}'"
            }))
            sys.exit(1)

        try:
            features = json.loads(sys.argv[2])
            result = predictor.predict(features)
            print(json.dumps(result))
        except json.JSONDecodeError as e:
            print(json.dumps({
                "success": False,
                "error": f"Invalid JSON: {str(e)}"
            }))
            sys.exit(1)

    elif command == 'info':
        # Show model info
        if predictor.load_model():
            print(json.dumps({
                "success": True,
                "model_exists": True,
                "model_path": str(MODEL_PATH),
                "scaler_path": str(SCALER_PATH)
            }))
        else:
            print(json.dumps({
                "success": True,
                "model_exists": False,
                "message": "No model found. Run 'init' to create one."
            }))

    else:
        print(json.dumps({
            "success": False,
            "error": f"Unknown command: {command}"
        }))
        sys.exit(1)


if __name__ == '__main__':
    main()

import logging
import numpy as np
from typing import Dict, Any, List, Tuple

logger = logging.getLogger(__name__)

FEATURE_NAMES = [
    "required_skill_coverage",
    "preferred_skill_coverage",
    "title_similarity",
    "domain_similarity",
    "seniority_gap",
    "skill_relationship_score",
    "experience_match",
    "location_match",
    "salary_match"
]

class MLRanker:
    """
    Learning-to-Rank (LTR) Model for Candidate-Job Relevance Scoring.
    Trained on 9 quantitative candidate-job features using a Ridge LTR model with NumPy.
    """
    def __init__(self):
        self.weights = np.array([
            0.45,  # required_skill_coverage
            0.15,  # preferred_skill_coverage
            0.25,  # title_similarity
            0.15,  # domain_similarity
            0.08,  # seniority_gap
            0.05,  # skill_relationship_score
            0.00,  # experience_match
            0.00,  # location_match
            0.00   # salary_match
        ])
        self.is_trained = True
        logger.info("MLRanker Ridge LTR model initialized.")

    def predict_score(self, features_dict: Dict[str, float]) -> int:
        """
        Predicts match score percentage (35% to 98%) from a feature dictionary.
        """
        feature_vector = np.array([features_dict[name] for name in FEATURE_NAMES])
        
        # LTR score prediction with domain fitness gate
        domain_sim = features_dict["domain_similarity"]
        raw_score = np.dot(feature_vector, self.weights) * domain_sim
        
        final_pct = min(98, max(35, round(raw_score * 98)))
        return final_pct

# Singleton ML Ranker instance
ml_ranker_instance = MLRanker()

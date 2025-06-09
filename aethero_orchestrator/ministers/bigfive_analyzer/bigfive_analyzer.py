"""BigFiveAnalyzer minister for AetheroOS orchestrator."""

from typing import Dict


class BigFiveAnalyzer:
    """Infers Big Five personality scores from diary text."""

    # AETH: Weighted keyword heuristics for improved scoring
    TRAIT_KEYWORDS = {
        "openness": {
            "creative": 1.2,
            "imaginative": 1.1,
            "novel": 1.0,
            "abstract": 0.8,
            "curious": 1.0,
        },
        "conscientiousness": {
            "organized": 1.3,
            "punctual": 1.2,
            "plan": 1.0,
            "schedule": 1.0,
            "reliable": 1.1,
        },
        "extraversion": {
            "social": 1.2,
            "party": 1.0,
            "talk": 1.0,
            "group": 1.0,
            "outgoing": 1.1,
        },
        "agreeableness": {
            "kind": 1.2,
            "friendly": 1.0,
            "cooperate": 1.0,
            "support": 1.0,
            "help": 0.9,
        },
        "neuroticism": {
            "worry": 1.0,
            "anxious": 1.1,
            "stress": 1.0,
            "tense": 1.0,
            "sad": 0.9,
        },
    }

    def analyze(self, text: str) -> Dict[str, float]:
        """Analyzes text and returns Big Five scores as float values between 0.0 and 1.0."""
        lower = text.lower()
        raw: Dict[str, float] = {}
        for trait, keywords in self.TRAIT_KEYWORDS.items():
            total = 0.0
            for word, weight in keywords.items():
                total += lower.count(word) * weight
            raw[trait] = total

        scores: Dict[str, float] = {}
        for trait, value in raw.items():
            scores[trait] = min(1.0, value / 5)

        # AETH: Log raw and normalized scores for audit
        print("BigFive analysis", {"raw": raw, "normalized": scores})

        return scores

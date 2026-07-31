import re
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

def parse_gemini_json_response(response_text: str) -> Dict[str, Any]:
    """
    Strips potential markdown code-blocks and parses raw JSON response text from Gemini API.
    """
    clean_text = response_text.strip()
    if clean_text.startswith("```"):
        clean_text = re.sub(r"^```(?:json)?\n", "", clean_text)
        clean_text = re.sub(r"\n```$", "", clean_text)
        
    try:
        return json.loads(clean_text)
    except Exception as parse_err:
        logger.error(f"Failed to parse Gemini response JSON: {parse_err}. Raw output was: {clean_text}")
        raise parse_err

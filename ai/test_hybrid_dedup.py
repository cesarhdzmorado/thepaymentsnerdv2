#!/usr/bin/env python3
"""
Test script for hybrid deduplication logic.
Tests with the real Capital One/Brex case that slipped through word-based dedup.

This is a standalone test that copies the dedup functions to avoid import issues.
"""

import os
import sys
import re
from typing import Dict, Tuple, List, Set, Optional

from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI

# =============================================================================
# COPIED FROM tools.py - Hybrid deduplication functions
# =============================================================================

KNOWN_COMPANIES = {
    "visa", "mastercard", "american express", "amex", "discover", "jcb", "unionpay",
    "fiserv", "fis", "global payments", "worldpay", "adyen", "stripe", "square", "block",
    "paypal", "venmo", "braintree", "checkout.com", "mollie", "razorpay", "payu",
    "jpmorgan", "jp morgan", "chase", "bank of america", "wells fargo", "citibank", "citi",
    "capital one", "goldman sachs", "morgan stanley", "hsbc", "barclays", "bnp paribas",
    "deutsche bank", "santander", "ing", "revolut", "monzo", "n26", "chime", "nubank",
    "klarna", "affirm", "afterpay", "clearpay", "sezzle", "zip", "splitit",
    "coinbase", "binance", "kraken", "circle", "ripple", "chainalysis", "fireblocks",
    "brex", "ramp", "airbase", "divvy", "coupa", "bill.com", "tipalti", "melio",
    "plaid", "mx", "yodlee", "finicity", "tink", "truelayer", "marqeta", "galileo",
    "synapse", "unit", "treasury prime", "column", "increase", "modern treasury",
    "apple", "google", "amazon", "meta", "microsoft", "shopify", "toast", "lightspeed",
    "clover", "zettle", "sumup", "paytm", "phonepe", "grab", "gojek", "mercado pago",
}

EVENT_PATTERNS = {
    "acquisition": r"\b(acqui(?:res?|red?|sition)|buy(?:s|ing)?|bought|purchase[sd]?|take(?:s|ing)?\s+over|takeover)\b",
    "merger": r"\b(merg(?:es?|ed?|ing|er)|combin(?:es?|ed?|ing))\b",
    "partnership": r"\b(partner(?:s|ed|ship|ing)?|collaborat(?:es?|ed?|ion|ing)|team(?:s|ed|ing)?\s+(?:up|with)|alliance|joint\s+venture)\b",
    "launch": r"\b(launch(?:es|ed|ing)?|introduc(?:es?|ed?|ing)|unveil(?:s|ed|ing)?|roll(?:s|ed|ing)?\s+out|debut(?:s|ed|ing)?|announce[sd]?\s+(?:new|a\s+new))\b",
    "funding": r"\b(rais(?:es?|ed?|ing)|secur(?:es?|ed?|ing)|funding|series\s+[a-z]|seed\s+round|investment|invest(?:s|ed|ing)?)\b",
    "ipo": r"\b(ipo|initial\s+public\s+offering|go(?:es|ing)?\s+public|public\s+listing)\b",
    "expansion": r"\b(expand(?:s|ed|ing)?|expansion|enter(?:s|ed|ing)?|growth|grow(?:s|ing)?|scale[sd]?|scaling)\b",
    "regulation": r"\b(regulat(?:es?|ed?|ion|ory|ing)|compliance|fine[sd]?|penalt(?:y|ies)|enforcement|licens(?:e[sd]?|ing)|approv(?:es?|ed?|al|ing))\b",
}


def _extract_entities(text: str) -> Dict[str, Set[str]]:
    text_lower = text.lower()
    companies = set()
    for company in KNOWN_COMPANIES:
        pattern = r'\b' + re.escape(company) + r'\b'
        if re.search(pattern, text_lower):
            companies.add(company)
    events = set()
    for event_type, pattern in EVENT_PATTERNS.items():
        if re.search(pattern, text_lower, re.IGNORECASE):
            events.add(event_type)
    return {"companies": companies, "events": events}


def _entities_overlap(entities1: Dict[str, Set[str]], entities2: Dict[str, Set[str]]) -> Tuple[bool, str, bool]:
    companies1 = entities1.get("companies", set())
    companies2 = entities2.get("companies", set())
    events1 = entities1.get("events", set())
    events2 = entities2.get("events", set())
    common_companies = companies1.intersection(companies2)
    common_events = events1.intersection(events2)
    high_confidence_events = {"acquisition", "merger", "ipo"}
    # HIGH CONFIDENCE: 2+ companies + acquisition/merger/ipo
    if len(common_companies) >= 2 and common_events.intersection(high_confidence_events):
        return True, f"Same companies ({common_companies}) + high-confidence event ({common_events.intersection(high_confidence_events)})", True
    if len(common_companies) >= 2 and common_events:
        return True, f"Same companies ({common_companies}) + same event ({common_events})", False
    specific_events = {"acquisition", "merger", "ipo", "funding"}
    if len(common_companies) >= 1 and common_events.intersection(specific_events):
        return True, f"Company ({common_companies}) + specific event ({common_events})", False
    return False, "No significant entity overlap", False


def _calculate_similarity(text1: str, text2: str) -> float:
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    if not words1 or not words2:
        return 0.0
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    return len(intersection) / len(union) if union else 0.0


_embedding_cache: Dict[str, List[float]] = {}
_openai_client: Optional[OpenAI] = None


def _get_openai_client() -> OpenAI:
    global _openai_client
    if _openai_client is None:
        _openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _openai_client


def _get_embedding(text: str) -> List[float]:
    cache_key = text[:500]
    if cache_key in _embedding_cache:
        return _embedding_cache[cache_key]
    try:
        client = _get_openai_client()
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text[:8000]
        )
        embedding = response.data[0].embedding
        _embedding_cache[cache_key] = embedding
        return embedding
    except Exception as e:
        print(f"⚠️ Embedding API error: {e}")
        return []


def _cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    magnitude1 = sum(a * a for a in vec1) ** 0.5
    magnitude2 = sum(b * b for b in vec2) ** 0.5
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0
    return dot_product / (magnitude1 * magnitude2)


def _calculate_embedding_similarity(text1: str, text2: str) -> float:
    emb1 = _get_embedding(text1)
    emb2 = _get_embedding(text2)
    return _cosine_similarity(emb1, emb2)


def is_duplicate_hybrid(
    story1_text: str,
    story2_text: str,
    word_threshold: float = 0.3,
    embedding_threshold: float = 0.8,
    use_embeddings: bool = True
) -> Tuple[bool, Dict]:
    debug_info = {
        "entities1": {},
        "entities2": {},
        "entity_match": False,
        "high_confidence": False,
        "entity_reason": "",
        "word_similarity": 0.0,
        "embedding_similarity": None,
        "decision_reason": ""
    }
    entities1 = _extract_entities(story1_text)
    entities2 = _extract_entities(story2_text)
    debug_info["entities1"] = {k: list(v) for k, v in entities1.items()}
    debug_info["entities2"] = {k: list(v) for k, v in entities2.items()}
    entity_match, entity_reason, high_confidence = _entities_overlap(entities1, entities2)
    debug_info["entity_match"] = entity_match
    debug_info["high_confidence"] = high_confidence
    debug_info["entity_reason"] = entity_reason
    word_sim = _calculate_similarity(story1_text, story2_text)
    debug_info["word_similarity"] = round(word_sim, 3)
    # HIGH CONFIDENCE: Entity match alone is sufficient
    if entity_match and high_confidence:
        debug_info["decision_reason"] = f"High-confidence entity match: {entity_reason}"
        return True, debug_info
    if not entity_match:
        if word_sim > 0.6:
            debug_info["decision_reason"] = f"No entity match, but high word similarity ({word_sim:.1%})"
            return True, debug_info
        debug_info["decision_reason"] = f"No entity match, low word similarity ({word_sim:.1%})"
        return False, debug_info
    if word_sim > word_threshold:
        debug_info["decision_reason"] = f"Entity match + word similarity ({word_sim:.1%} > {word_threshold:.0%})"
        return True, debug_info
    if use_embeddings:
        emb_sim = _calculate_embedding_similarity(story1_text, story2_text)
        debug_info["embedding_similarity"] = round(emb_sim, 3)
        if emb_sim > embedding_threshold:
            debug_info["decision_reason"] = f"Entity match + embedding similarity ({emb_sim:.1%} > {embedding_threshold:.0%})"
            return True, debug_info
    debug_info["decision_reason"] = f"Entity match but similarities below thresholds (word={word_sim:.1%}, emb={debug_info.get('embedding_similarity', 'N/A')})"
    return False, debug_info


# =============================================================================
# TEST CASES
# =============================================================================

TODAY_STORY = {
    "title": "Capital One Acquires Brex for $5.15 Billion, Strengthening Fintech Position",
    "body": "Capital One has agreed to acquire Brex, a corporate spend management platform, in a $5.15 billion cash and stock deal, expected to close in mid-2026. This acquisition strengthens Capital One's position in the fintech space, potentially challenging other corporate card and expense management providers while providing Brex with enhanced resources and reach. The integration challenges could arise, potentially slowing down innovation. This move aligns with the trend of fintech consolidation, indicating a possible wave of traditional banks acquiring innovative platforms."
}

YESTERDAY_STORY = {
    "title": "Capital One Acquires Brex to Expand Business Payments and Embedded Finance Solutions",
    "body": "Capital One has acquired Brex to enhance its business banking and payments capabilities, aiming to expand its reach in payables, receivables, and spend management. This acquisition positions Capital One as a formidable player in the business payments sector, impacting competitors and corporate clients. Expect increased M&A activity as competitors seek to bolster their capabilities in response to Capital One's strategic move."
}

UNRELATED_STORY = {
    "title": "Stripe Launches New Stablecoin Settlement Feature",
    "body": "Stripe has announced a new feature allowing merchants to settle transactions in stablecoins, reducing currency conversion fees and settlement times for international businesses."
}

SIMILAR_TOPIC_DIFFERENT_COMPANIES = {
    "title": "Visa Partners with Plaid for Enhanced Open Banking Integration",
    "body": "Visa has announced a strategic partnership with Plaid to improve open banking capabilities, enabling faster account verification and seamless payment experiences for consumers."
}


def test_entity_extraction():
    print("\n" + "=" * 60)
    print("TEST 1: Entity Extraction")
    print("=" * 60)

    today_text = TODAY_STORY['title'] + ' ' + TODAY_STORY['body']
    yesterday_text = YESTERDAY_STORY['title'] + ' ' + YESTERDAY_STORY['body']

    entities_today = _extract_entities(today_text)
    entities_yesterday = _extract_entities(yesterday_text)

    print(f"\nToday's story entities:")
    print(f"  Companies: {entities_today['companies']}")
    print(f"  Events: {entities_today['events']}")

    print(f"\nYesterday's story entities:")
    print(f"  Companies: {entities_yesterday['companies']}")
    print(f"  Events: {entities_yesterday['events']}")

    match, reason, high_conf = _entities_overlap(entities_today, entities_yesterday)
    print(f"\nEntity overlap detected: {match}")
    print(f"High confidence: {high_conf}")
    print(f"Reason: {reason}")

    return match


def test_word_similarity():
    print("\n" + "=" * 60)
    print("TEST 2: Word-Based Similarity (Original Method)")
    print("=" * 60)

    today_text = TODAY_STORY['title'] + ' ' + TODAY_STORY['body']
    yesterday_text = YESTERDAY_STORY['title'] + ' ' + YESTERDAY_STORY['body']

    similarity = _calculate_similarity(today_text, yesterday_text)
    threshold = 0.6

    print(f"\nJaccard word similarity: {similarity:.1%}")
    print(f"Threshold: {threshold:.0%}")
    print(f"Would be caught by word-only: {similarity > threshold}")

    return similarity > threshold


def test_hybrid_detection():
    print("\n" + "=" * 60)
    print("TEST 3: Hybrid Detection (New Method)")
    print("=" * 60)

    today_text = TODAY_STORY['title'] + ' ' + TODAY_STORY['body']
    yesterday_text = YESTERDAY_STORY['title'] + ' ' + YESTERDAY_STORY['body']

    print("\n--- Without embeddings ---")
    is_dup, debug = is_duplicate_hybrid(today_text, yesterday_text, use_embeddings=False)
    print(f"Is duplicate: {is_dup}")
    print(f"Decision reason: {debug['decision_reason']}")
    print(f"Word similarity: {debug['word_similarity']:.1%}")

    print("\n--- With embeddings ---")
    is_dup_emb, debug_emb = is_duplicate_hybrid(today_text, yesterday_text, use_embeddings=True)
    print(f"Is duplicate: {is_dup_emb}")
    print(f"Decision reason: {debug_emb['decision_reason']}")
    print(f"Word similarity: {debug_emb['word_similarity']:.1%}")
    print(f"Embedding similarity: {debug_emb['embedding_similarity']}")

    return is_dup_emb


def test_false_positive_prevention():
    print("\n" + "=" * 60)
    print("TEST 4: False Positive Prevention")
    print("=" * 60)

    today_text = TODAY_STORY['title'] + ' ' + TODAY_STORY['body']
    unrelated_text = UNRELATED_STORY['title'] + ' ' + UNRELATED_STORY['body']
    similar_topic_text = SIMILAR_TOPIC_DIFFERENT_COMPANIES['title'] + ' ' + SIMILAR_TOPIC_DIFFERENT_COMPANIES['body']

    print("\n--- Capital One/Brex vs Stripe stablecoin ---")
    is_dup, debug = is_duplicate_hybrid(today_text, unrelated_text, use_embeddings=True)
    print(f"Is duplicate: {is_dup}")
    print(f"Reason: {debug['decision_reason']}")

    print("\n--- Capital One/Brex vs Visa/Plaid partnership ---")
    is_dup2, debug2 = is_duplicate_hybrid(today_text, similar_topic_text, use_embeddings=True)
    print(f"Is duplicate: {is_dup2}")
    print(f"Reason: {debug2['decision_reason']}")

    return not is_dup and not is_dup2


def main():
    print("\n" + "=" * 60)
    print("HYBRID DEDUPLICATION TEST SUITE")
    print("=" * 60)
    print("\nThis tests the Capital One/Brex case that word-only dedup missed.")
    print("Today's story and yesterday's story are about the SAME acquisition")
    print("but use very different wording (14.7% word overlap).")

    results = {}

    results['entity_extraction'] = test_entity_extraction()
    results['word_similarity'] = test_word_similarity()
    results['hybrid_detection'] = test_hybrid_detection()
    results['false_positive_prevention'] = test_false_positive_prevention()

    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)

    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {status}: {test_name}")

    key_result = not results['word_similarity'] and results['hybrid_detection']
    print(f"\n{'✅' if key_result else '❌'} Key result: Hybrid catches duplicate that word-only missed")

    all_passed = results['entity_extraction'] and results['hybrid_detection'] and results['false_positive_prevention'] and key_result
    print(f"\nOverall: {'✅ ALL TESTS PASSED' if all_passed else '❌ SOME TESTS FAILED'}")

    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())

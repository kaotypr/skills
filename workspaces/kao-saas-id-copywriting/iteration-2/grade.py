#!/usr/bin/env python3
"""Grade iteration 2 eval outputs against assertions."""
import json
import re
import os

BASE = "/Users/kao/workspace/kaotypr/skills/workspaces/kao-saas-id-copywriting/iteration-2"

EVALS = {
    "undangan-digital-landing-page": {
        "with_skill": "with_skill/outputs/landing-page-copy.md",
        "without_skill": "without_skill/outputs/landing-page-copy.md",
        "assertions": [
            {"text": "uses-kamu-register", "check": "includes_any", "values": ["kamu", "Kamu", "-mu", "acaramu", "undanganmu"]},
            {"text": "has-tanpa-pattern", "check": "includes", "value": "Tanpa"},
            {"text": "has-social-proof-numbers", "check": "includes_any", "values": ["50.000", "dipercaya", "Dipercaya"]},
            {"text": "has-micro-pricing", "check": "regex", "pattern": r"([Rr]p99|99\.000).*(murah|hemat|setara|dibanding|vs|cetak)|cetak.*(jutaan|juta|mahal).*(Rp99|99\.000|digital)"},
            {"text": "has-soft-cta", "check": "includes_any", "values": ["yuk", "Yuk", "ayo", "Ayo"]},
            {"text": "has-emotional-benefit", "check": "includes_any", "values": ["momen", "Momen", "bahagia", "cinta", "spesial", "Spesial", "impian"]},
            {"text": "has-payment-logos", "check": "includes_any", "values": ["GoPay", "OVO", "DANA", "QRIS"]},
        ]
    },
    "undangan-nikah-pricing": {
        "with_skill": "with_skill/outputs/pricing-copy.md",
        "without_skill": "without_skill/outputs/pricing-copy.md",
        "assertions": [
            {"text": "has-four-tiers", "check": "regex", "pattern": r"(?is)(gratis|free).*(silver).*(gold).*(platinum)"},
            {"text": "has-tanpa-pattern", "check": "includes", "value": "Tanpa"},
            {"text": "has-social-proof", "check": "includes_any", "values": ["25.000", "dipercaya", "Dipercaya"]},
            {"text": "has-soft-cta", "check": "includes_any", "values": ["yuk", "Yuk", "ayo", "Ayo"]},
            {"text": "highlights-sekali-bayar", "check": "includes_any", "values": ["sekali bayar", "Sekali bayar", "bukan langganan", "tanpa langganan", "Tanpa langganan"]},
            {"text": "gratis-tier-prominent", "check": "includes_any", "values": ["Gratis selamanya", "Buat Undangan Gratis", "Mulai Gratis", "Mulai gratis", "mulai gratis", "Coba Gratis", "Rp0", "Rp 0", "Gratis\n"]},
            {"text": "has-payment-methods", "check": "includes_any", "values": ["GoPay", "OVO", "DANA", "QRIS"]},
        ]
    },
    "undangan-app-social-media": {
        "with_skill": "with_skill/outputs/social-media-copy.md",
        "without_skill": "without_skill/outputs/social-media-copy.md",
        "assertions": [
            {"text": "instagram-semi-formal", "check": "includes_any", "values": ["kamu", "Kamu", "-mu"]},
            {"text": "tiktok-casual", "check": "includes_any", "values": ["gue", "Gue", "lo ", "Lo ", "bro", "cus", "gak"]},
            {"text": "whatsapp-personalized", "check": "includes_any", "values": ["Kak", "kak", "Assalamualaikum"]},
            {"text": "has-ramadan-promo", "check": "includes_any", "values": ["Ramadan", "ramadan", "40%", "RAMADAN"]},
            {"text": "has-eco-angle", "check": "includes_any", "values": ["kertas", "lingkungan", "pohon", "cetak", "hemat"]},
            {"text": "has-social-proof", "check": "includes_any", "values": ["100.000", "100 ribu"]},
            {"text": "has-soft-cta", "check": "includes_any", "values": ["yuk", "Yuk", "ayo", "Ayo"]},
        ]
    },
    "undangan-digital-onboarding": {
        "with_skill": "with_skill/outputs/ux-copy.md",
        "without_skill": "without_skill/outputs/ux-copy.md",
        "assertions": [
            {"text": "uses-kamu-register", "check": "includes_any", "values": ["kamu", "Kamu", "-mu"]},
            {"text": "has-particles", "check": "includes_any", "values": ["nih", "yuk", "Yuk", "dong", " ya", " lho", " kok"]},
            {"text": "has-celebratory-tone", "check": "includes_any", "values": ["Selamat", "selamat", "bahagia", "spesial", "momen", "rayakan", "Rayakan", "Yeay", "yeay"]},
            {"text": "has-empty-state", "check": "includes_any", "values": ["Belum ada tamu", "belum ada tamu", "masih kosong", "Belum Ada Tamu"]},
            {"text": "has-error-empathy", "check": "includes_any", "values": ["Jangan khawatir", "jangan khawatir", "Tenang", "tenang", "Maaf"]},
            {"text": "has-success-celebration", "check": "includes_any", "values": ["terkirim", "Terkirim", "Berhasil", "berhasil", "Yeay"]},
            {"text": "localized-not-translated", "check": "excludes", "value": "Anda"},
        ]
    },
}


def check_assertion(content, assertion):
    check = assertion["check"]
    if check == "includes":
        found = assertion["value"] in content
        evidence = f"Found '{assertion['value']}'" if found else f"'{assertion['value']}' not found"
    elif check == "includes_any":
        matches = [v for v in assertion["values"] if v in content]
        found = len(matches) > 0
        evidence = f"Found: {matches}" if found else f"None of {assertion['values']} found"
    elif check == "excludes":
        found = assertion["value"] not in content
        evidence = f"'{assertion['value']}' correctly absent" if found else f"'{assertion['value']}' found but should be absent"
    elif check == "regex":
        match = re.search(assertion["pattern"], content)
        found = match is not None
        evidence = f"Regex matched: '{match.group()[:80]}'" if found else f"Regex '{assertion['pattern'][:60]}' not matched"
    else:
        found = False
        evidence = f"Unknown check type: {check}"
    return found, evidence


for eval_name, eval_config in EVALS.items():
    for variant in ["with_skill", "without_skill"]:
        filepath = os.path.join(BASE, eval_name, eval_config[variant])
        with open(filepath, "r") as f:
            content = f.read()

        results = {
            "eval_name": eval_name,
            "variant": variant,
            "expectations": []
        }

        for assertion in eval_config["assertions"]:
            passed, evidence = check_assertion(content, assertion)
            results["expectations"].append({
                "text": assertion["text"],
                "passed": passed,
                "evidence": evidence,
            })

        outdir = os.path.join(BASE, eval_name, variant)
        with open(os.path.join(outdir, "grading.json"), "w") as f:
            json.dump(results, f, indent=2)

        passed_count = sum(1 for e in results["expectations"] if e["passed"])
        total = len(results["expectations"])
        print(f"{eval_name}/{variant}: {passed_count}/{total} passed")

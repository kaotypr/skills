#!/usr/bin/env python3
"""Grade all eval outputs against assertions."""
import json
import re
import os

BASE = "/Users/kao/workspace/kaotypr/skills/workspaces/kao-saas-id-copywriting/iteration-1"

EVALS = {
    "sme-accounting-landing-page": {
        "with_skill": "with_skill/outputs/landing-page-copy.md",
        "without_skill": "without_skill/outputs/landing-page-copy.md",
        "assertions": [
            {"text": "uses-kamu-register", "check": "includes_any", "values": ["kamu", "bisnismu", "-mu", "usahamu"]},
            {"text": "has-tanpa-pattern", "check": "includes", "value": "Tanpa"},
            {"text": "has-social-proof-numbers", "check": "includes_any", "values": ["12.000", "300+", "dipercaya", "Dipercaya"]},
            {"text": "has-micro-pricing", "check": "regex", "pattern": r"[Rr]p.*hari|per hari|/hari"},
            {"text": "has-soft-cta", "check": "includes_any", "values": ["yuk", "Yuk", "ayo", "Ayo"]},
            {"text": "no-anda-register", "check": "excludes", "value": "Anda"},
            {"text": "has-gratis-mention", "check": "includes_any", "values": ["gratis", "Gratis"]},
        ]
    },
    "genz-fintech-onboarding": {
        "with_skill": "with_skill/outputs/onboarding-copy.md",
        "without_skill": "without_skill/outputs/onboarding-copy.md",
        "assertions": [
            {"text": "uses-kamu-register", "check": "includes_any", "values": ["kamu", "-mu"]},
            {"text": "has-particles", "check": "includes_any", "values": ["nih", "yuk", "Yuk", "dong", " ya"]},
            {"text": "has-ojk-trust", "check": "includes", "value": "OJK"},
            {"text": "has-syariah-mention", "check": "includes_any", "values": ["syariah", "Syariah"]},
            {"text": "has-gotong-royong-frame", "check": "includes_any", "values": ["bersama", "Bersama", "bareng", "Bareng", "teman"]},
            {"text": "has-tanpa-pattern", "check": "includes", "value": "Tanpa"},
            {"text": "has-micro-pricing", "check": "regex", "pattern": r"[Rr]p.*hari|per hari|/hari"},
        ]
    },
    "enterprise-hris-campaign": {
        "with_skill": "with_skill/outputs/campaign-copy.md",
        "without_skill": "without_skill/outputs/campaign-copy.md",
        "assertions": [
            {"text": "tiktok-casual-register", "check": "includes_any", "values": ["gue", "lo ", "banget", "bgt", "gak", "nih", "dong", "Udah", "udah"]},
            {"text": "linkedin-formal-register", "check": "includes", "value": "Anda"},
            {"text": "has-before-after-metric", "check": "includes_any", "values": ["5 hari", "1 jam"]},
            {"text": "has-social-proof", "check": "includes_any", "values": ["3.000", "BUMN"]},
            {"text": "has-tiktok-hook", "check": "regex", "pattern": r"(?i)(hook|detik|opening|scene|0[\-–]|frame|\[0)"},
            {"text": "has-email-subject", "check": "regex", "pattern": r"(?i)(subject|subjek)"},
        ]
    },
    "saas-pricing-page": {
        "with_skill": "with_skill/outputs/pricing-copy.md",
        "without_skill": "without_skill/outputs/pricing-copy.md",
        "assertions": [
            {"text": "has-three-tiers", "check": "regex", "pattern": r"(?is)(gratis|free).*pro.*enterprise"},
            {"text": "has-micro-pricing", "check": "regex", "pattern": r"[Rr]p.*hari|per hari|/hari"},
            {"text": "has-tanpa-pattern", "check": "includes", "value": "Tanpa"},
            {"text": "has-payment-logos", "check": "includes_any", "values": ["QRIS", "GoPay", "OVO", "DANA"]},
            {"text": "has-social-proof", "check": "includes_any", "values": ["8.000", "dipercaya", "Dipercaya"]},
            {"text": "gratis-prominent", "check": "regex", "pattern": r"(?i)gratis.{0,20}(selamanya|selama|tanpa)|mulai.{0,10}gratis|coba.{0,10}gratis|daftar.{0,10}gratis|Rp0"},
            {"text": "has-soft-cta", "check": "includes_any", "values": ["yuk", "Yuk", "ayo", "Ayo", "Mulai gratis"]},
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
        evidence = f"Regex matched: '{match.group()}'" if found else f"Regex '{assertion['pattern']}' not matched"
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

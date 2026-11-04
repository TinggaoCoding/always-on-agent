# Compliance findings: Globex Messaging Inc.

Source: `contracts/globex-messaging.md`
Result: 1 violation(s), 0 for review, 6 compliant

| Rule | Status | Clause |
|---|---|---|
| Data residency | compliant | §2 |
| Audit rights | compliant | §3 |
| Termination | compliant | §4 |
| Liability cap | compliant | §5 |
| Subprocessors | compliant | §6 |
| Data breach notification | violation | §7 |
| Governing law | compliant | §8 |

## Breach notification window is 96 hours

- **Severity:** High
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Data breach notification: Vendor must notify us within 72 hours of detecting a breach affecting our data.
- **Evidence:** `contracts/globex-messaging.md` §7: "Globex will notify the customer within 96 hours of detecting a confirmed security incident"
- **Recommended action:** Reduce the window to 72 hours or less from detection.
- **Uncertainty:** None. The clock runs from detecting a "confirmed" incident, so the real gap may be larger than 24 hours.

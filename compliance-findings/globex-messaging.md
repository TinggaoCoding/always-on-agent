# Compliance findings: Globex Messaging Inc.

Source: `contracts/globex-messaging.md`
Result: 1 violation(s), 0 for review, 6 compliant

| Rule | Status | Clause |
|---|---|---|
| Data residency | violation | §2 |
| Audit rights | compliant | §3 |
| Termination | compliant | §4 |
| Liability cap | compliant | §5 |
| Subprocessors | compliant | §6 |
| Data breach notification | compliant | §7 |
| Governing law | compliant | §8 |

## EU data may be processed and transferred to the US

- **Severity:** High
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Data residency: EU customer data must remain in the EU.
- **Evidence:** `contracts/globex-messaging.md` §2: "Customer data will be processed in the European Economic Area (EEA) and in Globex's data centres in the United States."
- **Recommended action:** Renegotiate §2 to restrict processing of EU customer data to the EU/EEA and remove the right to transfer data between regions.
- **Uncertainty:** None

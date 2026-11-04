# Compliance findings: Acme Data Platform Ltd.

Source: `contracts/acme-data-platform.md`
Result: 3 violation(s), 1 for review, 3 compliant

| Rule | Status | Clause |
|---|---|---|
| Data residency | violation | §2 |
| Audit rights | review | §3 |
| Termination | compliant | §4 |
| Liability cap | compliant | §5 |
| Subprocessors | violation | §6 |
| Data breach notification | violation | §7 |
| Governing law | compliant | §8 |

## EU data may be processed in the US and Singapore

- **Severity:** High
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Data residency: EU customer data must remain in the EU.
- **Evidence:** `contracts/acme-data-platform.md` §2: "Vendor may process customer data in any region where Vendor maintains infrastructure, including the United States, Ireland, and Singapore."
- **Recommended action:** Renegotiate §2 to commit to EU/EEA-only processing of EU customer data. "Reasonable efforts" with no residency guarantee is not enough.
- **Uncertainty:** None

## Breach notification window is 96 hours

- **Severity:** High
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Data breach notification: Vendor must notify us within 72 hours of detecting a breach affecting our data.
- **Evidence:** `contracts/acme-data-platform.md` §7: "Vendor will notify the customer within 96 hours of confirming a security incident"
- **Recommended action:** Reduce the window to 72 hours or less and start the clock at detection, not confirmation.
- **Uncertainty:** None. The clock starts at "confirming", which can be later than detection, so the real gap may be larger than 24 hours.

## Subprocessor changes are only listed after the fact

- **Severity:** Medium
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Subprocessors: Vendor must notify us in writing at least 30 days before adding a new subprocessor.
- **Evidence:** `contracts/acme-data-platform.md` §6: "Vendor will update the list within 30 days of any change."
- **Recommended action:** Require written notice to us at least 30 days before any new subprocessor is engaged, ideally with a right to object.
- **Uncertainty:** A list update could be argued to be a notice mechanism, but it comes after the change and is not sent to us in writing.

## Audit notice period is 60 days

- **Severity:** Medium
- **Labels:** `compliance`, `needs-human-review`
- **Status:** review
- **Rule:** Audit rights: We must retain the right to audit vendor's controls on at least 30 days' notice.
- **Evidence:** `contracts/acme-data-platform.md` §3: "on not less than 60 days' written notice"
- **Recommended action:** Ask to shorten the notice period to 30 days. Legal to decide whether 60 days is acceptable meanwhile.
- **Uncertainty:** 60 days misses the 30-day requirement but stays within the 90-day violation threshold.

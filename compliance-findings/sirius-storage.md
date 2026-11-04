# Compliance findings: Sirius Storage SDN BHD

Source: `contracts/sirius-storage.md`
Result: 6 violation(s), 1 for review, 0 compliant

| Rule | Status | Clause |
|---|---|---|
| Data residency | violation | §2 |
| Audit rights | violation | §3 |
| Termination | violation | §4 |
| Liability cap | violation | §5 |
| Subprocessors | violation | §6 |
| Data breach notification | violation | §7 |
| Governing law | review | §8 |

## Data stored in Malaysia and Singapore

- **Severity:** High
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Data residency: EU customer data must remain in the EU.
- **Evidence:** `contracts/sirius-storage.md` §2: "Customer data is stored in Sirius's data centres in Malaysia and Singapore."
- **Recommended action:** Require EU/EEA-only storage and processing for EU customer data, and remove the vendor's right to relocate data at its discretion.
- **Uncertainty:** None

## No specific breach notification window

- **Severity:** High
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Data breach notification: Vendor must notify us within 72 hours of detecting a breach affecting our data.
- **Evidence:** `contracts/sirius-storage.md` §7: "Sirius will notify the customer of confirmed security incidents in due course"
- **Recommended action:** Add a fixed notification window of 72 hours or less from detection.
- **Uncertainty:** None

## Liability capped at 3 months of fees

- **Severity:** High
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Liability cap: Vendor liability cap must be at least 12 months of fees paid.
- **Evidence:** `contracts/sirius-storage.md` §5: "Sirius's aggregate liability under this Agreement is capped at three (3) months of fees paid."
- **Recommended action:** Raise the cap to at least 12 months of fees and take data breach out of the cap.
- **Uncertainty:** None

## Subprocessors can be added without notice

- **Severity:** Medium
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Subprocessors: Vendor must notify us in writing at least 30 days before adding a new subprocessor.
- **Evidence:** `contracts/sirius-storage.md` §6: "Sirius may engage any subprocessor it deems appropriate without prior notice to or consent from the customer."
- **Recommended action:** Require written notice at least 30 days before any new subprocessor is engaged, with a right to object.
- **Uncertainty:** None

## No termination for convenience during the 5-year initial term

- **Severity:** Medium
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Termination: We must be able to terminate for convenience with no more than 90 days' notice.
- **Evidence:** `contracts/sirius-storage.md` §4: "Termination for convenience is not permitted during the initial term."
- **Recommended action:** Add a right to terminate for convenience on 90 days' notice or less at any point in the term.
- **Uncertainty:** None

## Audit requires 180 days' notice

- **Severity:** Medium
- **Labels:** `compliance`
- **Status:** violation
- **Rule:** Audit rights: We must retain the right to audit vendor's controls on at least 30 days' notice.
- **Evidence:** `contracts/sirius-storage.md` §3: "on not less than 180 days' notice and not more than once every two years"
- **Recommended action:** Reduce the audit notice period to 30 days and allow at least one audit per year.
- **Uncertainty:** None

## Governed by Malaysian law

- **Severity:** Low
- **Labels:** `compliance`, `needs-human-review`
- **Status:** review
- **Rule:** Governing law: Governing law must be a jurisdiction with mature data protection law (England & Wales, Ireland, US Delaware, or similar).
- **Evidence:** `contracts/sirius-storage.md` §8: "This Agreement is governed by the laws of Malaysia."
- **Recommended action:** Ask legal whether Malaysian law is acceptable. Prefer England & Wales or Ireland.
- **Uncertainty:** Malaysia has a recognised regime (PDPA 2010), so this is not a violation. It is not on the named list, though, and how mature and well enforced it is remains open.

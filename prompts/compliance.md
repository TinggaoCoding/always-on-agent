# Routine: Vendor Contract Compliance Drift

You check every vendor contract in this repo against our compliance policy and report what drifted.

## Inputs

- `compliance-policy.md`: the 7 rules. Each rule has a requirement and a "Violation" line.
- `contracts/*.md`: one file per vendor contract. Check every file, every run.

Only read these. Do not edit them.

## How to judge each rule

1. **The "Violation" line is the hard threshold.** A clause that matches it is `violation`.
2. **Between requirement and violation line → `review`.** If a clause misses the requirement but does not hit the violation line, mark it `review`, not `violation`. Example shape: the requirement says "at least X", the violation line says "more than Y", and the clause sits between X and Y.
3. **Read rules by intent: they protect us, the customer.** A clause that is *more* favourable to us than required is `compliant`. For instance, a liability cap that does *not* apply to data breach (breach liability is uncapped) favours us. That is not what "cap excludes data breach scenarios" is aimed at.
4. **Judge only what the rule covers.** Don't stretch a rule to a neighbouring clause. Example: a non-renewal notice period is not termination for convenience.
5. **Unsure → `review`, with the reason.** Never leave a rule out. Every contract gets a status for all 7 rules.
6. **Quote, don't paraphrase.** Evidence is the section number plus a short verbatim quote from the contract.

Severity is fixed per rule, so reruns stay stable. A `review` finding gets the same severity it would have as a violation.

| Rule | Severity |
|---|---|
| Data residency | High |
| Data breach notification | High |
| Liability cap | High |
| Subprocessors | Medium |
| Termination | Medium |
| Audit rights | Medium |
| Governing law | Low |

## Output

Write one file per contract: `compliance-findings/<contract-file-name>.md`.
The file must contain **nothing run-specific**: no dates, no run IDs, no timestamps.
If the file already exists and your rule table (every status and clause) is identical to the one in it, **leave the file untouched**, even if you would word the findings differently. Only real drift may show up as a diff.

Use exactly this layout:

```markdown
# Compliance findings: <Counterparty from the contract header>

Source: `contracts/<file>.md`
Result: <n> violation(s), <m> for review, <k> compliant

| Rule | Status | Clause |
|---|---|---|
| Data residency | violation / review / compliant | §<n> |
| Audit rights | ... | ... |
| Termination | ... | ... |
| Liability cap | ... | ... |
| Subprocessors | ... | ... |
| Data breach notification | ... | ... |
| Governing law | ... | ... |

## <Short title of the problem>

- **Severity:** High / Medium / Low
- **Labels:** `compliance` (add `needs-human-review` if status is review)
- **Status:** violation / review
- **Rule:** <policy rule name>: <the policy requirement, one line>
- **Evidence:** `contracts/<file>.md` §<n>: "<verbatim quote>"
- **Recommended action:** <what to renegotiate or ask legal, one or two sentences>
- **Uncertainty:** <what could make this wrong, or "None">
```

Write one `##` section per `violation` or `review` rule, ordered High → Medium → Low. Compliant rules appear only in the table.
If a contract has no violations and nothing for review, write the table and the line `No findings.` below it.

## Delivering the result

1. Work on a new branch `claude/compliance-<YYYY-MM-DD>` from `main`.
2. Commit only files under `compliance-findings/`.
3. If nothing differs from `main`, stop. Do not open a PR. "No drift" is the normal case.
4. Otherwise open a PR into `main`:
   - Title: `Compliance drift <YYYY-MM-DD>`.
   - Body: one line per contract with its result counts, then the list of High findings.
   - Add the labels `compliance`, and also `needs-human-review` if any finding is for review. If the labels don't exist in the repo, open the PR without them. Don't fail.

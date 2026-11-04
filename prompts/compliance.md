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

First pick your baseline branch (see "Delivering the result"), then write one file per contract: `compliance-findings/<contract-file-name>.md`.
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

Pick your baseline **before** you write any file. At most one compliance PR may be open at a time.

1. Look for an open PR whose head branch starts with `claude/compliance-` (`gh pr list --state open --json number,headRefName`).
2. **If one exists**, that PR is your baseline. A human has not merged it yet, so don't open another one.
   - Check out its branch and merge `origin/main` into it, so contracts and policy are current. If the merge conflicts, abort it and stop. Say so in your final report.
   - Write the findings as described above, comparing against the files on this branch.
   - If nothing changed, stop.
   - Otherwise commit only files under `compliance-findings/`, push to the same branch, and add a PR comment: one line per contract whose result changed.
3. **If none exists**, `main` is your baseline.
   - Create a new branch `claude/compliance-<YYYY-MM-DD>` from `main` and write the findings.
   - If nothing differs from `main`, stop. Do not open a PR. "No drift" is the normal case.
   - Otherwise commit only files under `compliance-findings/`, push, and open a PR into `main`:
     - Title: `Compliance drift <YYYY-MM-DD>`.
     - Body: one line per contract with its result counts, then the list of High findings.
     - Add the labels `compliance`, and also `needs-human-review` if any finding is for review. If the labels don't exist in the repo, open the PR without them. Don't fail.

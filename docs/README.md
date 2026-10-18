# Project documentation

This is the planning home for Tree of Life. The existing app is an exploratory prototype; these documents specify how to develop it into a coherent, research-backed project.

## Reading order

1. [Project memory](../MEMORY.md): current direction and durable context.
2. [Product](PRODUCT.md): what the project is for and what the brief actually requires.
3. [Roadmap](ROADMAP.md): sequence, gates and the next bounded task.
4. [Architecture](ARCHITECTURE.md): how the implementation should eventually be separated.
5. [Research](research/README.md) and [suite dossiers](suites/README.md): evidence and subject-specific plans.
6. [Decisions](DECISIONS.md): which choices are explicit, provisional or superseded.

## Ownership of information

| Document                             | Owns                                                    | Update when                                                            |
| ------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| `AGENTS.md`                          | Repo workflow and ownership constraints                 | Working rules change                                                   |
| `MEMORY.md`                          | Short current context and user intent                   | Direction, constraints or next workstream changes                      |
| `PRODUCT.md`                         | Requirements and experience structure                   | Scope changes                                                          |
| `ROADMAP.md`                         | Work order, dependencies and completion gates           | A task advances or priorities change                                   |
| `ARCHITECTURE.md`                    | Current/target code boundaries and technical tradeoffs  | A structural decision is made                                          |
| `DECISIONS.md`                       | Decision status, provenance, rationale and consequences | A consequential choice is made or reversed                             |
| `research/README.md`                 | Research procedure and shared source ledger             | Sources are reviewed or methodology changes                            |
| `suites/<id>.md`                     | One suite's question, evidence, model and experiments   | Research or implementation changes that suite                          |
| Root `DESIGN.md` / `VERIFICATION.md` | Historical prototype evidence                           | Add a clearly dated/revision-specific record, not retroactive approval |
| Root `HANDOFF.md`                    | Short resume pointer and integration status             | Handoff state changes                                                  |

Avoid duplicating authoritative specifications. A concise reminder may link to its owner. Markdown links are relative so this documentation works in GitHub and a local checkout.

## Status vocabulary

- **User requirement:** supplied by Jerry; preserve its intent.
- **Working assumption:** a reasonable agent choice that can be revised without pretending it was user-approved.
- **Candidate:** an idea awaiting research or selection.
- **Prototype:** executable exploration with known shortcuts.
- **Specified:** a dossier has cleared the evidence and model-design gate.
- **Validated educational model:** implementation and explanations satisfy the declared numerical, behavioral and learning checks. This does not mean empirically calibrated biology.
- **Release candidate:** a selected, honest subset meets the cross-project release gate.

No suite currently has `Specified`, `Validated educational model` or `Release candidate` status. Passing software tests does not advance those statuses by itself.

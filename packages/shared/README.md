# packages/shared

Code shared between `apps/web` and the future Capacitor-wrapped native build (Term 4) — types, constants, and any logic that shouldn't be duplicated (e.g. marking-scheme calculation used by both the Mock Test Engine and any future offline mode).

Empty until there's a second consumer of shared code. Don't create abstractions here speculatively — move code in only when `apps/web` and a second app both need it.

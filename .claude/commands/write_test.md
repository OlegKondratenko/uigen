---
description: Write Vitest tests for a given file or feature
---

Write tests for: $ARGUMENTS

Follow this project's testing conventions:

- Use **Vitest** with `@testing-library/react` and the `jsdom` environment (already configured in `vitest.config.mts`).
- Place test files in a `__tests__/` directory next to the code under test, named `<filename>.test.ts` (or `.test.tsx` for component tests).
- Import the code under test via the `@/` path alias.
- Cover the meaningful behavior and edge cases, not just the happy path. Keep tests focused and readable.
- Do not add comments that merely restate what the test does.

After writing the tests, run them to confirm they pass:

```bash
npx vitest run <path-to-the-new-test-file>
```

If a test fails, fix the test (or surface a genuine bug in the code) before finishing. Report the final result.

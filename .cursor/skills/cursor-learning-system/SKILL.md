# Cursor Agent Learning System

## Purpose
This skill enables Cursor agents to maintain a persistent knowledge base of learnings, solutions, and fixes discovered during development work. All entries should be added to `.cursor/learnings/` directory.

## Directory Structure
```
.cursor/
├── learnings/
│   ├── architecture/
│   ├── bugs-and-fixes/
│   ├── performance/
│   ├── integrations/
│   └── patterns/
└── README.md
```

## When to Document

**ALWAYS document when you:**
- Fix a bug that wasn't immediately obvious
- Discover a workaround for a third-party library issue
- Find a configuration that resolves conflicts
- Learn something about project-specific architecture
- Discover performance optimizations
- Solve integration challenges
- Find edge cases or gotchas
- Correct a misconception or wrong approach

**Document IMMEDIATELY after:**
- Successfully resolving an issue after multiple attempts
- Finding documentation that contradicts expected behavior
- Discovering version-specific quirks
- Implementing a pattern that works well for this codebase

## Documentation Format

Every learning entry should follow this structure:

```markdown
# [Clear, Descriptive Title]

**Date:** YYYY-MM-DD
**Category:** [architecture/bugs/performance/integration/pattern]
**Context:** [Brief description of what you were trying to do]

## The Problem
[Describe what went wrong, what didn't work, or what you learned]

## The Solution
[Explain what actually works and why]

## Why It Matters
[Explain the root cause or why this is important to remember]

## Example
```[language]
// Show a clear before/after or working example
```

## Related Files
- `path/to/relevant/file.ext`
- `path/to/another/file.ext`

## Tags
#tag1 #tag2 #specific-technology
```

## File Naming Convention

Use descriptive, searchable names:
- `bugs-and-fixes/tailwind-css-layer-conflicts.md`
- `architecture/supabase-user-attribution-pattern.md`
- `performance/vue-computed-vs-methods-rendering.md`
- `integrations/wordpress-rest-api-authentication.md`
- `patterns/css-isolation-strategies.md`

## Categories Guide

### architecture/
- Project structure decisions
- Data flow patterns
- Module organization
- Design patterns chosen

### bugs-and-fixes/
- Bugs encountered and their solutions
- Error messages and resolutions
- Workarounds for library issues
- Version-specific problems

### performance/
- Optimization discoveries
- Bottleneck solutions
- Caching strategies
- Query improvements

### integrations/
- Third-party API learnings
- Service connection issues
- Authentication patterns
- External tool configurations

### patterns/
- Code patterns that work well
- Anti-patterns discovered
- Best practices for this project
- Reusable solutions

## Example Entry

```markdown
# Tailwind CSS v4 Layer Conflicts in WordPress Plugin

**Date:** 2026-02-05
**Category:** bugs-and-fixes
**Context:** Implementing Tailwind CSS v4 in uiXpress WordPress plugin causing style conflicts

## The Problem
When using `@import "tailwindcss"` in a WordPress plugin, Tailwind v4 automatically creates `@layer base, components, utilities` which conflicts with existing WordPress styles. The base layer resets cause WordPress admin styles to break.

## The Solution
Instead of importing full Tailwind, selectively import only what's needed:
```css
@import "tailwindcss/theme" layer(uix-theme);
@import "tailwindcss/utilities" layer(uix-utilities);
```

Wrap all plugin styles in a custom layer and use `:where()` selector for low specificity:
```css
@layer uix-plugin {
  :where(.uip-plugin-container) {
    /* All plugin styles here */
  }
}
```

## Why It Matters
WordPress loads global styles that shouldn't be overridden. Using Tailwind's base layer causes unintended resets. The `:where()` selector gives 0 specificity, allowing WordPress styles to take precedence while keeping plugin styles scoped.

## Example
```css
/* ❌ Don't do this - imports base layer */
@import "tailwindcss";

/* ✅ Do this - selective imports with custom layers */
@import "tailwindcss/theme" layer(uix-theme);
@import "tailwindcss/utilities" layer(uix-utilities);

@layer uix-plugin {
  :where(.uip-app-frame) {
    @apply flex flex-col h-screen;
  }
}
```

## Related Files
- `assets/css/main.css`
- `tailwind.config.js`

## Tags
#tailwind #wordpress #css-layers #specificity #plugin-development
```

## Maintenance Commands

When starting a new task, always check for relevant learnings:
```bash
# Search for relevant learnings
grep -r "keyword" .cursor/learnings/

# List recent learnings
ls -lt .cursor/learnings/**/*.md | head -10
```

## Integration with Cursor

1. **After every fix**: Create a learning entry before moving on
2. **Before implementing**: Check `.cursor/learnings/` for similar issues
3. **During code review**: Reference learning entries in comments
4. **Weekly**: Review learnings and consolidate duplicate entries

## Rules for Agents

1. **Be specific**: Don't write "fixed CSS issue" - write "Resolved Tailwind layer conflict using selective imports"
2. **Include context**: Future you needs to know WHAT you were building
3. **Show code**: Examples are worth a thousand words
4. **Explain why**: Understanding the root cause prevents future issues
5. **Tag properly**: Make it searchable
6. **Cross-reference**: Link to related learnings
7. **Date everything**: Track when knowledge was gained
8. **Update if needed**: If you learn more about a topic, update the existing entry

## Quick Add Template

For rapid documentation during development:

```markdown
# [Title]
**Date:** $(date +%Y-%m-%d)
**Context:** [One sentence about what you were doing]

## Problem
[What went wrong]

## Solution
[What works]

## Code
```[language]
[Example]
```

## Tags
#[relevant-tags]
```

## Benefits

- **Faster debugging**: Search past solutions before reinventing
- **Team knowledge**: Share learnings with other agents or developers
- **Project continuity**: Maintain context across sessions
- **Pattern recognition**: Identify recurring issues
- **Onboarding**: New agents can read the knowledge base
- **Documentation**: Automatic project-specific documentation

## Notes

- Keep entries concise but complete
- One learning per file (easier to search)
- Update outdated learnings with "DEPRECATED" note
- Link to external resources when helpful
- Include error messages when relevant for searchability

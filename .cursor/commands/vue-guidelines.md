# Vue.js Guidelines

## Core Requirements

- **Vue.js 3** with Composition API
- Always use `<script setup>` syntax exclusively
- Leverage Composition API patterns (`ref`, `reactive`, `computed`, `watch`, etc.)
- Prefer `defineProps` and `defineEmits` for component communication
- Use TypeScript when possible for better type safety
- Structure components with clear separation: template, script, style
- Set javascript functions as consts (eg: `const doFunction = () => {}`)

## Component Structure

- Use `<script setup>` syntax exclusively
- Clear separation: template, script, style
- Prefer Composition API patterns over Options API

## Function Declaration

- Always declare JavaScript functions as consts:
  ```javascript
  const doFunction = () => {};
  ```

## State Management - CRITICAL

**REQUIRED: Use singleton composables for shared state. Do NOT use provide/inject or excessive prop drilling.**

See `composable-architecture.md` for the full pattern, but the key rules are:

1. **Singleton Pattern**: Define state at module level (outside the composable function)
2. **Direct Imports**: Components import composables directly, no props needed for shared functions
3. **No Provide/Inject**: Import the composable in each component that needs it

### Anti-Pattern (DON'T DO THIS):

```vue
<!-- Parent passing many props down -->
<ChildComponent
  :isActive="isActive"
  :isFavorite="isFavorite"
  :setHoverState="setHoverState"
  :isHovered="isHovered"
  @update:value="handleUpdate"
/>
```

### Required Pattern (DO THIS):

```javascript
// composables/useFeature.js
const sharedState = ref([]); // Module level = singleton

export function useFeature() {
  const doSomething = () => { /* operates on sharedState */ };
  return { sharedState, doSomething };
}
```

```vue
<!-- Child imports directly, no props needed -->
<script setup>
import { useFeature } from '../composables/useFeature.js';
const { sharedState, doSomething } = useFeature();
</script>
```

### When to Create a Composable

- Passing the same prop to 2+ child components
- Functions being passed as props
- State that multiple sibling components need to access
- Any time you see prop drilling patterns

## Component Communication

- **Shared state**: Use singleton composables (see `composable-architecture.md`)
- **Parent-to-child data**: Use props for component-specific data only
- **Child-to-parent events**: Use emits sparingly, prefer composables for shared state
- **Avoid**: Passing functions as props when a composable would work

# Singleton Composable Architecture

**REQUIRED PATTERN**: When creating or refactoring Vue composables that share state across multiple components, you MUST use the singleton composable pattern. Do NOT use provide/inject for shared state.

## Core Principle

Create **singleton composables** where state is defined at the module level (outside the function) so all components that import it share the same reactive state. This eliminates prop drilling and provides direct access to shared functionality.

## Anti-Pattern: What NOT to Do

```javascript
// BAD - Each component gets its own isolated state
export function useFeature() {
  const state = ref([]); // Created fresh each call - NOT SHARED
  return { state };
}

// BAD - Using provide/inject adds boilerplate
provide('featureState', state);
const state = inject('featureState'); // Requires parent setup
```

## Required Pattern

```javascript
// composables/useFeature.js
import { ref, computed, reactive, shallowRef } from "vue";

// ============================================================================
// SINGLETON STATE - Shared across all components that import this composable
// ============================================================================

// Simple values - module level, created ONCE
const isReady = ref(false);
const isLoading = ref(false);

// Complex objects - use shallowRef to avoid deep reactivity overhead
const instance = shallowRef(null);

// Related properties - group with reactive
const menuState = reactive({
  open: false,
  position: { top: 0, left: 0 },
  query: "",
});

// Configuration (non-reactive)
let onUpdateCallback = null;

// ============================================================================
// METHODS - Operate on shared state
// ============================================================================

const initialize = async (options = {}) => {
  if (options.onUpdate) {
    onUpdateCallback = options.onUpdate;
  }
  isLoading.value = true;
  // ... initialization logic
  isReady.value = true;
  isLoading.value = false;
};

const destroy = () => {
  instance.value = null;
  isReady.value = false;
  menuState.open = false;
  onUpdateCallback = null;
};

const doSomething = () => {
  if (!instance.value) return;
  // ... action logic
};

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

const isEmpty = computed(() => !instance.value);

// ============================================================================
// COMPOSABLE EXPORT
// ============================================================================

/**
 * Composable for managing [feature] state
 * Uses singleton pattern - state is shared across all components
 *
 * @returns {Object} Feature state and methods
 */
export function useFeature() {
  return {
    // State (shared singletons)
    isReady,
    isLoading,
    instance,
    menuState,

    // Computed
    isEmpty,

    // Methods
    initialize,
    destroy,
    doSomething,
  };
}

export default useFeature;
```

## Usage Pattern

### Parent Component (Initializes)

```vue
<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useFeature } from "./composables/useFeature.js";

const { initialize, destroy } = useFeature();

onMounted(async () => {
  await initialize({
    onUpdate: (value) => emit("update:modelValue", value),
  });
});

onBeforeUnmount(() => {
  destroy();
});
</script>
```

### Child Component (Uses State Directly)

```vue
<script setup>
import { useFeature } from "./composables/useFeature.js";

// NO PROPS NEEDED - direct access to shared state
const { instance, menuState, doSomething } = useFeature();
</script>

<template>
  <div v-if="instance">
    <button @click="doSomething">Action</button>
  </div>
</template>
```

## Real Examples in Codebase

### Menu System (app/src/components/app/menu/)

Multiple composables share state across menu components:

- `useFavorites.js` - favorites array, add/remove/isFavorite functions
- `useHoverStates.js` - hover tracking for menu items
- `useMenuState.js` - isActive, shouldShowSubMenu, toggleMenuOpen
- `useMenuCache.js` - localStorage caching for menu

**Used by:**
- `index.vue` - orchestrates menu, uses cache/filtering
- `FavoritesSection.vue` - manages favorites editing
- `MenuExpanded.vue` - renders expanded menu
- `MenuMinimized.vue` - renders collapsed menu

**Result:** Each child component imports what it needs directly. No prop drilling.

### Editor System (app/src/pages/post-editor/src/composables/)

- `useEditor.js` - TipTap instance, focus, content, actions

**Used by:**
- `PostContent.vue` - initializes editor
- `ContextBubbleMenu.vue` - formatting controls
- `sidebar/post-actions/component.vue` - export functions

## When to Use

**ALWAYS use this pattern when:**

- Multiple components need the same state
- You're passing functions or state through 2+ levels of props
- Components need to communicate without parent-child relationship
- State should persist across component lifecycles

**Use regular composables (non-singleton) only when:**

- State is needed by one component only
- You explicitly need multiple independent instances

## Required Rules

1. **State at module level** - Define refs/reactive OUTSIDE the function body
2. **Use shallowRef for complex objects** - Prevents unnecessary deep reactivity
3. **Provide cleanup method** - Always include a destroy/reset function for teardown
4. **Import directly** - Components import the composable, NOT receive it via props
5. **No provide/inject** - Direct imports are simpler and more explicit

## Migration Checklist

When converting from props to singleton composable:

- [ ] Identify all props being passed for this feature
- [ ] Create composable with singleton state at module level
- [ ] Move functions that operate on state into the composable
- [ ] Move initialization logic to parent component's onMounted
- [ ] Replace prop usage with composable imports in children
- [ ] Remove props/emits from component definitions
- [ ] Verify all components share the same state instance

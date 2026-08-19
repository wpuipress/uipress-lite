# Vue Component Size Guidelines

## When to Break Up Components

### Size Thresholds

**Break up components when they exceed:**
- **500 lines** of code (template + script + style combined)
- **300 lines** of template markup
- **200 lines** of script logic
- **100 lines** of style definitions

**Consider breaking up even smaller components if:**
- A component has more than **5-7 distinct responsibilities**
- A component renders more than **10-15 child elements** in its template
- A component manages more than **10 reactive state variables**
- A component has more than **15 functions/methods**
- A component handles multiple unrelated features or domains

### Code Smell Indicators

Break up components when you notice:

1. **Multiple Concerns**: Component handles UI rendering, data fetching, state management, and business logic
2. **Deep Nesting**: Template has more than 4-5 levels of nested elements
3. **Repeated Patterns**: Similar code blocks that could be extracted into reusable components
4. **Complex Conditionals**: Multiple `v-if`/`v-else` chains or complex computed properties
5. **Large Template Sections**: Distinct sections that could be their own components
6. **Unrelated Features**: Component handles multiple features that don't share state
7. **Difficult Testing**: Hard to test because component does too many things
8. **Performance Issues**: Component re-renders unnecessarily due to size/complexity

## How to Break Up Components

### 1. Extract by Feature/Functionality

**Before:**
```vue
<!-- Large component handling multiple features -->
<script setup>
// Menu rendering logic
// Favorites management
// Shortcuts editing
// User details
// Admin notices
</script>
```

**After:**
```vue
<!-- Main component orchestrates sub-components -->
<script setup>
import MenuSection from './src/menu-section.vue';
import FavoritesSection from './src/favorites-section.vue';
import ShortcutsSection from './src/shortcuts-section.vue';
import UserDetails from './src/user-details.vue';
import AdminNotices from '@/components/app/admin-notices/index.vue';
</script>
```

### 2. Extract Reusable UI Patterns

**Before:**
```vue
<template>
  <!-- Repeated menu item structure -->
  <div v-for="item in items" class="menu-item">
    <div class="icon">...</div>
    <div class="name">...</div>
    <div class="actions">...</div>
  </div>
</template>
```

**After:**
```vue
<template>
  <MenuItem 
    v-for="item in items" 
    :key="item.id"
    :item="item"
  />
</template>

<script setup>
import MenuItem from './src/menu-item.vue';
</script>
```

### 3. Extract Complex Logic into Composables

**Before:**
```vue
<script setup>
// 100+ lines of favorites logic
const favorites = ref([]);
const addFavorite = () => { /* ... */ };
const removeFavorite = () => { /* ... */ };
const updateFavorite = () => { /* ... */ };
// ... more favorites logic
</script>
```

**After:**
```vue
<script setup>
import { useFavorites } from './src/useFavorites.js';
const { favorites, addFavorite, removeFavorite, updateFavorite } = useFavorites();
</script>
```

### 4. Extract Form Sections

**Before:**
```vue
<template>
  <form>
    <!-- 200 lines of form fields -->
    <div class="personal-info">...</div>
    <div class="contact-info">...</div>
    <div class="preferences">...</div>
  </form>
</template>
```

**After:**
```vue
<template>
  <form>
    <PersonalInfoSection v-model="form.personal" />
    <ContactInfoSection v-model="form.contact" />
    <PreferencesSection v-model="form.preferences" />
  </form>
</template>
```

### 5. Extract List/Table Components

**Before:**
```vue
<template>
  <div>
    <!-- Complex table with inline editing, sorting, filtering -->
  </div>
</template>
```

**After:**
```vue
<template>
  <DataTable 
    :items="items"
    :columns="columns"
    @edit="handleEdit"
    @sort="handleSort"
  />
</template>
```

## Component Structure Best Practices

### File Organization

When breaking up components, organize them in a `src/` subdirectory:

```
components/
  app/
    menu/
      index.vue          # Main component (< 500 lines)
      src/
        menu-item.vue    # Reusable item component
        submenu.vue      # Submenu component
        menu-icon.vue    # Icon component
        menu-item-name.vue
        menu-item-link.vue
        useFavorites.js  # Composable for favorites logic
        processMenu.js   # Utility functions
```

### Component Communication

**REQUIRED: Use singleton composables for shared state (see `composable-architecture.md`):**
```vue
<script setup>
// Each component imports what it needs directly - NO prop drilling
import { useFavorites } from './composables/useFavorites.js';
import { useHoverStates } from './composables/useHoverStates.js';

const { favorites, addFavorite } = useFavorites();
const { setHoverState, isHovered } = useHoverStates();
</script>
```

**Use props ONLY for component-specific data:**
```vue
<script setup>
defineProps({
  item: { type: Object, required: true },  // Data specific to this instance
  mobile: { type: Boolean, default: false } // Configuration for this component
});
// DON'T pass shared functions like isActive, setHoverState as props
</script>
```

**Use emits sparingly for parent-specific reactions:**
```vue
<script setup>
const emit = defineEmits(['resize']); // Only for things parent needs to know
// DON'T use emits when composables can handle the state
</script>
```

**DO NOT use provide/inject** - use singleton composables instead (simpler, more explicit)

## Refactoring Checklist

When breaking up a large component:

- [ ] Identify distinct features/responsibilities
- [ ] Extract reusable UI patterns into components
- [ ] Move complex logic into composables
- [ ] Create utility functions for pure logic
- [ ] Ensure proper prop/emit communication
- [ ] Update imports and dependencies
- [ ] Test each extracted component independently
- [ ] Verify parent component still works correctly
- [ ] Update documentation/comments
- [ ] Check for performance improvements

## Examples from Codebase

### Good: Extracted Components

```vue
<!-- Main menu component uses smaller sub-components -->
<script setup>
import SubMenu from './src/submenu.vue';
import MenuIcon from './src/menu-icon.vue';
import MenuItemName from './src/menu-item-name.vue';
import MenuItemLink from './src/menu-item-link.vue';
import SubMenuItem from './src/submenu-item.vue';
</script>
```

### Good: Extracted Composables

```vue
<script setup>
import { useFavorites } from './src/useFavorites.js';
const { favorites, addFavorite, removeFavorite } = useFavorites();
</script>
```

## Anti-Patterns to Avoid

❌ **Don't create components that are too small** (under 50 lines unless truly reusable)
❌ **Don't break up components just for the sake of it** - ensure there's a clear benefit
❌ **Don't prop drill** - use singleton composables instead (see `composable-architecture.md`)
❌ **Don't use provide/inject** - singleton composables are simpler and more explicit
❌ **Don't pass functions as props** - import them from composables directly
❌ **Don't duplicate code** - extract shared logic into composables or utilities
❌ **Don't create components with unclear responsibilities** - each component should have one clear purpose

## Benefits of Proper Component Size

✅ **Maintainability**: Easier to understand and modify
✅ **Reusability**: Components can be used in multiple places
✅ **Testability**: Smaller components are easier to test
✅ **Performance**: Better optimization and fewer unnecessary re-renders
✅ **Collaboration**: Multiple developers can work on different components
✅ **Debugging**: Easier to locate and fix issues


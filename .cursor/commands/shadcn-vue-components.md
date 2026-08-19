# shadcn-vue Component Usage

## Core Principle

**Always prefer using shadcn-vue components from `app/src/components/ui` when building UI elements.** These components are pre-configured, accessible, and follow the project's design system.

## Component Location

All shadcn-vue components are located in:
```
app/src/components/ui/
```

## Available Components

The following shadcn-vue components are available and should be used when appropriate:

- **Accordion** - Collapsible content sections
- **Alert** - Contextual feedback messages
- **Alert Dialog** - Modal dialogs for confirmations
- **Aspect Ratio** - Maintain consistent aspect ratios
- **Avatar** - User profile images
- **Badge** - Status indicators and labels
- **Breadcrumb** - Navigation hierarchy
- **Button** - Primary action buttons
- **Calendar** - Date selection
- **Card** - Content containers
- **Carousel** - Image/content carousels
- **Checkbox** - Form checkboxes
- **Collapsible** - Expandable/collapsible content
- **Combobox** - Autocomplete input fields
- **Context Menu** - Right-click menus
- **Dialog** - Modal dialogs
- **Drawer** - Slide-out panels
- **Dropdown Menu** - Dropdown menus
- **Empty** - Empty state displays
- **Hover Card** - Hover-triggered cards
- **Input** - Text input fields
- **KBD** - Keyboard key indicators
- **Label** - Form labels
- **Menubar** - Application menu bars
- **Navigation Menu** - Navigation components
- **Number Field** - Numeric input fields
- **Pin Input** - PIN/password input fields
- **Popover** - Floating content panels
- **Progress** - Progress indicators
- **Radio Group** - Radio button groups
- **Resizable** - Resizable panels
- **Scroll Area** - Custom scrollable areas
- **Select** - Dropdown select fields
- **Separator** - Visual dividers
- **Sheet** - Slide-out panels (alternative to drawer)
- **Skeleton** - Loading placeholders
- **Slider** - Range sliders
- **Sonner** - Toast notifications
- **Spinner** - Loading spinners
- **Stepper** - Step-by-step workflows
- **Switch** - Toggle switches
- **Table** - Data tables
- **Tabs** - Tabbed interfaces
- **Tags Input** - Tag input fields
- **Textarea** - Multi-line text input
- **Toggle** - Toggle buttons
- **Tooltip** - Hover tooltips

## Import Pattern

Import components from their respective directories:

```vue
<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
</script>
```

## Usage Guidelines

### When to Use shadcn-vue Components

- ✅ Building new UI features
- ✅ Replacing custom components with equivalent shadcn-vue components
- ✅ Creating forms, dialogs, or interactive elements
- ✅ Implementing data tables or lists
- ✅ Adding navigation elements
- ✅ Creating feedback/notification systems

### When NOT to Use shadcn-vue Components

- ❌ When a component doesn't exist in the shadcn-vue library
- ❌ When you need highly specialized functionality not covered by shadcn-vue
- ❌ When using existing custom components that are already well-established in the codebase

### Component Composition

shadcn-vue components are designed to be composed together. For example:

```vue
<template>
  <Dialog>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Action</DialogTitle>
      </DialogHeader>
      <Card>
        <CardContent>
          <Button>Confirm</Button>
        </CardContent>
      </Card>
    </DialogContent>
  </Dialog>
</template>
```

## Customization

- shadcn-vue components can be customized using props and slots
- Use Tailwind CSS classes for styling adjustments
- Maintain consistency with the project's design system (see `ui-design.md`)
- Components already follow the dark minimalist design language

## Migration Strategy

When refactoring existing code:
1. Identify UI elements that can be replaced with shadcn-vue components
2. Check component documentation for API compatibility
3. Replace custom components gradually, testing as you go
4. Maintain existing functionality while improving consistency

## Best Practices

- **Consistency**: Use shadcn-vue components to maintain UI consistency across the application
- **Accessibility**: shadcn-vue components include built-in accessibility features
- **Performance**: Components are optimized and follow Vue.js best practices
- **Maintainability**: Using standardized components reduces maintenance burden
- **Documentation**: Check component source files in `app/src/components/ui/[component-name]/` for usage examples

## Component Documentation

Each component directory contains:
- Component files (`.vue`)
- Index file (`index.js`) for exports
- Type definitions where applicable

Refer to these files for component APIs, props, slots, and events.


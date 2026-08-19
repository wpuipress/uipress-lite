# Nuxt i18n Documentation

This section covers the installation, configuration, usage, and advanced features of the Nuxt i18n module, which integrates internationalization capabilities into your Nuxt applications.

## Installation

### Overview

To get started with the Nuxt i18n module, follow these steps to install and configure it in your project.

### Quick Start

1. Install `@nuxtjs/i18n` as a dev dependency:

   ```bash
   npx nuxi@latest module add @nuxtjs/i18n
   ```

2. Add `@nuxtjs/i18n` to your `nuxt.config.ts` modules:

   ```typescript
   export default defineNuxtConfig({
     modules: ['@nuxtjs/i18n']
   })
   ```

## Configuration

### Module Options

You can set the module options using the `i18n` property in the `nuxt.config` root.

```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    // Module Options
  }
})
```

## Edge Channel

### Opting In

To opt in to the latest commits on the main branch, update the `@nuxtjs/i18n` dependency in your `package.json`:

```json
{
  "devDependencies": {
    "@nuxtjs/i18n": "npm:@nuxtjs/i18n-edge"
  }
}
```

Remove the lockfile and reinstall dependencies.

### Opting Out

To revert to a stable version, update the `@nuxtjs/i18n` dependency:

```json
{
  "devDependencies": {
    "@nuxtjs/i18n": "^9.0.0"
  }
}
```

Remove the lockfile and reinstall dependencies.

## Usage

### Basic Setup

Configure the project locales and the `defaultLocale` in the `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'nl', name: 'Nederlands', file: 'nl.json' }
    ]
  }
})
```

Create translation files in `<rootDir>/i18n/locales`:

- `i18n/locales/en.json`
  ```json
  {
    "welcome": "Welcome"
  }
  ```

- `i18n/locales/nl.json`
  ```json
  {
    "welcome": "Welkom"
  }
  ```

### Language Switcher

Add a basic language switcher in `pages/index.vue`:

```vue
<script setup>
const { locales, setLocale } = useI18n()
</script>

<template>
  <div>
    <button v-for="locale in locales" @click="setLocale(locale.code)">
      {{ locale.name }}
    </button>
    <h1>{{ $t('welcome') }}</h1>
  </div>
</template>
```

### Auto Imports

If auto-imports are disabled, import composables explicitly:

```vue
<script setup>
import { useI18n, useLocalePath } from '#imports'
</script>
```

### Route Localization

Use `$localePath` to resolve localized routes:

```vue
<template>
  <NuxtLink :to="$localePath('index')">{{ $t('home') }}</NuxtLink>
</template>
```

### Switching Between Languages

Use `$switchLocalePath` to switch routes:

```vue
<template>
  <NuxtLink :to="$switchLocalePath('en')">English</NuxtLink>
  <NuxtLink :to="$switchLocalePath('nl')">Nederlands</NuxtLink>
</template>
```

### URL Path with Route Object

Use `useLocaleRoute` for programmatic control over internal links:

```vue
<script setup>
const localeRoute = useLocaleRoute()
function onClick() {
  const route = localeRoute({ name: 'user-profile', query: { foo: '1' } })
  if (route) {
    return navigateTo(route.fullPath)
  }
}
</script>

<template>
  <button @click="onClick">Show profile</button>
</template>
```

## Vue I18n Configuration

### Overview

Configure runtime options for Vue I18n in a separate `i18n.config.ts` file:

```typescript
export default defineI18nConfig(() => {
  return {
    // vue-i18n options
  }
})
```

### When to Use

Use `i18n.config.ts` for runtime functions or data that cannot be serialized for build-time processing.

## Routing Strategies

### Overview

Nuxt i18n overrides default routes to add locale prefixes based on the selected strategy.

### Supported Strategies

| Strategy                     | Description                                                                                          |
|------------------------------|------------------------------------------------------------------------------------------------------|
| `no_prefix`                  | No locale prefix; relies on browser & cookie detection.                                            |
| `prefix_except_default`      | Locale prefix for all routes except the default language.                                          |
| `prefix`                     | All routes have a locale prefix.                                                                    |
| `prefix_and_default`         | URLs with prefixes for every language; non-prefixed version for the default language.              |

### Configuration Example

```typescript
export default defineNuxtConfig({
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en'
  }
})
```

## Runtime Hooks

### Overview

Nuxt i18n provides runtime hooks for specific tasks based on the app's language.

### Hooks

- **`i18n:beforeLocaleSwitch`**: Called before switching locales.
- **`i18n:localeSwitched`**: Called after the locale has been switched.

### Usage Example

Define callbacks in a plugin:

```typescript
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('i18n:beforeLocaleSwitch', (options) => {
    console.log('onBeforeLanguageSwitch', options.oldLocale, options.newLocale)
  })

  nuxtApp.hook('i18n:localeSwitched', (options) => {
    console.log('onLanguageSwitched', options.oldLocale, options.newLocale)
  })
})
```

## Custom Route Paths

### Overview

Customize path names for specific locales using module configuration or page components.

### Module Configuration Example

```typescript
export default defineNuxtConfig({
  i18n: {
    customRoutes: 'config',
    pages: {
      about: {
        en: '/about-us',
        fr: '/a-propos'
      }
    }
  }
})
```

### Page Component Example

```vue
<script setup>
definePageMeta({
  i18n: {
    paths: {
      en: '/about-us',
      fr: '/a-propos'
    }
  }
})
</script>
```

## Browser Language Detection

### Overview

Detect user browser language and redirect accordingly.

### Configuration Example

```typescript
export default defineNuxtConfig({
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})
```

## SEO

### Overview

Optimize SEO with `useLocaleHead()` for locale-related metadata.

### Setup Example

```vue
<script setup>
const head = useLocaleHead()
</script>
```

## Lazy-load Translations

### Overview

Lazy-load translations to improve performance.

### Configuration Example

```typescript
export default defineNuxtConfig({
  i18n: {
    locales: [
      { code: 'en', file: 'en-US.json' },
      { code: 'fr', file: 'fr-FR.ts' }
    ],
    defaultLocale: 'en'
  }
})
```

### Example of Lazy-loading

```typescript
export default defineI18nLocale(async locale => {
  return {
    welcome: 'Bienvenue'
  }
})
```

## Lang Switcher

### Overview

Implement a language switcher in your application.

### Example

```vue
<script setup>
const { locale, locales, setLocale } = useI18n()
</script>

<template>
  <NuxtLink v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
    {{ locale.name }}
  </NuxtLink>
</template>
```

This document provides a comprehensive overview of the Nuxt i18n module, covering installation, configuration, usage, and advanced features to enhance internationalization in your Nuxt applications.
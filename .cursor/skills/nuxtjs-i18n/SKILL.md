```markdown
---
name: nuxtjs-i18n
description: Provides internationalization support for Nuxt.js applications, enabling developers to easily manage and implement multilingual content. Use this skill to enhance your Nuxt.js app with localization features.
---

## Overview

Nuxt.js i18n is a module that integrates internationalization (i18n) capabilities into Nuxt.js applications. It simplifies the process of managing and implementing multilingual content, allowing developers to create applications that support multiple languages seamlessly.

## Quick Start

To get started with Nuxt.js i18n, follow these steps:

1. **Installation**: Add the module to your Nuxt.js project.
   ```bash
   npm install @nuxtjs/i18n
   ```

2. **Configuration**: Update your `nuxt.config.js` to include the i18n module.
   ```javascript
   export default {
     modules: [
       '@nuxtjs/i18n',
     ],
     i18n: {
       locales: ['en', 'fr'],
       defaultLocale: 'en',
       vueI18n: {
         fallbackLocale: 'en',
         messages: {
           en: {
             welcome: "Welcome"
           },
           fr: {
             welcome: "Bienvenue"
           }
         }
       }
     }
   }
   ```

3. **Usage**: Use the `$t` method in your components to translate strings.
   ```html
   <template>
     <div>
       <p>{{ $t('welcome') }}</p>
     </div>
   </template>
   ```

## Section Index

- **[overview](sections/overview.md)**: Introduction and basic setup for Nuxt.js i18n.

## Key Concepts Summary

- **Locales**: Define the languages your application will support.
- **Default Locale**: The primary language used when the application loads.
- **Vue I18n**: The underlying library that handles translation logic.
- **Messages**: Key-value pairs for each language, containing the translatable content.

## Common Examples

- **Switching Languages**: Change the language dynamically in your application.
  ```javascript
  this.$i18n.setLocale('fr');
  ```

- **Locale-Specific Routes**: Automatically generate routes for each locale.
  ```javascript
  export default {
    i18n: {
      strategy: 'prefix_except_default',
      locales: ['en', 'fr'],
      defaultLocale: 'en'
    }
  }
  ```

## Important Notes

- Ensure all locale files are correctly set up to avoid missing translation errors.
- Use the `fallbackLocale` option to provide a default language when translations are missing.

For detailed API reference, see [overview](sections/overview.md).
```
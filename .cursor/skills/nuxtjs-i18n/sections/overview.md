# Overview of Internationalization in Nuxt.js

This section provides an overview of the internationalization (i18n) capabilities in Nuxt.js, detailing how to configure and implement localization in your Nuxt applications. It covers the key concepts, installation, and basic usage of the i18n module.

## What is Internationalization (i18n)?

Internationalization (i18n) is the process of designing and developing applications that can be adapted to various languages and regions without requiring engineering changes. In the context of Nuxt.js, it allows developers to create multilingual applications easily.

## Key Features

- **Dynamic Language Switching**: Users can switch languages on the fly.
- **Automatic Route Generation**: Routes can be automatically generated for different languages.
- **Translation Management**: Simplifies the management of translation files.

## Installation

To use the i18n module in your Nuxt.js application, you need to install it via npm or yarn. Run one of the following commands:

```bash
npm install @nuxtjs/i18n
```

or

```bash
yarn add @nuxtjs/i18n
```

## Configuration

After installation, you need to configure the i18n module in your `nuxt.config.js` file. Below is a basic configuration example:

```javascript
export default {
  modules: [
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en-US.js' },
      { code: 'fr', name: 'Français', iso: 'fr-FR', file: 'fr-FR.js' }
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: 'lang/',
  }
}
```

### Configuration Options

| Option        | Type     | Description                                           |
|---------------|----------|-------------------------------------------------------|
| `locales`     | Array    | List of locales supported by the application.        |
| `defaultLocale` | String | The default locale to use when none is specified.    |
| `lazy`        | Boolean  | Load language files lazily (recommended for larger apps). |
| `langDir`     | String   | Directory where language files are stored.           |

## Usage

Once configured, you can use the `$t` method to translate strings in your templates and components. Here’s an example:

```html
<template>
  <div>
    <h1>{{ $t('welcome_message') }}</h1>
  </div>
</template>
```

### Translation Files

Translation files should be placed in the directory specified by `langDir`. Each file should export an object containing key-value pairs for translations. For example, `en-US.js` might look like this:

```javascript
export default {
  welcome_message: 'Welcome to our application!',
}
```

## Conclusion

The i18n module in Nuxt.js provides a powerful and flexible way to implement internationalization in your applications. By following the installation and configuration steps outlined above, you can easily create a multilingual experience for your users.
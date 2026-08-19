# Code Standards & Best Practices

## General Best Practices

- Write clean, readable code with consistent formatting
- Use meaningful variable and function names
- Implement proper error handling
- Add comments for complex business logic
- Follow security best practices (sanitization, validation, escaping)
- Optimize for performance when possible
- Use modern ES6+ features appropriately

## Vue Component Architecture

**REQUIRED**: Use singleton composables for shared state across components.

- See `composable-architecture.md` for the full pattern
- See `vue-guidelines.md` for component communication rules
- Do NOT use provide/inject - use singleton composables instead
- Do NOT pass functions as props when multiple components need them

## Changelog Requirement

**Important**: When fixing bugs or adding new features, please add the changes or updates to the changelog: `changelog.txt`

## When Suggesting Code

- Always provide complete, working examples
- Include imports/requires when necessary
- Consider accessibility in UI components
- Suggest performance optimizations when relevant
- Mention any potential security considerations

## Security

- Sanitize user input
- Validate data before processing
- Escape output appropriately
- Follow WordPress security best practices for PHP code

## Performance

- Optimize for performance when possible
- Use modern ES6+ features appropriately
- Consider lazy loading for heavy components
- Optimize images and assets


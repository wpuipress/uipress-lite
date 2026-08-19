# Documentation Requirements

## General Rule

**All new functions must include docblocks**

## Documentation Formats

- Use **JSDoc** format for JavaScript/Node.js functions
- Use **PHPDoc** format for PHP functions
- Include parameter types, return types, and brief descriptions
- Add usage examples for complex functions

## JavaScript/Node.js Documentation Example

```javascript
/**
 * Fetches user data from the API
 * @param {string} userId - The unique identifier for the user
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeProfile - Whether to include profile data
 * @returns {Promise<Object>} User data object
 * @throws {Error} When user is not found
 * @example
 * const user = await fetchUserData('123', { includeProfile: true });
 */
async function fetchUserData(userId, options = {}) {
  // Implementation here
}
```

## PHP Documentation Example

```php
/**
 * Validates and sanitizes user input data
 *
 * @param array $data The input data to validate
 * @param array $rules Validation rules to apply
 * @return array Sanitized and validated data
 * @throws InvalidArgumentException When validation fails
 * @since 1.0.0
 * @example
 * $clean_data = validate_user_input($_POST, ['email' => 'email', 'name' => 'string']);
 */
function validate_user_input($data, $rules) {
    // Implementation here
}
```

## Required Elements

- Parameter types and descriptions
- Return types
- Brief description of what the function does
- Usage examples for complex functions
- Error conditions (@throws) when applicable


# Integration Tests

## Setup
1. Create a Box Platform application with JWT authentication:
   - Go to https://cloud.app.box.com/developers/console
   - Create a new Custom App with "Server Authentication (with JWT)"
   - Under "App Access Level" select "App + Enterprise Access"
   - Enable all necessary application scopes
   - Enable "Generate User Access Tokens" and "Make API calls using the as-user header"

2. Download the JWT configuration file:
   - Go to your app's configuration tab
   - In "App Settings" section, download the JSON configuration file
   - Base64 encode the configuration file contents

3. Set environment variables:
   - `BOX_JWT_CONFIG`: Base64 encoded JWT configuration
   - `BOX_ADMIN_USER_ID`: ID of admin user account with sufficient permissions

## Running Tests
```bash
# Run all integration tests
npm run test:integration

# Run specific test file
npm run test:integration -- test/integration/__tests__/users.test.js
```

## Notes
- Integration tests require admin user access
- JWT configuration must have necessary permissions
- Tests will create and delete test data - use a development environment
- Never commit sensitive credentials or configuration

# MaplePrints Website Test Suite

This test suite provides comprehensive validation for the configuration files and Git LFS setup in the MaplePrints website repository.

## Overview

The test suite validates the following files and configurations:
- `.coderabbit.yaml` - CodeRabbit AI code review configuration
- `.gitattributes` - Git LFS configuration for video files
- `.gitignore` - Git ignore patterns for IDE, OS, and temporary files
- Video files in `resources/carousel-videos/` and `resources/recent-orders/` directories

## Test Files

### `coderabbit-config.test.js`
Tests for `.coderabbit.yaml` configuration:
- File existence and valid YAML structure
- Language configuration (en-US)
- Review settings (summary, line reviews, poem)
- Auto-review enablement
- Security validations
- Best practices compliance

### `gitattributes.test.js`
Tests for `.gitattributes` configuration:
- Git LFS configuration for .mp4 files
- Proper LFS attributes (filter, diff, merge)
- Pattern matching validation
- Integration with Git LFS
- File format validation

### `gitignore.test.js`
Tests for `.gitignore` patterns:
- IDE files (.vscode/, .idea/, vim swap files)
- OS files (.DS_Store, Thumbs.db)
- Log files (*.log)
- Pattern effectiveness
- Best practices compliance
- Security considerations

### `git-lfs-videos.test.js`
Tests for Git LFS video files:
- Video file existence in both directories
- Valid LFS pointer format
- SHA256 OID validation
- File size validation
- Cross-directory consistency
- Integration with .gitattributes

### `integration.test.js`
Integration tests for configuration interactions:
- Configuration file coexistence
- Git LFS integration
- IDE and editor files handling
- CodeRabbit configuration integration
- Repository structure validation
- Performance considerations

## Prerequisites

```bash
npm install
```

This installs:
- `jest` - Testing framework
- `js-yaml` - YAML parser for configuration validation

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npx jest tests/coderabbit-config.test.js
npx jest tests/gitattributes.test.js
npx jest tests/gitignore.test.js
npx jest tests/git-lfs-videos.test.js
npx jest tests/integration.test.js
```

### Run tests matching a pattern
```bash
npx jest --testNamePattern="LFS"
npx jest --testNamePattern="CodeRabbit"
```

## Test Coverage

The test suite provides comprehensive coverage including:
- **Happy path scenarios**: Valid configurations and expected behavior
- **Edge cases**: Empty files, unusual patterns, boundary conditions
- **Error handling**: Missing files, invalid formats, corrupted data
- **Security**: No sensitive information, no dangerous patterns
- **Best practices**: Proper formatting, naming conventions, maintainability
- **Integration**: Interaction between different configuration files

## Coverage Goals

The test suite aims for:
- 100% coverage of configuration file validation
- All Git LFS pointer validation
- Complete pattern matching verification
- Comprehensive integration testing

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
name: Configuration Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Adding New Tests

When adding new configuration files or modifying existing ones:

1. Create a new test file in the `tests/` directory
2. Follow the existing test structure and naming conventions
3. Include tests for:
   - File existence and validity
   - Expected configuration values
   - Edge cases and error conditions
   - Integration with other configurations
4. Update this README with new test descriptions

## Test Structure

Each test file follows this structure:

```javascript
describe('Main Test Suite', () => {
  beforeAll(() => {
    // Setup code
  });

  describe('Feature Category', () => {
    test('should validate specific behavior', () => {
      // Test implementation
    });
  });
});
```

## Best Practices

- Use descriptive test names that explain what is being tested
- Group related tests using `describe` blocks
- Use `beforeAll` for expensive setup operations
- Keep tests independent and isolated
- Validate both positive and negative cases
- Include edge cases and boundary conditions
- Add comments for complex validation logic

## Troubleshooting

### Tests fail after modifying configuration files
- Verify the configuration files are properly formatted
- Check that all required fields are present
- Ensure Git LFS is properly initialized
- Validate that video files are LFS pointers, not actual binary files

### Git LFS tests fail
- Ensure Git LFS is installed: `git lfs install`
- Verify `.gitattributes` is configured correctly
- Check that video files are tracked by LFS: `git lfs ls-files`
- Re-track files if needed: `git lfs track "*.mp4"`

### YAML parsing errors
- Validate YAML syntax using a YAML validator
- Check for proper indentation (2 spaces)
- Ensure no tabs are used
- Verify no trailing whitespace

## Contributing

When contributing tests:
1. Follow the existing test structure and naming conventions
2. Ensure tests are deterministic and reproducible
3. Add meaningful assertions with clear error messages
4. Update this README with any new test categories
5. Run the full test suite before submitting changes

## License

MIT License - Same as the main repository
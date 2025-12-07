/**
 * Test suite for .coderabbit.yaml configuration file
 * Validates CodeRabbit AI code review settings
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('.coderabbit.yaml Configuration Tests', () => {
  let config;
  const configPath = path.join(__dirname, '..', '.coderabbit.yaml');

  beforeAll(() => {
    // Load and parse the YAML configuration
    const fileContents = fs.readFileSync(configPath, 'utf8');
    config = yaml.load(fileContents);
  });

  describe('File Existence and Structure', () => {
    test('should exist in repository root', () => {
      expect(fs.existsSync(configPath)).toBe(true);
    });

    test('should be valid YAML', () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });

    test('should not be empty', () => {
      expect(Object.keys(config).length).toBeGreaterThan(0);
    });
  });

  describe('Language Configuration', () => {
    test('should have language setting', () => {
      expect(config).toHaveProperty('language');
    });

    test('should use en-US language', () => {
      expect(config.language).toBe('en-US');
    });

    test('should have valid language code format', () => {
      expect(config.language).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
    });
  });

  describe('Reviews Configuration', () => {
    test('should have reviews section', () => {
      expect(config).toHaveProperty('reviews');
      expect(typeof config.reviews).toBe('object');
    });

    test('should enable summary', () => {
      expect(config.reviews).toHaveProperty('summary');
      expect(config.reviews.summary).toBe(true);
    });

    test('should enable line-level reviews', () => {
      expect(config.reviews).toHaveProperty('line_reviews');
      expect(config.reviews.line_reviews).toBe(true);
    });

    test('should enable poem feature', () => {
      expect(config.reviews).toHaveProperty('poem');
      expect(config.reviews.poem).toBe(true);
    });

    test('should have auto_review section', () => {
      expect(config.reviews).toHaveProperty('auto_review');
      expect(typeof config.reviews.auto_review).toBe('object');
    });

    test('should enable auto-review', () => {
      expect(config.reviews.auto_review).toHaveProperty('enabled');
      expect(config.reviews.auto_review.enabled).toBe(true);
    });
  });

  describe('Configuration Values Validation', () => {
    test('all boolean values should be actual booleans', () => {
      const booleanFields = [
        config.reviews.summary,
        config.reviews.line_reviews,
        config.reviews.poem,
        config.reviews.auto_review.enabled
      ];

      booleanFields.forEach(field => {
        expect(typeof field).toBe('boolean');
      });
    });

    test('should not contain unexpected top-level keys', () => {
      const validKeys = ['language', 'reviews'];
      const actualKeys = Object.keys(config);
      
      actualKeys.forEach(key => {
        expect(validKeys).toContain(key);
      });
    });

    test('reviews section should not contain unexpected keys', () => {
      const validKeys = ['summary', 'line_reviews', 'poem', 'auto_review'];
      const actualKeys = Object.keys(config.reviews);
      
      actualKeys.forEach(key => {
        expect(validKeys).toContain(key);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle file read errors gracefully', () => {
      const nonExistentPath = path.join(__dirname, '..', '.nonexistent.yaml');
      expect(() => {
        fs.readFileSync(nonExistentPath, 'utf8');
      }).toThrow();
    });

    test('should have proper indentation (2 spaces)', () => {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const lines = fileContents.split('\n');
      
      const indentedLines = lines.filter(line => line.match(/^\s+\w/));
      indentedLines.forEach(line => {
        const leadingSpaces = line.match(/^(\s+)/);
        if (leadingSpaces) {
          expect(leadingSpaces[1].length % 2).toBe(0);
        }
      });
    });

    test('should not have trailing whitespace', () => {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const lines = fileContents.split('\n');
      
      lines.forEach((line, index) => {
        if (line.length > 0) {
          expect(line).not.toMatch(/\s$/);
        }
      });
    });
  });

  describe('Security and Best Practices', () => {
    test('should not contain sensitive information', () => {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /api[_-]?key/i,
        /token/i,
        /private[_-]?key/i
      ];

      sensitivePatterns.forEach(pattern => {
        expect(fileContents).not.toMatch(pattern);
      });
    });

    test('should enable all recommended features', () => {
      expect(config.reviews.summary).toBe(true);
      expect(config.reviews.line_reviews).toBe(true);
      expect(config.reviews.auto_review.enabled).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    test('configuration should be parseable by CodeRabbit', () => {
      // Ensure all required fields are present
      expect(config.language).toBeDefined();
      expect(config.reviews).toBeDefined();
      expect(config.reviews.auto_review).toBeDefined();
      expect(config.reviews.auto_review.enabled).toBeDefined();
    });

    test('should support standard YAML types', () => {
      expect(typeof config.language).toBe('string');
      expect(typeof config.reviews).toBe('object');
      expect(typeof config.reviews.summary).toBe('boolean');
    });
  });
});
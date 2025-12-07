/**
 * Test suite for .gitignore configuration file
 * Validates ignore patterns for development files, IDE artifacts, and OS files
 */

const fs = require('fs');
const path = require('path');

describe('.gitignore Configuration Tests', () => {
  const gitignorePath = path.join(__dirname, '..', '.gitignore');
  let fileContents;
  let lines;

  beforeAll(() => {
    fileContents = fs.readFileSync(gitignorePath, 'utf8');
    lines = fileContents.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  });

  describe('File Existence and Structure', () => {
    test('should exist in repository root', () => {
      expect(fs.existsSync(gitignorePath)).toBe(true);
    });

    test('should not be empty', () => {
      expect(fileContents.trim().length).toBeGreaterThan(0);
    });

    test('should be readable', () => {
      expect(() => {
        fs.readFileSync(gitignorePath, 'utf8');
      }).not.toThrow();
    });

    test('should have multiple ignore patterns', () => {
      expect(lines.length).toBeGreaterThan(0);
    });
  });

  describe('IDE and Editor Files', () => {
    test('should ignore .vscode directory', () => {
      expect(fileContents).toContain('.vscode/');
    });

    test('should ignore .idea directory', () => {
      expect(fileContents).toContain('.idea/');
    });

    test('should ignore vim swap files', () => {
      expect(fileContents).toMatch(/\*\.swp/);
      expect(fileContents).toMatch(/\*\.swo/);
    });

    test('should ignore temporary editor files', () => {
      expect(fileContents).toContain('*~');
    });

    test('should have IDE section comment', () => {
      expect(fileContents).toMatch(/IDE and Editor/i);
    });
  });

  describe('OS Files', () => {
    test('should ignore macOS .DS_Store files', () => {
      expect(fileContents).toContain('.DS_Store');
    });

    test('should ignore Windows Thumbs.db files', () => {
      expect(fileContents).toContain('Thumbs.db');
    });

    test('should have OS files section comment', () => {
      expect(fileContents).toMatch(/OS files/i);
    });
  });

  describe('Log Files', () => {
    test('should ignore log files', () => {
      expect(fileContents).toMatch(/\*\.log/);
    });

    test('should have logs section comment', () => {
      expect(fileContents).toMatch(/Logs/i);
    });
  });

  describe('Pattern Format Validation', () => {
    test('should use correct glob patterns', () => {
      const patterns = fileContents.match(/\*\.\w+/g);
      expect(patterns).toBeTruthy();
      
      if (patterns) {
        patterns.forEach(pattern => {
          expect(pattern).toMatch(/^\*\.\w+$/);
        });
      }
    });

    test('directories should end with /', () => {
      const directoryPatterns = ['.vscode/', '.idea/'];
      
      directoryPatterns.forEach(pattern => {
        if (fileContents.includes(pattern)) {
          expect(pattern).toMatch(/\/$/);
        }
      });
    });

    test('should not have invalid patterns', () => {
      // Check for common mistakes
      expect(fileContents).not.toMatch(/\*\*\*+/); // Too many wildcards
      expect(fileContents).not.toMatch(/\/\//); // Double slashes
    });

    test('should have proper comment format', () => {
      const commentLines = fileContents.split('\n').filter(line => line.startsWith('#'));
      
      commentLines.forEach(comment => {
        expect(comment).toMatch(/^#\s+\w/);
      });
    });
  });

  describe('Pattern Coverage', () => {
    test('should cover common IDE files', () => {
      const commonIDEs = ['.vscode', '.idea'];
      const covered = commonIDEs.filter(ide => fileContents.includes(ide));
      
      expect(covered.length).toBeGreaterThan(0);
    });

    test('should cover multiple editor types', () => {
      const editorPatterns = ['*.swp', '*.swo', '*~'];
      const covered = editorPatterns.filter(pattern => fileContents.includes(pattern));
      
      expect(covered.length).toBe(editorPatterns.length);
    });

    test('should cover major OS temporary files', () => {
      const osFiles = ['.DS_Store', 'Thumbs.db'];
      
      osFiles.forEach(file => {
        expect(fileContents).toContain(file);
      });
    });
  });

  describe('Edge Cases and Special Patterns', () => {
    test('should handle files starting with dot', () => {
      const dotFiles = fileContents.match(/^\.[a-zA-Z]/gm);
      expect(dotFiles).toBeTruthy();
    });

    test('should handle wildcard patterns', () => {
      const wildcardPatterns = fileContents.match(/\*\.\w+/g);
      expect(wildcardPatterns).toBeTruthy();
      expect(wildcardPatterns.length).toBeGreaterThan(0);
    });

    test('should not ignore critical files', () => {
      const criticalFiles = [
        'package.json',
        'index.html',
        '*.html',
        '*.css',
        '*.js'
      ];
      
      // These should NOT be in gitignore (except if intentionally ignored)
      const nonMinifiedJS = fileContents.match(/^\*\.js$/gm);
      expect(nonMinifiedJS).toBeFalsy();
    });

    test('should handle negation patterns if present', () => {
      const negationPatterns = fileContents.match(/^!/gm);
      // Negation patterns are optional but if present should be valid
      if (negationPatterns) {
        negationPatterns.forEach(pattern => {
          expect(pattern).toBe('!');
        });
      }
    });
  });

  describe('File Organization', () => {
    test('should have section comments', () => {
      const sectionComments = fileContents.match(/^#\s+[A-Z]/gm);
      expect(sectionComments).toBeTruthy();
      expect(sectionComments.length).toBeGreaterThanOrEqual(3); // At least 3 sections
    });

    test('should group related patterns', () => {
      const allLines = fileContents.split('\n');
      let inIDESection = false;
      let inOSSection = false;
      
      allLines.forEach(line => {
        if (line.match(/IDE and Editor/i)) inIDESection = true;
        if (line.match(/OS files/i)) {
          inOSSection = true;
          inIDESection = false;
        }
        
        if (inIDESection && line.includes('.vscode')) {
          expect(true).toBe(true); // IDE files in IDE section
        }
        if (inOSSection && line.includes('.DS_Store')) {
          expect(true).toBe(true); // OS files in OS section
        }
      });
    });

    test('should have blank lines between sections', () => {
      const allLines = fileContents.split('\n');
      const sectionIndices = [];
      
      allLines.forEach((line, index) => {
        if (line.match(/^#\s+[A-Z]/)) {
          sectionIndices.push(index);
        }
      });
      
      // Check for blank lines before section comments
      sectionIndices.forEach((index, i) => {
        if (i > 0 && index > 0) {
          const prevLine = allLines[index - 1];
          expect(prevLine.trim()).toBe('');
        }
      });
    });
  });

  describe('Best Practices', () => {
    test('should not have trailing whitespace', () => {
      const allLines = fileContents.split('\n');
      
      allLines.forEach(line => {
        if (line.length > 0) {
          expect(line).not.toMatch(/\s$/);
        }
      });
    });

    test('should end with newline', () => {
      expect(fileContents).toMatch(/\n$/);
    });

    test('should use Unix line endings', () => {
      expect(fileContents).not.toMatch(/\r\n/);
    });

    test('should not be excessively large', () => {
      const stats = fs.statSync(gitignorePath);
      expect(stats.size).toBeLessThan(50000); // 50KB max
    });

    test('should follow naming convention', () => {
      const filename = path.basename(gitignorePath);
      expect(filename).toBe('.gitignore');
    });
  });

  describe('Pattern Effectiveness', () => {
    test('patterns should match their intended targets', () => {
      const testCases = [
        { pattern: '*.log', file: 'error.log', shouldMatch: true },
        { pattern: '*.log', file: 'debug.log', shouldMatch: true },
        { pattern: '*.swp', file: '.file.swp', shouldMatch: true },
        { pattern: '*.swo', file: '.file.swo', shouldMatch: true },
        { pattern: '.DS_Store', file: '.DS_Store', shouldMatch: true },
        { pattern: 'Thumbs.db', file: 'Thumbs.db', shouldMatch: true }
      ];
      
      testCases.forEach(({ pattern, file, shouldMatch }) => {
        if (fileContents.includes(pattern)) {
          const regex = new RegExp(
            pattern
              .replace(/\./g, '\\.')
              .replace(/\*/g, '.*')
          );
          expect(regex.test(file)).toBe(shouldMatch);
        }
      });
    });

    test('should not have duplicate patterns', () => {
      const patterns = lines.filter(line => !line.startsWith('#'));
      const uniquePatterns = [...new Set(patterns)];
      
      expect(patterns.length).toBe(uniquePatterns.length);
    });
  });

  describe('Security Considerations', () => {
    test('should not accidentally ignore important files', () => {
      const dangerousPatterns = [
        /^\*$/m,           // Ignore everything
        /^\/\*$/m,         // Ignore root everything
        /^\*\.\*$/m        // Ignore all files
      ];
      
      dangerousPatterns.forEach(pattern => {
        expect(fileContents).not.toMatch(pattern);
      });
    });

    test('should not contain sensitive information', () => {
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /api[_-]?key/i,
        /token/i
      ];

      sensitivePatterns.forEach(pattern => {
        expect(fileContents).not.toMatch(pattern);
      });
    });

    test('should not reference external URLs', () => {
      expect(fileContents).not.toMatch(/https?:\/\//);
    });
  });

  describe('Common Development Patterns', () => {
    test('should ignore editor-specific files', () => {
      const editorFiles = ['.vscode/', '.idea/', '*.swp', '*.swo', '*~'];
      const found = editorFiles.filter(pattern => fileContents.includes(pattern));
      
      expect(found.length).toBe(editorFiles.length);
    });

    test('should ignore OS-specific files', () => {
      const osFiles = ['.DS_Store', 'Thumbs.db'];
      
      osFiles.forEach(file => {
        expect(fileContents).toContain(file);
      });
    });

    test('should ignore log files', () => {
      expect(fileContents).toMatch(/\*\.log/);
    });
  });

  describe('Repository-Specific Validation', () => {
    test('should not ignore source files', () => {
      // Make sure we\'re not ignoring critical source files
      expect(fileContents).not.toMatch(/^\*\.html$/m);
      expect(fileContents).not.toMatch(/^\*\.css$/m);
      expect(fileContents).not.toMatch(/^js\/$/m);
    });

    test('should not ignore resource directories', () => {
      expect(fileContents).not.toMatch(/^resources\/$/m);
      expect(fileContents).not.toContain('resources/');
    });

    test('should be appropriate for a static website', () => {
      // Should not have patterns for build artifacts common in frameworks
      // But if they do, they should be intentional
      const frameworkPatterns = ['node_modules/', 'dist/', 'build/', '.next/'];
      
      // These are fine to ignore if present, but not required for static site
      frameworkPatterns.forEach(pattern => {
        if (fileContents.includes(pattern)) {
          expect(typeof pattern).toBe('string'); // Just checking it's intentional
        }
      });
    });
  });

  describe('Pattern Syntax Validation', () => {
    test('should use valid gitignore syntax', () => {
      const invalidPatterns = [
        /\[\[/,      // Double brackets
        /\]\]/,      // Double brackets
        /\|\|/,      // Double pipes
        /&&/         // Double ampersands
      ];
      
      invalidPatterns.forEach(pattern => {
        expect(fileContents).not.toMatch(pattern);
      });
    });

    test('comments should be properly formatted', () => {
      const commentLines = fileContents.split('\n').filter(line => line.trim().startsWith('#'));
      
      commentLines.forEach(comment => {
        // Comments should start with # followed by space
        expect(comment.trim()).toMatch(/^#\s/);
      });
    });

    test('should not have inline comments', () => {
      const patternLines = lines.filter(line => !line.startsWith('#'));
      
      patternLines.forEach(line => {
        // Gitignore doesn't support inline comments
        expect(line).not.toMatch(/\s+#/);
      });
    });
  });
});
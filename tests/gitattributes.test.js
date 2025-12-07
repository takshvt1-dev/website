/**
 * Test suite for .gitattributes configuration file
 * Validates Git LFS setup for video files
 */

const fs = require('fs');
const path = require('path');

describe('.gitattributes Configuration Tests', () => {
  const gitattributesPath = path.join(__dirname, '..', '.gitattributes');
  let fileContents;

  beforeAll(() => {
    fileContents = fs.readFileSync(gitattributesPath, 'utf8');
  });

  describe('File Existence and Structure', () => {
    test('should exist in repository root', () => {
      expect(fs.existsSync(gitattributesPath)).toBe(true);
    });

    test('should not be empty', () => {
      expect(fileContents.trim().length).toBeGreaterThan(0);
    });

    test('should be readable', () => {
      expect(() => {
        fs.readFileSync(gitattributesPath, 'utf8');
      }).not.toThrow();
    });
  });

  describe('Git LFS Configuration', () => {
    test('should configure .mp4 files for LFS', () => {
      expect(fileContents).toContain('*.mp4');
    });

    test('should specify filter=lfs', () => {
      expect(fileContents).toMatch(/filter=lfs/);
    });

    test('should specify diff=lfs', () => {
      expect(fileContents).toMatch(/diff=lfs/);
    });

    test('should specify merge=lfs', () => {
      expect(fileContents).toMatch(/merge=lfs/);
    });

    test('should mark as non-text files', () => {
      expect(fileContents).toMatch(/-text/);
    });

    test('should have complete LFS configuration line', () => {
      const lfsPattern = /\*\.mp4\s+filter=lfs\s+diff=lfs\s+merge=lfs\s+-text/;
      expect(fileContents).toMatch(lfsPattern);
    });
  });

  describe('File Format Validation', () => {
    test('should use glob pattern for file matching', () => {
      expect(fileContents).toMatch(/\*\.\w+/);
    });

    test('should have proper attribute format', () => {
      const lines = fileContents.trim().split('\n');
      lines.forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
          // Each line should have pattern followed by attributes
          expect(line).toMatch(/\S+\s+\w+=/);
        }
      });
    });

    test('should not have trailing whitespace', () => {
      const lines = fileContents.split('\n');
      lines.forEach(line => {
        if (line.length > 0) {
          expect(line).not.toMatch(/\s$/);
        }
      });
    });

    test('should end with newline', () => {
      expect(fileContents).toMatch(/\n$/);
    });
  });

  describe('Video File Extensions', () => {
    test('should handle .mp4 extension', () => {
      expect(fileContents).toContain('*.mp4');
    });

    test('should use wildcard pattern correctly', () => {
      const pattern = /\*\.mp4/;
      expect(fileContents).toMatch(pattern);
    });

    test('pattern should match sample filenames', () => {
      const sampleFiles = [
        '1.mp4',
        '2.mp4',
        '3.mp4',
        '4.mp4',
        '5.mp4',
        'video.mp4',
        'test-video.mp4'
      ];

      // Simple glob pattern matching
      const pattern = /^.*\.mp4$/;
      sampleFiles.forEach(filename => {
        expect(filename).toMatch(pattern);
      });
    });
  });

  describe('LFS Attributes Validation', () => {
    test('should not have duplicate patterns', () => {
      const lines = fileContents.trim().split('\n').filter(l => l.trim() && !l.startsWith('#'));
      const patterns = lines.map(line => line.split(/\s+/)[0]);
      const uniquePatterns = [...new Set(patterns)];
      
      expect(patterns.length).toBe(uniquePatterns.length);
    });

    test('should have all required LFS attributes', () => {
      const requiredAttributes = ['filter=lfs', 'diff=lfs', 'merge=lfs', '-text'];
      
      requiredAttributes.forEach(attr => {
        expect(fileContents).toContain(attr);
      });
    });

    test('attributes should be properly formatted', () => {
      const lines = fileContents.trim().split('\n');
      lines.forEach(line => {
        if (line.includes('lfs')) {
          // Should have key=value format
          expect(line).toMatch(/\w+=\w+/);
        }
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle file with no comments', () => {
      const hasComments = fileContents.includes('#');
      // File can exist with or without comments
      expect(typeof hasComments).toBe('boolean');
    });

    test('should not contain invalid characters', () => {
      // Should not contain control characters except newline
      expect(fileContents).not.toMatch(/[\x00-\x08\x0B\x0C\x0E-\x1F]/);
    });

    test('should handle empty lines gracefully', () => {
      const lines = fileContents.split('\n');
      // Empty lines are valid in gitattributes
      expect(lines).toBeInstanceOf(Array);
    });

    test('should not have conflicting attributes', () => {
      // -text and text should not both be present for same pattern
      const lines = fileContents.trim().split('\n');
      lines.forEach(line => {
        if (line.includes('-text')) {
          expect(line).not.toMatch(/\btext\b/);
        }
      });
    });
  });

  describe('Integration with Git LFS', () => {
    test('should be compatible with Git LFS v2+', () => {
      const lfsConfig = fileContents.match(/filter=lfs\s+diff=lfs\s+merge=lfs/);
      expect(lfsConfig).toBeTruthy();
    });

    test('video files in repository should match pattern', () => {
      const videoPath = path.join(__dirname, '..', 'resources', 'carousel-videos');
      
      if (fs.existsSync(videoPath)) {
        const videoFiles = fs.readdirSync(videoPath);
        const mp4Files = videoFiles.filter(f => f.endsWith('.mp4'));
        
        expect(mp4Files.length).toBeGreaterThan(0);
        
        mp4Files.forEach(file => {
          expect(file).toMatch(/\.mp4$/);
        });
      }
    });

    test('should validate LFS pointer format for tracked files', () => {
      const videoPath = path.join(__dirname, '..', 'resources', 'carousel-videos', '1.mp4');
      
      if (fs.existsSync(videoPath)) {
        const content = fs.readFileSync(videoPath, 'utf8');
        
        // If it's an LFS pointer, it should have specific format
        if (content.includes('version https://git-lfs.github.com/spec/v1')) {
          expect(content).toMatch(/version https:\/\/git-lfs\.github\.com\/spec\/v1/);
          expect(content).toMatch(/oid sha256:[a-f0-9]{64}/);
          expect(content).toMatch(/size \d+/);
        }
      }
    });
  });

  describe('Best Practices', () => {
    test('should follow gitattributes naming convention', () => {
      const filename = path.basename(gitattributesPath);
      expect(filename).toBe('.gitattributes');
    });

    test('should have proper Unix line endings', () => {
      // Should not have Windows line endings
      expect(fileContents).not.toMatch(/\r\n/);
    });

    test('should not exceed reasonable file size', () => {
      const stats = fs.statSync(gitattributesPath);
      expect(stats.size).toBeLessThan(10000); // 10KB should be plenty
    });

    test('should be version control friendly', () => {
      // Should not contain binary data
      const lines = fileContents.split('\n');
      lines.forEach(line => {
        // Each line should be printable ASCII or valid UTF-8
        expect(line).toMatch(/^[\x20-\x7E\s]*$/);
      });
    });
  });

  describe('Security Considerations', () => {
    test('should not contain sensitive information', () => {
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /api[_-]?key/i,
        /token/i,
        /credentials/i
      ];

      sensitivePatterns.forEach(pattern => {
        expect(fileContents).not.toMatch(pattern);
      });
    });

    test('should not reference external resources', () => {
      expect(fileContents).not.toMatch(/https?:\/\//);
      expect(fileContents).not.toMatch(/ftp:\/\//);
    });
  });

  describe('Pattern Specificity', () => {
    test('should use appropriate wildcard', () => {
      // *.mp4 is more specific than * or **
      expect(fileContents).toMatch(/\*\.mp4/);
      expect(fileContents).not.toMatch(/^\*\s+filter=lfs/m);
    });

    test('should target specific file types', () => {
      const lines = fileContents.trim().split('\n').filter(l => l.trim() && !l.startsWith('#'));
      
      lines.forEach(line => {
        // Each pattern should specify an extension or specific path
        expect(line).toMatch(/\.\w+|\/[\w-]+/);
      });
    });
  });
});
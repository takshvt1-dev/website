/**
 * Integration Tests for Configuration Files
 * Tests the interaction between different configuration files
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Configuration Integration Tests', () => {
  let gitattributes, gitignore, coderabbitConfig;
  
  beforeAll(() => {
    const gitattributesPath = path.join(__dirname, '..', '.gitattributes');
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    const coderabbitPath = path.join(__dirname, '..', '.coderabbit.yaml');
    
    gitattributes = fs.readFileSync(gitattributesPath, 'utf8');
    gitignore = fs.readFileSync(gitignorePath, 'utf8');
    coderabbitConfig = yaml.load(fs.readFileSync(coderabbitPath, 'utf8'));
  });

  describe('Configuration Files Coexistence', () => {
    test('all configuration files should exist', () => {
      expect(fs.existsSync(path.join(__dirname, '..', '.gitattributes'))).toBe(true);
      expect(fs.existsSync(path.join(__dirname, '..', '.gitignore'))).toBe(true);
      expect(fs.existsSync(path.join(__dirname, '..', '.coderabbit.yaml'))).toBe(true);
    });

    test('configuration files should be in repository root', () => {
      const rootFiles = fs.readdirSync(path.join(__dirname, '..'));
      
      expect(rootFiles).toContain('.gitattributes');
      expect(rootFiles).toContain('.gitignore');
      expect(rootFiles).toContain('.coderabbit.yaml');
    });

    test('configuration files should not conflict', () => {
      // .gitignore should not ignore .gitattributes or .coderabbit.yaml
      expect(gitignore).not.toContain('.gitattributes');
      expect(gitignore).not.toContain('.coderabbit.yaml');
    });
  });

  describe('Git LFS Integration', () => {
    test('.gitattributes should configure LFS for video files', () => {
      expect(gitattributes).toMatch(/\*\.mp4.*filter=lfs/);
    });

    test('video files should not be ignored by .gitignore', () => {
      expect(gitignore).not.toMatch(/\*\.mp4/);
      expect(gitignore).not.toContain('resources/');
    });

    test('LFS tracked files should exist and be pointers', () => {
      const videoPath = path.join(__dirname, '..', 'resources', 'carousel-videos', '1.mp4');
      
      if (fs.existsSync(videoPath)) {
        const content = fs.readFileSync(videoPath, 'utf8');
        const stats = fs.statSync(videoPath);
        
        // Should be small pointer file
        expect(stats.size).toBeLessThan(500);
        // Should contain LFS pointer content
        expect(content).toContain('version https://git-lfs.github.com/spec/v1');
      }
    });

    test('video directories should not be ignored', () => {
      const carouselPath = path.join(__dirname, '..', 'resources', 'carousel-videos');
      const recentOrdersPath = path.join(__dirname, '..', 'resources', 'recent-orders');
      
      expect(fs.existsSync(carouselPath)).toBe(true);
      expect(fs.existsSync(recentOrdersPath)).toBe(true);
    });
  });

  describe('IDE and Editor Files Handling', () => {
    test('IDE files should be ignored but not LFS tracked', () => {
      // IDE files should be in .gitignore
      expect(gitignore).toContain('.vscode/');
      expect(gitignore).toContain('.idea/');
      
      // IDE files should not be in .gitattributes
      expect(gitattributes).not.toContain('.vscode');
      expect(gitattributes).not.toContain('.idea');
    });

    test('temporary files should be ignored', () => {
      expect(gitignore).toMatch(/\*\.swp/);
      expect(gitignore).toMatch(/\*\.swo/);
      expect(gitignore).toContain('*~');
    });

    test('log files should be ignored', () => {
      expect(gitignore).toMatch(/\*\.log/);
    });
  });

  describe('CodeRabbit Configuration Integration', () => {
    test('CodeRabbit should review all non-ignored files', () => {
      expect(coderabbitConfig.reviews.auto_review.enabled).toBe(true);
      expect(coderabbitConfig.reviews.line_reviews).toBe(true);
    });

    test('CodeRabbit language should be appropriate', () => {
      expect(coderabbitConfig.language).toBe('en-US');
    });

    test('CodeRabbit should not be ignored', () => {
      expect(gitignore).not.toContain('.coderabbit');
    });
  });

  describe('Repository Structure Validation', () => {
    test('resources directory should exist', () => {
      const resourcesPath = path.join(__dirname, '..', 'resources');
      expect(fs.existsSync(resourcesPath)).toBe(true);
    });

    test('video subdirectories should exist', () => {
      const carouselPath = path.join(__dirname, '..', 'resources', 'carousel-videos');
      const recentOrdersPath = path.join(__dirname, '..', 'resources', 'recent-orders');
      
      expect(fs.existsSync(carouselPath)).toBe(true);
      expect(fs.existsSync(recentOrdersPath)).toBe(true);
    });

    test('test directory should exist', () => {
      const testsPath = path.join(__dirname);
      expect(fs.existsSync(testsPath)).toBe(true);
    });
  });

  describe('File Extension Consistency', () => {
    test('all video files should use .mp4 extension', () => {
      const carouselPath = path.join(__dirname, '..', 'resources', 'carousel-videos');
      const recentOrdersPath = path.join(__dirname, '..', 'resources', 'recent-orders');
      
      if (fs.existsSync(carouselPath)) {
        const files = fs.readdirSync(carouselPath);
        const videoFiles = files.filter(f => !f.startsWith('.'));
        
        videoFiles.forEach(file => {
          expect(file).toMatch(/\.mp4$/);
        });
      }
    });

    test('.gitattributes pattern should match actual video files', () => {
      const pattern = /\*\.mp4/;
      expect(gitattributes).toMatch(pattern);
      
      // Verify pattern matches actual files
      const carouselPath = path.join(__dirname, '..', 'resources', 'carousel-videos');
      if (fs.existsSync(carouselPath)) {
        const files = fs.readdirSync(carouselPath);
        files.forEach(file => {
          if (!file.startsWith('.')) {
            expect(file.endsWith('.mp4')).toBe(true);
          }
        });
      }
    });
  });

  describe('Configuration File Format Consistency', () => {
    test('all configuration files should use Unix line endings', () => {
      expect(gitattributes).not.toMatch(/\r\n/);
      expect(gitignore).not.toMatch(/\r\n/);
      
      const coderabbitContent = fs.readFileSync(
        path.join(__dirname, '..', '.coderabbit.yaml'),
        'utf8'
      );
      expect(coderabbitContent).not.toMatch(/\r\n/);
    });

    test('all configuration files should end with newline', () => {
      expect(gitattributes).toMatch(/\n$/);
      expect(gitignore).toMatch(/\n$/);
    });

    test('no configuration file should contain secrets', () => {
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /api[_-]?key/i,
        /token/i
      ];
      
      [gitattributes, gitignore].forEach(content => {
        sensitivePatterns.forEach(pattern => {
          expect(content).not.toMatch(pattern);
        });
      });
    });
  });

  describe('Git Workflow Integration', () => {
    test('LFS should be configured before video files are committed', () => {
      // .gitattributes should configure LFS
      expect(gitattributes).toContain('filter=lfs');
      
      // Video files should be LFS pointers
      const videoPath = path.join(__dirname, '..', 'resources', 'carousel-videos', '1.mp4');
      if (fs.existsSync(videoPath)) {
        const stats = fs.statSync(videoPath);
        expect(stats.size).toBeLessThan(500);
      }
    });

    test('ignored files should not be tracked by LFS', () => {
      // IDE files in .gitignore should not be in .gitattributes
      const ignoredPatterns = ['.vscode', '.idea', '.DS_Store', 'Thumbs.db'];
      
      ignoredPatterns.forEach(pattern => {
        if (gitignore.includes(pattern)) {
          expect(gitattributes).not.toContain(pattern);
        }
      });
    });
  });

  describe('Performance Considerations', () => {
    test('large binary files should be tracked with LFS', () => {
      // Video files are configured for LFS
      expect(gitattributes).toMatch(/\*\.mp4.*filter=lfs/);
    });

    test('LFS pointers should be small', () => {
      const videoPath = path.join(__dirname, '..', 'resources', 'carousel-videos', '1.mp4');
      
      if (fs.existsSync(videoPath)) {
        const stats = fs.statSync(videoPath);
        expect(stats.size).toBeLessThan(500);
      }
    });

    test('configuration files should be small', () => {
      const gitattributesStats = fs.statSync(path.join(__dirname, '..', '.gitattributes'));
      const gitignoreStats = fs.statSync(path.join(__dirname, '..', '.gitignore'));
      const coderabbitStats = fs.statSync(path.join(__dirname, '..', '.coderabbit.yaml'));
      
      expect(gitattributesStats.size).toBeLessThan(10000);
      expect(gitignoreStats.size).toBeLessThan(50000);
      expect(coderabbitStats.size).toBeLessThan(10000);
    });
  });

  describe('Security Best Practices', () => {
    test('configuration files should not expose sensitive paths', () => {
      [gitattributes, gitignore].forEach(content => {
        expect(content).not.toMatch(/\/home\//);
        expect(content).not.toMatch(/\/Users\//);
        expect(content).not.toMatch(/C:\\/);
      });
    });

    test('should not ignore security-critical files', () => {
      expect(gitignore).not.toContain('.gitattributes');
      expect(gitignore).not.toContain('.gitignore');
    });
  });

  describe('Maintainability', () => {
    test('configuration files should have comments for clarity', () => {
      expect(gitignore).toMatch(/#/);
    });

    test('configuration files should be organized in sections', () => {
      const gitignoreLines = gitignore.split('\n');
      const sectionComments = gitignoreLines.filter(line => line.match(/^#\s+[A-Z]/));
      
      expect(sectionComments.length).toBeGreaterThan(0);
    });
  });
});
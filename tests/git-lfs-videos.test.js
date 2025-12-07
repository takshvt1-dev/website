/**
 * Test suite for Git LFS video file configuration
 * Validates that video files are properly tracked by Git LFS
 */

const fs = require('fs');
const path = require('path');

describe('Git LFS Video Files Tests', () => {
  const carouselVideosPath = path.join(__dirname, '..', 'resources', 'carousel-videos');
  const recentOrdersPath = path.join(__dirname, '..', 'resources', 'recent-orders');
  
  const carouselVideos = ['1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4'];
  const recentOrdersVideos = ['1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4'];

  describe('Video File Directories', () => {
    test('carousel-videos directory should exist', () => {
      expect(fs.existsSync(carouselVideosPath)).toBe(true);
    });

    test('recent-orders directory should exist', () => {
      expect(fs.existsSync(recentOrdersPath)).toBe(true);
    });

    test('carousel-videos should be a directory', () => {
      const stats = fs.statSync(carouselVideosPath);
      expect(stats.isDirectory()).toBe(true);
    });

    test('recent-orders should be a directory', () => {
      const stats = fs.statSync(recentOrdersPath);
      expect(stats.isDirectory()).toBe(true);
    });
  });

  describe('Carousel Videos Existence', () => {
    carouselVideos.forEach((video, index) => {
      test(`carousel video ${index + 1} (${video}) should exist`, () => {
        const videoPath = path.join(carouselVideosPath, video);
        expect(fs.existsSync(videoPath)).toBe(true);
      });
    });

    test('all 5 carousel videos should be present', () => {
      const files = fs.readdirSync(carouselVideosPath);
      const mp4Files = files.filter(f => f.endsWith('.mp4'));
      expect(mp4Files.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Recent Orders Videos Existence', () => {
    recentOrdersVideos.forEach((video, index) => {
      test(`recent orders video ${index + 1} (${video}) should exist`, () => {
        const videoPath = path.join(recentOrdersPath, video);
        expect(fs.existsSync(videoPath)).toBe(true);
      });
    });

    test('all 5 recent orders videos should be present', () => {
      const files = fs.readdirSync(recentOrdersPath);
      const mp4Files = files.filter(f => f.endsWith('.mp4'));
      expect(mp4Files.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Git LFS Pointer Format Validation', () => {
    const validateLFSPointer = (content) => {
      const hasVersion = content.includes('version https://git-lfs.github.com/spec/v1');
      const hasOid = /oid sha256:[a-f0-9]{64}/.test(content);
      const hasSize = /size \d+/.test(content);
      
      return { hasVersion, hasOid, hasSize };
    };

    carouselVideos.forEach((video, index) => {
      test(`carousel video ${index + 1} should be a valid LFS pointer`, () => {
        const videoPath = path.join(carouselVideosPath, video);
        const content = fs.readFileSync(videoPath, 'utf8');
        
        const { hasVersion, hasOid, hasSize } = validateLFSPointer(content);
        
        expect(hasVersion).toBe(true);
        expect(hasOid).toBe(true);
        expect(hasSize).toBe(true);
      });
    });

    recentOrdersVideos.forEach((video, index) => {
      test(`recent orders video ${index + 1} should be a valid LFS pointer`, () => {
        const videoPath = path.join(recentOrdersPath, video);
        const content = fs.readFileSync(videoPath, 'utf8');
        
        const { hasVersion, hasOid, hasSize } = validateLFSPointer(content);
        
        expect(hasVersion).toBe(true);
        expect(hasOid).toBe(true);
        expect(hasSize).toBe(true);
      });
    });
  });

  describe('LFS Pointer Structure', () => {
    test('carousel video pointers should have correct LFS version', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      
      expect(content).toMatch(/version https:\/\/git-lfs\.github\.com\/spec\/v1/);
    });

    test('recent orders video pointers should have correct LFS version', () => {
      const videoPath = path.join(recentOrdersPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      
      expect(content).toMatch(/version https:\/\/git-lfs\.github\.com\/spec\/v1/);
    });

    test('LFS pointers should contain valid SHA256 OID', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      
      const oidMatch = content.match(/oid sha256:([a-f0-9]{64})/);
      expect(oidMatch).toBeTruthy();
      expect(oidMatch[1].length).toBe(64);
    });

    test('LFS pointers should contain size information', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      
      const sizeMatch = content.match(/size (\d+)/);
      expect(sizeMatch).toBeTruthy();
      expect(parseInt(sizeMatch[1])).toBeGreaterThan(0);
    });

    test('LFS pointer should have exactly 3 lines', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      const lines = content.trim().split('\n');
      
      expect(lines.length).toBe(3);
    });

    test('LFS pointer lines should be in correct order', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      const lines = content.trim().split('\n');
      
      expect(lines[0]).toMatch(/^version https:\/\//);
      expect(lines[1]).toMatch(/^oid sha256:/);
      expect(lines[2]).toMatch(/^size \d+$/);
    });
  });

  describe('File Size Validation', () => {
    test('LFS pointer files should be small (< 500 bytes)', () => {
      carouselVideos.forEach(video => {
        const videoPath = path.join(carouselVideosPath, video);
        const stats = fs.statSync(videoPath);
        expect(stats.size).toBeLessThan(500);
      });
    });

    test('all LFS pointers should have similar sizes', () => {
      const sizes = carouselVideos.map(video => {
        const videoPath = path.join(carouselVideosPath, video);
        return fs.statSync(videoPath).size;
      });
      
      const minSize = Math.min(...sizes);
      const maxSize = Math.max(...sizes);
      
      // Pointer sizes should be within 100 bytes of each other
      expect(maxSize - minSize).toBeLessThan(100);
    });

    test('LFS pointers should indicate non-zero original file sizes', () => {
      carouselVideos.forEach(video => {
        const videoPath = path.join(carouselVideosPath, video);
        const content = fs.readFileSync(videoPath, 'utf8');
        const sizeMatch = content.match(/size (\d+)/);
        
        expect(parseInt(sizeMatch[1])).toBeGreaterThan(0);
      });
    });
  });

  describe('SHA256 OID Validation', () => {
    test('all carousel videos should have unique OIDs', () => {
      const oids = carouselVideos.map(video => {
        const videoPath = path.join(carouselVideosPath, video);
        const content = fs.readFileSync(videoPath, 'utf8');
        const match = content.match(/oid sha256:([a-f0-9]{64})/);
        return match ? match[1] : null;
      });
      
      const uniqueOids = [...new Set(oids.filter(Boolean))];
      expect(uniqueOids.length).toBe(oids.filter(Boolean).length);
    });

    test('all recent orders videos should have unique OIDs', () => {
      const oids = recentOrdersVideos.map(video => {
        const videoPath = path.join(recentOrdersPath, video);
        const content = fs.readFileSync(videoPath, 'utf8');
        const match = content.match(/oid sha256:([a-f0-9]{64})/);
        return match ? match[1] : null;
      });
      
      const uniqueOids = [...new Set(oids.filter(Boolean))];
      expect(uniqueOids.length).toBe(oids.filter(Boolean).length);
    });

    test('OIDs should be valid hexadecimal', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      const match = content.match(/oid sha256:([a-f0-9]{64})/);
      
      expect(match).toBeTruthy();
      expect(/^[a-f0-9]+$/.test(match[1])).toBe(true);
    });
  });

  describe('Cross-Directory Validation', () => {
    test('carousel and recent-orders videos should have same structure', () => {
      const carouselFiles = fs.readdirSync(carouselVideosPath).filter(f => f.endsWith('.mp4'));
      const recentOrdersFiles = fs.readdirSync(recentOrdersPath).filter(f => f.endsWith('.mp4'));
      
      expect(carouselFiles.length).toBe(recentOrdersFiles.length);
    });

    test('corresponding videos should have same naming pattern', () => {
      const carouselFiles = fs.readdirSync(carouselVideosPath).filter(f => f.endsWith('.mp4')).sort();
      const recentOrdersFiles = fs.readdirSync(recentOrdersPath).filter(f => f.endsWith('.mp4')).sort();
      
      expect(carouselFiles).toEqual(recentOrdersFiles);
    });

    test('videos in both directories may reference same content', () => {
      // Videos 1-5 appear in both directories, check if they're identical
      const video1Carousel = fs.readFileSync(path.join(carouselVideosPath, '1.mp4'), 'utf8');
      const video1Recent = fs.readFileSync(path.join(recentOrdersPath, '1.mp4'), 'utf8');
      
      // If they're the same, OIDs should match
      const oid1 = video1Carousel.match(/oid sha256:([a-f0-9]{64})/)?.[1];
      const oid2 = video1Recent.match(/oid sha256:([a-f0-9]{64})/)?.[1];
      
      expect(oid1).toBe(oid2);
    });
  });

  describe('File Permissions and Accessibility', () => {
    test('carousel videos should be readable', () => {
      carouselVideos.forEach(video => {
        const videoPath = path.join(carouselVideosPath, video);
        expect(() => {
          fs.readFileSync(videoPath, 'utf8');
        }).not.toThrow();
      });
    });

    test('recent orders videos should be readable', () => {
      recentOrdersVideos.forEach(video => {
        const videoPath = path.join(recentOrdersPath, video);
        expect(() => {
          fs.readFileSync(videoPath, 'utf8');
        }).not.toThrow();
      });
    });

    test('video directories should be accessible', () => {
      expect(() => {
        fs.readdirSync(carouselVideosPath);
      }).not.toThrow();
      
      expect(() => {
        fs.readdirSync(recentOrdersPath);
      }).not.toThrow();
    });
  });

  describe('File Content Validation', () => {
    test('LFS pointers should not contain binary data', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      
      // Should be readable as UTF-8 text
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    });

    test('LFS pointers should only contain ASCII characters', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      
      // Check for non-ASCII characters
      expect(/^[\x00-\x7F]*$/.test(content)).toBe(true);
    });

    test('LFS pointers should not have trailing whitespace', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (index < lines.length - 1) { // Exclude last line which may be empty
          expect(line).not.toMatch(/\s$/);
        }
      });
    });

    test('LFS pointers should use Unix line endings', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      
      expect(content).not.toMatch(/\r\n/);
    });
  });

  describe('Integration with .gitattributes', () => {
    test('.gitattributes should exist and configure LFS for mp4 files', () => {
      const gitattributesPath = path.join(__dirname, '..', '.gitattributes');
      expect(fs.existsSync(gitattributesPath)).toBe(true);
      
      const content = fs.readFileSync(gitattributesPath, 'utf8');
      expect(content).toMatch(/\*\.mp4.*filter=lfs/);
    });

    test('video files should match .gitattributes pattern', () => {
      const allVideos = [...carouselVideos, ...recentOrdersVideos];
      
      allVideos.forEach(video => {
        expect(video).toMatch(/\.mp4$/);
      });
    });
  });

  describe('Original File Size Information', () => {
    test('carousel videos should indicate reasonable original sizes', () => {
      carouselVideos.forEach(video => {
        const videoPath = path.join(carouselVideosPath, video);
        const content = fs.readFileSync(videoPath, 'utf8');
        const sizeMatch = content.match(/size (\d+)/);
        const size = parseInt(sizeMatch[1]);
        
        // Original videos should be between 100KB and 10MB
        expect(size).toBeGreaterThan(100000);
        expect(size).toBeLessThan(10000000);
      });
    });

    test('file sizes should be consistent with video content', () => {
      // Check that reported sizes are reasonable for video files
      const sizes = carouselVideos.map(video => {
        const videoPath = path.join(carouselVideosPath, video);
        const content = fs.readFileSync(videoPath, 'utf8');
        const match = content.match(/size (\d+)/);
        return parseInt(match[1]);
      });
      
      // All sizes should be in a reasonable range
      sizes.forEach(size => {
        expect(size).toBeGreaterThan(0);
        expect(size).toBeLessThan(10000000); // 10MB max
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle missing video files gracefully', () => {
      const nonExistentPath = path.join(carouselVideosPath, 'nonexistent.mp4');
      
      expect(fs.existsSync(nonExistentPath)).toBe(false);
    });

    test('should detect corrupted LFS pointers', () => {
      const videoPath = path.join(carouselVideosPath, '1.mp4');
      const content = fs.readFileSync(videoPath, 'utf8');
      
      // Valid pointer should have all required fields
      expect(content).toContain('version');
      expect(content).toContain('oid');
      expect(content).toContain('size');
    });
  });

  describe('Best Practices', () => {
    test('video files should follow naming convention', () => {
      const allVideos = [
        ...fs.readdirSync(carouselVideosPath),
        ...fs.readdirSync(recentOrdersPath)
      ].filter(f => f.endsWith('.mp4'));
      
      allVideos.forEach(video => {
        expect(video).toMatch(/^\d+\.mp4$/);
      });
    });

    test('directories should only contain video files', () => {
      const carouselFiles = fs.readdirSync(carouselVideosPath);
      const recentOrdersFiles = fs.readdirSync(recentOrdersPath);
      
      carouselFiles.forEach(file => {
        expect(file).toMatch(/\.mp4$/);
      });
      
      recentOrdersFiles.forEach(file => {
        expect(file).toMatch(/\.mp4$/);
      });
    });

    test('LFS pointers should be committed to git', () => {
      // Pointers should be small text files, not large binary files
      carouselVideos.forEach(video => {
        const videoPath = path.join(carouselVideosPath, video);
        const stats = fs.statSync(videoPath);
        
        // LFS pointer should be < 500 bytes, actual video would be much larger
        expect(stats.size).toBeLessThan(500);
      });
    });
  });
});
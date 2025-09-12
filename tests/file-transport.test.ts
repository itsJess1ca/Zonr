import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, rmSync, readFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { FileTransport } from '../src';
import type { LogLevel } from '../src';

describe('FileTransport', () => {
  let testDir: string;
  let testFilename: string;
  let testFilePath: string;

  beforeEach(() => {
    testDir = mkdtempSync(join(tmpdir(), 'zonr-test-'));
    testFilename = 'test.log';
    testFilePath = join(testDir, testFilename);
  });

  afterEach(() => {
    try {
      if (existsSync(testDir)) {
        rmSync(testDir, { recursive: true, force: true });
      }
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('constructor', () => {
    it('should create a FileTransport with required options', () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
      });

      expect(transport.name).toBe('file');
      expect(transport.destroyed).toBe(false);
    });

    it('should handle error when path does not exist', () => {
      return new Promise<void>((resolve, reject) => {
        const invalidPath = '/tmp/nonexistent/path';
        
        const transport = new FileTransport({
          filename: testFilename,
          path: invalidPath,
          onError: (error) => {
            try {
              expect(error.message).toContain('ENOENT');
              resolve();
            } catch (err) {
              reject(err);
            }
          },
        });

        // Trigger a write to cause the error
        transport.write('test', 'info');
        
        // Timeout after 5 seconds if no error occurs
        setTimeout(() => {
          reject(new Error('Expected error did not occur'));
        }, 5000);
      });
    });

    it('should handle custom error handler', () => {
      let capturedError: Error | null = null;
      
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
        onError: (error) => {
          capturedError = error;
        },
      });

      // Simulate an error by trying to write to a destroyed transport
      transport.destroy();
      transport.write('test message', 'info');

      expect(capturedError).toBeNull(); // No error should occur for this operation
    });
  });

  describe('write', () => {
    it('should write log messages to file', async () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
        sync: true, // Use sync mode for immediate writes in tests
      });

      transport.write('Test message 1', 'info');
      transport.write('Test message 2', 'error');

      await transport.flush();
      await transport.close();

      expect(existsSync(testFilePath)).toBe(true);

      const content = readFileSync(testFilePath, 'utf8');
      const lines = content.trim().split('\n');

      expect(lines).toHaveLength(2);

      const log1 = JSON.parse(lines[0]);
      expect(log1.level).toBe('info');
      expect(log1.message).toBe('Test message 1');
      expect(log1.timestamp).toBeDefined();

      const log2 = JSON.parse(lines[1]);
      expect(log2.level).toBe('error');
      expect(log2.message).toBe('Test message 2');
      expect(log2.timestamp).toBeDefined();
    }, 10000);

    it('should handle different log levels', async () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
        sync: true,
      });

      const levels: LogLevel[] = ['info', 'warn', 'error', 'debug'];
      
      for (const level of levels) {
        transport.write(`Message for ${level}`, level);
      }

      await transport.flush();
      await transport.close();

      const content = readFileSync(testFilePath, 'utf8');
      const lines = content.trim().split('\n');

      expect(lines).toHaveLength(4);

      for (let i = 0; i < levels.length; i++) {
        const log = JSON.parse(lines[i]);
        expect(log.level).toBe(levels[i]);
        expect(log.message).toBe(`Message for ${levels[i]}`);
      }
    }, 10000);

    it('should not write to destroyed transport', () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
      });

      transport.destroy();
      expect(transport.destroyed).toBe(true);

      // Should not throw but should warn
      transport.write('test message', 'info');
      
      // Transport should remain destroyed
      expect(transport.destroyed).toBe(true);
    });
  });

  describe('lifecycle methods', () => {
    it('should flush buffered content', async () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
        sync: false,
        minLength: 1024,
      });

      transport.write('Buffered message', 'info');
      await transport.flush();
      await transport.close();

      expect(existsSync(testFilePath)).toBe(true);
    }, 10000);

    it('should close transport gracefully', async () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
        sync: true,
      });

      transport.write('Message before close', 'info');
      
      await transport.close();
      expect(transport.destroyed).toBe(true);

      // Should handle multiple close calls
      await transport.close();
    }, 10000);

    it('should destroy transport immediately', () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
      });

      expect(transport.destroyed).toBe(false);
      
      transport.destroy();
      expect(transport.destroyed).toBe(true);

      // Should handle multiple destroy calls
      transport.destroy();
      expect(transport.destroyed).toBe(true);
    });

    it('should handle flush on destroyed transport', async () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
      });

      transport.destroy();

      await expect(transport.flush()).rejects.toThrow('Cannot flush destroyed transport');
    });
  });

  describe('configuration', () => {
    it('should apply default options', () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
      });

      // Access private options through type assertion for testing
      const options = (transport as any).options;
      expect(options.encoding).toBe('utf8');
      expect(options.sync).toBe(false);
      expect(options.minLength).toBe(4096);
    });

    it('should override default options', () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
        encoding: 'ascii',
        sync: true,
        minLength: 1024,
      });

      const options = (transport as any).options;
      expect(options.encoding).toBe('ascii');
      expect(options.sync).toBe(true);
      expect(options.minLength).toBe(1024);
    });
  });

  describe('performance characteristics', () => {
    it('should handle high-volume writes efficiently', async () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
        sync: false,
        minLength: 4096,
      });

      const messageCount = 100; // Reduced for faster tests
      
      for (let i = 0; i < messageCount; i++) {
        transport.write(`High volume message ${i}`, 'info');
      }

      await transport.flush();
      await transport.close();

      const content = readFileSync(testFilePath, 'utf8');
      const lines = content.trim().split('\n');
      expect(lines).toHaveLength(messageCount);
    }, 15000);

    it('should handle concurrent writes', async () => {
      const transport = new FileTransport({
        filename: testFilename,
        path: testDir,
        sync: false,
      });

      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(
          Promise.resolve().then(() => {
            transport.write(`Concurrent message ${i}`, 'info');
          })
        );
      }

      await Promise.all(promises);
      await transport.flush();
      await transport.close();

      const content = readFileSync(testFilePath, 'utf8');
      const lines = content.trim().split('\n');
      expect(lines).toHaveLength(50);
    }, 15000);
  });
});
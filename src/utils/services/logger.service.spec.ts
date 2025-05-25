import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
    // Spy on console methods
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logWithMetadata', () => {
    it('should log message with metadata', () => {
      const message = 'Test message';
      const metadata = { test: 'data' };

      service.logWithMetadata(message, metadata);

      expect(consoleSpy).toHaveBeenCalled();
      const loggedMessage = consoleSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('Test message');
      expect(loggedMessage).toContain('"test":"data"');
    });

    it('should handle empty metadata', () => {
      const message = 'Test message';

      service.logWithMetadata(message);

      expect(consoleSpy).toHaveBeenCalled();
      const loggedMessage = consoleSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('Test message');
      expect(loggedMessage).not.toContain('|');
    });
  });

  describe('logError', () => {
    it('should log error with metadata', () => {
      const error = new Error('Test error');
      const metadata = { context: 'TestContext' };
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      service.logError(error, metadata);

      expect(errorSpy).toHaveBeenCalled();
      const loggedMessage = errorSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('Error occurred');
      expect(loggedMessage).toContain('Test error');
      expect(loggedMessage).toContain('TestContext');

      errorSpy.mockRestore();
    });

    it('should log error without metadata', () => {
      const error = new Error('Test error');
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      service.logError(error);

      expect(errorSpy).toHaveBeenCalled();
      const loggedMessage = errorSpy.mock.calls[0][0];
      expect(loggedMessage).toContain('Error occurred');
      expect(loggedMessage).toContain('Test error');

      errorSpy.mockRestore();
    });
  });

  describe('environment handling', () => {
    it('should respect development environment', () => {
      process.env.NODE_ENV = 'development';
      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

      service.logWithMetadata('Debug message', {}, 'debug');

      expect(debugSpy).toHaveBeenCalled();
      debugSpy.mockRestore();
    });

    it('should respect production environment', () => {
      process.env.NODE_ENV = 'production';
      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

      service.logWithMetadata('Debug message', {}, 'debug');

      expect(debugSpy).not.toHaveBeenCalled();
      debugSpy.mockRestore();
    });
  });
});

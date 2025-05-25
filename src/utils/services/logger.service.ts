import { Injectable, Logger, LogLevel } from '@nestjs/common';

export interface LogMetadata {
  context?: string;
  error?: any;
  [key: string]: any;
}

@Injectable()
export class LoggerService extends Logger {
  private readonly env = process.env.NODE_ENV || 'development';

  logWithMetadata(
    message: string,
    metadata: LogMetadata = {},
    level: LogLevel = 'log',
  ) {
    const formattedMessage = this.formatMessage(message, metadata);

    switch (level) {
      case 'debug':
        if (this.env === 'development') {
          super.debug(formattedMessage);
        }
        break;
      case 'warn':
        super.warn(formattedMessage);
        break;
      case 'error':
        super.error(formattedMessage, metadata.error?.stack);
        break;
      default:
        super.log(formattedMessage);
    }
  }

  logError(error: Error, metadata: LogMetadata = {}) {
    this.logWithMetadata(
      'Error occurred',
      {
        ...metadata,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
      'error',
    );
  }

  private formatMessage(message: string, metadata: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const context = metadata.context ? `[${metadata.context}]` : '';
    const { context: _, error: __, ...restMetadata } = metadata;

    const metadataStr = Object.keys(restMetadata).length
      ? `| ${JSON.stringify(restMetadata)}`
      : '';

    return `${timestamp} ${context} ${message} ${metadataStr}`.trim();
  }
}

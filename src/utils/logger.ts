
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry: LogEntry = {
        level: LogLevel.ERROR,
        message,
        timestamp: new Date(),
        context,
        error
      };
      this.addLog(entry);
      console.error(`[ERROR] ${message}`, { context, error });
    }
  }

  warn(message: string, context?: Record<string, any>) {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry: LogEntry = {
        level: LogLevel.WARN,
        message,
        timestamp: new Date(),
        context
      };
      this.addLog(entry);
      console.warn(`[WARN] ${message}`, context);
    }
  }

  info(message: string, context?: Record<string, any>) {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry: LogEntry = {
        level: LogLevel.INFO,
        message,
        timestamp: new Date(),
        context
      };
      this.addLog(entry);
      console.log(`[INFO] ${message}`, context);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry: LogEntry = {
        level: LogLevel.DEBUG,
        message,
        timestamp: new Date(),
        context
      };
      this.addLog(entry);
      console.debug(`[DEBUG] ${message}`, context);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();

// Set log level based on environment
if (import.meta.env.DEV) {
  logger.setLogLevel(LogLevel.DEBUG);
} else {
  logger.setLogLevel(LogLevel.WARN);
}

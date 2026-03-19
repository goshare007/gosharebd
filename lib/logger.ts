import log from 'loglevel';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  log.setLevel('debug');
} else if (isProduction) {
  log.setLevel('warn');
} else {
  log.setLevel('info');
}

export const logger = {
  trace: (message: string, ...args: unknown[]) => log.trace(message, ...args),
  debug: (message: string, ...args: unknown[]) => log.debug(message, ...args),
  info: (message: string, ...args: unknown[]) => log.info(message, ...args),
  warn: (message: string, ...args: unknown[]) => log.warn(message, ...args),
  error: (message: string, ...args: unknown[]) => log.error(message, ...args),
};

export default logger;

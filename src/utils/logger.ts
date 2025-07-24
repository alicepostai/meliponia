
const isDevelopment = __DEV__;

export const logger = {
  log: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  },

  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.debug(message, ...args);
    }
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(message, ...args);
  },

  error: (message: string, ...args: any[]) => {
    console.error(message, ...args);
  },

  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.info(message, ...args);
    }
  }
};
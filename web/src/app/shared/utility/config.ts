
export interface AppConfig {
    appName: string;
    apiEndPoints: {
      auth: {
        checkAccount: string;
        register: string;
      };
    };
  }

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_TOKEN: string;
      FAUNA_TOKEN: string;
      RPC_URL: string;
      ENV: 'test' | 'dev' | 'prod';
    }
  }
}

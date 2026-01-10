declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      FRONTEND_URL: string;

      // Database
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;

      // Steam
      STEAM_API_KEY: string;
      STEAM_RETURN_URL: string;
      STEAM_REALM: string;

      // JWT
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_ACCESS_EXPIRES_IN: string;
      JWT_REFRESH_EXPIRES_IN: string;

      // Cookie
      COOKIE_SECRET: string;
    }
  }
}

export {};

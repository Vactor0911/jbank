declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      FRONTEND_URL: string;

      // MariaDB
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;

      // Redis
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      REDIS_DATABASE: string;

      // Steam
      STEAM_API_KEY: string;
      STEAM_RETURN_URL: string;
      STEAM_REALM: string;

      // JWT
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_ACCESS_EXPIRES_IN: string;
      JWT_REFRESH_EXPIRES_IN: string;

      // CSRF
      CSRF_EXPIRES_IN: string;

      // Cookie
      COOKIE_SECRET: string;
    }
  }
}

export {};

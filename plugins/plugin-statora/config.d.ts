/// <reference types="backstage__config" />

declare module '@backstage/config' {
    interface AppConfig {
      statora?: {
        supabase?: {
          url?: string;
          anonKey?: string;
        };
      };
    }
  }
  
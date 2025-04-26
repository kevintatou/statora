import { DatabaseService, DiscoveryService, LoggerService } from '@backstage/backend-plugin-api';

export interface PluginEnvironment {
  logger: LoggerService;
  database: DatabaseService;
  discovery: DiscoveryService;
}

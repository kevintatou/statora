import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { Config } from '@backstage/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

type ComponentRow = {
  component_name: string;
  product_name: string | null;
  github_repo: string | null;
  argocd_app: string | null;
  sentry_project: string | null;
  gcp_project: string | null;
  jira_project: string | null;
};

export class SupabaseEntityProvider implements EntityProvider {
  private readonly supabase: SupabaseClient;
  private connection?: EntityProviderConnection;

  constructor(config: Config) {
    const url = config.getString('statora.supabase.url');
    const key = config.getString('statora.supabase.serviceRoleKey');
    this.supabase = createClient(url, key);
  }

  getProviderName(): string {
    return 'statora-provider';
  }

  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
    await this.refresh();          // <-- add this line

  }

  async refresh(): Promise<void> {
    console.log("HEY")
    if (!this.connection) {
      throw new Error('SupabaseEntityProvider not connected to catalog');
    }
    const { data: components, error } = await this.supabase
      .from('components')
      .select('*');
    console.log(`🔁 Applying ${components?.length} components to catalog`);

    if (error || !components) {
      throw new Error(`❌ Supabase fetch failed: ${error?.message || 'Unknown error'}`);
    }

    const entities = components.map(c => {
      // SupabaseEntityProvider.ts

      const annotations: Record<string, string> = {
        'backstage.io/source-location': c.github_repo ?? '',
        'backstage.io/techdocs-ref': 'dir:.',

        // Only add this if you really need it – and with ONE bootstrap prefix
        'backstage.io/managed-by-location': 'bootstrap:statora-supabase',
        'backstage.io/managed-by-origin-location': 'bootstrap:statora-supabase',
      };


      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: c.component_name,
          annotations,
        },
        spec: {
          type: 'service',
          lifecycle: 'production',
          owner: 'statora',
        },
      };
    });
    console.log(entities)
    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        entity,
        locationKey: 'statora-provider',
      }))
    });
  }

}

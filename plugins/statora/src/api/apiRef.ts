import { createApiRef } from "@backstage/core-plugin-api";
type Mapping = {
  component_name: string;
  github_repo: string;
  product_name?: string;
};

type DoraMetrics = {
  component_name: string;
  deploy_frequency: number;
  lead_time_minutes: number;
  change_failure_rate: number;
  time_to_restore_minutes: number;
};

// plugins/statora/src/api/apiRef.ts
export interface StatoraApi {
  getComponentMappings(): Promise<Mapping[]>;
  getDoraMetrics(): Promise<DoraMetrics[]>;
  getComponentsByProduct(productName: string): Promise<Mapping[]>;
  getComponentMapping(componentName: string): Promise<Mapping | null>;
  getComponentDora(componentName: string): Promise<DoraMetrics | null>;
  updateComponentMapping(componentName: string, mapping: Mapping): Promise<Mapping>;
  createComponentMapping(componentName: string, mapping: Mapping): Promise<Mapping>;
}


export const statoraApiRef = createApiRef<StatoraApi>({
  id: 'plugin.statora.service',
});

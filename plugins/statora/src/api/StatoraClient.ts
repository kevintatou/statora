import { DiscoveryApi, IdentityApi } from "@backstage/core-plugin-api";
import { StatoraApi } from "./apiRef";

export class StatoraClient implements StatoraApi {
  constructor(
    private readonly discoveryApi: DiscoveryApi,
    private readonly identityApi: IdentityApi
  ) {}

  private async fetchWithAuth(path: string, options: RequestInit = {}) {
    const baseUrl = await this.discoveryApi.getBaseUrl('statora-backend');
    const { token } = await this.identityApi.getCredentials();

    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.statusText}`);
    }

    return res.status === 204 ? null : await res.json();
  }

  getComponentMappings() {
    return this.fetchWithAuth('/components');
  }

  getDoraMetrics() {
    return this.fetchWithAuth('/dora-metrics');
  }

  getComponentsByProduct(productName: string) {
    return this.fetchWithAuth(`/products/${encodeURIComponent(productName)}/components`);
  }

  getComponentMapping(componentName: string) {
    return this.fetchWithAuth(`/components/${componentName}`);
  }

  getComponentDora(componentName: string) {
    return this.fetchWithAuth(`/dora-metrics/${componentName}`);
  }

  updateComponentMapping(componentName: string, mapping: Mapping) {
    return this.fetchWithAuth(`/components/${componentName}`, {
      method: 'PUT',
      body: JSON.stringify(mapping),
    });
  }

  createComponentMapping(componentName: string, mapping: Mapping) {
    return this.fetchWithAuth(`/components`, {
      method: 'POST',
      body: JSON.stringify({ ...mapping, component_name: componentName }),
    });
  }
}

// plugins/statora/src/api/api.ts
import { createApiFactory, discoveryApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { statoraApiRef } from './apiRef';
import { StatoraClient } from './StatoraClient';

export const statoraApiFactory = createApiFactory({
  api: statoraApiRef,
  deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
  factory: ({ discoveryApi, identityApi }) =>
    new StatoraClient(discoveryApi, identityApi),
});

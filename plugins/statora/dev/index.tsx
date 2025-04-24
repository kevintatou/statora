import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { statoraPlugin, EntityStatoraContent } from '../src/plugin';

createDevApp()
  .registerPlugin(statoraPlugin)
  .addPage({
    element: <EntityStatoraContent />,
    title: 'Root Page',
    path: '/statora',
  })
  .render();

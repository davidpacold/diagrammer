// Deployment presets for different architecture scenarios

import { sharedSaas } from './shared-saas.js';
import { dedicatedSaas } from './dedicated-saas.js';
import { customerHosted } from './customer-hosted.js';

export const presets = {
  'shared-saas': sharedSaas,
  'dedicated-saas': dedicatedSaas,
  'customer-hosted': customerHosted,
};

export const presetList = [
  { id: 'shared-saas', name: 'Shared SaaS', description: 'Multi-tenant, cost-optimized' },
  { id: 'dedicated-saas', name: 'Dedicated SaaS', description: 'Single-tenant, isolated resources' },
  { id: 'customer-hosted', name: 'Customer Hosted', description: 'On-premises, full control' },
];

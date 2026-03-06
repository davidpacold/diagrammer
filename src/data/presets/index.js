// Deployment presets for different architecture scenarios

import { sharedSaas } from './shared-saas.js';
import { dedicatedSaas } from './dedicated-saas.js';
import { customerHosted } from './customer-hosted.js';
import { azureTerraform } from './azure-terraform.js';

export const presets = {
  'shared-saas': sharedSaas,
  'dedicated-saas': dedicatedSaas,
  'customer-hosted': customerHosted,
  'azure-terraform': azureTerraform,
};

export const presetList = [
  { id: 'shared-saas', name: 'Shared SaaS', description: 'Multi-tenant, cost-optimized' },
  { id: 'dedicated-saas', name: 'Dedicated SaaS', description: 'Single-tenant, isolated resources' },
  { id: 'customer-hosted', name: 'Customer Hosted', description: 'On-premises, full control' },
  { id: 'azure-terraform', name: 'Azure Terraform', description: 'Real-world Azure deployment via Terraform' },
];

import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: '3rcj5swa',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
});

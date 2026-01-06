import { defineAdminConfig } from '@medusajs/admin-sdk'

export default defineAdminConfig({
  name: 'Medusa Admin',
  env: process.env.NODE_ENV,
})

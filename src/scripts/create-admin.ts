#!/usr/bin/env node
import { loadEnv } from '@medusajs/framework/utils'
import { MedusaService } from '@medusajs/framework'
import { UserService } from '@medusajs/medusa'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

async function createAdminUser() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@example.com'
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'password123!'

  console.log(`Creating admin user: ${email}`)

  try {
    const userService = new UserService({
      container: {
        // You need to properly initialize services here
      }
    })

    // This is a simplified version - actual implementation requires
    // proper container setup from the Medusa container
    const { User } = await import('@medusajs/medusa/dist/models/user')
    
    console.log('Admin user creation requires running via medusa CLI')
    console.log(`Please run: npx medusa user -e ${email} -p ${password}`)
    
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }
}

createAdminUser()

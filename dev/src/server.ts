import express from 'express'
import payload from 'payload'
import { InitOptions } from 'payload/config'
import { seed } from './seed'

require('dotenv').config()
const app = express()

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin')
})

type Start = Partial<InitOptions> & {
  seedPayload?: boolean
}

export const start = async ({ seedPayload, ...args }: Start = {}) => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
      if (seedPayload || process.env.PAYLOAD_SEED === 'true') {
        await seed(payload)
      }
    },
    ...(args || {}),
  })

  // Add your own express routes here

  return app.listen(3000)
}

if (!areWeTestingWithJest()) start()

export function areWeTestingWithJest() {
  return process.env.JEST_WORKER_ID !== undefined
}

// import type { Server } from 'http'
// import mongoose from 'mongoose'
import payload from 'payload'
import { start } from './src/server'

import type { Page, ArchiveBlockType } from './src/payload-types'

const isPluginEnabled = process.env.PAYLOAD_IS_PLUGIN_ENABLED === 'true'

describe(`Tests ${isPluginEnabled ? 'with' : 'without'} plugin`, () => {
  // let server: Server
  let server: Awaited<ReturnType<typeof start>>

  beforeAll(async () => {
    server = await start({ local: true, seedPayload: true })
  }, 30000 /* ms */)

  afterAll(async () => {
    // await mongoose.connection.dropDatabase()
    // await mongoose.connection.close()
    server.close()

    if (typeof payload.db.destroy === 'function') {
      await payload.db.destroy(payload)
    }
  }, 30000 /* ms */)

  // Add tests to ensure that the plugin works as expected

  // Example test to check for seeded data
  it('seeds data accordingly', async () => {
    const pagesQuery = await payload.find({
      collection: 'pages',
      sort: 'createdAt',
    })

    expect(pagesQuery.totalDocs).toEqual(1)
  })

  it('executes block-level after read hook within lexical BlocksFeature', async () => {
    const pagesQuery = await payload.find({
      collection: 'pages',
      sort: 'createdAt',
    })
    const [page] = pagesQuery.docs as Page[]
    const block = page.layout?.root.children[0].fields as ArchiveBlockType

    expect(block.docs?.populatedDocs?.length).toEqual(1)
    expect(block.docs?.populatedDocsTotal).toEqual(block.docs?.populatedDocs?.length)
    expect(typeof block.docs?.populatedDocs?.[0].value).toEqual('string')
  })
})

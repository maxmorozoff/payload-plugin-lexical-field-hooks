import path from 'path'

import { buildConfig } from 'payload/config'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Examples } from './collections/Examples'
import { Media } from './collections/Media'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import lexicalFieldHooks from '../../src'
// import lexicalFieldHooks from 'payload-plugin-lexical-field-hooks'

console.log('PAYLOAD_IS_PLUGIN_ENABLED:', process.env.PAYLOAD_IS_PLUGIN_ENABLED)

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    webpack: config => {
      const newConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...(config?.resolve?.alias || {}),
            react: path.join(__dirname, '../node_modules/react'),
            'react-dom': path.join(__dirname, '../node_modules/react-dom'),
            payload: path.join(__dirname, '../node_modules/payload'),
          },
        },
      }
      return newConfig
    },
  },
  editor: lexicalEditor({}),
  collections: [
    //
    Pages,
    Examples,
    Users,
    Media,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [lexicalFieldHooks({ enabled: process.env.PAYLOAD_IS_PLUGIN_ENABLED !== 'false' })],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
})

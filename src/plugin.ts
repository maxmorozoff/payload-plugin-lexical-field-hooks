import type { Plugin } from 'payload/config'
import type { CollectionConfig, GlobalConfig, RichTextField } from 'payload/types'

import type { PluginConfig } from './types'

import { fixRichTextHooks } from './lib/fixRichTextHooks'
import { recursiveFindField } from './lib/recursiveFindField'
import { hasBlocksFeature } from './lib/utils'

const lexicalFixFieldHooksPlugin =
  (pluginConfig: PluginConfig): Plugin =>
  config => {
    if (!pluginConfig.enabled) return config

    return {
      ...config,
      ...(config?.collections ? { collections: config.collections?.map(fixCollection) } : {}),
      ...(config?.globals ? { globals: config.globals?.map(fixCollection) } : {}),
    }
  }

export default lexicalFixFieldHooksPlugin

function fixCollection<T extends CollectionConfig | GlobalConfig>(collection: T): T {
  const richTextFields = recursiveFindField<RichTextField>(
    collection.fields || [],
    'richText',
  ).filter(field => hasBlocksFeature(field))

  if (!richTextFields.length) return collection

  // console.log('%o', { richTextFields });
  richTextFields.forEach(fixRichTextHooks)

  return collection
}

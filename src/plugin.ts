import type { Plugin } from 'payload/config'
import type { CollectionConfig, GlobalConfig, RichTextField } from 'payload/types'

import type { PluginConfig } from './types'

import { fixRichTextHooks } from './lib/fixRichTextHooks'
import { recursiveFindField } from './lib/recursiveFindField'
import { hasBlocksFeature } from './lib/utils'

const lexicalFixFieldHooksPlugin =
  (pluginConfig: PluginConfig): Plugin =>
  config => {
    if (pluginConfig.enabled === false) return config

    const {
      collectionsFilter = () => true,
      globalsFilter = () => true,
      richTextFieldFilter = () => true,
      hooksFilter = () => true,
    } = pluginConfig

    return {
      ...config,
      ...(config?.collections
        ? {
            collections: config.collections?.map(collection =>
              collectionsFilter({ collection })
                ? fixCollection(collection, hooksFilter, richTextFieldFilter)
                : collection,
            ),
          }
        : {}),
      ...(config?.globals
        ? {
            globals: config.globals?.map(global =>
              globalsFilter({ global })
                ? fixCollection(global, hooksFilter, richTextFieldFilter)
                : global,
            ),
          }
        : {}),
    }
  }

export default lexicalFixFieldHooksPlugin

function fixCollection<T extends CollectionConfig | GlobalConfig>(
  collection: T,
  hooksFilter: NonNullable<PluginConfig['hooksFilter']>,
  richTextFieldFilter: NonNullable<PluginConfig['richTextFieldFilter']>,
): T {
  const richTextFields = recursiveFindField<RichTextField>(
    collection.fields || [],
    'richText',
  ).filter(field => hasBlocksFeature(field) && richTextFieldFilter({ field }))

  if (!richTextFields.length) return collection

  // console.log('%o', { richTextFields });
  const fixHooks = fixRichTextHooks(hooksFilter)
  richTextFields.forEach(fixHooks)

  return collection
}

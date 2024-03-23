import type {
  CollectionConfig,
  FieldAffectingData,
  GlobalConfig,
  RichTextField,
} from 'payload/types'

import { type LexicalRichTextAdapter } from '@payloadcms/richtext-lexical'

export type PluginConfig = {
  /**
   * @default () => true
   */
  collectionsFilter?: (args: { collection: CollectionConfig }) => boolean
  /**
   * Enable or disable plugin
   * @default true
   */
  enabled?: boolean
  /**
   * @default () => true
   */
  globalsFilter?: (args: { global: GlobalConfig }) => boolean
  /**
   * @default () => true
   */
  hooksFilter?: (args: {
    blockType: string
    field: FieldAffectingData
    hookIndex: number
    hookName: FieldHookName
  }) => boolean
  /**
   * @default () => true
   */
  richTextFieldFilter?: (args: { field: RichTextField }) => boolean
}

export type LexicalRichTextField = Omit<RichTextField, 'editor'> & {
  editor?: LexicalRichTextAdapter
}
export type FieldHooks = NonNullable<RichTextField['hooks']>
export type FieldHookName = keyof FieldHooks

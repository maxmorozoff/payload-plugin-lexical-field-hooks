import { type LexicalRichTextAdapter } from '@payloadcms/richtext-lexical'
import type {
  CollectionConfig,
  FieldAffectingData,
  GlobalConfig,
  RichTextField,
} from 'payload/types'

export type PluginConfig = {
  /**
   * Enable or disable plugin
   * @default true
   */
  enabled?: boolean
  /**
   * @default () => true
   */
  collectionsFilter?: (args: { collection: CollectionConfig }) => boolean
  /**
   * @default () => true
   */
  globalsFilter?: (args: { global: GlobalConfig }) => boolean
  /**
   * @default () => true
   */
  richTextFieldFilter?: (args: { field: RichTextField }) => boolean
  /**
   * @default () => true
   */
  hooksFilter?: (args: {
    hookName: FieldHookName
    blockType: string
    field: FieldAffectingData
    hookIndex: number
  }) => boolean
}

export type LexicalRichTextField = Omit<RichTextField, 'editor'> & {
  editor?: LexicalRichTextAdapter
}
export type FieldHooks = NonNullable<RichTextField['hooks']>
export type FieldHookName = keyof FieldHooks

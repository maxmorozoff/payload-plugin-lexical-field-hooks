import { type LexicalRichTextAdapter } from '@payloadcms/richtext-lexical'
import { type RichTextField } from 'payload/types'

export type PluginConfig = {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean
}

export type LexicalRichTextField = Omit<RichTextField, 'editor'> & {
  editor?: LexicalRichTextAdapter
}
export type FieldHooks = NonNullable<RichTextField['hooks']>
export type FieldHookName = keyof FieldHooks

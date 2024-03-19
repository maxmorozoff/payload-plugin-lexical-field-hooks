import type { LexicalRichTextAdapter } from '@payloadcms/richtext-lexical'
import type { Block, Field, RichTextField } from 'payload/types'

import { fieldAffectsData } from 'payload/types'

import type { FieldHookName } from '../types'

import { fieldHooksWrapper } from './hooksWrapper'
import { ensureKeyExists, hasOwnNonNullableProperty } from './utils'

export function fixRichTextHooks(richTextField: RichTextField) {
  const editor = richTextField.editor as LexicalRichTextAdapter

  const blocksFeature = editor.editorConfig.resolvedFeatureMap.get('blocks')
  if (!blocksFeature) return

  const blocks = (blocksFeature.props as { blocks: Block[] })?.blocks
  if (!blocks?.length) return

  ensureKeyExists(richTextField, 'hooks', {})
  const wrappedHooks = richTextField.hooks

  blocks.forEach(block => {
    traverseBlock(block.fields, block.slug)
  })

  function traverseBlock(fields: Field[], blockType: string) {
    for (const field of fields) {
      if (fieldAffectsData(field) && hasOwnNonNullableProperty(field, 'hooks')) {
        const hooks = field.hooks

        const hookNames = Object.keys(hooks) as FieldHookName[]
        for (const hookName of hookNames) {
          fieldHooksWrapper(hookName, hooks, field, blockType, wrappedHooks)
        }

        continue
      }

      if ('fields' in field || 'tabs' in field) {
        traverseBlock(
          // @ts-expect-error FIXME: Property 'type' is missing in type 'NamedTab'.
          'fields' in field ? field?.fields : field?.tabs,
          blockType,
        )
      }
    }
  }
}

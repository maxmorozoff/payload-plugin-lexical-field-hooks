import type { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedLexicalNode } from 'lexical'
import type { FieldAffectingData, FieldHook } from 'payload/types'

import type { FieldHookName, FieldHooks, PluginConfig } from '../types'

import { deepChange } from './deepChange'
import { ensureKeyExists } from './utils'

export function fieldHooksWrapper(
  hookName: FieldHookName,
  hooks: FieldHooks,
  field: FieldAffectingData,
  blockType: string,
  wrappedHooks: FieldHooks,
  hookFilter: NonNullable<PluginConfig['hooksFilter']>,
) {
  const namedHooks = hooks[hookName]
  if (!(namedHooks && Array.isArray(namedHooks))) return

  const wrappedNamedHooks = namedHooks
    .filter((_, i) => hookFilter({ blockType, field, hookIndex: i, hookName }))
    .map(hookWrapper(field, blockType, hookName))

  if (!wrappedNamedHooks?.length) return

  ensureKeyExists(wrappedHooks, hookName, [])

  wrappedHooks[hookName].push(...wrappedNamedHooks)
}

function hookWrapper(field: FieldAffectingData, blockType: string, hookName: FieldHookName) {
  return (hook: FieldHook<any, any, any>): FieldHook<any, any, any> =>
    async ({ value, ...opts }) => {
      const richTextChildren = value?.root?.children as SerializedLexicalNode[]
      if (!richTextChildren) return value

      const children = await Promise.all(
        richTextChildren.map(_node => {
          // TODO: Add support for link feature
          // if(_node.type === 'link') {
          //   return {
          //     ..._node,
          //   }
          // }
          if (_node.type === 'block') {
            const node = _node as SerializedBlockNode
            const nodeFields = node.fields

            if ((nodeFields?.blockType !== blockType, !field.name)) return _node
            return deepChange(nodeFields, field.name, (value, siblingData) =>
              hook({
                ...opts,
                field,
                siblingData,
                value,
              }),
            ).then(fields => ({ ...node, fields }))
          }

          return _node
        }),
      ).catch(err => {
        console.error(err)
      })

      return { ...value, root: { ...value.root, children } }
    }
}

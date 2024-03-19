import type { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { SerializedLexicalNode } from 'lexical'
import type { FieldAffectingData, FieldHook } from 'payload/types'

import type { FieldHookName, FieldHooks } from '../types'

import { deepChange } from './deepChange'
import { ensureKeyExists } from './utils'

export function fieldHooksWrapper(
  hookName: FieldHookName,
  hooks: FieldHooks,
  field: FieldAffectingData,
  blockType: string,
  wrappedHooks: FieldHooks,
) {
  const namedHooks = hooks[hookName]
  if (!(namedHooks && Array.isArray(namedHooks))) return

  const wrappedNamedHooks = namedHooks.map(hookWrapper(field, blockType))

  ensureKeyExists(wrappedHooks, hookName, [])

  wrappedHooks[hookName].push(...wrappedNamedHooks)
}

function hookWrapper(field: FieldAffectingData, blockType: string) {
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

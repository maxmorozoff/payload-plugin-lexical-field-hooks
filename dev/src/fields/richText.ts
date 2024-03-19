import {
  lexicalEditor,
  // TreeViewFeature,
  BlocksFeature,
  LinkFeature,
  type LinkFeatureProps,
} from '@payloadcms/richtext-lexical'
import type { Block, RichTextField } from 'payload/types'
import deepMerge from '../utilities/deepMerge'
import link from './link'

type RichTextOptions = {
  blocks?: Block[]
  linkFields?: LinkFeatureProps['fields']
  overrides?: Omit<Partial<RichTextField>, 'editor' | 'type'>
}

export const richText = ({
  blocks,
  linkFields = [link({ overrides: { name: 'fields' } })],
  overrides = {},
}: RichTextOptions = {}): RichTextField => {
  return {
    ...deepMerge(
      {
        name: 'layout',
        type: 'richText',
      },
      overrides,
    ),
    editor: lexicalEditor({
      features: ({ defaultFeatures }) =>
        [
          // TreeViewFeature(), // for debugging
          ...(defaultFeatures || []),
          linkFields &&
            LinkFeature({
              fields: linkFields,
            }),
          blocks && BlocksFeature({ blocks }),
        ].filter(Boolean),
    }),
  }
}

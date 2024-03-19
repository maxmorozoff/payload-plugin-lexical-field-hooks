import type { Block } from 'payload/types'

// import { richText } from '../../fields/richText'
import { populateArchiveBlock } from './hooks/populateArchiveBlock'

export const Archive: Block = {
  slug: 'archive',
  labels: {
    singular: 'Archive',
    plural: 'Archives',
  },
  interfaceName: 'ArchiveBlockType',
  fields: [
    // richText({
    //   overrides: {
    //     name: 'introContent',
    //     label: 'Intro Content',
    //   },
    // }),
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Collection',
          value: 'collection',
        },
        {
          label: 'Individual Selection',
          value: 'selection',
        },
      ],
    },
    {
      type: 'select',
      name: 'relationTo',
      label: 'Collections To Show',
      defaultValue: 'pages',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
      },
      options: [
        {
          label: 'Pages',
          value: 'pages',
        },
        {
          label: 'Examples',
          value: 'examples',
        },
      ],
    },
    // {
    //   type: 'relationship',
    //   name: 'categories',
    //   label: 'Categories To Show',
    //   relationTo: 'categories',
    //   hasMany: true,
    //   admin: {
    //     condition: (_, siblingData) => siblingData.populateBy === 'collection',
    //   },
    // },
    {
      type: 'number',
      name: 'limit',
      label: 'Limit',
      defaultValue: 10,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
    },

    {
      type: 'group',
      name: 'docs',
      label: false,
      hooks: {
        afterRead: [populateArchiveBlock],
      },
      fields: [
        {
          type: 'relationship',
          name: 'selectedDocs',
          label: 'Selection',
          relationTo: ['pages', 'examples'],
          hasMany: true,
          admin: {
            condition: (_, siblingData) => siblingData.populateBy === 'selection',
          },
        },
        {
          type: 'relationship',
          name: 'populatedDocs',
          label: 'Populated Docs',
          relationTo: ['pages', 'examples'],
          hasMany: true,
          admin: {
            disabled: true,
            description: 'This field is auto-populated after-read',
            condition: (_, siblingData) => siblingData.populateBy === 'collection',
          },
        },
        {
          type: 'number',
          name: 'populatedDocsTotal',
          label: 'Populated Docs Total',
          admin: {
            step: 1,
            disabled: true,
            description: 'This field is auto-populated after-read',
            condition: (_, siblingData) => siblingData.populateBy === 'collection',
          },
        },
      ],
    },
  ],
}

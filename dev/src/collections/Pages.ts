import type { CollectionConfig } from 'payload/types'

// import { admins } from '../access/admins'
// import { adminsOrPublished } from '../access/adminsOrPublished'

// import { Archive } from '../blocks/ArchiveBlock'
// import { CallToAction } from '../blocks/CallToAction'
// import { Content } from '../blocks/Content'
// import { MediaBlock } from '../blocks/MediaBlock'
import { blocks } from '../blocks'
import { slugField } from '../fields/slug'
import { richText } from '../fields/richText'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${doc.slug !== 'home' ? doc.slug : ''}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  versions: {
    drafts: true,
  },
  // access: {
  //   read: adminsOrPublished,
  //   update: admins,
  //   create: admins,
  //   delete: admins,
  // },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            richText({
              blocks,
              // blocks: [CallToAction, Content, MediaBlock, Archive],
            }),
          ],
        },
      ],
    },
    slugField(),
  ],
}

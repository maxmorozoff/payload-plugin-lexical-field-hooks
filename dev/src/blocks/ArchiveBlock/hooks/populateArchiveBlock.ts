import { FieldHook } from 'payload/types'

export const populateArchiveBlock: FieldHook = async ({
  siblingData: archiveBlock,
  context,
  req: { payload },
}) => {
  if (archiveBlock.populateBy === 'collection' && !context.isPopulatingArchiveBlock) {
    const res = await payload.find({
      collection: archiveBlock.relationTo,
      limit: archiveBlock.limit || 10,
      context: {
        isPopulatingArchiveBlock: true,
      },
      where: {
        ...(archiveBlock?.categories?.length > 0
          ? {
              categories: {
                in: archiveBlock.categories
                  .map(cat => {
                    if (typeof cat === 'string' || typeof cat === 'number') return cat
                    return cat.id
                  })
                  .join(','),
              },
            }
          : {}),
      },
      sort: '-publishedAt',
    })

    return {
      populatedDocsTotal: res.totalDocs,
      populatedDocs: res.docs.map(thisDoc => ({
        relationTo: archiveBlock.relationTo,
        value: thisDoc.id,
      })),
    }
  }
}

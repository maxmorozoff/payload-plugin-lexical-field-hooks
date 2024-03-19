import type { Field } from 'payload/types'

/**
 * Recursive function to find fields that match a specific value or condition.
 *
 * @param fields - Array of fields to search through.
 * @param value - Value or condition to match.
 * @param key - Key to use for comparison, defaults to 'type'.
 * @return Array of fields that match the given value or condition.
 */
export const recursiveFindField = <T extends Field>(
  fields: Field[],
  value: ((value: any) => boolean) | string,
  key: keyof Field = 'type',
): T[] => {
  const richTextFields: T[] = []
  for (const field of fields) {
    if ((typeof value === 'function' && value(field)) || field[key] === value) {
      richTextFields.push(field as T)
      continue
    }
    if ('fields' in field || 'tabs' in field) {
      const foundFields = recursiveFindField<T>(
        // @ts-expect-error FIXME: Property 'type' is missing in type 'NamedTab'.
        'fields' in field ? field?.fields : field?.tabs,
        value,
      )
      richTextFields.push(...foundFields)
    }
  }
  return richTextFields
}

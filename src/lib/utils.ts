import type { RichTextField } from 'payload/types'

import type { LexicalRichTextField } from '../types'

/**
 * Ensures that a specified key exists in an object, assigning a default value if it doesn't.
 *
 * @param object - The object to ensure the key exists in.
 * @param key - The key that should exist in the object.
 * @param defaultValue - The default value to assign if the key doesn't exist.
 * @return Asserts that the object is of type T with the key K and its value being non-nullable.
 */
export function ensureKeyExists<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue: NonNullable<T[K]>,
): asserts object is T & Record<K, NonNullable<T[K]>> {
  if (!object) throw new Error('Object does not exist')
  if (!hasOwnNonNullableProperty(object, key)) object[key] = defaultValue 
}

/**
 * Checks if the input object has a non-nullable property specified by the key.
 *
 * @param object - The object to check for the specified property.
 * @param key - The key of the property to check.
 * @return Returns `true` if the object has the specified non-nullable property, `false` otherwise.
 */
export function hasOwnNonNullableProperty<T extends object, K extends keyof T = keyof T>(
  object: T,
  key: K,
): object is T & Record<K, NonNullable<T[K]>> {
  return Object.hasOwn(object, key) && object[key] !== null && object[key] !== undefined
}

/**
 * Checks if the given richText field has the "blocks" feature enabled.
 *
 * @param field - The field to check.
 * @return Returns true if the field has the "blocks" feature enabled, otherwise false.
 */
export function hasBlocksFeature(field: LexicalRichTextField | RichTextField): boolean {
  return (
    field &&
    hasOwnNonNullableProperty(field, 'editor') &&
    'editorConfig' in field.editor &&
    hasOwnNonNullableProperty(field.editor, 'editorConfig') &&
    hasOwnNonNullableProperty(field.editor.editorConfig, 'features') &&
    hasOwnNonNullableProperty(field.editor.editorConfig.features, 'enabledFeatures') &&
    field.editor.editorConfig.features.enabledFeatures.includes('blocks')
  )
}

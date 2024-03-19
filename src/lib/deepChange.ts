/**
 * Recursively changes a value in an object by applying a change function to a specified key.
 *
 * @param object - The object to search for the specified key.
 * @param key - The key to search for in the object.
 * @param changeValue - The function to apply to the value associated with the specified key.
 * @return The modified object with the changed value.
 */
export async function deepChange(
  object: Record<string, any>,
  key: string,
  changeValue = async (v: any, sibling?: any) => await v,
) {
  if (Object.hasOwn(object, key))
    return { ...object, [key]: await changeValue(object[key], object) }

  const objectKeys = Object.keys(object)
  const res = Array(objectKeys.length)

  for (let i = 0; i < objectKeys.length; i++) {
    const nextObject = object[objectKeys[i]]
    if (nextObject && typeof nextObject === 'object') {
      res[i] = await deepChange(nextObject, key, changeValue)
    } else {
      res[i] = nextObject
    }
  }

  if (Array.isArray(object)) return res

  return Object.fromEntries(res.map((v, i) => [objectKeys[i], v]))
}

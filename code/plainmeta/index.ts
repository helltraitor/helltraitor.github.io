/**
 * Storage with optional string keys
 *
 * In case when key have a value in plainmeta, its unshielded value sets
 *
 * ## Example
 * ```ts
 * const source = `Text { key=value option }`
 * const meta = parse(source)
 *
 * console.log(meta.key)
 * // 'value'
 *
 * console.log(meta.option)
 * // true
 *
 * console.log(meta.other)
 * // undefined
 * ```
 */
export interface PlainMeta {
  [key: string]: string | boolean | undefined
}

/**
 * Regex match any text that enclosed with curl brackets at the end of string
 *
 * Use [`regex101.com`](https://regex101.com) for explanation
 *
 * ## Example
 * ```ts
 * const matched = `Text {match}`
 * const dontMatchedShieldedStart = `Text \{don't match}`
 * const fullMatched = `Text { full \} match }`
 * const dontMatchedShieldedEnd = `Text { don't match \}`
 * const matchedEnd = `Text {don't match} other {match}`
 * ```
 */
const TARGET = /\{(?<=((?<!\\)\{))(?<target>([^{}]|(?<=\\)}|(?<=\\){)*)(?=((?<!\\)\}))\}$/

/**
 * Regex that extracts all pairs key=value and options that stands alone
 *
 * Use [`regex101.com`](https://regex101.com) for explanation
 *
 * ## Example
 * ```text
 * key=value empty-key= option other-option
 * 'very long key'='very long value with single quote\''
 * 'option with = sign'
 * 'key with = sign'='value with = sign'
 * key-width-end-slash\=makes-no-option
 * "use-quotes=for-this"
 * ```
 */
const EXTRACT = /("(?<doubleKey>(([^"]|(?<=\\)["])*))"|'(?<singleKey>([^']|(?<=\\)['])*)'|(?<plainKey>[^'"\s]+))=("(?<doubleValue>(([^"]|(?<=\\)["])*))"|'(?<singleValue>([^']|(?<=\\)['])*)'|(?<plainValue>[^'"\s]*))|("(?<doubleOption>(([^"]|(?<=\\)["])*))"|'(?<singleOption>([^']|(?<=\\)['])*)'|(?<plainOption>[^'"\s]+))/gu

/**
 * Removes plainmeta if any and replaces shielded sequences
 *
 * `\{` -> `{`
 *
 * `\}` -> `}`
 *
 * ## Example
 * ```ts
 * const source = 'Some text {plainmeta}'
 * const cleaned = clean(source)
 *
 * console.log(cleaned)
 * // 'Some text'
 * ```
 */
export const clean = (source: string) =>
  source.replace(TARGET, '')
    .replace('\\{', '{')
    .replace('\\}', '}')

/**
 * Extracts target matched to TARGET constant
 */
const extractTarget = (source: string): string | undefined => {
  const rawTarget = source.match(TARGET)?.groups?.target
  const restoredTarget = rawTarget?.replace('\\}', '}')?.replace('\\{', '{')
  return restoredTarget
}

/**
 * Parses any string that may content plainmeta. Only latest plainmeta used
 *
 * ## Plainmeta
 * Plainmeta is any group of key\value or option values in curly brackets divided by space.
 *
 * Key, value and options are kinds of target which can be in quote or plain:
 * ```
 * ""
 * "text"
 * ''
 * 'text'
 * text
 * ```
 * One exception is plain value which can be empty
 * ```
 * empty-key= option
 * ```
 *
 * Plain meta must be the last part of string and enclosed with curly brackets
 * ```
 * Some text {plainmeta}\0
 * ```
 *
 * ## Example
 * ```ts
 * const source = `Text {skipped} {extracted}`
 * const meta = parse(source)
 *
 * console.log(meta.skipped)
 * // undefined
 *
 * console.log(meta.extracted)
 * // true
 * ```
 */
export const parse = (source: string): PlainMeta | undefined => {
  const meta: PlainMeta = {}

  const target = extractTarget(source)
  const extract = target?.matchAll(EXTRACT)
  for (const record of extract ?? []) {
    if (!record.groups) {
      console.error('Group is empty for one element of the meta extraction', extract)
      return undefined
    }

    const groups = record.groups as Record<string, string | undefined>

    const key = groups.doubleKey?.replace('\\"', '"') ?? groups.singleKey?.replace('\\\'', '\'') ?? groups.plainKey
    const value = groups.doubleValue?.replace('\\"', '"') ?? groups.singleValue?.replace('\\\'', '\'') ?? groups.plainValue
    const option = groups.doubleOption?.replace('\\"', '"') ?? groups.singleOption?.replace('\\\'', '\'') ?? groups.plainOption

    if (key !== undefined && value !== undefined)
      meta[key] = value

    if (option !== undefined)
      meta[option] = true
  }

  return meta
}

export interface PostModel {
  title: string
  created: string
  modified: string
  language: string
  description: string
}

export const POST_MODEL_FIELDS = ['title', 'created', 'modified', 'language', 'description']

export const intoPostModelReason = (data: Record<string, string>): PostModel | string[] => {
  const filteredFields = Object.entries(data).filter(([key, _]) => POST_MODEL_FIELDS.includes(key))
  const maybePost = Object.fromEntries(POST_MODEL_FIELDS.map(key => ([key, undefined])).concat(filteredFields))

  const unsetFields = Object.entries(maybePost).filter(([_, value]) => value === undefined).map(([key, _]) => key)
  if (unsetFields.length > 0)
    return unsetFields

  return maybePost as PostModel
}

export const intoPostModel = (data: Record<string, string>): PostModel | undefined => {
  const maybePost = intoPostModelReason(data)
  return Array.isArray(maybePost) ? undefined : maybePost
}

export const intoPostModelAsserted = (data: Record<string, string>): PostModel => {
  const maybePost = intoPostModelReason(data)
  if (Array.isArray(maybePost))
    throw new Error(`The provided data have unset fields: [${maybePost.join(', ')}]`)

  return maybePost
}

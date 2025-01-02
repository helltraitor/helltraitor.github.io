export interface ProjectModel {
  title: string
  created: string
  completed: string | undefined
  language: string
  description: string
  details: string | undefined
}

export const PROJECT_MODEL_FIELDS_OPTIONAL = ['completed', 'details']

export const PROJECT_MODEL_FIELDS = ['title', 'created', 'completed', 'language', 'description', 'details']

export const intoProjectModelReason = (data: Record<string, string>): ProjectModel | string[] => {
  const filteredFields = Object.entries(data).filter(([key, _]) => PROJECT_MODEL_FIELDS.includes(key))
  const maybeProject = Object.fromEntries(PROJECT_MODEL_FIELDS.map(key => ([key, undefined])).concat(filteredFields))

  const unsetFields = Object.entries(maybeProject).filter(([_, value]) => value === undefined).map(([key, _]) => key)
  if (
    unsetFields.length > 0
    && !unsetFields.map(field => PROJECT_MODEL_FIELDS_OPTIONAL.includes(field)).reduce((prev, curr) => prev && curr)
  )
    return unsetFields

  return maybeProject as ProjectModel
}

export const intoProjectModel = (data: Record<string, string>): ProjectModel | undefined => {
  const maybeProject = intoProjectModelReason(data)
  return Array.isArray(maybeProject) ? undefined : maybeProject
}

export const intoProjectModelAsserted = (data: Record<string, string>): ProjectModel => {
  const maybeProject = intoProjectModelReason(data)
  if (Array.isArray(maybeProject))
    throw new Error(`The provided data have unset fields [${maybeProject.join(', ')}] on record ${JSON.stringify(data)}`)

  return maybeProject
}

export const getProjectName = (route: string, model: ProjectModel): string | never => {
  const projectName = route.match(/^\/projects\/(?<project>[^\/]+)/)?.groups?.project
  if (!projectName) {
    throw createError({
      statusCode: 500,
      message: `All projects must be stored at '/projects/' directory, but ${model.title} at ${route} is not, which is probably a bug...`,
      fatal: true,
    })
  }

  return projectName
}

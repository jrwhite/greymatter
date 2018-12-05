export interface NormalizedObjects<T> {
  byId: { [id: string]: T }
  allIds: string[]
}

export const initialNormalizedObject = {
  byId: {},
  allIds: []
}

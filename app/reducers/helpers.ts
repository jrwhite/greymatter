// // for NormalizedObjects
// function changeNormObjsById<T extends { id: string }> (
//   state: { [id: string]: T },
//   id: string,
//   change: object
// ): { [id: string]: T } {
//   const item: T = state[id]
//   return {
//     ...state,
//     [id]: {
//       ...item,
//       ...change
//     }
//   }
// }

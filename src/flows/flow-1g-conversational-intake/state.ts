// Answers kept across this flow's screens (useFlowState). The entry screen resets them.
export const defaults = {
  petName: "",
  species: "Dog",
  breed: "Golden Retriever",
  age: "10 weeks",
  weight: "14 lb",
  place: "Fremont, Seattle",
}
export type PetState = typeof defaults

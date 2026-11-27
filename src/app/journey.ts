// The only file that joins flows together.
// `start` is where "/" lands. `links["<flow>:<exit>"]` sends a flow's named exit to another flow's entry
// ("<flow>" or "<flow>/<screen-path>"). Exits without a link fall back to the flow's own FlowDef.exits.
export interface Journey {
  start: string
  links: Record<string, string>
}

export const journey: Journey = {
  // login-sample and flow-1e-photo-first are not in this repo yet, so the journey starts at Flow 1g.
  // When login-sample is published: start "login-sample", links { "login-sample:signed-in": "flow-1e-photo-first" }.
  start: "flow-1g-conversational-intake",
  links: {},
}

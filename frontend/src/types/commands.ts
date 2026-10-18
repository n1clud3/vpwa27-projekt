export interface Parameter {
  name: string,
  mandatory: boolean,
}

export interface Command {
  name: string,
  availableOutOfChannel: boolean,
  params: Parameter[],
  description?: string,
}

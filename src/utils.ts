// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const pluralize = (prop: number, text: string) => `${prop} ${prop < 2 ? text : text + 's'}`

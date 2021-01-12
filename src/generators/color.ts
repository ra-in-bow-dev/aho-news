export const getDarkColor = (): string =>
  'hsl(' + Math.random() * 360 + ', 100%, 7%)'
export const getLightColor = (): string =>
  'hsl(' + Math.random() * 360 + ', 100%, 70%)'
export const getGradientStyle = (): string =>
  `background-image: linear-gradient(${getLightColor()},${getLightColor()}); color: ${getDarkColor()};`
export default (dark: boolean): string =>
  `hsl(${Math.random() * 360}, 100%, ${dark ? 7 : 70}%)`

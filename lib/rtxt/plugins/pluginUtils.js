export const matchRegexp = regexp => string => {
  const result = regexp.exec(string)
  regexp.lastIndex = 0
  return result
}

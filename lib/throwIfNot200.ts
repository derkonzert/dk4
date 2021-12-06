/**
 * Useful to make fetch throw if the http status code is not 200:
 * @example
 *  fetch(someUrl).then(throwIfNot200)
 * @param response Response
 * @returns Response
 */

export function throwIfNot200(response: Response) {
  if (response.status !== 200) {
    throw new Error(response.statusText);
  } else {
    return response;
  }
}

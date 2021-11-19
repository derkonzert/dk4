import { Spotify } from "./Spotify"

describe("Spotify plugin", () => {
  const spotifyUrlTypes = ["artist", "track", "album", "playlist"]

  spotifyUrlTypes.forEach(spotifyUrlType => {
    it(`detects open spotify ${spotifyUrlType} links`, () => {
      const result = Spotify.test({
        word: `https://open.spotify.com/${spotifyUrlType}/3y6SKYXXP4lrliD6CzVXH3`,
      })

      expect(result.value.type).toBe(spotifyUrlType)
      expect(result.value.id).toBe("3y6SKYXXP4lrliD6CzVXH3")
      expect(result.value.embedUrl).toBe(
        `https://embed.spotify.com/?uri=spotify:${spotifyUrlType}:3y6SKYXXP4lrliD6CzVXH3`
      )
    })
  })

  it("returns undefined if no match occured", () => {
    const result = Spotify.test({
      word: "Something else",
    })

    expect(result).toBeUndefined()
  })
})

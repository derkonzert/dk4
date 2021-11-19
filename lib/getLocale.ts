export function getLocale(locale) {
  switch (locale) {
    case "de":
      return require("../locales/de.json");
    default:
      return require("../locales/en.json");
  }
}

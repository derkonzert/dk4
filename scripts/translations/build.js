const path = require("path");
const glob = require("glob");
const { readFile, writeFile } = require("fs");

const locales = {
  de: require("../../locales/de.json"),
  en: require("../../locales/en.json"),
};

class FileChecker {
  constructor(path) {
    this.path = path;
  }

  readPath() {
    return new Promise((resolve, reject) => {
      readFile(this.path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          this.data = data.toString();

          resolve(this);
        }
      });
    });
  }

  findTranslationKeys() {
    const translations = this.data.matchAll(/[\W,\()]t\("(([^"])*)"\)/gm) || [];
    this.translations = [];

    for (let [, match2] of translations) {
      this.translations.push(match2);
    }
  }
}

const makePattern = (patterns) =>
  "{" + patterns.map((pattern) => path.join(pattern)).join(",") + "}";

const pattern = makePattern([
  "pages/**/*.{tsx,ts}",
  "lib/**/*.{tsx,ts}",
  "components/**/*.{tsx,ts}",
]);

function globaAsync(pattern, options) {
  return new Promise((resolve, reject) => {
    glob(pattern, options, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}

async function writeFileA(path, data, options) {
  return new Promise((resolve, reject) => {
    writeFile(path, data, options, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    });
  });
}

async function main() {
  const paths = await globaAsync(pattern, { cwd: process.cwd() });

  const checkers = paths.map((path) => new FileChecker(path));

  const translationKeys = await Promise.all(
    checkers.map((checker) => checker.readPath())
  ).then(() => {
    checkers.forEach((checker) => checker.findTranslationKeys());

    return checkers.flatMap((c) => c.translations);
  });

  const missingTranslations = [];
  const staleTranslations = [];

  translationKeys.sort();

  for (const [localeName, translations] of Object.entries(locales)) {
    const newTranslations = {};

    translationKeys.forEach((keyFromFile) => {
      newTranslations[keyFromFile] = translations[keyFromFile];

      if (typeof newTranslations[keyFromFile] !== "string") {
        newTranslations[keyFromFile] = keyFromFile;
      }

      if (newTranslations[keyFromFile] === keyFromFile) {
        missingTranslations.push([localeName, keyFromFile]);
      }
    });

    locales[localeName] = newTranslations;

    for (const oldTranslationKey of Object.keys(translations)) {
      if (!translationKeys.includes(oldTranslationKey)) {
        staleTranslations.push([localeName, oldTranslationKey]);
      }
    }
  }

  for (const [localeName, translations] of Object.entries(locales)) {
    await writeFileA(
      path.join(__dirname, "../../locales", `${localeName}.json`),
      JSON.stringify(translations, null, 2),
      {}
    );
  }

  if (missingTranslations.length) {
    console.log("Missing Translations");
    console.log(JSON.stringify(missingTranslations, null, 2));
  }
  if (staleTranslations.length) {
    console.log("Removed Stale Translations");
    console.log(JSON.stringify(staleTranslations, null, 2));
  }
}
//
main();

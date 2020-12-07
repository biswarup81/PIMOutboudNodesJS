// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const text = 'Founded in 1832 in Saint-Imier, Longines has established itself as an expert watchmaker steeped in tradition, elegance and performance over the centuries. Its deep value for timeless elegance underpins the brands\' signature aesthetic, which has been consistent across a large variety of coveted timepieces for decades. The iconic 120-year-old brand blends the past and the present with avant-garde technology in classic designs, making it one of the most sought-after luxury watch labels.';
const target = 'nl';

async function translateText() {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log('Translations:');
  translations.forEach((translation, i) => {
    console.log(`${text[i]} => (${target}) ${translation}`);
  });
}

translateText();
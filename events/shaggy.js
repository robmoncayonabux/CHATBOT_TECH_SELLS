
const shaggy = "shaggy";
const KeyShaggy = (sentence, keywords) => {

  const lowerCaseSentence = sentence.toLowerCase();

  for (const shaggy of keywords) {
    if (lowerCaseSentence.includes(keywords)) {
      return true
    };
  };

  return false
};

module.export = {  shaggy, KeyShaggy };
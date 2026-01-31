window.nutriCalc = window.nutriCalc || {};

nutriCalc.textFormatter = {
  getEnding(word) {
    if (word.length === 0) {
      return '';
    }
    const lowerWord = word.toLowerCase();
    let ending = lowerWord.slice(-1);
    const { WORD_ENDINGS } = nutriCalc.constants;
    if (WORD_ENDINGS.includes(ending)) {
      return ending;
    }
    if (lowerWord.length >= 3) {
      ending = lowerWord.slice(-3);
      if (WORD_ENDINGS.includes(ending)) {
        return ending;
      }
    }
    if (lowerWord.length >= 2) {
      ending = lowerWord.slice(-2);
      if (WORD_ENDINGS.includes(ending)) {
        return ending;
      }
    }

    return '';
  },
  isQuoted(value) {
    return /^"(\w+)"$/.test(value);
  },
  pluralize(word) {
    const isQuoted = this.isQuoted(word);
    const unQuotedWord = this.unquote(word);
    if (unQuotedWord.length <= 1) {
      return word;
    }
    if (nutriCalc.constants.UNITES.includes(unQuotedWord)) {
      return word;
    }
    if (/^\d+(?:\/\d+)?$/.test(unQuotedWord)) {
      return word;
    }
    const ending = nutriCalc.textFormatter.getEnding(unQuotedWord);
    if (ending === 's' || ending === 'x' || ending === 'z') {
      return word;
    }
    const withoutFirstChar = unQuotedWord.slice(1);
    const isUpperCase =
      withoutFirstChar === withoutFirstChar.toUpperCase() &&
      withoutFirstChar !== withoutFirstChar.toLowerCase();
    const singular = unQuotedWord;
    const lowerCasedSingular = unQuotedWord.toLowerCase();
    let plural = singular;
    if (ending === '') {
      plural += 's';
    }
    const {
      EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_AIL,
      EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_AL,
      EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_AU,
      EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_EU,
      EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_OU,
    } = nutriCalc.constants;
    if (ending === 'eu') {
      if (
        EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_EU.includes(lowerCasedSingular)
      ) {
        plural += 's';
      } else {
        plural += 'x';
      }
    }
    if (ending === 'ou') {
      if (
        EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_OU.includes(lowerCasedSingular)
      ) {
        plural += 'x';
      } else {
        plural += 's';
      }
    }
    if (ending === 'eau') {
      plural += 'x';
    }
    if (ending === 'au') {
      if (
        EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_AU.includes(lowerCasedSingular)
      ) {
        plural += 's';
      } else {
        plural += 'x';
      }
    }
    if (ending === 'al') {
      if (
        EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_AL.includes(lowerCasedSingular)
      ) {
        plural += 's';
      } else {
        plural = singular.slice(0, -1) + 'ux';
      }
    }
    if (ending === 'ail') {
      if (
        EXCEPTIONS_FOR_PLURAL_OF_WORDS_ENDING_IN_AIL.includes(
          lowerCasedSingular
        )
      ) {
        plural = singular.slice(0, -2) + 'ux';
      } else {
        plural += 's';
      }
    }
    if (isUpperCase) {
      plural = plural.toUpperCase();
    } else {
      plural = unQuotedWord.charAt(0) + plural.slice(1);
    }

    return isQuoted ? this.quote(plural) : plural;
  },
  quote(value) {
    return !this.isQuoted(value) ? `"${value}"` : value;
  },
  unquote(value) {
    return this.isQuoted(value) ? value.slice(1, -1) : value;
  },
};

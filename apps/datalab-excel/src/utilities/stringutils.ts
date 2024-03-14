export function toCamelCase(str: string): string {
  return str
    .replace(/\s(.)/g, function ($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function ($1) {
      return $1.toLowerCase();
    });
}

export function toTitleCase(str: string): string {
  // Insert space before all caps
  let result = str.replace(/([A-Z])/g, ' $1');
  // Uppercase the first character of each word
  result = result.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  return result;
}

export function toSentenceCase(str: string): string {
  // Insert space before all caps
  let result = str.replace(/($[\\?])/g, '');
  // Uppercase the first character of the sentence
  result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
  return result;
}

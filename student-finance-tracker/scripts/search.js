export function compileRegex(pattern) {
  try {
    return pattern ? new RegExp(pattern, "i") : null;
  } catch {
    return null;
  }
}

export function highlight(text, regex) {
  if (!regex) return text;
  return text.replace(regex, match => `<mark>${match}</mark>`);
}

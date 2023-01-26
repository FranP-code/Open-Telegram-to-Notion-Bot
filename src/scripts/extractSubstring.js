function extractSubstring(str, start, end) {
  const position = str.indexOf(start) + start.length;

  if (!end) {
    return str.substring(position, str.length);
  }
  return str.substring(position, str.indexOf(end, position));
}

module.exports = extractSubstring;

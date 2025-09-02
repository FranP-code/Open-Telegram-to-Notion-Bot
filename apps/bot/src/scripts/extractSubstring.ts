export default function extractSubstring(str: string, start: string, end: string|false) {
  const position = str.indexOf(start) + start.length;

  if (!end) {
    return str.substring(position, str.length);
  }
  return str.substring(position, str.indexOf(end, position));
}

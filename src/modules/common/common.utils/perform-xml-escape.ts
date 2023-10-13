import xmlEscape from 'xml-escape';

export const performXmlEscape = <Type extends Record<string, unknown>>(
  object: Type,
): Type => {
  const xmlEscapedObject = {};

  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      xmlEscapedObject[key] = performXmlEscape(
        value as Record<string, unknown>,
      );
    } else if (value) {
      xmlEscapedObject[key] = xmlEscape(String(value));
    }
  });

  return xmlEscapedObject as Type;
};

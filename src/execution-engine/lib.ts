//Functions to resolve Data Pill Text

export function resolveCustomPath(obj: any, rawPath: string): any {
  const [topKey, ...nestedPath] = rawPath.split('/');
  const topValue = obj[topKey];
  return nestedPath.reduce((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key];
    }
    return undefined;
  }, topValue);
}

export function interpretTemplate(template: string, context: any): string {
  return template.replace(/\$\?\{(.*?)\}/g, (_, rawPath) => {
    const value = resolveCustomPath(context, rawPath.trim());
    return value !== undefined ? value : '';
  });
}

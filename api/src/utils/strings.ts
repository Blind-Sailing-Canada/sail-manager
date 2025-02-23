export const capitalize = (([
  first,
  ...rest]:
  string) => first.toUpperCase() + rest.join(''));
export const titleize = (s: string) => s.split(' ').map(sb => capitalize(sb)).join(' ');
export const diffStringHtml = (value: any) => {
  if (typeof value == 'object' && typeof value.__old !== 'undefined') {
    return `<s style="color:red">${value.__old || ''}</s>&nbsp;<b style="color:green">${value.__new}</b>`;
  }
  if (typeof value == 'object' && typeof value.__new !== 'undefined') {
    return `<b style="color:green">${value.__new}</b>`;
  }

  return value;
}
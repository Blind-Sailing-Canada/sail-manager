export const capitalize = (([
  first,
  ...rest]:
string) => first.toUpperCase() + rest.join(''));
export const titlize = (s: string) => s.split(' ').map(sb => capitalize(sb)).join(' ');

export const compare = (a, b, order, data_type: 'string' | 'number' | 'date') => {
  switch (data_type) {
    case 'string':
      if (order === 'DESC') {
        return b.localeCompare(a);
      } else {
        return a.localeCompare(b);
      }
    case 'number':
      if (order === 'DESC') {
        return +b - (+a);
      } else {
        return +a - (+b);
      }
    case 'date':
      const aTime = new Date(a).getTime();
      const bTime = new Date(b).getTime();
      if (order === 'DESC') {
        return bTime - aTime;
      } else {
        return aTime - bTime;
      }
    default:
      return 0;
  }
};

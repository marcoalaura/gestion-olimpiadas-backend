export const removeAll = function (
  elements: Array<any>,
  list: Array<any>,
): Array<any> {
  for (let i = 0, l = elements.length; i < l; i++) {
    let ind: number;
    while ((ind = list.indexOf(elements[i])) > -1) {
      list.splice(ind, 1);
    }
  }
  return list;
};

export const isSubArray = function (a: Array<any>, b: Array<any>) {
  let result = true;
  b.forEach((n) => {
    if (!a.includes(n)) {
      result = false;
      return;
    }
  });
  return result;
};

export const removeItem = function (arr: Array<any>, item: any) {
  const i = arr.findIndex((x) => x.id === item.id);
  if (i !== -1) {
    arr.splice(i, 1);
  }
};

export const convertLinealObject = function (data: any): any {
  const ob = {};
  for (const i in data) {
    for (const j in data[i]) {
      ob[j] = data[i][j];
    }
  }
  return ob;
};

export const cleanObject = (data: any): any => {
  const obj = JSON.parse(JSON.stringify(data));
  for (const attr of Object.keys(obj)) {
    if (obj[attr] === 'undefined') delete obj[attr];
    if (obj[attr] === undefined) delete obj[attr];
    if (obj[attr] === null) delete obj[attr];
    if (obj[attr] === 'null') delete obj[attr];
  }
  return obj;
};

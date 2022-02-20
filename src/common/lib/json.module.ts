export const GetJsonData = function (query: string): any {
  const arrayOfKeyValues = query.split(',');
  const modifiedArray = [];
  for (let i = 0; i < arrayOfKeyValues.length; i++) {
    const arrayValues = arrayOfKeyValues[i].split(':');
    const arrayString =
      '"' + arrayValues[0] + '"' + ':' + '"' + arrayValues[1] + '"';
    modifiedArray.push(arrayString);
  }
  const jsonDataString = '{' + modifiedArray.toString() + '}';
  const jsonData = JSON.parse(jsonDataString);
  return jsonData;
};

export const ConvertJsonToFiltroQuery = function (obj: JSON): any {
  let filtro = '';
  for (const attr of Object.keys(obj)) {
    filtro = filtro + `${attr}:${obj[attr]},`;
  }
  if (filtro) filtro = filtro.slice(0, filtro.length - 1);
  return filtro;
};

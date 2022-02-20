export const generarPDF = async function (
  urlEjsPlantilla: string,
  objParametros: any,
  rutaSalidaPDF: string,
  config: any,
): Promise<any> {
  const resultado = new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ejs = require('ejs');
    ejs.renderFile(urlEjsPlantilla, objParametros, (error, result) => {
      if (result) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const wkhtmltopdf = require('wkhtmltopdf');
        const options = config
          ? config
          : {
              pageSize: 'Letter',
              orientation: 'portrait',
              marginLeft: '0.5cm',
              marginRight: '0.5cm',
              marginTop: '0.5cm',
              marginBottom: '0.5cm',
              output: rutaSalidaPDF,
            };
        wkhtmltopdf(result, options, (err, stream) => {
          if (err) reject(err);
          else resolve(stream);
        });
      } else {
        reject(error);
      }
    });
  });
  return resultado;
};

export const descargarPDF = async function (urlPDF: string): Promise<any> {
  const resultado = new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');
      const contents = fs.readFileSync(urlPDF, { encoding: 'base64' });
      resolve(contents);
    } catch (error) {
      reject(error);
    }
  });
  return resultado;
};

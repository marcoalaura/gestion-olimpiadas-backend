import { Persona } from 'src/application/persona/persona.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class persona1618432392680 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 'df882bc3-a839-4205-87e6-a8cf36c2927f',
        nombres: 'JUANCITO',
        primerApellido: 'PINTO',
        segundoApellido: 'ESCOBAR',
        nroDocumento: '7894545',
        fechaNacimiento: '2010-01-01',
        genero: 'M',
        correo: 'juancito.pinto@gmail.com',
        celular: '72565987'
      },
      {
        id: '774e7bbc-b82f-4510-9501-b316c43dde10',
        nombres: 'GENOVEVA',
        primerApellido: 'RIOS',
        segundoApellido: 'FUENTE',
        nroDocumento: '1458798',
        fechaNacimiento: '2009-10-02',
        genero: 'F',
        correo: 'genoveva.rios@gmail.com',
        celular: '70565987'
      },
      {
        id: '69db280a-757d-49c1-8ce4-5dc9ecbe0400',
        nombres: 'DADDY',
        primerApellido: 'LLANQUI',
        segundoApellido: 'LAYME',
        nroDocumento: '6894565',
        fechaNacimiento: '2012-02-05',
        genero: 'M',
        correo: 'daddy.llanqui@gmail.com',
        celular: '79065987'
      },
      {
        id: '376fc94d-0395-45ee-b341-6fd559473dc7',
        nombres: 'MARIA',
        primerApellido: 'MERCEDEZ',
        segundoApellido: 'BENZ',
        nroDocumento: '5986545',
        fechaNacimiento: '2014-09-11',
        genero: 'F',
        correo: 'maria.mercedes@gmail.com',
        celular: '78965321'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c80',
        nombres: 'MIGUEL',
        primerApellido: 'RIVERA',
        segundoApellido: 'COCO',
        nroDocumento: '8977552',
        fechaNacimiento: '2015-12-01',
        genero: 'M',
        correo: 'miguel.rivera@gmail.com',
        celular: '70163987'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c81',
        nombres: 'JESSENIA',
        primerApellido: 'ARREDONDO',
        segundoApellido: '',
        nroDocumento: '8000000',
        fechaNacimiento: '2015-10-26',
        genero: 'F',
        correo: 'estudiante_81@gmail.com',
        celular: '78547781'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c82',
        nombres: 'CRETY',
        primerApellido: 'ARZA',
        segundoApellido: 'RODRIGUEZ',
        nroDocumento: '8000002',
        fechaNacimiento: '2015-08-13',
        genero: 'F',
        correo: 'estudiante_82@gmail.com',
        celular: '78547782'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c83',
        nombres: 'VERONICA',
        primerApellido: 'ARZE',
        segundoApellido: 'VARGAS',
        nroDocumento: '8000003',
        fechaNacimiento: '2015-09-16',
        genero: 'F',
        correo: 'estudiante_83@gmail.com',
        celular: '78547783'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c84',
        nombres: 'CAMILO',
        primerApellido: 'AVIRA',
        segundoApellido: 'MARADEY',
        nroDocumento: '8000004',
        fechaNacimiento: '2015-08-12',
        genero: 'M',
        correo: 'estudiante_84@gmail.com',
        celular: '78547784'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c85',
        nombres: 'WILDER',
        primerApellido: 'BACARREZA',
        segundoApellido: 'ALBA',
        nroDocumento: '8000005',
        fechaNacimiento: '2015-07-21',
        genero: 'M',
        correo: 'estudiante_86@gmail.com',
        celular: '78547785'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c86',
        nombres: 'HAROLD',
        primerApellido: 'BARBA',
        segundoApellido: 'LIJERON',
        nroDocumento: '8000006',
        fechaNacimiento: '2015-06-19',
        genero: 'M',
        correo: 'estudiante_86@gmail.com',
        celular: '78547786'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c87',
        nombres: 'ROSMERY',
        primerApellido: 'BATTE',
        segundoApellido: 'OLIVER',
        nroDocumento: '8000007',
        fechaNacimiento: '2015-10-07',
        genero: 'M',
        correo: 'estudiante_87@gmail.com',
        celular: '78547787'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c88',
        nombres: 'LOURDES',
        primerApellido: 'ZAMBRANA',
        segundoApellido: 'FUENTES',
        nroDocumento: '8000008',
        fechaNacimiento: '2015-02-02',
        genero: 'F',
        correo: 'estudiante_88@gmail.com',
        celular: '78547788'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c89',
        nombres: 'CARLA',
        primerApellido: 'SAAVEDRA',
        segundoApellido: 'SOLIZ',
        nroDocumento: '8000009',
        fechaNacimiento: '2015-12-02',
        genero: 'F',
        correo: 'estudiante_89@gmail.com',
        celular: '78547789'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c90',
        nombres: 'MARIO',
        primerApellido: 'VELASQUEZ',
        segundoApellido: 'MAMANI',
        nroDocumento: '8000010',
        fechaNacimiento: '2010-11-02',
        genero: 'F',
        correo: 'estudiante_90@gmail.com',
        celular: '78547789'
      },
      {
        id: '09f2989e-48ae-49cd-8323-d5aea3248c91',
        nombres: 'MARIA',
        primerApellido: 'JIMENEZ',
        segundoApellido: 'CALLE',
        nroDocumento: '8000011',
        fechaNacimiento: '2002-11-02',
        genero: 'F',
        correo: 'estudiante_91@gmail.com',
        celular: '78547712',
      },
    ];
    const personas = items.map((item) => {
      const p = new Persona();
      p.id = item.id;
      p.nombres = item.nombres;
      p.primerApellido = item.primerApellido;
      p.segundoApellido = item.segundoApellido;
      p.tipoDocumento = 'CI';
      p.nroDocumento = item.nroDocumento;
      p.fechaNacimiento = item.fechaNacimiento;
      p.genero = item.genero;
      p.usuarioCreacion = '1';
      return p;
    });
    await queryRunner.manager.save(personas);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

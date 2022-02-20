import { Estudiante } from 'src/application/olimpiada/entity/Estudiante.entity';
import { Persona } from 'src/application/persona/persona.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class estudiante1618432392681 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7',
        rude: '86768762058118',
        id_persona: 'df882bc3-a839-4205-87e6-a8cf36c2927f',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '954c7fdb-f54d-47ef-97d0-10464b244652',
        rude: '86768762058138',
        id_persona: '774e7bbc-b82f-4510-9501-b316c43dde10',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '97974c41-9964-4b2a-989e-1061fdfb22fd',
        rude: '86768762058139',
        id_persona: '69db280a-757d-49c1-8ce4-5dc9ecbe0400',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'a7c43492-c651-4d11-8d55-4be34894fdf5',
        rude: '86768762058140',
        id_persona: '376fc94d-0395-45ee-b341-6fd559473dc7',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '2c11f32b-bdd5-4991-9da2-9663ab8902e5',
        rude: '86768762058141',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c80',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244681',
        rude: '8000000001',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c81',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244682',
        rude: '8000000002',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c82',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244683',
        rude: '8000000003',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c83',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244684',
        rude: '8000000004',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c84',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244685',
        rude: '8000000005',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c85',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244686',
        rude: '8000000006',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c86',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244687',
        rude: '8000000007',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c87',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244688',
        rude: '8000000008',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c88',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244689',
        rude: '8000000009',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c89',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244690',
        rude: '8000000000',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c90',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '154c7fdb-f54d-47ef-97d0-10464b244691',
        rude: '8000000011',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c91',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '76cd48f5-d15b-4bd4-b800-e1d59d5cd1fa',
        rude: '9000000001',
        id_persona: 'c01b95a4-3706-5165-a617-136c4bc5c55a',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '4a25f6af-f689-43a5-895f-20e0def9860c',
        rude: '9000000002',
        id_persona: '6c8a7067-2088-5f20-aebd-f7e843302ce6',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'ff8dcb7b-967b-404a-abd8-d198ce4db822',
        rude: '9000000003',
        id_persona: 'bc028c45-46be-57eb-aefc-131860830cf2',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '65328dec-14d3-4ce1-8d10-3cd171217152',
        rude: '9000000004',
        id_persona: 'ac34c55a-0405-5b52-a9ba-23f17a5b2002',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '069e9e4c-03b4-4fec-954a-b939038975a5',
        rude: '9000000005',
        id_persona: 'b59506ca-08f3-5e31-8d9a-a16cbd690eba',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'a9a0a5fb-d531-43fb-bfb4-4fb46e834d1b',
        rude: '9000000006',
        id_persona: 'ab6512e6-bc41-5d2d-9933-c177720df5ff',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '9ff582a8-867e-4776-a3d7-6fca6d126c46',
        rude: '9000000007',
        id_persona: '37a21ba6-db52-5191-bb3d-34b8ee34a3e0',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'b198e9dd-8665-4446-afb9-2528423058c3',
        rude: '9000000008',
        id_persona: '09a4e38e-a504-59a5-8a7f-e41fcccdf564',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '7c870743-437b-4a75-b9d6-cc4c271ae08b',
        rude: '9000000009',
        id_persona: 'b20b4c94-c470-5854-9783-cdaa36f06d38',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'a0050ec2-bb7a-4947-b8bb-152f9d25d26b',
        rude: '9000000010',
        id_persona: '5bfda704-9852-5c51-aa6e-6c43805f3059',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'ad83eb92-49e8-437e-85db-59de497cb3e9',
        rude: '9000000011',
        id_persona: '7b2ee425-867a-50e2-9191-2f1aedaf2ced',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'f537eda1-34e4-48e4-b3c9-93b195dd1c8b',
        rude: '9000000012',
        id_persona: '058b0e33-cdd4-5703-94dc-f995059ea2b7',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '391d3dff-7b59-4789-9ce0-af6a74b1ade0',
        rude: '9000000013',
        id_persona: 'df882bc3-a839-4205-87e6-a8cf36c2927f',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '6ea54828-3c11-4849-80d3-8fa83652fe48',
        rude: '9000000014',
        id_persona: '774e7bbc-b82f-4510-9501-b316c43dde10',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'c9322ed2-eebd-4a7d-8b88-40b6a1406a7a',
        rude: '9000000015',
        id_persona: '69db280a-757d-49c1-8ce4-5dc9ecbe0400',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'af65a42a-0a2b-4315-8093-d02901801af4',
        rude: '9000000016',
        id_persona: '376fc94d-0395-45ee-b341-6fd559473dc7',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'b44379c9-a29f-4dd8-b546-f6b230c1095d',
        rude: '9000000017',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c80',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'af7b7ee8-172f-4459-bde8-06d333cf0b59',
        rude: '9000000018',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c81',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '8b2be6a4-076b-429a-9a46-56a5bd2d2cbf',
        rude: '9000000019',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c82',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'c4e82ba3-8009-452a-86ad-83c405bade97',
        rude: '9000000020',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c83',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '7bb8e67d-76a6-4f89-ab78-5425f37eb1a1',
        rude: '9000000021',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c84',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '2bb81717-0e4b-42b3-9fac-5495a1bcd249',
        rude: '9000000022',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c85',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'e231a4c9-987b-43d8-b4e6-12f0d9518d3b',
        rude: '9000000023',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c86',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '5882e4e8-c3f0-46ee-86ee-58f272dd2a26',
        rude: '9000000024',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c87',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '2097c94b-08cd-4b4b-8df8-a989641d7cc9',
        rude: '9000000025',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c88',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '1e554cc2-3f7c-47e5-91c6-3e32c1220736',
        rude: '9000000026',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c89',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '1933575b-1a7f-45ab-988f-b47731b1fe9a',
        rude: '9000000027',
        id_persona: '09f2989e-48ae-49cd-8323-d5aea3248c90',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: 'e0f632ce-5b51-49ad-8b1d-8177447e1891',
        rude: '9000000028',
        id_persona: '5bfda704-9852-5c51-aa6e-6c43805f3059',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '2ecf6434-45ea-477a-badf-7be07611b959',
        rude: '9000000029',
        id_persona: '7b2ee425-867a-50e2-9191-2f1aedaf2ced',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
      {
        id: '281e7eca-9f81-477d-81e1-6cb06bd430d7',
        rude: '9000000030',
        id_persona: '058b0e33-cdd4-5703-94dc-f995059ea2b7',
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
      },
    ];
    const estudiantes = items.map((item) => {
      const p = new Persona();
      p.id = item.id_persona;
      const e = new Estudiante();
      e.id = item.id;
      e.rude = item.rude;
      e.fechaCreacion = item.fechaCreacion;
      e.usuarioCreacion = item.usuarioCreacion;
      e.persona = p;
      return e;
    });
    await queryRunner.manager.save(estudiantes);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

import { MigrationInterface, QueryRunner } from 'typeorm';
import { Inscripcion } from '../../src/application/olimpiada/entity/Inscripcion.entity';
import { Estudiante } from '../../src/application/olimpiada/entity/Estudiante.entity';
import { UnidadEducativa } from '../../src/application/olimpiada/entity/UnidadEducativa.entity';
import { EtapaAreaGrado } from 'src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { Status } from '../../src/common/constants';
import { MedalleroPosicion } from 'src/application/olimpiada/entity/MedalleroPosicion.entity';

export class inscripcion1618588592183 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        estado: Status.ACTIVE,
        id_estudiante: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '42beaff4-5400-455b-bb90-22f0bf33c660',
        estado: Status.ACTIVE,
        id_estudiante: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7',
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '33d0cd14-5001-4071-a185-f5c2babb24d1',
        estado: Status.ACTIVE,
        id_estudiante: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7',
        id_etapa_area_grado: '2bc7bbdd-c62d-51d1-88c2-9a91bbd5b231',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: 'ad803419-a69c-40e3-99df-178b444ffac3',
        estado: Status.ACTIVE,
        id_estudiante: '954c7fdb-f54d-47ef-97d0-10464b244652',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },
      {
        id: '954c7fdb-f54d-47ef-97d0-10464b244652',
        estado: Status.ACTIVE,
        id_estudiante: '954c7fdb-f54d-47ef-97d0-10464b244652',
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },
      {
        id: '264c4191-c62b-400f-a520-f3cfeb66f980',
        estado: Status.ACTIVE,
        id_estudiante: '954c7fdb-f54d-47ef-97d0-10464b244652',
        id_etapa_area_grado: '2bc7bbdd-c62d-51d1-88c2-9a91bbd5b231',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },

      {
        id: '20ab9ebc-b0de-4994-9f0b-6621b2b9335e',
        estado: Status.ACTIVE,
        id_estudiante: '97974c41-9964-4b2a-989e-1061fdfb22fd',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },
      {
        id: 'fac230ae-6782-47e8-a259-ce6cbedc4c2a',
        estado: Status.ACTIVE,
        id_estudiante: '97974c41-9964-4b2a-989e-1061fdfb22fd',
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },
      {
        id: '97974c41-9964-4b2a-989e-1061fdfb22fd',
        estado: Status.ACTIVE,
        id_estudiante: '97974c41-9964-4b2a-989e-1061fdfb22fd',
        id_etapa_area_grado: '2bc7bbdd-c62d-51d1-88c2-9a91bbd5b231',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },

      {
        id: '9c808178-d8e6-11eb-b8bc-0242ac130003',
        estado: Status.ACTIVE,
        id_estudiante: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        clasificado: true,
      },
      {
        id: 'a3ae886e-d8e6-11eb-b8bc-0242ac130003',
        estado: Status.ACTIVE,
        id_estudiante: '954c7fdb-f54d-47ef-97d0-10464b244652',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_medallero_posicion_automatica:
          '6a5862f8-d8e9-11eb-b8bc-0242ac130003',
        id_medallero_posicion_manual: '725e904e-d8e9-11eb-b8bc-0242ac130003',
        clasificado: true,
      },
      {
        id: 'abefdea6-d8e6-11eb-b8bc-0242ac130003',
        estado: Status.ACTIVE,
        id_estudiante: '97974c41-9964-4b2a-989e-1061fdfb22fd',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_medallero_posicion_automatica:
          '725e904e-d8e9-11eb-b8bc-0242ac130003',
        id_medallero_posicion_manual: '6a5862f8-d8e9-11eb-b8bc-0242ac130003',
        clasificado: true,
      },
      {
        id: 'a7c43492-c651-4d11-8d55-4be34894fdf5',
        estado: Status.ACTIVE,
        id_estudiante: 'a7c43492-c651-4d11-8d55-4be34894fdf5',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
        id_medallero_posicion_automatica:
          '6a5862f8-d8e9-11eb-b8bc-0242ac130003',
        clasificado: true,
      },
      {
        id: '57a312ea-d8f1-11eb-b8bc-0242ac130003',
        estado: Status.ACTIVE,
        id_estudiante: '2c11f32b-bdd5-4991-9da2-9663ab8902e5',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
        id_medallero_posicion_automatica:
          '725e904e-d8e9-11eb-b8bc-0242ac130003',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244681',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244681',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244682',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244682',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244683',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244683',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244684',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244684',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244685',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244685',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: '32b79fa5-aaba-5f11-99ad-1545e60a3eda',
        clasificado: true,
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244686',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244686',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: '32b79fa5-aaba-5f11-99ad-1545e60a3eda',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244687',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244687',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: '32b79fa5-aaba-5f11-99ad-1545e60a3eda',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244688',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244688',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: '81fa846c-8fd7-4f28-8bf2-f280928cd487',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244689',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244689',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: '81fa846c-8fd7-4f28-8bf2-f280928cd487',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244690',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244690',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        id_unidad_educativa: '81fa846c-8fd7-4f28-8bf2-f280928cd487',
      },
      {
        id: '754c7fdb-f54d-47ef-97d0-10464b244691',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244690',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b7',
        id_unidad_educativa: '81fa846c-8fd7-4f28-8bf2-f280928cd487',
      },
      {
        id: '0d9eef9b-a7e2-40b2-9bfc-98679d609f72',
        estado: Status.ACTIVE,
        id_estudiante: '954c7fdb-f54d-47ef-97d0-10464b244652',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b7',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },
      {
        id: '6c054458-de2b-4cea-a34c-35cdde8d4cc8',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244691',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b8',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },
      {
        id: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244689',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '234fd6cb-5b19-421c-af3a-d2e8413e7b12',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244690',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '345fd6cb-5b19-421c-af3a-d2e8413e7b12',
        estado: Status.ACTIVE,
        id_estudiante: '154c7fdb-f54d-47ef-97d0-10464b244688',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '456fd6cb-5b19-421c-af3a-d2e8413e7b12',
        estado: Status.ACTIVE,
        id_estudiante: '954c7fdb-f54d-47ef-97d0-10464b244652',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        id_unidad_educativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '567fd6cb-5b19-421c-af3a-d2e8413e7b12',
        estado: Status.ACTIVE,
        id_estudiante: '2c11f32b-bdd5-4991-9da2-9663ab8902e5',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
        clasificado: true,
      },
      {
        id: '678fd6cb-5b19-421c-af3a-d2e8413e7b12',
        estado: Status.ACTIVE,
        id_estudiante: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        id_unidad_educativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },

      {
        id: '01bf6a88-e74b-4a22-8214-fba32f4a00ca',
        estado: Status.ACTIVE,
        id_estudiante: '76cd48f5-d15b-4bd4-b800-e1d59d5cd1fa',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: '514f8edd-f1f5-4faa-b57c-b8b805eb6af0',
        id_medallero_posicion_automatica:
          '93646460-b888-4817-b001-5103af3b36f1',
        clasificado: true,
      },
      {
        id: 'c8fb5981-d957-4422-8ff4-48caac8bb123',
        estado: Status.ACTIVE,
        id_estudiante: '4a25f6af-f689-43a5-895f-20e0def9860c',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: '39f44e02-1b7c-4e72-b183-877ce351afe2',
      },
      {
        id: '10dc7f68-d4e7-4df7-bb90-458b06bb4e66',
        estado: Status.ACTIVE,
        id_estudiante: 'ff8dcb7b-967b-404a-abd8-d198ce4db822',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: '876fdf56-1eb7-4d46-9cb8-54f4fbde5e0c',
      },
      {
        id: '345fbfc3-55a0-4b85-bd74-02b990b528aa',
        estado: Status.ACTIVE,
        id_estudiante: '65328dec-14d3-4ce1-8d10-3cd171217152',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: '876fdf56-1eb7-4d46-9cb8-54f4fbde5e0c',
        id_medallero_posicion_automatica:
          '93646460-b888-4817-b001-5103af3b36f1',
        clasificado: true,
      },
      {
        id: 'fa1d2f7a-8761-489d-b6c5-1ac865e00901',
        estado: Status.ACTIVE,
        id_estudiante: '069e9e4c-03b4-4fec-954a-b939038975a5',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: '3a753d6f-8206-4a1b-ac40-03f7d6e31e26',
        clasificado: true,
      },
      {
        id: 'dd70f1e8-c74b-426c-8e19-725b7d456c86',
        estado: Status.ACTIVE,
        id_estudiante: 'a9a0a5fb-d531-43fb-bfb4-4fb46e834d1b',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: '3a753d6f-8206-4a1b-ac40-03f7d6e31e26',
      },
      {
        id: '94df2be1-dc3a-473f-a158-486f2c23c7aa',
        estado: Status.ACTIVE,
        id_estudiante: '9ff582a8-867e-4776-a3d7-6fca6d126c46',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: 'e0988dcd-7f9e-402d-b4f3-8fa640fa31fa',
        clasificado: true,
      },
      {
        id: '3ff8c47e-1146-4753-8ae8-fc8fcf63bfb8',
        estado: Status.ACTIVE,
        id_estudiante: 'b198e9dd-8665-4446-afb9-2528423058c3',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: '23f0edab-8d89-4d72-8631-99a042df22cc',
      },
      {
        id: '6b3cc8c4-8ae9-4139-8a18-394323c2d02b',
        estado: Status.ACTIVE,
        id_estudiante: '7c870743-437b-4a75-b9d6-cc4c271ae08b',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: 'b6f2f9ed-c055-4988-8e47-c431441c509b',
        id_medallero_posicion_automatica:
          '028b7057-f5e2-4ee3-9429-a5e9041897db',
        clasificado: true,
      },
      {
        id: '88097d2d-e57b-4c10-82a2-dc5e94d3eed5',
        estado: Status.ACTIVE,
        id_estudiante: 'a0050ec2-bb7a-4947-b8bb-152f9d25d26b',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        id_unidad_educativa: 'cfa68b01-20ab-4950-a785-ac3fc5529cce',
        id_medallero_posicion_automatica:
          '028b7057-f5e2-4ee3-9429-a5e9041897db',
        clasificado: true,
      },

      {
        id: '00d3d449-c396-4057-8126-7edd50748f65',
        estado: Status.ACTIVE,
        id_estudiante: 'ad83eb92-49e8-437e-85db-59de497cb3e9',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: '26162cbf-bc53-4e2b-b338-d486fe91b92c',
      },
      {
        id: '54633afe-9394-42e9-8638-e7fffa21b67c',
        estado: Status.ACTIVE,
        id_estudiante: 'f537eda1-34e4-48e4-b3c9-93b195dd1c8b',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: '514f8edd-f1f5-4faa-b57c-b8b805eb6af0',
        id_medallero_posicion_automatica:
          '05eca3fa-28f3-494b-bd13-5caae3df60f8',
        clasificado: true,
      },
      {
        id: '9501d4e5-9fd5-4c95-b820-6348833c2ebe',
        estado: Status.ACTIVE,
        id_estudiante: '391d3dff-7b59-4789-9ce0-af6a74b1ade0',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: '39f44e02-1b7c-4e72-b183-877ce351afe2',
        id_medallero_posicion_automatica:
          '05eca3fa-28f3-494b-bd13-5caae3df60f8',
        clasificado: true,
      },
      {
        id: 'cdfa9cfd-a62e-44cf-861c-30f3bdecad2f',
        estado: Status.ACTIVE,
        id_estudiante: '6ea54828-3c11-4849-80d3-8fa83652fe48',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: '876fdf56-1eb7-4d46-9cb8-54f4fbde5e0c',
      },
      {
        id: 'facf1303-07a4-4b7c-8e44-e60a46e9ab81',
        estado: Status.ACTIVE,
        id_estudiante: 'c9322ed2-eebd-4a7d-8b88-40b6a1406a7a',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: '3a753d6f-8206-4a1b-ac40-03f7d6e31e26',
      },
      {
        id: 'ca0c41bf-eddd-4ed5-89cd-bcbd1bb101c6',
        estado: Status.ACTIVE,
        id_estudiante: 'af65a42a-0a2b-4315-8093-d02901801af4',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: 'e0988dcd-7f9e-402d-b4f3-8fa640fa31fa',
      },
      {
        id: '3283caac-5c77-4319-9e24-2bf1e47e998f',
        estado: Status.ACTIVE,
        id_estudiante: 'b44379c9-a29f-4dd8-b546-f6b230c1095d',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: '23f0edab-8d89-4d72-8631-99a042df22cc',
        id_medallero_posicion_automatica:
          '4ba91924-1ec9-4a54-8e3d-0464a2137b8b',
        clasificado: true,
      },
      {
        id: 'c621e6e9-ba1c-4045-8a0a-4394bdc48933',
        estado: Status.ACTIVE,
        id_estudiante: 'af7b7ee8-172f-4459-bde8-06d333cf0b59',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: 'b6f2f9ed-c055-4988-8e47-c431441c509b',
        id_medallero_posicion_automatica:
          '4ba91924-1ec9-4a54-8e3d-0464a2137b8b',
        clasificado: true,
      },
      {
        id: '19919f19-3e4e-4f2c-9e06-c148148cf89d',
        estado: Status.ACTIVE,
        id_estudiante: '8b2be6a4-076b-429a-9a46-56a5bd2d2cbf',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: 'cfa68b01-20ab-4950-a785-ac3fc5529cce',
      },
      {
        id: '2d4e4ad3-aa1e-4ff9-8431-ac964990d319',
        estado: Status.ACTIVE,
        id_estudiante: 'c4e82ba3-8009-452a-86ad-83c405bade97',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        id_unidad_educativa: '26162cbf-bc53-4e2b-b338-d486fe91b92c',
      },

      {
        id: '25cf7697-4c79-4192-9918-373ca53ef90e',
        estado: Status.ACTIVE,
        id_estudiante: 'ad83eb92-49e8-437e-85db-59de497cb3e9',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: '514f8edd-f1f5-4faa-b57c-b8b805eb6af0',
      },
      {
        id: '84ee0ac4-710c-4959-b56c-df0fe9354cb6',
        estado: Status.ACTIVE,
        id_estudiante: 'f537eda1-34e4-48e4-b3c9-93b195dd1c8b',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: '39f44e02-1b7c-4e72-b183-877ce351afe2',
      },
      {
        id: 'ab184385-5a99-47ed-8038-b95b1b5ab2bb',
        estado: Status.ACTIVE,
        id_estudiante: '391d3dff-7b59-4789-9ce0-af6a74b1ade0',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: '876fdf56-1eb7-4d46-9cb8-54f4fbde5e0c',
      },
      {
        id: '89c7e7ad-6c97-43f2-8f77-3746b6ac40bb',
        estado: Status.ACTIVE,
        id_estudiante: '6ea54828-3c11-4849-80d3-8fa83652fe48',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: '3a753d6f-8206-4a1b-ac40-03f7d6e31e26',
        id_medallero_posicion_automatica:
          '17eb57eb-8638-4330-95a7-9ff0ce147e9a',
        clasificado: true,
      },
      {
        id: '2a566b26-8453-4df2-8bef-1605230580fe',
        estado: Status.ACTIVE,
        id_estudiante: 'c9322ed2-eebd-4a7d-8b88-40b6a1406a7a',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: 'e0988dcd-7f9e-402d-b4f3-8fa640fa31fa',
        id_medallero_posicion_automatica:
          '17eb57eb-8638-4330-95a7-9ff0ce147e9a',
        clasificado: true,
      },
      {
        id: '247add20-72fe-4017-8429-6eec3462ef2e',
        estado: Status.ACTIVE,
        id_estudiante: 'af65a42a-0a2b-4315-8093-d02901801af4',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: '23f0edab-8d89-4d72-8631-99a042df22cc',
        id_medallero_posicion_automatica:
          '8b616c41-2969-4c4c-9a79-7033babd1380',
        clasificado: true,
      },
      {
        id: '75f8fb2b-1128-420f-8bbb-c852e6531e7f',
        estado: Status.ACTIVE,
        id_estudiante: 'b44379c9-a29f-4dd8-b546-f6b230c1095d',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: 'b6f2f9ed-c055-4988-8e47-c431441c509b',
        id_medallero_posicion_automatica:
          '8b616c41-2969-4c4c-9a79-7033babd1380',
        clasificado: true,
      },
      {
        id: 'f52a0cf3-df1e-4c1f-a32e-1cc51c4f7d3b',
        estado: Status.ACTIVE,
        id_estudiante: 'af7b7ee8-172f-4459-bde8-06d333cf0b59',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: 'cfa68b01-20ab-4950-a785-ac3fc5529cce',
        id_medallero_posicion_automatica:
          '05eca3fa-28f3-494b-bd13-5caae3df60f8',
        clasificado: true,
      },
      {
        id: '14314f36-11db-41bf-9f22-3c0ff32be486',
        estado: Status.ACTIVE,
        id_estudiante: '8b2be6a4-076b-429a-9a46-56a5bd2d2cbf',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: '26162cbf-bc53-4e2b-b338-d486fe91b92c',
        id_medallero_posicion_automatica:
          '05eca3fa-28f3-494b-bd13-5caae3df60f8',
        clasificado: true,
      },
      {
        id: 'fd7049bb-77d6-46a6-bc1f-bb405c585d44',
        estado: Status.ACTIVE,
        id_estudiante: 'c4e82ba3-8009-452a-86ad-83c405bade97',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        id_unidad_educativa: '39f44e02-1b7c-4e72-b183-877ce351afe2',
      },
      
      {
        id: '78319eee-75ee-48c0-a167-47654569b6ed',
        estado: Status.ACTIVE,
        id_estudiante: '7bb8e67d-76a6-4f89-ab78-5425f37eb1a1',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: '514f8edd-f1f5-4faa-b57c-b8b805eb6af0',
      },
      {
        id: '0e8e1c86-d433-490a-b59b-8b8d77bedac6',
        estado: Status.ACTIVE,
        id_estudiante: '2bb81717-0e4b-42b3-9fac-5495a1bcd249',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: '39f44e02-1b7c-4e72-b183-877ce351afe2',
        clasificado: true,
      },
      {
        id: 'e0ffa379-a9bb-4801-b874-c77c3bd98493',
        estado: Status.ACTIVE,
        id_estudiante: 'e231a4c9-987b-43d8-b4e6-12f0d9518d3b',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: '876fdf56-1eb7-4d46-9cb8-54f4fbde5e0c',
      },
      {
        id: '5fde6241-6a54-43f3-a28f-4145c28222e3',
        estado: Status.ACTIVE,
        id_estudiante: '5882e4e8-c3f0-46ee-86ee-58f272dd2a26',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: '3a753d6f-8206-4a1b-ac40-03f7d6e31e26',
      },
      {
        id: '66003dbe-9450-400d-8fb8-6c98f7bd53af',
        estado: Status.ACTIVE,
        id_estudiante: '2097c94b-08cd-4b4b-8df8-a989641d7cc9',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: 'e0988dcd-7f9e-402d-b4f3-8fa640fa31fa',
        clasificado: true,
      },
      {
        id: 'aeee1ebf-2923-40d5-94d1-a34cb5695f6c',
        estado: Status.ACTIVE,
        id_estudiante: '1e554cc2-3f7c-47e5-91c6-3e32c1220736',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: '23f0edab-8d89-4d72-8631-99a042df22cc',
      },
      {
        id: '79eb4a77-3192-47d4-b60c-e17fde6c6198',
        estado: Status.ACTIVE,
        id_estudiante: '1933575b-1a7f-45ab-988f-b47731b1fe9a',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: 'b6f2f9ed-c055-4988-8e47-c431441c509b',
      },
      {
        id: '1008a4c0-ee8b-42b0-8ec6-014ae65c768f',
        estado: Status.ACTIVE,
        id_estudiante: 'e0f632ce-5b51-49ad-8b1d-8177447e1891',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: 'cfa68b01-20ab-4950-a785-ac3fc5529cce',
        clasificado: true,
      },
      {
        id: '663fdd57-6a3e-42c9-8fc2-7d314756e73f',
        estado: Status.ACTIVE,
        id_estudiante: '2ecf6434-45ea-477a-badf-7be07611b959',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: '26162cbf-bc53-4e2b-b338-d486fe91b92c',
      },
      {
        id: '8d886c2d-3801-4b26-892d-2ff40184ac0c',
        estado: Status.ACTIVE,
        id_estudiante: '281e7eca-9f81-477d-81e1-6cb06bd430d7',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        id_unidad_educativa: '514f8edd-f1f5-4faa-b57c-b8b805eb6af0',
      },
    ];
    const data = items.map((item, index) => {
      const i = new Inscripcion();
      i.id = item.id;
      i.idImportacion = `${index + 100}`;
      i.estado = item.estado;
      const estudiante = new Estudiante();
      estudiante.id = item.id_estudiante;
      const ue = new UnidadEducativa();
      ue.id = item.id_unidad_educativa;
      const etapaAreaGrado = new EtapaAreaGrado();
      etapaAreaGrado.id = item.id_etapa_area_grado;
      i.etapaAreaGrado = etapaAreaGrado;
      i.unidadEducativa = ue;
      i.estudiante = estudiante;
      i.fechaCreacion = new Date();
      i.usuarioCreacion = '1';
      i.clasificado = item.clasificado;
      const medalleroPosicionAutomatica = new MedalleroPosicion();
      medalleroPosicionAutomatica.id = item.id_medallero_posicion_automatica;
      i.idMedalleroPosicionAutomatica = medalleroPosicionAutomatica;
      const medalleroPosicionManual = new MedalleroPosicion();
      medalleroPosicionManual.id = item.id_medallero_posicion_manual;
      i.idMedalleroPosicionManual = medalleroPosicionManual;
      return i;
    });
    await queryRunner.manager.save(data);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

import { MigrationInterface, QueryRunner } from 'typeorm';
import { Distrito } from '../../src/application/olimpiada/entity/Distrito.entity';
import { Departamento } from '../../src/application/olimpiada/entity/Departamento.entity';

export class distrito1511516017923 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: '2310b8e7-aab4-4320-a3f9-4361dc95750a',
        nombre: 'LA PAZ 2',
        codigo: 1001,
        id_departamento: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
      },
      {
        id: '4049f17f-9760-42c7-bee9-7afb3f0865ae',
        nombre: 'LAJA',
        codigo: 1002,
        id_departamento: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
      },
      {
        id: 'd4f35a56-a812-44dd-8ca7-f6b6899fda14',
        nombre: 'WARNES',
        codigo: 1003,
        id_departamento: 'd5183d83-58ba-4ebe-9bdb-0e073c48a58d',
      },
      {
        id: 'a568abb5-8dfe-4229-b7dc-29699cb1b220',
        nombre: 'MONTERO',
        codigo: 1004,
        id_departamento: 'd5183d83-58ba-4ebe-9bdb-0e073c48a58d',
      },
      {
        id: 'fa66a92f-299d-441b-a671-d927d6d2a44b',
        nombre: 'DISTRITO COCHABAMBA',
        codigo: 3001,
        id_departamento: '7a69567c-8d6a-4383-8930-628b83c8f214',
      },
      {
        id: '533d98c4-32a5-4f2d-ba02-c7ccfe2ef56b',
        nombre: 'DISTRITO BENI',
        codigo: 8001,
        id_departamento: '638e04bc-1bec-4898-9617-cbfff7adaff1',
      },
      {
        id: 'b24c8ce1-fdd0-46dd-955a-e7a998a2d86a',
        nombre: 'DISTRITO TARIJA',
        codigo: 6001,
        id_departamento: 'ad46939d-d038-4812-9fc8-fea2dcfcbc59',
      },
      {
        id: '57544c03-ecee-4597-8b8f-e1aa93c4787d',
        nombre: 'DISTRITO POTOSÍ',
        codigo: 5001,
        id_departamento: 'ccad3b6d-db1a-4e15-9759-2005b193a3a6',
      },
      {
        id: '1716b255-196e-4eb5-b828-b4987d757332',
        nombre: 'DISTRITO ORURO',
        codigo: 4001,
        id_departamento: '753074a4-b4ea-41dd-8ed1-5807b10dec07',
      },
      {
        id: '87e8b6d2-eb32-43ed-9f24-c6df798fb037',
        nombre: 'DISTRITO CHUQUISACA',
        codigo: 2001,
        id_departamento: '9346d5bc-d1a5-4604-b874-eb1f6795236d',
      },
      {
        id: 'f8fb9c58-83fe-46e5-a998-26ec4bc397c3',
        nombre: 'DISTRITO PANDO',
        codigo: 9001,
        id_departamento: 'd2cee6f6-a8a3-4fe5-8db3-0572b31fc2ab',
      },
    ];
    const data = items.map((item) => {
      const d = new Departamento();
      d.id = item.id_departamento;
      const dis = new Distrito();
      dis.id = item.id;
      dis.nombre = item.nombre;
      dis.codigo = item.codigo;
      dis.departamento = d;
      dis.fechaCreacion = new Date();
      dis.usuarioCreacion = '1';
      return dis;
    });
    await queryRunner.manager.save(data);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

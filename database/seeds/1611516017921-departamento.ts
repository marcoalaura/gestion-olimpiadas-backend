import { MigrationInterface, QueryRunner } from 'typeorm';
import { Departamento } from '../../src/application/olimpiada/entity/Departamento.entity';

export class departamento1611516017921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: '9346d5bc-d1a5-4604-b874-eb1f6795236d',
        nombre: 'Chuquisaca',
        codigo: '1',
      },
      {
        id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
        nombre: 'La Paz',
        codigo: '2',
      },
      {
        id: '7a69567c-8d6a-4383-8930-628b83c8f214',
        nombre: 'Cochabamba',
        codigo: '3',
      },
      {
        id: '753074a4-b4ea-41dd-8ed1-5807b10dec07',
        nombre: 'Oruro',
        codigo: '4',
      },
      {
        id: 'ccad3b6d-db1a-4e15-9759-2005b193a3a6',
        nombre: 'Potosí',
        codigo: '5',
      },
      {
        id: 'ad46939d-d038-4812-9fc8-fea2dcfcbc59',
        nombre: 'Tarija',
        codigo: '6',
      },
      {
        id: 'd5183d83-58ba-4ebe-9bdb-0e073c48a58d',
        nombre: 'Santa Cruz',
        codigo: '7',
      },
      {
        id: '638e04bc-1bec-4898-9617-cbfff7adaff1',
        nombre: 'Beni',
        codigo: '8',
      },
      {
        id: 'd2cee6f6-a8a3-4fe5-8db3-0572b31fc2ab',
        nombre: 'Pando',
        codigo: '9',
      },
    ];
    const data = items.map((item) => {
      const d = new Departamento();
      d.id = item.id;
      d.nombre = item.nombre;
      d.codigo = item.codigo;
      return d;
    });
    await queryRunner.manager.save(data);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

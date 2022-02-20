import { MigrationInterface, QueryRunner } from 'typeorm';
import { GradoEscolaridad } from '../../src/application/olimpiada/entity/GradoEscolaridad.entity';

export class gradoEscolaridad1618576318440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        nombre: 'PRIMERO DE SECUNDARIA',
        orden: 7,
      },
      {
        id: '248f063b-5ae3-5824-8bf3-d445f93d37aa',
        nombre: 'SEGUNDO DE SECUNDARIA',
        orden: 8,
      },
      {
        id: '3bf6c70d-1ae6-47f9-9782-7fb863d89101',
        nombre: 'TERCERO DE SECUNDARIA',
        orden: 9,
      },
      {
        id: '37760524-aa62-4c26-9411-15c55ad1081d',
        nombre: 'CUARTO DE SECUNDARIA',
        orden: 10,
      },
      {
        id: 'dd64b928-5396-486e-a8a0-ef9e5124668a',
        nombre: 'QUINTO DE SECUNDARIA',
        orden: 11,
      },
      {
        id: '83719493-54e3-5447-ac4b-06d51866fe20',
        nombre: 'SEXTO DE SECUNDARIA',
        orden: 12,
      },
    ];
    const data = items.map((item) => {
      const g = new GradoEscolaridad();
      g.id = item.id;
      g.nombre = item.nombre;
      g.orden = item.orden;
      g.fechaCreacion = new Date();
      g.usuarioCreacion = '1';
      return g;
    });
    await queryRunner.manager.save(data);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

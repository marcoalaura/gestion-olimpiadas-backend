import { TextService } from 'src/common/lib/text.service';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertsParametros1617820337609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // TIPO DOCUMENTO
    const parametros = [
      {
        id: TextService.generateUuid(),
        codigo: 'TD-CI',
        nombre: 'Cédula de identidad',
        grupo: 'TD',
        descripcion: 'Cédula de Identidad',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TD-CIE',
        nombre: 'Cédula de identidad de extranjero',
        grupo: 'TD',
        descripcion: 'Cédula de identidad de extranjero',
      },
      // APPS
      {
        id: TextService.generateUuid(),
        codigo: 'TAPP-B',
        nombre: 'Backend',
        grupo: 'TAPP',
        descripcion: 'Backend',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TAPP-F',
        nombre: 'Frontend',
        grupo: 'TAPP',
        descripcion: 'Frontend',
      },
      // ACCIONES
      {
        id: TextService.generateUuid(),
        codigo: 'TACC-R',
        nombre: 'read',
        grupo: 'TACC',
        descripcion: 'READ',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACC-U',
        nombre: 'update',
        grupo: 'TACC',
        descripcion: 'UPDATE',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACC-C',
        nombre: 'create',
        grupo: 'TACC',
        descripcion: 'CREATE',
      },
      {
        id: TextService.generateUuid(),
        codigo: 'TACC-D',
        nombre: 'delete',
        grupo: 'TACC',
        descripcion: 'DELETE',
      },
    ];
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('parametro')
      .values(parametros)
      .execute();
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

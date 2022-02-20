import { Persona } from 'src/application/persona/persona.entity';
import { TextService } from 'src/common/lib/text.service';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class usuario1611171041789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombres: 'ADMIN',
        primerApellido: 'ADMIN',
        segundoApellido: 'ADMIN',
        nroDocumento: '1234567',
        fechaNacimiento: '1900-01-01',
        genero: 'M',
      },
    ];
    const personas = items.map((item) => {
      const p = new Persona();
      p.id = TextService.textToUuid(item.nroDocumento);
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
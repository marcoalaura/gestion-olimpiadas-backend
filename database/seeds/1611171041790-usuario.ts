import { Persona } from 'src/application/persona/persona.entity';
import { Usuario } from 'src/application/usuario/usuario.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { TextService } from '../../src/common/lib/text.service';
import { Status } from '../../src/common/constants';

export class usuario1611171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const pass = await TextService.encrypt(process.env.ADMIN_PASS);
    const items = [
      {
        usuario: 'admin',
        persona: TextService.textToUuid('1234567'),
        correoElectonico: process.env.ADMIN_EMAIL,
      },
    ];
    const usuarios = items.map((item) => {
      const p = new Persona();
      p.id = item.persona;
      const u = new Usuario();
      u.id = TextService.textToUuid(item.usuario);
      u.usuario = item.usuario;
      u.correoElectronico = item.correoElectonico;
      u.contrasena = pass;
      u.fechaCreacion = new Date();
      u.estado = Status.ASIGNADO;
      u.usuarioCreacion = '1';
      u.persona = p;
      return u;
    });
    await queryRunner.manager.save(usuarios);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

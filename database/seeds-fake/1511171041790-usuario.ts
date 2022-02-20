import { Persona } from 'src/application/persona/persona.entity';
import { Usuario } from 'src/application/usuario/usuario.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { TextService } from '../../src/common/lib/text.service';
import { Status } from '../../src/common/constants';

export class usuario1511171041790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const DEFAULT_PASS = '123';
    const pass = await TextService.encrypt(DEFAULT_PASS);
    const items = [
      {
        usuario: 'ADMINISTRADOR',
        persona: TextService.textToUuid('9270815'),
        correoElectonico: 'agepic-9270815@yopmail.com',
      },
      {
        usuario: 'SUPER_ADMIN',
        persona: TextService.textToUuid('1765251'),
        correoElectonico: 'agepic-1765251@yopmail.com',
      },
      {
        usuario: 'TECNICO_SIE_DEPARTAMENTAL',
        persona: TextService.textToUuid('6114767'),
        correoElectonico: 'agepic-6114767@yopmail.com',
      },
      {
        usuario: 'TECNICO_SIE_DEPARTAMENTAL_2',
        persona: TextService.textToUuid('4839411'),
        correoElectonico: 'agepic-4839411@yopmail.com',
      },
      {
        usuario: 'TECNICO_SIE_DEPARTAMENTAL_3',
        persona: TextService.textToUuid('3439411'),
        correoElectonico: 'agepic-3439411@yopmail.com',
      },
      {
        usuario: 'TECNICO_SIE_DISTRITAL',
        persona: TextService.textToUuid('3439412'),
        correoElectonico: 'agepic-3439412@yopmail.com',
      },
      {
        usuario: 'COMITE_DEPARTAMENTAL',
        persona: TextService.textToUuid('5602708'),
        correoElectonico: 'agepic-5602708@yopmail.com',
      },
      {
        usuario: 'COMITE_DOCENTE_VERIFICADOR',
        persona: TextService.textToUuid('7463463'),
        correoElectonico: 'agepic-7463463@yopmail.com',
      },
      {
        usuario: 'COMITE_DOCENTE_VERIFICADOR_2',
        persona: TextService.textToUuid('8769411'),
        correoElectonico: 'agepic-8769411@yopmail.com',
      },
      {
        usuario: 'COMITE_DOCENTE_CARGA',
        persona: TextService.textToUuid('4839423'),
        correoElectonico: 'agepic-4839423@yopmail.com',
      },
      {
        usuario: 'CONSULTA',
        persona: TextService.textToUuid('4839412'),
        correoElectonico: 'agepic-4839412@yopmail.com',
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
      u.estado = Status.ACTIVE;
      u.usuarioCreacion = '1';
      u.persona = p;
      return u;
    });
    await queryRunner.manager.save(usuarios);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

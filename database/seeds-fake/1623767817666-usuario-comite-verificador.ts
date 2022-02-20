import { MigrationInterface, QueryRunner } from 'typeorm';
import { TextService } from 'src/common/lib/text.service';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { Usuario } from 'src/application/usuario/usuario.entity';
import { UsuarioRol } from 'src/core/authorization/entity/usuario-rol.entity';
import { Area } from 'src/application/olimpiada/entity/Area.entity';
import { Etapa } from 'src/application/olimpiada/entity/Etapa.entity';
import { Olimpiada } from 'src/application/olimpiada/entity/Olimpiada.entity';
import { Rol } from 'src/core/authorization/entity/rol.entity';

export class usuarioComiteVerificador1623767817666
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: TextService.textToUuid(RolEnum.COMITE_DOCENTE_VERIFICADOR),
        usuario: TextService.textToUuid('COMITE_DOCENTE_VERIFICADOR'),
        area: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        etapa: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
      },
      {
        rol: TextService.textToUuid(RolEnum.COMITE_DOCENTE_VERIFICADOR),
        usuario: TextService.textToUuid('COMITE_DOCENTE_VERIFICADOR_2'),
        area: '297cd53f-d950-401d-912a-f9deb66550b9',
        etapa: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
      },
      {
        rol: TextService.textToUuid(RolEnum.COMITE_DOCENTE_CARGA),
        usuario: TextService.textToUuid('COMITE_DOCENTE_CARGA'),
        area: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        etapa: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
      },
    ];

    const usuarioRol = items.map((item) => {
      const r = new Rol();
      r.id = item.rol;

      const u = new Usuario();
      u.id = item.usuario;

      const o = new Olimpiada();
      o.id = '97303a51-8570-453f-9e67-1a06537c0744';

      const ur = new UsuarioRol();
      ur.id = TextService.generateUuid();
      ur.rol = r;
      ur.usuario = u;
      ur.olimpiada = o;
      if (item.area) {
        const a = new Area();
        a.id = item.area;
        ur.area = a;
      }
      if (item.etapa) {
        const e = new Etapa();
        e.id = item.etapa;
        ur.etapa = e;
      }
      ur.usuarioCreacion = '1';
      return ur;
    });
    await queryRunner.manager.save(usuarioRol);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

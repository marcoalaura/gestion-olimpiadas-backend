import { Olimpiada } from 'src/application/olimpiada/entity/Olimpiada.entity';
import { Usuario } from 'src/application/usuario/usuario.entity';
import { TextService } from 'src/common/lib/text.service';
import { Rol } from 'src/core/authorization/entity/rol.entity';
import { UsuarioRol } from 'src/core/authorization/entity/usuario-rol.entity';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class usuarioRol1611516017924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: TextService.textToUuid(RolEnum.SUPER_ADMIN),
        usuario: TextService.textToUuid('admin'),
        olimpiada: TextService.textToUuid('MINEDU'),
      },
    ];
    const usuarioRol = items.map((item) => {
      const r = new Rol();
      r.id = item.rol;

      const u = new Usuario();
      u.id = item.usuario;

      const o = new Olimpiada();
      o.id = item.olimpiada;

      const ur = new UsuarioRol();
      ur.id = TextService.generateUuid();
      ur.rol = r;
      ur.usuario = u;
      ur.olimpiada = o;
      ur.usuarioCreacion = '1';
      return ur;
    });
    await queryRunner.manager.save(usuarioRol);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

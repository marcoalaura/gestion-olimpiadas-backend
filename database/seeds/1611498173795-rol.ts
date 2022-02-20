import { RolEnum } from 'src/core/authorization/rol.enum';
import { Rol } from '../../src/core/authorization/entity/rol.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { TextService } from '../../src/common/lib/text.service';
import { Status } from '../../src/common/constants';

export class rol1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: RolEnum.ADMINISTRADOR,
        nombre: 'Administrador',
        grupo: 'USUARIO',
      },
      {
        rol: RolEnum.ESTUDIANTE,
        nombre: 'Estudiante',
        grupo: 'ESTUDIANTE',
        permisoCrear: Status.INHABILITADO,
      },
      {
        rol: RolEnum.COMITE_DOCENTE_CARGA,
        nombre: 'Comité docente carga',
        grupo: 'ACTOR',
        campos: ['idEtapa', 'idArea'],
      },
      {
        rol: RolEnum.COMITE_DEPARTAMENTAL,
        nombre: 'Comité departamental',
        grupo: 'ACTOR',
        campos: ['idDepartamento', 'idArea'],
      },
      {
        rol: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        nombre: 'Comité docente verificador',
        grupo: 'ACTOR',
        campos: ['idEtapa', 'idArea'],
      },
      {
        rol: RolEnum.DIRECTOR,
        nombre: 'Director',
        grupo: 'ACTOR',
        campos: ['idUnidadEducativa'],
      },
      {
        rol: RolEnum.CONSULTA,
        nombre: 'Consulta',
        grupo: 'USUARIO',
      },
      {
        rol: RolEnum.SUPER_ADMIN,
        nombre: 'Super administrador',
        grupo: 'USUARIO',
      },
      {
        rol: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        nombre: 'Técnico SIE departamental',
        grupo: 'ACTOR',
        campos: ['idDepartamento'],
      },
      {
        rol: RolEnum.TECNICO_SIE_DISTRITO,
        nombre: 'Técnico SIE distrital',
        grupo: 'ACTOR',
        campos: ['idDistrito'],
      },
    ];
    const roles = items.map((item) => {
      const r = new Rol();
      r.id = TextService.textToUuid(item.rol);
      r.rol = item.rol;
      r.nombre = item.nombre;
      r.grupo = item.grupo;
      r.permisoCrear = item.permisoCrear || Status.HABILITADO;
      r.campos = item.campos;
      r.usuarioCreacion = '1';
      return r;
    });
    await queryRunner.manager.save(roles);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

import { Departamento } from 'src/application/olimpiada/entity/Departamento.entity';
import { Olimpiada } from 'src/application/olimpiada/entity/Olimpiada.entity';
import { Usuario } from 'src/application/usuario/usuario.entity';
import { TextService } from 'src/common/lib/text.service';
import { Rol } from 'src/core/authorization/entity/rol.entity';
import { Distrito } from 'src/application/olimpiada/entity/Distrito.entity';
import { Area } from 'src/application/olimpiada/entity/Area.entity';
import { UsuarioRol } from 'src/core/authorization/entity/usuario-rol.entity';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { UnidadEducativa } from 'src/application/olimpiada/entity/UnidadEducativa.entity';

export class usuarioRol1618432392582 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: TextService.textToUuid(RolEnum.ADMINISTRADOR),
        usuario: TextService.textToUuid('ADMINISTRADOR'),
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      },
      {
        rol: TextService.textToUuid(RolEnum.ADMINISTRADOR),
        usuario: TextService.textToUuid('ADMINISTRADOR'),
        idOlimpiada: '719e52b4-d8e1-11eb-b8bc-0242ac130003',
      },
      {
        rol: TextService.textToUuid(RolEnum.ADMINISTRADOR),
        usuario: TextService.textToUuid('ADMINISTRADOR'),
        idOlimpiada: '203ea483-f326-4019-85fa-4938a3326547',
      },
      {
        rol: TextService.textToUuid(RolEnum.SUPER_ADMIN),
        usuario: TextService.textToUuid('SUPER_ADMIN'),
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      },
      {
        rol: TextService.textToUuid(RolEnum.TECNICO_SIE_DEPARTAMENTAL),
        usuario: TextService.textToUuid('TECNICO_SIE_DEPARTAMENTAL'),
        departamento: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      },
      {
        rol: TextService.textToUuid(RolEnum.TECNICO_SIE_DEPARTAMENTAL),
        usuario: TextService.textToUuid('TECNICO_SIE_DEPARTAMENTAL_2'),
        departamento: '7a69567c-8d6a-4383-8930-628b83c8f214',
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      },
      {
        rol: TextService.textToUuid(RolEnum.TECNICO_SIE_DEPARTAMENTAL),
        usuario: TextService.textToUuid('TECNICO_SIE_DEPARTAMENTAL_3'),
        departamento: 'd5183d83-58ba-4ebe-9bdb-0e073c48a58d',
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      },
      {
        rol: TextService.textToUuid(RolEnum.TECNICO_SIE_DISTRITO),
        usuario: TextService.textToUuid('TECNICO_SIE_DISTRITAL'),
        idDistrito: '2310b8e7-aab4-4320-a3f9-4361dc95750a',
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      },
      {
        rol: TextService.textToUuid(RolEnum.COMITE_DEPARTAMENTAL),
        usuario: TextService.textToUuid('COMITE_DEPARTAMENTAL'),
        departamento: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
        idOlimpiada: '203ea483-f326-4019-85fa-4938a3326547',
        idArea: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
      },
      {
        rol: TextService.textToUuid(RolEnum.CONSULTA),
        usuario: TextService.textToUuid('CONSULTA'),
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      }
    ];
    const usuarioRol = items.map((item) => {
      const r = new Rol();
      r.id = item.rol;

      const u = new Usuario();
      u.id = item.usuario;

      const o = new Olimpiada();
      o.id = item.idOlimpiada;

      const ur = new UsuarioRol();
      ur.id = TextService.generateUuid();
      ur.rol = r;
      ur.usuario = u;
      ur.olimpiada = o;
      if (item.departamento) {
        const d = new Departamento();
        d.id = item.departamento;
        ur.departamento = d;
      }
      if (item.idDistrito) {
        const distrito = new Distrito();
        distrito.id = item.idDistrito;
        ur.distrito = distrito;
      }
      if (item.idArea) {
        const area = new Area();
        area.id = item.idArea;
        ur.area = area;
      }
      ur.usuarioCreacion = '1';
      return ur;
    });
    await queryRunner.manager.save(usuarioRol);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

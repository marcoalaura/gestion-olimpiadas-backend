import { MigrationInterface, QueryRunner } from 'typeorm';
import { TextService } from 'src/common/lib/text.service';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { Rol } from 'src/core/authorization/entity/rol.entity';
import { Usuario } from 'src/application/usuario/usuario.entity';
import { UsuarioRol } from 'src/core/authorization/entity/usuario-rol.entity';
import { Olimpiada } from 'src/application/olimpiada/entity/Olimpiada.entity';
import { Persona } from 'src/application/persona/persona.entity';
import { UnidadEducativa } from 'src/application/olimpiada/entity/UnidadEducativa.entity';
import { Status } from 'src/common/constants';

export class usuariosDirector1624260342861 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items1 = [
      {
        nombres: 'ANKEE',
        primerApellido: 'AGUILERA',
        segundoApellido: 'KADO',
        nroDocumento: '10810779',
        fechaNacimiento: '1954-05-22',
        genero: 'F',
      },
      {
        nombres: 'ROGER',
        primerApellido: 'MARTINEZ',
        segundoApellido: 'PAZ',
        nroDocumento: '4709245',
        fechaNacimiento: '2009-09-25',
        genero: 'M',
      },
      {
        nombres: 'MARIELA',
        primerApellido: 'ALCAZAR',
        segundoApellido: 'ALMARAZ',
        nroDocumento: '4192294-1E',
        fechaNacimiento: '2002-05-04',
        genero: 'F',
      },
    ];
    const personas = items1.map((item) => {
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

    const DEFAULT_PASS = '123';
    const pass = await TextService.encrypt(DEFAULT_PASS);
    const items2 = [
      {
        usuario: 'DIRECTOR',
        persona: TextService.textToUuid('10810779'),
        correoElectonico: 'agepic-10810779@yopmail.com',
      },
      {
        usuario: 'DIRECTOR2',
        persona: TextService.textToUuid('4709245'),
        correoElectonico: 'agepic-4709245@yopmail.com',
      },
      {
        usuario: 'DIRECTOR3',
        persona: TextService.textToUuid('4192294-1E'),
        correoElectonico: 'agepic-4192294-1e@yopmail.com',
      },
    ];
    const usuarios = items2.map((item) => {
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

    const unidades = await queryRunner.query('SELECT * FROM area;');
    const items = [
      {
        rol: TextService.textToUuid(RolEnum.DIRECTOR),
        usuario: TextService.textToUuid('DIRECTOR'),
        unidadEducactiva: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        rol: TextService.textToUuid(RolEnum.DIRECTOR),
        usuario: TextService.textToUuid('DIRECTOR2'),
        unidadEducactiva: 'd277ed90-d730-583b-bb24-aca999f2edcb',
      },
      {
        rol: TextService.textToUuid(RolEnum.DIRECTOR),
        usuario: TextService.textToUuid('DIRECTOR3'),
        unidadEducactiva: '32b79fa5-aaba-5f11-99ad-1545e60a3eda',
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
      if (item.unidadEducactiva) {
        const ue = new UnidadEducativa();
        ue.id = item.unidadEducactiva;
        ur.unidadEducativa = ue;
      }
      ur.usuarioCreacion = '1';
      return ur;
    });
    await queryRunner.manager.save(usuarioRol);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

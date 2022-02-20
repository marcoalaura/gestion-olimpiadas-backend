import { MigrationInterface, QueryRunner } from 'typeorm';

// Utils
import { TextService } from 'src/common/lib/text.service';

// Entities
import { Usuario } from '../../src/application/usuario/usuario.entity';
import { UsuarioRol } from '../../src/core/authorization/entity/usuario-rol.entity';
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';
import { Rol } from '../../src/core/authorization/entity/rol.entity';
import { v4 } from 'uuid';

// Types and constants
import { RolEnum } from 'src/core/authorization/rol.enum';

export class fakeOlimpiadaCargaResultados3627667477403
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    // const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    // const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    // const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;
    const fecha = new Date();

    /**
     * Olimpiada
     */
    console.log('*** Creando olimpiada resultados ***');
    const olimpiadasItems = [
      {
        id: TextService.textToUuid(`olimpiada-carga-resultados-${INITIAL}`),
        nombre: `Olimpiada para Subida de resultados ${fecha.toISOString()}`,
        sigla: 'OPSDR2021',
        gestion: 2021,
        fechaInicio: new Date('2021-08-10'),
        fechaFin: new Date('2021-11-10'),
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
        logo: 'milogo',
        leyenda: 'olimpiada-subida-resultados',
      },
    ];
    const olimpiadas = olimpiadasItems.map((item) => {
      const o = new Olimpiada();
      Object.assign(o, item);
      return o;
    });
    await queryRunner.manager.save(olimpiadas);

    /**
     * Relacion ADMINISTRADOR - OLIMPIADA DE CARGA
     */
    const _usuarioOlimpiada = new Usuario();
    _usuarioOlimpiada.id = TextService.textToUuid('ADMINISTRADOR');
    const _usuarioOlimpiadaRol = new Rol();
    _usuarioOlimpiadaRol.id = TextService.textToUuid(RolEnum.ADMINISTRADOR);
    const usuarioRolOlimpiada = new UsuarioRol();
    usuarioRolOlimpiada.id = v4();
    usuarioRolOlimpiada.rol = _usuarioOlimpiadaRol;
    usuarioRolOlimpiada.usuario = _usuarioOlimpiada;
    usuarioRolOlimpiada.olimpiada = olimpiadas[0];
    usuarioRolOlimpiada.usuarioCreacion = 'seeders';

    await queryRunner.manager.save(usuarioRolOlimpiada);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
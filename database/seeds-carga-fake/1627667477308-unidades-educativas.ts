import { MigrationInterface, QueryRunner, SimpleConsoleLogger} from 'typeorm';

// Utils
import { TextService } from 'src/common/lib/text.service';

// Faker functions
import {
  name as fkName,
  datatype as fkDatatype,
  company as fkCompany,
  lorem as fkLorem
} from 'faker';

// Entities
import { Usuario } from '../../src/application/usuario/usuario.entity';
import { UsuarioRol } from '../../src/core/authorization/entity/usuario-rol.entity';
import { Persona } from '../../src/application/persona/persona.entity';
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';
import { Etapa } from '../../src/application/olimpiada/entity/Etapa.entity';
import { Area } from '../../src/application/olimpiada/entity/Area.entity';
import { GradoEscolaridad } from '../../src/application/olimpiada/entity/GradoEscolaridad.entity';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { Calendario } from '../../src/application/olimpiada/entity/Calendario.entity';
import { Distrito } from '../../src/application/olimpiada/entity/Distrito.entity';
import { UnidadEducativa } from '../../src/application/olimpiada/entity/UnidadEducativa.entity';
import { Rol } from '../../src/core/authorization/entity/rol.entity';
import { Estudiante } from '../../src/application/olimpiada/entity/Estudiante.entity';
import { Inscripcion } from '../../src/application/olimpiada/entity/Inscripcion.entity';
import { MedalleroPosicion } from '../../src/application/olimpiada/entity/MedalleroPosicion.entity';
import { MedalleroPosicionRural } from '../../src/application/olimpiada/entity/MedalleroPosicionRural.entity';
import { Pregunta } from '../../src/application/olimpiada/entity/Pregunta.entity';
import { v4 } from 'uuid';
import { EstudianteExamenDetalle } from '../../src/application/olimpiada/entity/EstudianteExamenDetalle.entity';
import { EstudianteExamen } from '../../src/application/olimpiada/entity/EstudianteExamen.entity';
// Types and constants
import {
  tiposEtapa,
  Status,
  TipoRespuesta,
  NivelDificultad,
  TipoPregunta,
  TipoPlanificacion,
  // tiposAreasGeograficas,
  // tiposUnidadesEducativas
} from '../../src/common/constants';
import { RolEnum } from 'src/core/authorization/rol.enum';
export class fakeUnidadesEducativas1627667477308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;


    const fecha = new Date();
    const DEFAULT_PASS = '123';
    const pass = await TextService.encrypt(DEFAULT_PASS);
    const deptos = [{
      id_departamento: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
      nombre: 'LPZ',
      id_distrito: '2310b8e7-aab4-4320-a3f9-4361dc95750a',
    }, {
      id_departamento: 'd5183d83-58ba-4ebe-9bdb-0e073c48a58d',
      nombre: 'SCZ',
      id_distrito: 'd4f35a56-a812-44dd-8ca7-f6b6899fda14',
    }]
    const tiposArea = ['RURAL', 'URBANO'];
	  const tiposUnidad = ['CONVENIO', 'PRIVADA', 'FISCAL'];
    const _rolDirector = new Rol();
    _rolDirector.id = TextService.textToUuid(RolEnum.DIRECTOR);

    const _olimpiada = new Olimpiada();
    _olimpiada.id = TextService.textToUuid(`olimpiada-carga-${INITIAL}`);

    
    const _medalleroData = [{
      subGrupo: 'ORO',
      denominativo: 'ORO',
      ordenGalardon: 1
    }, {
      subGrupo: 'PLATA',
      denominativo: 'PLATA',
      ordenGalardon: 2
    }, {
      subGrupo: 'BRONCE',
      denominativo: 'BRONCE',
      ordenGalardon: 3
    }];



    /**
     * Unidades Educativas
     */

    console.log('*** Creando unidades educativas con sus directores ***');
    let unidadesEducativas: UnidadEducativa[] = [];
    let personas: Persona[] = [];
    let usuarios: Usuario[] = [];
    let usuariosRol: UsuarioRol[] = [];

    for (let iue = INITIAL; iue < INITIAL + NRO_UNIDADES_EDUCATIVAS; iue++) {
      const rndPosition = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
      let dUE = new Distrito();
      dUE.id = deptos[rndPosition].id_distrito;
      let _unidadEducativa = new UnidadEducativa();
      _unidadEducativa.id = TextService.textToUuid(`colegio-${iue}`)
      _unidadEducativa.nombre = `${fkCompany.companyName()} ${deptos[rndPosition].nombre} ${iue}`;
      _unidadEducativa.codigoSie = iue;
      _unidadEducativa.tipoUnidadEducativa = tiposUnidad[Math.floor(Math.random() * (2 - 0 + 1)) + 0];
      _unidadEducativa.areaGeografica = tiposArea[rndPosition];
      _unidadEducativa.seccion = fkLorem.word();
      _unidadEducativa.localidad = fkLorem.word();
      _unidadEducativa.distrito = dUE;
      _unidadEducativa.fechaCreacion = new Date();
      _unidadEducativa.usuarioCreacion = 'seeders-carga-fake';

      unidadesEducativas.push(_unidadEducativa);
      // await queryRunner.manager.save([_unidadEducativa]);


      /// Creando directores y asignando a colegios
      const _persona = new Persona();
      _persona.id = TextService.textToUuid(`persona-${iue}`);
      _persona.nombres = `${fkName.firstName()}-${INITIAL}-${iue}`;
      _persona.primerApellido = fkName.lastName();
      _persona.nroDocumento = `${fkDatatype.number()}`;
      _persona.fechaNacimiento = '1960-05-12';
      _persona.usuarioCreacion = 'seeders-carga-fake';
      personas.push(_persona);
      // await queryRunner.manager.save([_persona]);

      const _usuario = new Usuario();
      _usuario.id = TextService.textToUuid(`usuario-${iue}`);
      _usuario.usuario = `DIRECTOR-${iue}`;
      _usuario.contrasena = pass;
      _usuario.persona = _persona;
      _usuario.estado = 'ACTIVO';
      _usuario.usuarioCreacion = 'seeders-carga-fake';
      usuarios.push(_usuario);
      // await queryRunner.manager.save([_usuario]);

      const _usuarioRol = new UsuarioRol();
      _usuarioRol.id = TextService.textToUuid(`usuarioRol-${iue}`);
      _usuarioRol.olimpiada = _olimpiada;
      _usuarioRol.rol = _rolDirector;
      _usuarioRol.usuario = _usuario;
      _usuarioRol.unidadEducativa = _unidadEducativa;
      _usuarioRol.usuarioCreacion = 'seeders-carga-fake';
      usuariosRol.push(_usuarioRol);
      // await queryRunner.manager.save([_usuarioRol]);
    }

    
    /// Unidades educativas - directores
    await queryRunner.manager.save(unidadesEducativas);
    await queryRunner.manager.save(personas);
    await queryRunner.manager.save(usuarios);
    await queryRunner.manager.save(usuariosRol);

  }
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
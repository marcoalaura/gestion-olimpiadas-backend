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
import { Persona } from '../../src/application/persona/persona.entity';
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { UnidadEducativa } from '../../src/application/olimpiada/entity/UnidadEducativa.entity';
import { Estudiante } from '../../src/application/olimpiada/entity/Estudiante.entity';
import { Inscripcion } from '../../src/application/olimpiada/entity/Inscripcion.entity';
import { MedalleroPosicion } from '../../src/application/olimpiada/entity/MedalleroPosicion.entity';

// Types and constants
import {
  Status,
} from '../../src/common/constants';

export class fakeEstudiantesInscripcionMatematicas3627667477409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;


    const _olimpiada = new Olimpiada();
    _olimpiada.id = TextService.textToUuid(`olimpiada-carga-resultados-${INITIAL}`);
    const _eag = new EtapaAreaGrado();
    _eag.id = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`);
    const _medallero = new MedalleroPosicion();
    _medallero.id = TextService.textToUuid(`medallero-matematicas-resultados${INITIAL}`)


    /**
     * 
     * Estudiantes - Examen - Inscripcion
     */
    for (let iue = INITIAL; iue < INITIAL + NRO_UNIDADES_EDUCATIVAS; iue++) {
      for (let idx = INITIAL; idx < INITIAL + NRO_ESTUDIANTES; idx++) {
        const _persona = new Persona();
        _persona.id = TextService.textToUuid(`persona-estudiante-resultados${iue}-${idx}`);
        _persona.nombres = `${fkName.firstName()}-${iue}-${idx}`;
        _persona.primerApellido = fkName.lastName();
        _persona.nroDocumento = `87654321${iue}${idx}`;
        _persona.fechaNacimiento = '1960-05-12';
        _persona.usuarioCreacion = '1';
        await queryRunner.manager.save([_persona]);
        // personasEstudiantes.push(_persona);
  
        const _estudiante = new Estudiante();
        _estudiante.id = TextService.textToUuid(`estudiante-resultados${iue}-${idx}`);
        _estudiante.rude = `87654321${iue}${idx}`;
        _estudiante.fechaCreacion = new Date();
        _estudiante.usuarioCreacion = '1';
        _estudiante.persona = _persona;
        await queryRunner.manager.save([_estudiante]);
        // estudiantes.push(_estudiante);

        let _ue = new UnidadEducativa();
        _ue.id = TextService.textToUuid(`colegio-resultados${iue}`);

        // Inscribiendo estudiantes
        const _inscripcion = new Inscripcion();
        _inscripcion.id = TextService.textToUuid(`inscripcion-matematicas-resultados-${iue}-${idx}`);
        _inscripcion.idImportacion = '1';
        _inscripcion.estado = Status.ACTIVE
        _inscripcion.estudiante = _estudiante;
        _inscripcion.unidadEducativa = _ue;
        _inscripcion.etapaAreaGrado = _eag;// TODO: seleccionar uno random
        _inscripcion.fechaCreacion = new Date();
        _inscripcion.usuarioCreacion = '1';
        _inscripcion.clasificado = true; // TODO: este campo es opcional ?? 
        // medalleros fake
        _inscripcion.idMedalleroPosicionAutomatica = _medallero; // tomar cualquier medallero random de los creados
        _inscripcion.idMedalleroPosicionManual = _medallero; // tomar cualquier medallero random de los creados
        // inscripciones.push(_inscripcion);
        await queryRunner.manager.save([_inscripcion]);

      }
    }

  }
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
import { MigrationInterface, QueryRunner, SimpleConsoleLogger} from 'typeorm';

// Utils
import { TextService } from 'src/common/lib/text.service';

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
export class fakeEstudiantesInscripcionMatematicas1627667488309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;

    const _olimpiada = new Olimpiada();
    _olimpiada.id = TextService.textToUuid(`olimpiada-test-sorteo-${INITIAL}`);
    const _eag = new EtapaAreaGrado();
    _eag.id = TextService.textToUuid(`eag-sorteo-matematicas-${INITIAL}`);
    const _medallero = new MedalleroPosicion();
    _medallero.id = TextService.textToUuid(`medallero-sorteo-matematicas-${INITIAL}`)


    /**
     * 
     * Estudiantes - Examen - Inscripcion
     */
    for (let iue = INITIAL; iue < INITIAL + NRO_UNIDADES_EDUCATIVAS; iue++) {
      // console.log('*** Inscribiendo estudiantes en unidades educativas ***');
      for (let idx = INITIAL; idx < INITIAL + NRO_ESTUDIANTES; idx++) {
        /// Creando estudiantes
        const _persona = new Persona();
        _persona.id = TextService.textToUuid(`persona-sorteo-estudiante-${iue}-${idx}`);
        _persona.nombres = `E-${TextService.generateShortRandomText()}-${iue}-${idx}`;
        _persona.primerApellido = TextService.generateShortRandomText();
        _persona.nroDocumento = `777888${iue}${idx}`;
        _persona.fechaNacimiento = '1960-05-12';
        _persona.usuarioCreacion = 'seeders-sorteo-fake';
        await queryRunner.manager.save([_persona]);
  
        const _estudiante = new Estudiante();
        _estudiante.id = TextService.textToUuid(`estudiante-sorteo-${iue}-${idx}`);
        _estudiante.rude = `777888${iue}${idx}`;
        _estudiante.fechaCreacion = new Date();
        _estudiante.usuarioCreacion = 'seeders-sorteo-fake';
        _estudiante.persona = _persona;
        await queryRunner.manager.save([_estudiante]);

        let _ue = new UnidadEducativa();
        _ue.id = TextService.textToUuid(`colegio-sorteo-${iue}`);

        // Inscribiendo estudiantes
        const _inscripcion = new Inscripcion();
        _inscripcion.id = TextService.textToUuid(`inscripcion-sorteo-matematicas-${iue}-${idx}`);
        _inscripcion.idImportacion = '1';
        _inscripcion.estado = Status.ACTIVE
        _inscripcion.estudiante = _estudiante;
        _inscripcion.unidadEducativa = _ue;
        _inscripcion.etapaAreaGrado = _eag;// TODO: seleccionar uno random
        _inscripcion.fechaCreacion = new Date();
        _inscripcion.usuarioCreacion = 'seeders-sorteo-fake';
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
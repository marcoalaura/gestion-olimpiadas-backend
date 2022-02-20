import { MigrationInterface, QueryRunner, SimpleConsoleLogger} from 'typeorm';

// Utils
import { TextService } from 'src/common/lib/text.service';

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

export class fakeEstudiantesInscripcionFisica2627667477510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;

    
    const fecha = new Date();
    const DEFAULT_PASS = '123';
    const pass = await TextService.encrypt(DEFAULT_PASS);

    const _olimpiada = new Olimpiada();
    _olimpiada.id = TextService.textToUuid(`olimpiada-carga-examen${INITIAL}`);
    const _eag = new EtapaAreaGrado();
    _eag.id = TextService.textToUuid(`eag-carga-fisica-examen${INITIAL}`);
    const _medallero = new MedalleroPosicion();
    _medallero.id = TextService.textToUuid(`medallero-fisica-examen${INITIAL}`)


    /**
     * 
     * Estudiantes - Examen - Inscripcion
     */

    // let personasEstudiantes: Persona[] = [];
    // let estudiantes: Estudiante[] = [];
    // let inscripciones: Inscripcion[] = [];

    // const estudiante_examen=[];
    // const estudiante_examen_offline = [];
    for (let iue = INITIAL; iue < INITIAL + NRO_UNIDADES_EDUCATIVAS; iue++) {
      // console.log('*** Inscribiendo estudiantes en unidades educativas ***');
      for (let idx = INITIAL; idx < INITIAL + NRO_ESTUDIANTES; idx++) {
        /// Creando estudiantes
        // const _persona = new Persona();
        // _persona.id = TextService.textToUuid(`persona-estudiante-${iue}-${idx}`);
        // _persona.nombres = `${fkName.firstName()}-${iue}-${idx}`;
        // _persona.primerApellido = fkName.lastName();
        // _persona.nroDocumento = `543210${iue}${idx}`;
        // _persona.fechaNacimiento = '1960-05-12';
        // _persona.usuarioCreacion = '1';
        // personasEstudiantes.push(_persona);
  
        let _estudiante = new Estudiante();
        _estudiante.id = TextService.textToUuid(`estudiante-examen${iue}-${idx}`);
        // _estudiante.persona = _persona;
        // _estudiante.rude = `543210${iue}${idx}`;
        // _estudiante.fechaCreacion = new Date();
        // _estudiante.usuarioCreacion = '1';
        // await queryRunner.manager.save([_estudiante]);
        // estudiantes.push(_estudiante);

        let _ue = new UnidadEducativa();
        _ue.id = TextService.textToUuid(`colegio-examen${iue}`);

        // Inscribiendo estudiantes
        const _inscripcion = new Inscripcion();
        _inscripcion.id = TextService.textToUuid(`inscripcion-fisica-examen${iue}-${idx}`);
        _inscripcion.idImportacion = '1';
        _inscripcion.estado = Status.ACTIVE
        _inscripcion.estudiante = _estudiante;
        _inscripcion.unidadEducativa = _ue;
        _inscripcion.etapaAreaGrado = _eag;
        _inscripcion.fechaCreacion = new Date();
        _inscripcion.usuarioCreacion = '1';
        _inscripcion.clasificado = true;
        _inscripcion.idMedalleroPosicionAutomatica = _medallero;
        _inscripcion.idMedalleroPosicionManual = _medallero;
        // inscripciones.push(_inscripcion);
        await queryRunner.manager.save([_inscripcion]);
      }
    }

    // await queryRunner.manager.save(inscripciones);

  }
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
import { MigrationInterface, QueryRunner, SimpleConsoleLogger} from 'typeorm';

// Utils
import { TextService } from 'src/common/lib/text.service';

// Entities
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

export class fakeEstudiantesInscripcionFisica1627667488310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;

    const _olimpiada = new Olimpiada();
    _olimpiada.id = TextService.textToUuid(`olimpiada-test-sorteo-${INITIAL}`);
    const _eag = new EtapaAreaGrado();
    _eag.id = TextService.textToUuid(`eag-sorteo-fisica-${INITIAL}`);
    const _medallero = new MedalleroPosicion();
    _medallero.id = TextService.textToUuid(`medallero-sorteo-fisica-${INITIAL}`)


    /**
     * 
     * Estudiantes - Examen - Inscripcion - CargaEmpaquetados
     */
    for (let iue = INITIAL; iue < INITIAL + NRO_UNIDADES_EDUCATIVAS; iue++) {
      for (let idx = INITIAL; idx < INITIAL + NRO_ESTUDIANTES; idx++) {
        let _estudiante = new Estudiante();
        _estudiante.id = TextService.textToUuid(`estudiante-sorteo-${iue}-${idx}`);

        let _ue = new UnidadEducativa();
        _ue.id = TextService.textToUuid(`colegio-sorteo-${iue}`);

        // Inscribiendo estudiantes
        const _inscripcion = new Inscripcion();
        _inscripcion.id = TextService.textToUuid(`inscripcion-sorteo-fisica-${iue}-${idx}`);
        _inscripcion.idImportacion = '1';
        _inscripcion.estado = Status.ACTIVE
        _inscripcion.estudiante = _estudiante;
        _inscripcion.unidadEducativa = _ue;
        _inscripcion.etapaAreaGrado = _eag;
        _inscripcion.fechaCreacion = new Date();
        _inscripcion.usuarioCreacion = 'seeders-sorteo-fake';
        _inscripcion.clasificado = true;
        _inscripcion.idMedalleroPosicionAutomatica = _medallero;
        _inscripcion.idMedalleroPosicionManual = _medallero;
        await queryRunner.manager.save([_inscripcion]);
      }
    }

  }
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
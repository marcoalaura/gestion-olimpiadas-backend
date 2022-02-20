import { MigrationInterface, QueryRunner } from 'typeorm';
// Utils
import { TextService } from 'src/common/lib/text.service';

// Entities
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';
import { Etapa } from '../../src/application/olimpiada/entity/Etapa.entity';
import { Area } from '../../src/application/olimpiada/entity/Area.entity';
import { GradoEscolaridad } from '../../src/application/olimpiada/entity/GradoEscolaridad.entity';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { Calendario } from '../../src/application/olimpiada/entity/Calendario.entity';
import { Rol } from '../../src/core/authorization/entity/rol.entity';
import { MedalleroPosicion } from '../../src/application/olimpiada/entity/MedalleroPosicion.entity';
import { v4 } from 'uuid';

// Types and constants
import {
  tiposEtapa,
  Status,
  TipoPlanificacion,
} from '../../src/common/constants';
import { RolEnum } from 'src/core/authorization/rol.enum';

export class fakeEtapaAreaGradoCalendario1627667488304
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    // const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    // const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    // const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;

    const _rolDirector = new Rol();
    _rolDirector.id = TextService.textToUuid(RolEnum.DIRECTOR);

    const _olimpiada = new Olimpiada();
    _olimpiada.id = TextService.textToUuid(`olimpiada-test-sorteo-${INITIAL}`);

    const _medalleroData = [
      {
        subGrupo: 'ORO',
        denominativo: 'ORO',
        ordenGalardon: 1,
      },
      {
        subGrupo: 'PLATA',
        denominativo: 'PLATA',
        ordenGalardon: 2,
      },
      {
        subGrupo: 'BRONCE',
        denominativo: 'BRONCE',
        ordenGalardon: 3,
      },
    ];

    /**
     * Etapas
     */
    console.log('*** Creando etapas - sorteo preguntas ***');
    const etapasItems = [
      {
        id: TextService.textToUuid(`etapa1-sorteo-${INITIAL}`),
        nombre: `Etapa 1 para sorteo de preguntas - ${INITIAL}`,
        tipo: tiposEtapa.DISTRITAL,
        jerarquia: 1,
        comiteDesempate: true,
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 4 * 24 * 3600 * 1000),
        fechaInicioImpugnacion: new Date(Date.now() + 34 * 24 * 3600 * 1000),
        fechaFinImpugnacion: new Date(Date.now() + 36 * 24 * 3600 * 1000),
        usuarioCreacion: 'seeders-sorteo-fake',
        estado: Status.CONFIGURACION_COMPETENCIA,
        estadoSorteoPreguntas: Status.PENDING,
      },
    ];
    const etapas = etapasItems.map((item) => {
      const e = new Etapa();
      Object.assign(e, item);
      e.olimpiada = _olimpiada;
      return e;
    });
    await queryRunner.manager.save(etapas);

    // Etapa - Area - Grado

    const eagsItems = [
      {
        id: TextService.textToUuid(`eag-sorteo-matematicas-${INITIAL}`),
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '0a55e851-622e-4465-8d72-c7ba2cf79c79', // MATEMÁTICAS
        id_etapa: TextService.textToUuid(`etapa1-sorteo-${INITIAL}`),
        id_grado_escolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6', // PRIMERO SECUNDARIA
        id_medallero: TextService.textToUuid(
          `medallero-sorteo-matematicas-${INITIAL}`,
        ),
      },
      {
        id: TextService.textToUuid(`eag-sorteo-fisica-${INITIAL}`),
        total_preguntas: 14,
        preguntas_curricula: 6,
        preguntas_olimpiada: 8,
        puntos_pregunta_curricula: 40,
        puntos_pregunta_olimpiada: 60,
        duracion_minutos: 10,
        preguntas_curricula_baja: 2,
        puntaje_curricula_baja: 5,
        preguntas_curricula_media: 2,
        puntaje_curricula_media: 5,
        preguntas_curricula_alta: 2,
        puntaje_curricula_alta: 10,
        preguntas_olimpiada_baja: 2,
        puntaje_olimpiada_baja: 10,
        preguntas_olimpiada_media: 2,
        puntaje_olimpiada_media: 10,
        preguntas_olimpiada_alta: 4,
        puntaje_olimpiada_alta: 5,
        nro_posiciones_total: 1,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 51,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: 'f6b02355-e60f-4464-a1a2-52e784b1717f', // FISICA
        id_etapa: TextService.textToUuid(`etapa1-sorteo-${INITIAL}`),
        id_grado_escolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa', // SEGUNDO SECUNDARIA
        id_medallero: TextService.textToUuid(
          `medallero-sorteo-fisica-${INITIAL}`,
        ),
      },
    ];

    /**
     * Etapa - Area - Grado
     */
    console.log('*** Creando etapa - area - grado ***');
    const eags: EtapaAreaGrado[] = [];
    const medalleros: MedalleroPosicion[] = [];
    const calendarios: Calendario[] = [];

    for (const keyEAG in eagsItems) {
      const _eag = new EtapaAreaGrado();
      _eag.id = eagsItems[keyEAG].id;
      _eag.totalPreguntas = eagsItems[keyEAG].total_preguntas;
      _eag.preguntasCurricula = eagsItems[keyEAG].preguntas_curricula;
      _eag.preguntasOlimpiada = eagsItems[keyEAG].preguntas_olimpiada;
      _eag.puntosPreguntaCurricula = eagsItems[keyEAG].puntos_pregunta_curricula;
      _eag.puntosPreguntaOlimpiada = eagsItems[keyEAG].puntos_pregunta_olimpiada;
      _eag.duracionMinutos = eagsItems[keyEAG].duracion_minutos;
      _eag.preguntasCurriculaBaja = eagsItems[keyEAG].preguntas_curricula_baja;
      _eag.puntajeCurriculaBaja = eagsItems[keyEAG].puntaje_curricula_baja;
      _eag.preguntasCurriculaMedia = eagsItems[keyEAG].preguntas_curricula_media;
      _eag.puntajeCurriculaMedia = eagsItems[keyEAG].puntaje_curricula_media;
      _eag.preguntasCurriculaAlta = eagsItems[keyEAG].preguntas_curricula_alta;
      _eag.puntajeCurriculaAlta = eagsItems[keyEAG].puntaje_curricula_alta;
      _eag.preguntasOlimpiadaBaja = eagsItems[keyEAG].preguntas_olimpiada_baja;
      _eag.puntajeOlimpiadaBaja = eagsItems[keyEAG].puntaje_olimpiada_baja;
      _eag.preguntasOlimpiadaMedia = eagsItems[keyEAG].preguntas_olimpiada_media;
      _eag.puntajeOlimpiadaMedia = eagsItems[keyEAG].puntaje_olimpiada_media;
      _eag.preguntasOlimpiadaAlta = eagsItems[keyEAG].preguntas_olimpiada_alta;
      _eag.puntajeOlimpiadaAlta = eagsItems[keyEAG].puntaje_olimpiada_alta;
      _eag.nroPosicionesTotal = eagsItems[keyEAG].nro_posiciones_total;
      _eag.nroPosicionesRural = eagsItems[keyEAG].nro_posiciones_rural;
      _eag.criterioCalificacion = eagsItems[keyEAG].criterio_calificacion;
      _eag.criterioMedallero = eagsItems[keyEAG].criterio_medallero;
      _eag.puntajeMinimoClasificacion = eagsItems[keyEAG].puntaje_minimo_clasificacion;
      _eag.cantidadMaximaClasificados = eagsItems[keyEAG].cantidad_maxima_clasificados;
      _eag.puntajeMinimoMedallero = eagsItems[keyEAG].puntaje_minimo_medallero;
      _eag.color = '#3b4d61';
      _eag.usuarioCreacion = '1';
      const etapa = new Etapa();
      etapa.id = eagsItems[keyEAG].id_etapa;
      const area = new Area();
      area.id = eagsItems[keyEAG].id_area;
      const grado = new GradoEscolaridad();
      grado.id = eagsItems[keyEAG].id_grado_escolar;
      _eag.area = area;
      _eag.etapa = etapa;
      _eag.gradoEscolar = grado;
      eags.push(_eag);

      const rndPosition = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
      const _medallero = new MedalleroPosicion();
      _medallero.id = eagsItems[keyEAG].id_medallero;
      _medallero.ordenGalardon = _medalleroData[rndPosition].ordenGalardon;
      _medallero.subGrupo = _medalleroData[rndPosition].subGrupo;
      _medallero.denominativo = _medalleroData[rndPosition].denominativo;
      _medallero.etapaAreaGrado = _eag;
      _medallero.usuarioCreacion = '1';
      medalleros.push(_medallero);

      const _calendarioOnline = new Calendario();
      _calendarioOnline.id = v4();
      _calendarioOnline.tipoPrueba = 'ONLINE';
      _calendarioOnline.tipoPlanificacion = TipoPlanificacion.CRONOGRAMA;
      _calendarioOnline.fechaHoraInicio = new Date('2021-08-05 08:00:00');
      _calendarioOnline.fechaHoraFin = new Date('2021-08-30 09:00:00');
      _calendarioOnline.etapaAreaGrado = _eag;
      _calendarioOnline.usuarioCreacion = '1';

      calendarios.push(_calendarioOnline);

      const _calendarioOffline = new Calendario();
      _calendarioOffline.id = v4();
      _calendarioOffline.tipoPrueba = 'OFFLINE';
      _calendarioOffline.tipoPlanificacion = TipoPlanificacion.CRONOGRAMA;
      _calendarioOffline.fechaHoraInicio = new Date('2021-08-05 08:00:00');
      _calendarioOffline.fechaHoraFin = new Date('2021-08-30 09:00:00');
      _calendarioOffline.etapaAreaGrado = _eag;
      _calendarioOffline.usuarioCreacion = '1';
      calendarios.push(_calendarioOffline);
    }

    await queryRunner.manager.save(eags);
    await queryRunner.manager.save(medalleros);
    await queryRunner.manager.save(calendarios);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

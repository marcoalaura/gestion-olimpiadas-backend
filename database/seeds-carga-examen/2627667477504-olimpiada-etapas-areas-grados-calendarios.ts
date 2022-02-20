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


export class fakeEtapaAreaGradoCalendario2627667477504 implements MigrationInterface {
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
    _olimpiada.id = TextService.textToUuid(`olimpiada-carga-examen${INITIAL}`);

    
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
     * Etapas
     */
     console.log('*** Creando etapas ***');
    const etapasItems = [{
      id: TextService.textToUuid(`etapa1-carga-examen${INITIAL}`),
      nombre: `Etapa 1 para pruebas de carga - Examen ${INITIAL}`,
      tipo: tiposEtapa.DISTRITAL,
      jerarquia: 1,
      comiteDesempate: true,
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 4*24*3600*1000),
      fechaInicioImpugnacion: new Date(Date.now() + 34*24*3600*1000),
      fechaFinImpugnacion: new Date(Date.now() + 36*24*3600*1000),
      usuarioCreacion: 'seeders-carga-fake',
      estado: Status.EXAMEN_SEGUN_CRONOGRAMA,
      estadoSorteoPreguntas: Status.FINALIZADO
    }];
    const etapas = etapasItems.map((item) => {
      const e = new Etapa();
      Object.assign(e, item);
      e.olimpiada = _olimpiada;
      return e;
    });
    await queryRunner.manager.save(etapas);

    /**
     * Etapa - Area - Grado
     * 
     */

    const eagsItems = [
      {
        id: TextService.textToUuid(`eag-carga-matematicas-examen${INITIAL}`),
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10000,
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
        id_area: '0a55e851-622e-4465-8d72-c7ba2cf79c79',// MATEMÁTICAS
        id_etapa: TextService.textToUuid(`etapa1-carga-examen${INITIAL}`),
        id_grado_escolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',// PRIMERO SECUNDARIA
        id_medallero: TextService.textToUuid(`medallero-matematicas-examen${INITIAL}`)
      },
      {
        id: TextService.textToUuid(`eag-carga-fisica-examen${INITIAL}`),
        total_preguntas: 14,
        preguntas_curricula: 6,
        preguntas_olimpiada: 8,
        puntos_pregunta_curricula: 40,
        puntos_pregunta_olimpiada: 60,
        duracion_minutos: 10000,
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
        id_area: 'f6b02355-e60f-4464-a1a2-52e784b1717f',// FISICA
        id_etapa: TextService.textToUuid(`etapa1-carga-examen${INITIAL}`),
        id_grado_escolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa', // SEGUNDO SECUNDARIA
        id_medallero: TextService.textToUuid(`medallero-fisica-examen${INITIAL}`)
      },
      {
        id: TextService.textToUuid(`eag-carga-quimica-examen${INITIAL}`),
        total_preguntas: 14,
        preguntas_curricula: 6,
        preguntas_olimpiada: 8,
        puntos_pregunta_curricula: 40,
        puntos_pregunta_olimpiada: 60,
        duracion_minutos: 10000,
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
        id_area: '795f761d-2764-408e-94ea-7d5020bc30ac',// QUÍMICA
        id_etapa: TextService.textToUuid(`etapa1-carga-examen${INITIAL}`),
        id_grado_escolar: '3bf6c70d-1ae6-47f9-9782-7fb863d89101', // TERCERO SECUNDARIA
        id_medallero: TextService.textToUuid(`medallero-quimica-examen${INITIAL}`)
      },
    ];


    /**
     * Etapa - Area - Grado
     */
    console.log('*** Creando etapa - area - grado ***');
    let eags: EtapaAreaGrado[] = [];
    let medalleros: MedalleroPosicion[] = [];
    let calendarios: Calendario[] = [];

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


      /**
     * Calendario OFFLINE Y ONLINE
     */
       let _calendarioOnline = new Calendario();
       _calendarioOnline.id = v4();
       _calendarioOnline.tipoPrueba = 'ONLINE';
       _calendarioOnline.tipoPlanificacion = TipoPlanificacion.CRONOGRAMA;
       _calendarioOnline.fechaHoraInicio =  new Date('2021-08-12 08:00:00');
       _calendarioOnline.fechaHoraFin =new Date('2021-09-30 09:00:00');
       _calendarioOnline.etapaAreaGrado = _eag;
       _calendarioOnline.usuarioCreacion = '1';

       calendarios.push(_calendarioOnline)
   
       let _calendarioOffline = new Calendario();
       _calendarioOffline.id = v4();
       _calendarioOffline.tipoPrueba = 'OFFLINE';
       _calendarioOffline.tipoPlanificacion = TipoPlanificacion.CRONOGRAMA;
       _calendarioOffline.fechaHoraInicio = new Date('2021-08-12 08:00:00');
       _calendarioOffline.fechaHoraFin = new Date('2021-08-30 09:00:00');
       _calendarioOffline.etapaAreaGrado = _eag;
       _calendarioOffline.usuarioCreacion = '1';
       calendarios.push(_calendarioOffline);

    }

    await queryRunner.manager.save(eags);
    await queryRunner.manager.save(medalleros);
    await queryRunner.manager.save(calendarios);

    

  }
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
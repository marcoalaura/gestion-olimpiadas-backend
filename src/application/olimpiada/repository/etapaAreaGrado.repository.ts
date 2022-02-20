import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { TextService } from '../../../common/lib/text.service';
import { GetJsonData } from '../../../common/lib/json.module';
import {
  EntityRepository,
  getManager,
  getRepository,
  Repository,
} from 'typeorm';
import { EtapaAreaGradoDto } from '../dto/etapaAreaGrado.dto';
import { EtapaAreaGrado } from '../entity/EtapaAreaGrado.entity';
import { Etapa } from '../entity/Etapa.entity';
import { Area } from '../entity/Area.entity';
import { GradoEscolaridad } from '../entity/GradoEscolaridad.entity';
import { Color, Status } from '../../../common/constants';
import { MedalleroPosicion } from '../entity/MedalleroPosicion.entity';
import { MedalleroPosicionRural } from '../entity/MedalleroPosicionRural.entity';
import { Inscripcion } from '../entity/Inscripcion.entity';
import { Calendario } from '../entity/Calendario.entity';

@EntityRepository(EtapaAreaGrado)
export class EtapaAreaGradoRepository extends Repository<EtapaAreaGrado> {
  async listar(idEtapa: string, paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .innerJoinAndSelect('etapaAreaGrado.area', 'area')
      .innerJoinAndSelect('etapaAreaGrado.gradoEscolar', 'gradoEscolar')
      .leftJoinAndSelect(
        'etapaAreaGrado.medalleroPosiciones',
        'mp',
        `mp.estado = '${Status.ACTIVE}'`,
      )
      .leftJoinAndSelect(
        'etapaAreaGrado.medalleroPosicionRurales',
        'mpr',
        `mpr.estado = '${Status.ACTIVE}'`,
      )
      .select([
        'etapaAreaGrado.id',
        'etapaAreaGrado.totalPreguntas',
        'etapaAreaGrado.preguntasCurricula',
        'etapaAreaGrado.preguntasOlimpiada',
        'etapaAreaGrado.puntosPreguntaCurricula',
        'etapaAreaGrado.puntosPreguntaOlimpiada',
        'etapaAreaGrado.duracionMinutos',
        'etapaAreaGrado.preguntasCurriculaBaja',
        'etapaAreaGrado.puntajeCurriculaBaja',
        'etapaAreaGrado.preguntasCurriculaMedia',
        'etapaAreaGrado.puntajeCurriculaMedia',
        'etapaAreaGrado.preguntasCurriculaAlta',
        'etapaAreaGrado.puntajeCurriculaAlta',
        'etapaAreaGrado.preguntasOlimpiadaBaja',
        'etapaAreaGrado.puntajeOlimpiadaBaja',
        'etapaAreaGrado.preguntasOlimpiadaMedia',
        'etapaAreaGrado.puntajeOlimpiadaMedia',
        'etapaAreaGrado.preguntasOlimpiadaAlta',
        'etapaAreaGrado.puntajeOlimpiadaAlta',
        'etapaAreaGrado.nroPosicionesTotal',
        'etapaAreaGrado.nroPosicionesRural',
        'etapaAreaGrado.puntajeMinimoMedallero',
        'etapaAreaGrado.criterioCalificacion',
        'etapaAreaGrado.criterioMedallero',
        'etapaAreaGrado.puntajeMinimoClasificacion',
        'etapaAreaGrado.cantidadMaximaClasificados',
        'etapaAreaGrado.estado',
        'etapa.id',
        'etapa.nombre',
        'etapa.estado',
        'area.id',
        'area.nombre',
        'gradoEscolar.id',
        'gradoEscolar.nombre',
        'gradoEscolar.orden',
        'mp.id',
        'mp.ordenGalardon',
        'mp.denominativo',
        'mp.subGrupo',
        'mpr.id',
        'mpr.orden',
        'mpr.posicionMaxima',
        'mpr.posicionMinima',
        'mpr.notaMinima',
        'olimpiada.id',
        'olimpiada.nombre',
      ])
      .where('etapa.id = :idEtapa', { idEtapa })
      .orderBy('area.nombre', orden)
      .addOrderBy('gradoEscolar.orden')
      // .addOrderBy('mp.ordenGalardon')
      // .addOrderBy('mpr.orden')
      .skip(saltar)
      .take(limite);

    if (parametros?.etapa) {
      query.andWhere('etapa.nombre ilike :etapa', {
        etapa: `%${parametros.etapa}%`,
      });
    }
    if (parametros?.idArea) {
      query.andWhere('area.id = :idarea', { idarea: parametros.idArea });
    }
    if (parametros?.area) {
      query.andWhere('area.nombre ilike :area', {
        area: `%${parametros.area}%`,
      });
    }
    if (parametros?.idGrado) {
      query.andWhere('gradoEscolar.id = :idgrado', {
        idgrado: parametros.idGrado,
      });
    }
    if (parametros?.grado) {
      query.andWhere('gradoEscolar.nombre ilike :grado', {
        grado: `%${parametros.grado}%`,
      });
    }
    if (parametros?.estado) {
      query.andWhere('etapaAreaGrado.estado = :estado', {
        estado: parametros.estado,
      });
    }

    return query.getManyAndCount();
  }

  async listarPublico(idEtapa: string, paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, orden } = paginacionQueryDto;

    const query = getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .innerJoinAndSelect('etapaAreaGrado.area', 'area')
      .innerJoinAndSelect('etapaAreaGrado.gradoEscolar', 'gradoEscolar')
      .select([
        'etapaAreaGrado.id',
        'area.nombre',
        'gradoEscolar.nombre',
        'gradoEscolar.orden',
      ])
      .where('etapa.id = :idEtapa', {
        idEtapa,
      })
      .andWhere('(etapa.estado = :publicado or etapa.estado = :cerrado)', {
        publicado: Status.PUBLICACION_RESULTADOS,
        cerrado: Status.CLOSED,
      })
      .andWhere('area.estado = :activo and gradoEscolar.estado = :activo', {
        activo: Status.ACTIVE,
      })
      .orderBy('area.nombre', orden)
      .addOrderBy('gradoEscolar.orden')
      .skip(saltar)
      .take(limite);

    return query.getManyAndCount();
  }

  async contarPorIds(
    id: string,
    idEtapa: string,
    idArea: string,
    idGrado: string,
  ) {
    const query = getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .where(
        'id_etapa = :idEtapa and id_area = :idArea and id_grado_escolar = :idGrado',
        { idEtapa, idArea, idGrado },
      );

    if (id) {
      query.andWhere('etapaAreaGrado.id <> :id', { id });
    }
    return query.getCount();
  }

  async buscarPorIds(idEtapa: string, idArea: string, idGrado: string) {
    const estado = 'ACTIVO';
    const result = getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .select([
        'etapaAreaGrado.id',
        'etapaAreaGrado.totalPreguntas',
        'etapaAreaGrado.preguntasCurricula',
        'etapaAreaGrado.preguntasOlimpiada',
        'etapaAreaGrado.puntosPreguntaCurricula',
        'etapaAreaGrado.puntosPreguntaOlimpiada',
        'etapaAreaGrado.duracionMinutos',
        'etapaAreaGrado.preguntasCurriculaBaja',
        'etapaAreaGrado.puntajeCurriculaBaja',
        'etapaAreaGrado.preguntasCurriculaMedia',
        'etapaAreaGrado.puntajeCurriculaMedia',
        'etapaAreaGrado.preguntasCurriculaAlta',
        'etapaAreaGrado.puntajeCurriculaAlta',
        'etapaAreaGrado.preguntasOlimpiadaBaja',
        'etapaAreaGrado.puntajeOlimpiadaBaja',
        'etapaAreaGrado.preguntasOlimpiadaMedia',
        'etapaAreaGrado.puntajeOlimpiadaMedia',
        'etapaAreaGrado.preguntasOlimpiadaAlta',
        'etapaAreaGrado.puntajeOlimpiadaAlta',
        'etapaAreaGrado.nroPosicionesTotal',
        'etapaAreaGrado.nroPosicionesRural',
        'etapaAreaGrado.puntajeMinimoMedallero',
        'etapaAreaGrado.criterioCalificacion',
        'etapaAreaGrado.criterioMedallero',
        'etapaAreaGrado.puntajeMinimoClasificacion',
        'etapaAreaGrado.cantidadMaximaClasificados',
        'etapaAreaGrado.estado',
        'etapa.id',
        'etapa.nombre',
      ])
      .where(
        'id_etapa = :idEtapa and id_area = :idArea and id_grado_escolar = :idGrado and estado = :estado',
        { idEtapa, idArea, idGrado, estado },
      )
      .getOne();

    return result;
  }

  buscarPorIdSimple(id: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .where('etapaAreaGrado.id = :id', { id })
      .getOne();
  }

  async buscarPorId(id: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .innerJoinAndSelect('etapaAreaGrado.area', 'area')
      .innerJoinAndSelect('etapaAreaGrado.gradoEscolar', 'gradoEscolar')
      .select([
        'etapaAreaGrado.id',
        'etapaAreaGrado.totalPreguntas',
        'etapaAreaGrado.preguntasCurricula',
        'etapaAreaGrado.preguntasOlimpiada',
        'etapaAreaGrado.puntosPreguntaCurricula',
        'etapaAreaGrado.puntosPreguntaOlimpiada',
        'etapaAreaGrado.duracionMinutos',
        'etapaAreaGrado.preguntasCurriculaBaja',
        'etapaAreaGrado.puntajeCurriculaBaja',
        'etapaAreaGrado.preguntasCurriculaMedia',
        'etapaAreaGrado.puntajeCurriculaMedia',
        'etapaAreaGrado.preguntasCurriculaAlta',
        'etapaAreaGrado.puntajeCurriculaAlta',
        'etapaAreaGrado.preguntasOlimpiadaBaja',
        'etapaAreaGrado.puntajeOlimpiadaBaja',
        'etapaAreaGrado.preguntasOlimpiadaMedia',
        'etapaAreaGrado.puntajeOlimpiadaMedia',
        'etapaAreaGrado.preguntasOlimpiadaAlta',
        'etapaAreaGrado.puntajeOlimpiadaAlta',
        'etapaAreaGrado.nroPosicionesTotal',
        'etapaAreaGrado.puntajeMinimoClasificacion',
        'etapaAreaGrado.estado',
        'etapa.id',
        'etapa.nombre',
        'etapa.tipo',
        'etapa.estado',
        'etapa.fechaInicio',
        'etapa.fechaFin',
        'area.id',
        'area.nombre',
        'gradoEscolar.id',
        'gradoEscolar.nombre',
      ])
      .where('etapaAreaGrado.id = :id', { id })
      .getOne();
  }

  buscarPorIdEtapaIdAreaIdGrado(
    idEtapa: string,
    idArea: string,
    idGradoEscolar: string,
  ) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .select(['etapaAreaGrado.id'])
      .where(
        'etapaAreaGrado.idEtapa = :idEtapa and etapaAreaGrado.idArea = :idArea and etapaAreaGrado.idGradoEscolar = :idGradoEscolar',
        { idEtapa, idArea, idGradoEscolar },
      )
      .getOne();
  }

  async crearActualizar(
    etapaAreaGradoDto: EtapaAreaGradoDto,
    usuarioAuditoria: string,
  ) {
    const {
      id,
      totalPreguntas,
      preguntasCurricula,
      preguntasOlimpiada,
      puntosPreguntaCurricula,
      puntosPreguntaOlimpiada,
      duracionMinutos,
      preguntasCurriculaBaja,
      puntajeCurriculaBaja,
      preguntasCurriculaMedia,
      puntajeCurriculaMedia,
      preguntasCurriculaAlta,
      puntajeCurriculaAlta,
      preguntasOlimpiadaBaja,
      puntajeOlimpiadaBaja,
      preguntasOlimpiadaMedia,
      puntajeOlimpiadaMedia,
      preguntasOlimpiadaAlta,
      puntajeOlimpiadaAlta,
      estado,
      idEtapa,
      idArea,
      idGradoEscolar,
      // medallero
      nroPosicionesTotal,
      puntajeMinimoMedallero,
      nroPosicionesRural,
      // clasificacion
      criterioCalificacion,
      criterioMedallero,
      puntajeMinimoClasificacion,
      cantidadMaximaClasificados,
    } = etapaAreaGradoDto;

    const etapa = new Etapa();
    etapa.id = idEtapa;
    const area = new Area();
    area.id = idArea;
    const gradoEscolaridad = new GradoEscolaridad();
    gradoEscolaridad.id = idGradoEscolar;

    const etapaAreaGrado = new EtapaAreaGrado();
    // esto esta mal
    etapaAreaGrado.id = id ? id : TextService.generateUuid();
    (etapaAreaGrado.totalPreguntas = parseInt(totalPreguntas)),
      (etapaAreaGrado.preguntasCurricula = parseInt(preguntasCurricula)),
      (etapaAreaGrado.preguntasOlimpiada = parseInt(preguntasOlimpiada)),
      (etapaAreaGrado.puntosPreguntaCurricula = parseFloat(
        puntosPreguntaCurricula,
      )),
      (etapaAreaGrado.puntosPreguntaOlimpiada = parseFloat(
        puntosPreguntaOlimpiada,
      )),
      (etapaAreaGrado.duracionMinutos = parseInt(duracionMinutos)),
      (etapaAreaGrado.preguntasCurriculaBaja = parseInt(
        preguntasCurriculaBaja,
      )),
      (etapaAreaGrado.puntajeCurriculaBaja = parseFloat(puntajeCurriculaBaja)),
      (etapaAreaGrado.preguntasCurriculaMedia = parseInt(
        preguntasCurriculaMedia,
      )),
      (etapaAreaGrado.puntajeCurriculaMedia = parseFloat(
        puntajeCurriculaMedia,
      )),
      (etapaAreaGrado.preguntasCurriculaAlta = parseInt(
        preguntasCurriculaAlta,
      )),
      (etapaAreaGrado.puntajeCurriculaAlta = parseFloat(puntajeCurriculaAlta)),
      (etapaAreaGrado.preguntasOlimpiadaBaja = parseInt(
        preguntasOlimpiadaBaja,
      )),
      (etapaAreaGrado.puntajeOlimpiadaBaja = parseFloat(puntajeOlimpiadaBaja)),
      (etapaAreaGrado.preguntasOlimpiadaMedia = parseInt(
        preguntasOlimpiadaMedia,
      )),
      (etapaAreaGrado.puntajeOlimpiadaMedia = parseFloat(
        puntajeOlimpiadaMedia,
      )),
      (etapaAreaGrado.preguntasOlimpiadaAlta = parseInt(
        preguntasOlimpiadaAlta,
      )),
      (etapaAreaGrado.puntajeOlimpiadaAlta = parseFloat(puntajeOlimpiadaAlta)),
      (etapaAreaGrado.estado = estado);
    etapaAreaGrado.etapa = etapa;
    etapaAreaGrado.area = area;
    etapaAreaGrado.gradoEscolar = gradoEscolaridad;

    etapaAreaGrado.nroPosicionesTotal = parseInt(nroPosicionesTotal);
    etapaAreaGrado.puntajeMinimoMedallero = parseFloat(puntajeMinimoMedallero);
    etapaAreaGrado.nroPosicionesRural = parseInt(nroPosicionesRural);
    etapaAreaGrado.criterioCalificacion = criterioCalificacion;
    etapaAreaGrado.criterioMedallero = criterioMedallero;
    etapaAreaGrado.puntajeMinimoClasificacion =
      puntajeMinimoClasificacion && criterioCalificacion
        ? parseFloat(puntajeMinimoClasificacion)
        : 0;
    etapaAreaGrado.cantidadMaximaClasificados = cantidadMaximaClasificados
      ? parseInt(cantidadMaximaClasificados)
      : null;

    if (id) {
      etapaAreaGrado.usuarioActualizacion = usuarioAuditoria;
    } else {
      etapaAreaGrado.usuarioCreacion = usuarioAuditoria;
      etapaAreaGrado.color = Color[parseInt(`${Math.random() * Color.length}`)];
    }

    // medalleroPosicion
    const medalleros: MedalleroPosicion[] = etapaAreaGradoDto.medalleroPosicion.map(
      (item) => {
        const medalleroPosicion = new MedalleroPosicion();
        medalleroPosicion.ordenGalardon = parseInt(item.ordenGalardon);
        medalleroPosicion.subGrupo = item.subGrupo;
        medalleroPosicion.denominativo = item.denominativo;
        medalleroPosicion.usuarioCreacion = usuarioAuditoria;
        medalleroPosicion.idEtapaAreaGrado = id;
        return medalleroPosicion;
      },
    );

    // medalleroPosicionRural
    const medallerosRural: MedalleroPosicionRural[] = etapaAreaGradoDto.medalleroPosicionRural.map(
      (item) => {
        const medalleroPosicionRural = new MedalleroPosicionRural();
        medalleroPosicionRural.orden = parseInt(item.orden);
        medalleroPosicionRural.posicionMaxima = parseInt(item.posicionMaxima);
        medalleroPosicionRural.posicionMinima = parseInt(item.posicionMinima);
        medalleroPosicionRural.notaMinima = parseInt(item.notaMinima);
        medalleroPosicionRural.usuarioCreacion = usuarioAuditoria;
        medalleroPosicionRural.idEtapaAreaGrado = id;
        return medalleroPosicionRural;
      },
    );

    return getManager().transaction(async (transactionEntityManager) => {
      if (id) {
        // medalleroPosicion
        await transactionEntityManager.update(
          MedalleroPosicion,
          { idEtapaAreaGrado: id },
          { estado: Status.INACTIVE, usuarioActualizacion: usuarioAuditoria },
        );
        await transactionEntityManager.save(MedalleroPosicion, medalleros);

        // medalleroPosicionRural
        await transactionEntityManager.update(
          MedalleroPosicionRural,
          { idEtapaAreaGrado: id },
          { estado: Status.INACTIVE, usuarioActualizacion: usuarioAuditoria },
        );
        await transactionEntityManager.save(
          MedalleroPosicionRural,
          medallerosRural,
        );
      } else {
        etapaAreaGrado.medalleroPosiciones = medalleros;
        etapaAreaGrado.medalleroPosicionRurales = medallerosRural;
      }

      // etapaAreaGrado
      await transactionEntityManager.save(etapaAreaGrado);
      return etapaAreaGrado;
    });
  }

  async actualizarEstado(id: string, estado: string, usuarioAuditoria: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder()
      .update(EtapaAreaGrado)
      .set({ estado, usuarioActualizacion: usuarioAuditoria })
      .where('id = :id', { id })
      .execute();
  }

  async contarPorIdArea(idArea: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('eag')
      .innerJoinAndSelect('eag.area', 'a')
      .where('a.id = :id', { id: idArea })
      .getCount();
  }

  async contarPorIdEtapa(idEtapa: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('eag')
      .innerJoinAndSelect('eag.etapa', 'e')
      .where('e.id = :id', { id: idEtapa })
      .getCount();
  }

  async contarPorIdGrado(idGrado: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('eag')
      .innerJoinAndSelect('eag.gradoEscolar', 'g')
      .where('g.id = :id', { id: idGrado })
      .getCount();
  }

  async eliminar(etapaAreaGrado: EtapaAreaGrado) {
    return this.remove(etapaAreaGrado);
  }

  listarEtapaAreaGradoPorEtapa(idEtapa: string, queryNivel: any = {}) {
    const { filtro } = queryNivel;
    let parametros: any = {};
    if (filtro) {
      parametros = filtro ? GetJsonData(filtro) : {};
    }
    const query = getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .innerJoinAndSelect('etapaAreaGrado.area', 'area')
      .innerJoinAndSelect('etapaAreaGrado.gradoEscolar', 'gradoEscolar')
      .select([
        'etapaAreaGrado.id',
        'etapaAreaGrado.estado',
        'area.id',
        'area.nombre',
        'area.estado',
        'gradoEscolar.id',
        'gradoEscolar.nombre',
        'gradoEscolar.estado',
        'etapa.id',
        'etapa.nombre',
      ])
      .where('etapaAreaGrado.etapa.id = :id', { id: idEtapa });

    if (parametros.idArea) {
      query.andWhere('area.id = :idArea', { idArea: parametros.idArea });
    }
    return query.getManyAndCount();
  }

  listarParametrosEtapaAreaGradoPorEtapa(idEtapa: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .innerJoinAndSelect('etapaAreaGrado.area', 'area')
      .innerJoinAndSelect('etapaAreaGrado.gradoEscolar', 'gradoEscolar')
      .select([
        'etapaAreaGrado.id',
        'etapaAreaGrado.totalPreguntas',
        'etapaAreaGrado.preguntasCurricula',
        'etapaAreaGrado.preguntasOlimpiada',
        'etapaAreaGrado.puntosPreguntaCurricula',
        'etapaAreaGrado.puntosPreguntaOlimpiada',
        'etapaAreaGrado.duracionMinutos',
        'etapaAreaGrado.preguntasCurriculaBaja',
        'etapaAreaGrado.puntajeCurriculaBaja',
        'etapaAreaGrado.preguntasCurriculaMedia',
        'etapaAreaGrado.puntajeCurriculaMedia',
        'etapaAreaGrado.preguntasCurriculaAlta',
        'etapaAreaGrado.puntajeCurriculaAlta',
        'etapaAreaGrado.preguntasOlimpiadaBaja',
        'etapaAreaGrado.puntajeOlimpiadaBaja',
        'etapaAreaGrado.preguntasOlimpiadaMedia',
        'etapaAreaGrado.puntajeOlimpiadaMedia',
        'etapaAreaGrado.preguntasOlimpiadaAlta',
        'etapaAreaGrado.puntajeOlimpiadaAlta',
        'etapaAreaGrado.nroPosicionesTotal',
        'etapaAreaGrado.puntajeMinimoClasificacion',
        'etapaAreaGrado.estado',
        'etapa.nombre',
        'area.nombre',
        'gradoEscolar.nombre',
      ])
      .where('etapaAreaGrado.etapa.id = :id', { id: idEtapa })
      .getMany();
  }

  obtenerIdOlimpiada(idEtapaAreaGrado: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .where('etapaAreaGrado.id = :id', { id: idEtapaAreaGrado })
      .select(['etapaAreaGrado.id', 'etapa.id', 'olimpiada.id'])
      .getOne();
  }

  async obtenerConfiguracion(idEtapa: string) {
    return await getRepository(EtapaAreaGrado)
      .createQueryBuilder('eag')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .innerJoinAndSelect('eag.area', 'area')
      .innerJoinAndSelect('eag.gradoEscolar', 'gradoEscolar')
      .select([
        'eag.id',
        'etapa.nombre',
        'area.nombre AS nombre_area',
        'gradoEscolar.nombre AS nombre_grado',
        'eag.totalPreguntas',
        'eag.preguntasCurricula',
        'eag.preguntasOlimpiada',
        'eag.puntosPreguntaCurricula',
        'eag.puntosPreguntaOlimpiada',
        'eag.duracionMinutos',
        'eag.nroPosicionesTotal',
        'eag.criterioCalificacion',
        'eag.puntajeMinimoClasificacion',
        'eag.criterioMedallero',
        'eag.puntajeMinimoMedallero',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select(['count(i.id)'])
          .from(Inscripcion, 'i')
          .where('i.idEtapaAreaGrado = eag.id')
          .andWhere('i.estado = :estado', { estado: Status.ACTIVE });
      }, 'inscripcion')
      .addSelect((subQuery) => {
        return subQuery
          .select(['count(m.id)'])
          .from(MedalleroPosicion, 'm')
          .where('m.idEtapaAreaGrado = eag.id')
          .andWhere('m.estado = :estado', { estado: Status.ACTIVE });
      }, 'medallero')
      .where('etapa.id = :idEtapa', { idEtapa })
      .andWhere('eag.estado = :estado', { estado: Status.ACTIVE })
      .getRawMany();
  }

  async obtenerConfiguracionCalendario(idEtapa: string) {
    return await getRepository(EtapaAreaGrado)
      .createQueryBuilder('eag')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .innerJoinAndSelect('eag.area', 'area')
      .innerJoinAndSelect('eag.gradoEscolar', 'gradoEscolar')
      .select([
        'eag.id',
        'etapa.nombre',
        'area.nombre AS nombre_area',
        'gradoEscolar.nombre AS nombre_grado',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select(['count(c.id)'])
          .from(Calendario, 'c')
          .where('c.idEtapaAreaGrado = eag.id');
      }, 'calendario')
      .addSelect((subQuery) => {
        return subQuery
          .select([
            "string_agg(c.tipo_prueba::varchar || '-' || c.tipo_planificacion::varchar, ',')",
          ])
          .from(Calendario, 'c')
          .where('c.idEtapaAreaGrado = eag.id');
      }, 'calendarioTipo')
      .where('etapa.id = :idEtapa', { idEtapa })
      .andWhere('eag.estado = :estado', { estado: Status.ACTIVE })
      .getRawMany();
  }

  async buscarEAGsiguiente(idEtapa: string, idEtapaSiguiente: string) {
    return await getRepository(EtapaAreaGrado)
      .createQueryBuilder('eag')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .innerJoinAndSelect('eag.area', 'area')
      .innerJoinAndSelect('eag.gradoEscolar', 'gradoEscolar')
      .select(['eag.id', 'etapa.nombre', 'area.nombre', 'gradoEscolar.nombre'])
      .where('etapa.id = :idEtapa', { idEtapa })
      .andWhere('eag.estado = :estado', { estado: Status.ACTIVE })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('ea.idArea, ea.idGradoEscolar')
          .from(EtapaAreaGrado, 'ea')
          .where('ea.idEtapa = :idEtapaSiguiente', { idEtapaSiguiente })
          .andWhere('ea.estado = :estado', { estado: Status.ACTIVE })
          .getQuery();
        return '(eag.idArea, eag.idGradoEscolar) NOT IN ' + subQuery;
      })
      .getMany();
  }

  async runTransaction(op) {
    return this.manager.transaction(op);
  }
}

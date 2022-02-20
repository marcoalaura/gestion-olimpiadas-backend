import { Status, Rol } from '../../../common/constants';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';

import { Pregunta } from '../entity/Pregunta.entity';
import { GetJsonData } from '../../../common/lib/json.module';

@EntityRepository(Pregunta)
export class PreguntaRepository extends Repository<Pregunta> {
  buscarPorId(id: string) {
    return getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .select([
        'pregunta.id',
        'pregunta.tipoPregunta',
        'pregunta.nivelDificultad',
        'pregunta.textoPregunta',
        'pregunta.imagenPregunta',
        'pregunta.tipoRespuesta',
        'pregunta.opciones',
        'pregunta.respuestas',
        'pregunta.estado',
        'pregunta.idEtapaAreaGrado',
      ])
      .where('pregunta.id = :id', { id })
      .getOne();
  }
  // TODO cargado por archivo se necesita un codigo para saber si esta repetido
  buscarPorPregunta(pregunta: string, idEag: string) {
    return getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .select([
        'pregunta.id',
        'pregunta.codigo',
        'pregunta.tipoPregunta',
        'pregunta.nivelDificultad',
        'pregunta.textoPregunta',
        'pregunta.imagenPregunta',
        'pregunta.tipoRespuesta',
        'pregunta.opciones',
        'pregunta.respuestas',
        'pregunta.estado',
        'pregunta.idEtapaAreaGrado',
      ])
      .where('pregunta.codigo = :pregunta', { pregunta })
      .andWhere('pregunta.idEtapaAreaGrado = :idEag', { idEag })
      .getOne();
  }
  // actualizarPregunta(id: string, datos: any) {
  //   return getRepository(Pregunta)
  //     .createQueryBuilder()
  //     .update()
  //     .set({
  //       tipoPregunta: datos.tipoPregunta,
  //       nivelDificultad: datos.nivelDificultad,
  //       imagenPregunta: datos.imagenPregunta,
  //       tipoRespuesta: datos.tipoRespuesta,
  //       opciones: datos.opciones,
  //       respuestas: datos.respuestas,
  //     })
  //     .where('id = :id', { id })
  //     .andWhere('estado = :estado', { estado: 'CREADO' })
  //     .execute();
  // }
  listarPorEtapaAreaGrado(
    idEtapaAreaGrado: string,
    rol: string,
    usuarioAuditoria: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    console.log('[listarPorEtapaAreaGrado] query.params: ', paginacionQueryDto);
    const { limite, filtro, saltar, orden, order } = paginacionQueryDto;
    console.log(' ====== order: ', orden, order);
    const parametros = filtro ? GetJsonData(filtro) : null;
    console.log('[listarPorEtapaAreaGrado] parametros: ', parametros);
    const query = getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .select([
        'pregunta.id',
        'pregunta.tipoPregunta',
        'pregunta.nivelDificultad',
        'pregunta.textoPregunta',
        'pregunta.imagenPregunta',
        'pregunta.tipoRespuesta',
        'pregunta.opciones',
        'pregunta.respuestas',
        'pregunta.estado',
        'pregunta.observacion',
      ])
      .where('pregunta.etapaAreaGrado.id = :id', { id: idEtapaAreaGrado })
      .andWhere('pregunta.estado != :estado', { estado: Status.ELIMINADO });
    if (rol === Rol.COMITE_DOCENTE_CARGA) {
      // query.andWhere('pregunta.estado in (:...estados)', {
      //   estados: [Status.CREATE, Status.OBSERVADO, Status.ENVIADO],
      // });
      query.andWhere('pregunta.usuarioCreacion = :usuarioAuditoria', {
        usuarioAuditoria,
      });
    }
    if (rol === Rol.COMITE_DOCENTE_VERIFICADOR) {
      query.andWhere('pregunta.estado = :enviado', {
        enviado: Status.ENVIADO,
      });
    }
    if (parametros?.tipoPregunta) {
      query.andWhere('pregunta.tipoPregunta = :tipoPregunta', {
        tipoPregunta: parametros.tipoPregunta,
      });
    }
    if (parametros?.nivelDificultad) {
      query.andWhere('pregunta.nivelDificultad = :nivelDificultad', {
        nivelDificultad: parametros.nivelDificultad,
      });
    }
    if (parametros?.tipoRespuesta) {
      query.andWhere('pregunta.tipoRespuesta = :tipoRespuesta', {
        tipoRespuesta: parametros.tipoRespuesta,
      });
    }
    if (parametros?.estado) {
      query.andWhere('pregunta.estado = :estadoFiltro', {
        estadoFiltro: parametros.estado,
      });
    }
    if (parametros?.nombreImagen) {
      query.andWhere('pregunta.imagenPregunta ilike :nombreImagen', {
        nombreImagen: `%${parametros.nombreImagen}%`,
      });
    }
    // order
    let tieneOrden = false;
    if (order?.indexOf('tipoPregunta') > -1) {
      query.orderBy('pregunta.tipoPregunta', orden);
      tieneOrden = true;
    }
    if (order?.indexOf('nivelDificultad') > -1) {
      query.orderBy('pregunta.nivelDificultad', orden);
      tieneOrden = true;
    }
    if (order?.indexOf('estado') > -1) {
      query.orderBy('pregunta.estado', orden);
      tieneOrden = true;
    }
    if (tieneOrden) query.addOrderBy('pregunta.fechaActualizacion', 'DESC');
    else query.orderBy('pregunta.fechaActualizacion', 'DESC');
    // paginacion
    query.skip(saltar);
    query.take(limite);

    return query.getManyAndCount();
  }
  crear(params: any) {
    return getRepository(Pregunta)
      .createQueryBuilder()
      .insert()
      .into(Pregunta)
      .values({
        id: params.id,
        tipoPregunta: params.tipoPregunta,
        nivelDificultad: params.nivelDificultad,
        textoPregunta: params.textoPregunta,
        imagenPregunta: params.imagenPregunta,
        tipoRespuesta: params.tipoRespuesta,
        opciones: params.opciones,
        respuestas: params.respuestas,
        estado: params.estado,
        etapaAreaGrado: params.etapaAreaGrado,
        usuarioCreacion: params.usuarioAuditoria,
      })
      .execute();
  }
  actualizarEstado(params: any) {
    const data: any = {
      estado: params.estado,
    };
    if (params.observacion) data.observacion = params.observacion;
    if (params.usuarioVerificacion)
      data.usuarioVerificacion = params.usuarioVerificacion;

    return getRepository(Pregunta)
      .createQueryBuilder()
      .update(Pregunta)
      .set(data)
      .where('id = :id', { id: params.id })
      .execute();
  }
  // este metodo no actualiza estado ni etapaAreaGrado
  actualizarPregunta(idPregunta: string, params: any) {
    return getRepository(Pregunta)
      .createQueryBuilder()
      .update(Pregunta)
      .set(params)
      .where('id = :id', { id: idPregunta })
      .andWhere('(estado = :creado OR estado =:observado)', {
        creado: Status.CREATE,
        observado: Status.OBSERVADO,
      })
      .execute();
  }

  /**
   * Metodo para contar preguntar por etapa
   * la agrupacion del conteo es por etapa-area-grado, tipo pregunta, nivel de dificultad
   * @param idEtapa identificador de la etapa
   * @returns Objeto
   */
  contarPorEtapa(idEtapa: string) {
    return getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .innerJoinAndSelect('pregunta.etapaAreaGrado', 'eag')
      .select([
        'pregunta.idEtapaAreaGrado as "idEtapaAreaGrado"',
        'pregunta.tipoPregunta as "tipoPregunta"',
        'pregunta.nivelDificultad as "nivelDificultad"',
        'COUNT(1) as "cantidad"',
      ])
      .where('eag.idEtapa = :idEtapa', { idEtapa })
      .andWhere('pregunta.estado = :estado', { estado: Status.APROBADO })
      .groupBy('pregunta.idEtapaAreaGrado')
      .addGroupBy('pregunta.tipoPregunta')
      .addGroupBy('pregunta.nivelDificultad')
      .getRawMany();
  }
  async contarPorIdEtapaAreaGrado(idEtapaAreaGrado: string) {
    return getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .where('pregunta.etapaAreaGrado = :id', { id: idEtapaAreaGrado })
      .getCount();
  }

  listarPreguntasAprobadasPorEtapaAreaGrado(idEtapaAreaGrado: string) {
    return getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .select([
        'pregunta.id',
        'pregunta.tipoPregunta',
        'pregunta.nivelDificultad',
        'pregunta.idEtapaAreaGrado',
        'pregunta.estado',
      ])
      .where('pregunta.idEtapaAreaGrado = :idEtapaAreaGrado', {
        idEtapaAreaGrado,
      })
      .andWhere('estado = :estado', { estado: Status.APROBADO })
      .getMany();
  }
  enviarPreguntasPorUsuario(
    idEtapaAreaGrado: string,
    usuarioAuditoria: string,
  ) {
    return getRepository(Pregunta)
      .createQueryBuilder()
      .update(Pregunta)
      .set({
        estado: Status.ENVIADO,
        usuarioActualizacion: usuarioAuditoria,
      })
      .where('idEtapaAreaGrado = :idEtapaAreaGrado', {
        idEtapaAreaGrado,
      })
      .andWhere('usuarioCreacion = :usuarioAuditoria', {
        usuarioAuditoria,
      })
      .andWhere('(estado = :creado)', {
        creado: Status.CREATE,
      })
      .execute();
  }

  resumenPreguntasAprobadasPorEtapa(idEtapa: string) {
    return getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .innerJoinAndSelect('pregunta.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .innerJoinAndSelect('eag.area', 'area')
      .innerJoinAndSelect('eag.gradoEscolar', 'gradoEscolar')
      .select([
        'etapa.nombre as "etapa"',
        'area.nombre as "area"',
        'gradoEscolar.nombre as "gradoEscolar"',
        'pregunta.tipoPregunta as "tipoPregunta"',
        'pregunta.nivelDificultad as "nivelDificultad"',
        'COUNT(1) as "cantidad"',
      ])
      .where('etapa.id = :idEtapa', { idEtapa })
      .andWhere('pregunta.estado = :estado', { estado: Status.APROBADO })
      .groupBy('etapa.nombre')
      .addGroupBy('area.nombre')
      .addGroupBy('gradoEscolar.nombre')
      .addGroupBy('pregunta.tipoPregunta')
      .addGroupBy('pregunta.nivelDificultad')
      .getRawMany();
  }

  resumenPreguntasPorEstadoPorEtapa(idEtapa: string) {
    return getRepository(Pregunta)
      .createQueryBuilder('pregunta')
      .innerJoinAndSelect('pregunta.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .innerJoinAndSelect('eag.area', 'area')
      .innerJoinAndSelect('eag.gradoEscolar', 'gradoEscolar')
      .select([
        'etapa.nombre as "etapa"',
        'area.nombre as "area"',
        'gradoEscolar.nombre as "gradoEscolar"',
        'pregunta.estado as "estado"',
        'COUNT(1) as "cantidad"',
      ])
      .where('etapa.id = :idEtapa', { idEtapa })
      .andWhere('pregunta.estado != :estado', { estado: Status.ANULADO })
      .groupBy('etapa.nombre')
      .addGroupBy('area.nombre')
      .addGroupBy('gradoEscolar.nombre')
      .addGroupBy('pregunta.estado')
      .getRawMany();
  }

  // Metodo actualizar respuestas o estado (impugnacion)
  actualizarPreguntaImpugnada(idPregunta: string, params: any) {
    return getRepository(Pregunta)
      .createQueryBuilder()
      .update(Pregunta)
      .set({ respuestas: params.respuestas, estado: params.estado })
      .where('id = :id', { id: idPregunta })
      .andWhere('(estado = :creado OR estado =:observado)', {
        creado: Status.APROBADO,
        observado: Status.OBSERVADO,
      })
      .execute();
  }
}

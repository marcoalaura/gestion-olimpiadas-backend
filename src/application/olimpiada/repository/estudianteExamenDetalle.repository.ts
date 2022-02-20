import { EntityRepository, getRepository, Repository } from 'typeorm';

import { EstudianteExamenDetalle } from '../entity/EstudianteExamenDetalle.entity';
import { Status } from '../../../common/constants';
@EntityRepository(EstudianteExamenDetalle)
export class EstudianteExamenDetalleRepository extends Repository<EstudianteExamenDetalle> {
  listarPreguntasPorIdExamen(idExamen: string) {
    return getRepository(EstudianteExamenDetalle)
      .createQueryBuilder('eed')
      .innerJoinAndSelect('eed.estudianteExamen', 'ee')
      .innerJoinAndSelect('eed.pregunta', 'p')
      .select([
        'eed.id AS id',
        'p.tipoPregunta AS "tipoPregunta"',
        'p.tipoRespuesta AS "tipoRespuesta"',
        'p.textoPregunta AS "textoPregunta"',
        'p.imagenPregunta AS "imagenPregunta"',
        'p.opciones AS opciones',
        'eed.respuestas AS respuestas',
      ])
      .where('ee.id = :id', { id: idExamen })
      .getRawMany();
  }

  listarPreguntasPorIdExamenParaCalificar(idExamen: string) {
    return getRepository(EstudianteExamenDetalle)
      .createQueryBuilder('eed')
      .innerJoinAndSelect('eed.estudianteExamen', 'ee')
      .innerJoinAndSelect('eed.pregunta', 'p')
      .innerJoinAndSelect('p.etapaAreaGrado', 'eag')
      .select([
        'eed.id',
        'p.tipoPregunta',
        'p.tipoRespuesta',
        'p.textoPregunta',
        'p.imagenPregunta',
        'p.nivelDificultad',
        'p.opciones',
        'p.respuestas',
        'p.estado',
        'eed.respuestas',
        'eed.fechaActualizacion',
        'eag',
      ])
      .where('ee.id = :id', { id: idExamen })
      .getMany();
  }

  encontrarRespuesta(id: string) {
    return getRepository(EstudianteExamenDetalle)
      .createQueryBuilder('eed')
      .innerJoinAndSelect('eed.estudianteExamen', 'ee')
      .select([
        'eed.id',
        'eed.respuestas',
        'eed.estado',
        'ee.id',
        'ee.fechaInicio',
        'ee.fechaFin',
        'ee.fechaConclusion',
        'ee.estado',
      ])
      .where('eed.id = :id', { id })
      .andWhere('eed.estado = :estado1', { estado1: Status.ACTIVE })
      .andWhere('ee.estado = :estado2', { estado2: Status.EN_PROCESO })
      .getOne();
  }

  encontrarRespuestaOffline(id: string) {
    return getRepository(EstudianteExamenDetalle)
      .createQueryBuilder('estudianteExamenDetalle')
      .innerJoinAndSelect('estudianteExamenDetalle.estudianteExamen', 'ee')
      .select([
        'estudianteExamenDetalle.id',
        'estudianteExamenDetalle.respuestas',
        'estudianteExamenDetalle.estado',
        'ee.id',
        'ee.fechaInicio',
        'ee.fechaFin',
        'ee.fechaConclusion',
        'ee.estado',
      ])
      .where('estudianteExamenDetalle.id = :id', { id })
      .andWhere('estudianteExamenDetalle.estado = :estado1', {
        estado1: Status.ACTIVE,
      })
      .getOne();
  }
  crear(params: any) {
    return this.createQueryBuilder('estudianteExamenDetalle')
      .insert()
      .into(EstudianteExamenDetalle)
      .values({
        id: params.id,
        respuestas: null,
        puntaje: null,
        estado: Status.ACTIVE,
        idEstudianteExamen: params.idEstudianteExamen,
        idPregunta: params.idPregunta,
        fechaCreacion: new Date(),
        usuarioCreacion: params.usuarioAuditoria,
      })
      .execute();
  }

  actualizarRespuesta(id: string, datos: any, params: any) {
    return getRepository(EstudianteExamenDetalle)
      .createQueryBuilder()
      .update()
      .set({
        respuestas: datos.respuestas,
        usuarioActualizacion: params.usuarioAuditoria,
      })
      .where('id = :id', { id })
      .execute();
  }

  actualizarRespuestaOffline(
    id: string,
    datos: any,
    usuarioActualizacion: string,
  ) {
    return this.createQueryBuilder('estudianteExamenDetalle')
      .update()
      .set({
        respuestas: datos.respuestas,
        fechaActualizacion: datos.fechaActualizacion,
        usuarioActualizacion,
      })
      .where('id = :id', { id })
      .execute();
  }

  buscarPorExamenYPregunta(idExamen: string, idPregunta: string) {
    return this.createQueryBuilder('eed')
      .select(['eed.id', 'eed.estado'])
      .where('eed.idEstudianteExamen = :idExamen', { idExamen })
      .andWhere('eed.idPregunta = :idPregunta', { idPregunta })
      .getOne();
  }

  cantidadPreguntas(idExamen: string) {
    return getRepository(EstudianteExamenDetalle)
      .createQueryBuilder('eed')
      .select(['count(1) as "totalPreguntas"'])
      .where('eed.idEstudianteExamen = :idExamen', { idExamen })
      .andWhere('eed.estado != :estado', { estado: Status.ANULADO })
      .getRawOne();
  }

  cantidadRespuestas(idExamen: string) {
    return getRepository(EstudianteExamenDetalle)
      .createQueryBuilder('eed')
      .select(['count(1) as "totalRespuestas"'])
      .where('eed.idEstudianteExamen = :idExamen', { idExamen })
      .andWhere('eed.estado != :estado', { estado: Status.ANULADO })
      .andWhere('eed.respuestas is not null')
      .getRawOne();
  }

  // impugnacion
  listarExamenesPorIdPreguntaParaImpugnar(idPregunta: string) {
    return getRepository(EstudianteExamenDetalle)
      .createQueryBuilder('eed')
      .innerJoinAndSelect('eed.estudianteExamen', 'ee')
      .select(['eed.id', 'ee.id', 'ee.estado'])
      .where('eed.id_pregunta = :id', { id: idPregunta })
      .getMany();
  }
}

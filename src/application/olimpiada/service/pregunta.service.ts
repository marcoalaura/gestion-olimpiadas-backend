import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';

import { EtapaAreaGrado } from '../entity/EtapaAreaGrado.entity';
import { PreguntaRepository } from '../repository/pregunta.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';

import { maquinaEstadosPregunta } from '../../../common/lib/maquinaEstados.module';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { TotalRowsResponseDto } from '../../../common/dto/total-rows-response.dto';
import {
  Status,
  TipoRespuesta,
  Transition,
  Opciones,
  OpcionesFalsoVerdadero,
  MAX_CARACTERES_TEXTO_PREGUNTA,
  MAX_CARACTERES_OPCIONES,
  MIN_CANTIDAD_OPCIONES,
  MIN_CANTIDAD_RESPUESTAS_SIMPLE,
  MIN_CANTIDAD_RESPUESTAS_MULTIPLE,
} from '../../../common/constants';
import { EtapaService } from '../service/etapa.service';
import { isSubArray } from '../../../common/lib/array.module';
import { Rol } from '../../../common/constants';
import { EstudianteExamen } from '../entity/EstudianteExamen.entity';

@Injectable()
export class PreguntaService {
  hitosCargaVerificacion = [Status.CONFIGURACION_COMPETENCIA];
  hitosImpugnacion = [Status.IMPUGNACION_PREGUNTAS_RESPUESTAS];
  constructor(
    @InjectRepository(PreguntaRepository)
    private readonly preguntaRepository: PreguntaRepository,
    private readonly etapaService: EtapaService,
    @InjectRepository(EstudianteExamenDetalleRepository)
    private readonly estudianteExamenDetalleRepository: EstudianteExamenDetalleRepository,
    @InjectRepository(EstudianteExamenRepository)
    private readonly estudianteExamenRepository: EstudianteExamenRepository,
  ) {}

  /**
   * Metodo para listar preguntas por una etapa-area-grado
   * @param idEtapaAreaGrado identificador de la etapa-area-grado
   * @param paginacionQueryDto query-params para paginacion
   * @returns lista de preguntas
   */
  async listarPreguntas(
    idEtapaAreaGrado: string,
    rol: string,
    usuarioAuditoria: string,
    paginacionQueryDto: PaginacionQueryDto,
  ): Promise<TotalRowsResponseDto> {
    if (
      !(
        Rol.COMITE_DOCENTE_CARGA ||
        Rol.COMITE_DOCENTE_VERIFICADOR ||
        Rol.ADMINISTRADOR ||
        Rol.SUPER_ADMIN
      )
    ) {
      throw new UnauthorizedException(
        'El rol no tiene los permisos para ejecutar la accion',
      );
    }
    const result = await this.preguntaRepository.listarPorEtapaAreaGrado(
      idEtapaAreaGrado,
      rol,
      usuarioAuditoria,
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  /**
   * Metodo para crear una pregunta
   * @param params parametros necesarios
   * @returns Object retorna un objeto con el id del registro creado
   */
  async crearPregunta(params: any) {
    // validar que si es una pregunta de seleccion tenga opciones
    this.validarDatosPregunta(params);
    await this.etapaService.validarVigenciaDeLaEtapa(
      params.idEtapaAreaGrado,
      this.hitosCargaVerificacion,
    );
    const data = { ...params };
    const eag = new EtapaAreaGrado();
    eag.id = data.idEtapaAreaGrado;
    delete data.idEtapaAreaGrado;
    data.id = uuid.v4();
    data.estado = Status.CREATE;
    data.etapaAreaGrado = eag;
    await this.preguntaRepository.crear(data);
    return { id: data.id };
  }

  /**
   * Metodo para actualizar los datos de una pregunta
   * @param params datos actualizar
   * @returns Object retorna un objeto con el id de la pregunta
   */
  async actualizarPregunta(params: any) {
    this.validarDatosPregunta(params);
    await this.validarActualizarDatos(params.idPregunta);
    const data: any = {};
    if (params.tipoPregunta) data.tipoPregunta = params.tipoPregunta;
    if (params.nivelDificultad) data.nivelDificultad = params.nivelDificultad;
    if (params.textoPregunta) {
      data.textoPregunta = params.textoPregunta;
      data.imagenPregunta = null;
    }
    if (params.imagenPregunta) {
      data.imagenPregunta = params.imagenPregunta;
      data.textoPregunta = null;
    }
    if (params.tipoRespuesta) data.tipoRespuesta = params.tipoRespuesta;
    if (params.opciones) data.opciones = params.opciones;
    if (params.respuestas) data.respuestas = params.respuestas;
    if (
      params.tipoRespuesta &&
      params.tipoRespuesta === TipoRespuesta.FALSO_VERDADERO
    )
      data.opciones = null;
    if (Object.keys(data).length === 0) {
      throw new PreconditionFailedException(
        'No se tienen datos para actualizar',
      );
    }
    await this.preguntaRepository.actualizarPregunta(params.idPregunta, data);
    return { id: params.idPregunta };
  }

  /**
   * Metodo para actualizar el estado de una pregunta
   * @param params objeto con los parametros necesarios
   * @returns Object resultado de la actualizacion
   */
  async actualizarEstado(params: any) {
    const nuevoEstado = await this.validarActualizarEstado(
      params.idPregunta,
      params?.operacion?.toLowerCase(),
    );
    const data: any = {};
    data.id = params.idPregunta;
    data.estado = nuevoEstado;
    if (nuevoEstado === Status.OBSERVADO) {
      if (!params.observacion) {
        throw new PreconditionFailedException(
          'El parametro observación es requerido',
        );
      }
      data.observacion = params.observacion;
    }
    if (nuevoEstado === Status.APROBADO) {
      data.usuarioVerificacion = params.usuarioAuditoria;
    }
    // Anular pregunta y limpiar puntajes (impugnacion)
    if (nuevoEstado === Status.ANULADO) {
      const preguntas = await this.estudianteExamenDetalleRepository.listarExamenesPorIdPreguntaParaImpugnar(
        data.id,
      );
      for (const examen of preguntas) {
        const p = await this.estudianteExamenRepository.update(
          {
            id: examen.estudianteExamen.id,
          },
          {
            puntaje: null,
          },
        );
        console.log('pp', p);
      }
    }
    data.usuarioActualizacion = params.usuarioAuditoria;
    await this.preguntaRepository.actualizarEstado(data);
    return { id: data.id };
  }

  async enviarPreguntasLote(params: any) {
    await this.etapaService.validarVigenciaDeLaEtapa(
      params.idEtapaAreaGrado,
      this.hitosCargaVerificacion,
    );
    const result = await this.preguntaRepository.enviarPreguntasPorUsuario(
      params.idEtapaAreaGrado,
      params.usuarioAuditoria,
    );
    return { affected: result.affected };
  }

  /**
   * Metodo para eliminar una pregunta
   * para poder eliminar este debe estar en estado CREADO
   * @param idPregunta identificador de la pregunta
   * @param params objeto con los datos de la sesion del usuario
   */
  async eliminarPregunta(idPregunta: string, params: any) {
    const nuevoEstado = await this.validarActualizarEstado(
      idPregunta,
      Transition.ELIMINAR,
    );
    const data: any = {};
    data.id = idPregunta;
    data.estado = nuevoEstado;
    data.usuarioActualizacion = params.usuarioAuditoria;
    await this.preguntaRepository.actualizarEstado(data);
    return null;
  }

  /**
   * Metodo para verificar el cambio de estado de una pregunta
   * @param idPregunta identificador de la pregunta
   * @param operacion operacion a realizar (enviar, activar, ...)
   * @returns nuevoEstado retorna el estado al que debe cambiar segun la operacion
   */
  async validarActualizarEstado(idPregunta: string, operacion: string) {
    const pregunta = await this.obtenerPreguntaPorId(idPregunta);

    const nuevoEstado = maquinaEstadosPregunta(
      pregunta.estado,
    ).executeTransition(operacion);

    await this.etapaService.validarVigenciaDeLaEtapa(
      pregunta.idEtapaAreaGrado,
      this.hitosCargaVerificacion,
    );
    return nuevoEstado;
  }

  async validarActualizarDatos(idPregunta: string) {
    const pregunta = await this.obtenerPreguntaPorId(idPregunta);
    if (
      !(
        pregunta.estado === Status.CREATE ||
        pregunta.estado === Status.OBSERVADO
      )
    ) {
      throw new PreconditionFailedException(
        `No se puede ejecutar la solicitud, la pregunta se encuentra en estado: ${pregunta.estado}`,
      );
    }

    await this.etapaService.validarVigenciaDeLaEtapa(
      pregunta.idEtapaAreaGrado,
      this.hitosCargaVerificacion,
    );
    return null;
  }

  async obtenerPreguntaPorId(idPregunta: string) {
    const pregunta = await this.preguntaRepository.buscarPorId(idPregunta);
    if (!pregunta || pregunta?.estado === Status.ELIMINADO) {
      throw new NotFoundException();
    }
    return pregunta;
  }

  validarDatosPregunta(params: any) {
    // validar texto o imagen
    if (!params.textoPregunta && !params.imagenPregunta) {
      throw new PreconditionFailedException(
        'La pregunta debe contener un texto o imagen',
      );
    }
    if (params?.textoPregunta?.length > MAX_CARACTERES_TEXTO_PREGUNTA) {
      throw new PreconditionFailedException(
        `El campo texto pregunta no debe exeder los ${MAX_CARACTERES_TEXTO_PREGUNTA} caracteres`,
      );
    }
    // validar tipo pregunta
    if (params.tipoRespuesta === TipoRespuesta.FALSO_VERDADERO) {
      if (params.opciones) {
        throw new PreconditionFailedException(
          'El campo opciones debe ser nulo para preguntas falso verdarero',
        );
      }
      if (
        params.respuestas?.length !== 1 ||
        !isSubArray(OpcionesFalsoVerdadero, params.respuestas)
      ) {
        throw new PreconditionFailedException(
          `El parametro respuesta debe contener un valor de falso o verdad`,
        );
      }
    }
    // preguntas de seleccion
    if (params.tipoRespuesta !== TipoRespuesta.FALSO_VERDADERO) {
      if (!params.opciones) {
        throw new PreconditionFailedException(
          'El campo opciones no puede ser null para preguntas de selección',
        );
      }
      const opcionesKey = Object.keys(params.opciones);
      if (opcionesKey.length < MIN_CANTIDAD_OPCIONES) {
        throw new PreconditionFailedException(
          `El campo opciones debe tener almenos ${MIN_CANTIDAD_OPCIONES} elementos para preguntas de selección`,
        );
      }
      if (!isSubArray(Opciones, opcionesKey)) {
        throw new PreconditionFailedException(
          'El campo opciones debe tener elementos del tipo: a, b, c ...',
        );
      }
      if (!isSubArray(opcionesKey, params.respuestas)) {
        throw new PreconditionFailedException(
          'Los valores de las respuestas no son elementos de las opciones',
        );
      }
    }
    // seleccion simple
    if (params.tipoRespuesta === TipoRespuesta.SELECCION_SIMPLE) {
      if (params.respuestas.length !== MIN_CANTIDAD_RESPUESTAS_SIMPLE) {
        throw new PreconditionFailedException(
          `Las preguntas de selección simple deben tener ${MIN_CANTIDAD_RESPUESTAS_SIMPLE} respuesta valida`,
        );
      }
    }
    // seleccion multiple
    if (params.tipoRespuesta === TipoRespuesta.SELECCION_MULTIPLE) {
      if (params.respuestas.length < MIN_CANTIDAD_RESPUESTAS_MULTIPLE) {
        throw new PreconditionFailedException(
          `Las preguntas de selección multiple deben tener al menos ${MIN_CANTIDAD_RESPUESTAS_MULTIPLE} respuestas validas`,
        );
      }
    }
    // validar pregunta imagen
    if (params.imagenPregunta) {
      if (params.textoPregunta) {
        throw new PreconditionFailedException(
          'Las preguntas con imagen no contienen texto de pregunta',
        );
      }
      if (params.tipoRespuesta !== TipoRespuesta.FALSO_VERDADERO) {
        const opcionesKey = Object.keys(params.opciones);
        for (const op of opcionesKey) {
          if (params?.opciones[op]) {
            throw new PreconditionFailedException(
              'Las opciones de una pregunta con imagen solo deben ser los indices',
            );
          }
        }
      }
    }
    // validar texto pregunta
    if (params.textoPregunta) {
      if (params.imagenPregunta) {
        throw new PreconditionFailedException(
          'Las preguntas con texto no tienen imagen asociada',
        );
      }
      if (params.tipoRespuesta !== TipoRespuesta.FALSO_VERDADERO) {
        const opcionesKey = Object.keys(params.opciones);
        for (const op of opcionesKey) {
          if (params?.opciones[op]?.length > MAX_CARACTERES_OPCIONES) {
            throw new PreconditionFailedException(
              `El texto de las opciones no debe exeder los ${MAX_CARACTERES_OPCIONES} caracteres`,
            );
          }
        }
      }
    }
  }

  async resumenPreguntasAprobadasPorEtapa(idEtapa: string) {
    const result = await this.preguntaRepository.resumenPreguntasAprobadasPorEtapa(
      idEtapa,
    );
    return result;
  }

  async resumenPreguntasPorEstadoPorEtapa(idEtapa: string) {
    const result = await this.preguntaRepository.resumenPreguntasPorEstadoPorEtapa(
      idEtapa,
    );
    return result;
  }

  async validarActualizarRespuesta(idPregunta: string) {
    const pregunta = await this.obtenerPreguntaPorId(idPregunta);
    if (
      !(
        pregunta.estado === Status.APROBADO ||
        pregunta.estado === Status.OBSERVADO
      )
    ) {
      throw new PreconditionFailedException(
        `No se puede ejecutar la solicitud, la pregunta se encuentra en estado: ${pregunta.estado}`,
      );
    }

    await this.etapaService.validarVigenciaDeLaEtapa(
      pregunta.idEtapaAreaGrado,
      this.hitosImpugnacion,
    );
    return pregunta;
  }

  /**
   * Metodo para actualizar respuesta de una pregunta impugnada
   * @param params datos actualizar
   * @returns Object retorna un objeto con el id de la pregunta
   */
  async actualizarPreguntaImpugnada(params: any) {
    if (!params.respuestas && !params.estado) {
      throw new PreconditionFailedException(
        'Valor para respuestas ó estado es requerido.',
      );
    }
    if (params.estado !== 'ANULADO' && params.estado !== 'APROBADO') {
      throw new PreconditionFailedException(
        'El estado no es válido, solo puede ser ANULADO.',
      );
    }
    const pregunta = await this.validarActualizarRespuesta(params.idPregunta);
    params.textoPregunta = pregunta.textoPregunta;
    params.imagenPregunta = pregunta.imagenPregunta;
    params.opciones = pregunta.opciones;
    params.tipoRespuesta = pregunta.tipoRespuesta;
    if (params.estado && !params.respuestas)
      params.respuestas = pregunta.respuestas;
    if (typeof params.respuestas === 'string')
      params.respuestas = [params.respuestas];
    this.validarDatosPregunta(params);
    const data: any = {};
    if (params.respuestas) data.respuestas = params.respuestas;
    if (params.estado) data.estado = params.estado;
    if (Object.keys(data).length === 0) {
      throw new PreconditionFailedException(
        'No se tienen datos para actualizar',
      );
    }
    await this.preguntaRepository.actualizarPreguntaImpugnada(
      params.idPregunta,
      data,
    );

    const examenes = await this.estudianteExamenRepository.buscarExamenesConPregunta(
      params.idPregunta,
    );
    const idsExamenes = examenes.map((ee) => {
      const examen = new EstudianteExamen();
      examen.id = ee.id;
      examen.puntaje = null;
      return examen;
    });
    await this.estudianteExamenRepository.save(idsExamenes);
    await this.estudianteExamenDetalleRepository.update(
      {
        idPregunta: params.idPregunta,
      },
      {
        puntaje: null,
      },
    );
    const inscripciones = examenes.map((ee) => {
      const ins = {
        idEstudianteExamen: ee.id,
        ...ee.inscripcion,
      };
      return ins;
    });

    return { id: params.idPregunta, inscripciones };
  }
}

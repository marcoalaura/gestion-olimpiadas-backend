import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartamentoRepository } from '../repository/departamento.repository';
import { DistritoRepository } from '../repository/distrito.repository';
import { ResultadosRepository } from '../repository/resultados.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { tiposEtapa, Status } from '../../../common/constants';
import { Departamento } from '../entity/Departamento.entity';
import { Distrito } from '../entity/Distrito.entity';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { EtapaService } from '../service/etapa.service';
import { ObtencionClasificadosRepository } from '../repository/obtencionClasificados.repository';
import { Connection } from 'typeorm';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';

@Injectable()
export class ObtenerClasificadosService {
  constructor(
    @InjectRepository(ObtencionClasificadosRepository)
    private obtencionClasificadosRepository: ObtencionClasificadosRepository,
    @InjectRepository(EtapaRepository)
    private etapaRepository: EtapaRepository,
    @InjectRepository(DepartamentoRepository)
    private departamentoRepository: DepartamentoRepository,
    @InjectRepository(DistritoRepository)
    private distritoRepository: DistritoRepository,
    @InjectRepository(ResultadosRepository)
    private resultadosRepository: ResultadosRepository,
    readonly etapaService: EtapaService,
    private connection: Connection,
  ) {}
  /**
   * obtiene la lista de clasificados por etapa
   * @param idEtapa string id de la etapa
   * @param usuarioAuditoria string id del usuario actualizador
   * */
  async obtencionClasificados(idEtapa: string, usuarioAuditoria: any) {
    // TODO incluir usuario
    // consultamos la etapa
    const etapa = await this.etapaRepository.findOne(idEtapa, {
      select: ['id', 'tipo', 'estadoPosicionamiento'],
    });
    if (!etapa) {
      throw new EntityNotFoundException(`Etapa no encontrada`);
    }
    // verificamos el estado CLASIFICACION de la etapa
    await this.etapaService.obtenerEtapaVigente(idEtapa, [
      Status.GENERAR_CLASIFICADOS,
    ]);
    // validamos que no vuelva a ejecutar mas de una vez
    if (etapa.estadoPosicionamiento === Status.GENERAR_CLASIFICADOS) {
      throw new PreconditionFailedException(
        'Esta etapa ya cuenta con clasificados.',
      );
    }
    if (etapa.estadoPosicionamiento === Status.CLASIFICACION_PROCESO) {
      throw new PreconditionFailedException(
        `La obtención de clasificados está en proceso`,
      );
    }
    // obtenemos las etapa area grados de la etapa
    const {
      etapaAreaGrados,
    } = await this.obtencionClasificadosRepository.findEtapaAreaGradosByEtapa(
      idEtapa,
    );

    if (!etapaAreaGrados) {
      throw new PreconditionFailedException(
        'No se encuentran Etapa area grados',
      );
    }
    // recuperamos los departamentos si es una etapa departamental
    let departamentos: Departamento[] = [];
    departamentos =
      etapa.tipo === tiposEtapa.DEPARTAMENTAL
        ? await this.departamentoRepository.find({
            select: ['id'],
          })
        : [];
    // recuperamos los distritos si es una etapa distrital
    let distritos: Distrito[] = [];
    distritos =
      etapa.tipo === tiposEtapa.DISTRITAL
        ? await this.distritoRepository.find({
            select: ['id'],
          })
        : [];
    // cambiar el sub estado a en proceso
    await this.etapaRepository.update(idEtapa, {
      estadoPosicionamiento: Status.CLASIFICACION_PROCESO,
    });

    // iteramos las etapas areas grados
    const op = async (transaction) => {
      const obtencionClasificadosRepositoryTransaction = transaction.getCustomRepository(
        ObtencionClasificadosRepository,
      );
      const etapaRepositoryTransaction = transaction.getCustomRepository(
        EtapaRepository,
      );
      for (const eag of etapaAreaGrados) {
        let idsInscripciones: Array<any> = [];
        const reglas = {
          criterioCalificacion: eag.criterioCalificacion,
          puntajeMinimoClasificacion: eag.puntajeMinimoClasificacion,
          criterioMedallero: eag.criterioMedallero,
          cantidadMaximaClasificados: eag.cantidadMaximaClasificados,
        };
        switch (etapa.tipo) {
          case tiposEtapa.DISTRITAL:
            // let cont = 0;
            for (const distrito of distritos) {
              // obtener todos los estudiantes examenes de ese distrito y ese eag
              const examenes = await obtencionClasificadosRepositoryTransaction.recuperarExamenesPorDistrito(
                eag.id,
                distrito.id,
              );
              idsInscripciones = this.evaluarClasificados(examenes, reglas);
              console.log(
                '[inscripciones clasificadas distr:]',
                idsInscripciones,
              );
              await obtencionClasificadosRepositoryTransaction.marcarClasificados(
                idsInscripciones,
                reglas,
                usuarioAuditoria,
              );
            }
            break;
          case tiposEtapa.DEPARTAMENTAL:
            for (const departamento of departamentos) {
              const examenes = await obtencionClasificadosRepositoryTransaction.recuperarExamenesPorDepartamento(
                eag.id,
                departamento.id,
              );
              idsInscripciones = this.evaluarClasificados(examenes, reglas);
              console.log(
                '[inscripciones clasificadas dept:]',
                idsInscripciones,
              );
              await obtencionClasificadosRepositoryTransaction.marcarClasificados(
                idsInscripciones,
                reglas,
                usuarioAuditoria,
              );
            }
            break;
          case tiposEtapa.NACIONAL:
            const examenes = await obtencionClasificadosRepositoryTransaction.recuperarExamenesNacional(
              eag.id,
            );
            idsInscripciones = this.evaluarClasificados(examenes, reglas);
            console.log(
              '[inscripciones clasificadas nacional:]',
              idsInscripciones,
            );
            await obtencionClasificadosRepositoryTransaction.marcarClasificados(
              idsInscripciones,
              reglas,
              usuarioAuditoria,
            );
            break;
          default:
            throw new PreconditionFailedException('Tipo de etapa no valido');
        }
      }

      await obtencionClasificadosRepositoryTransaction.marcarClasificadoEtapa(
        etapa.id,
      );
      await etapaRepositoryTransaction.update(idEtapa, {
        estadoPosicionamiento: Status.GENERAR_CLASIFICADOS,
      });
    };

    const start = async () => {
      try {
        await this.obtencionClasificadosRepository.runTransaction(op);
        await this.resultadosRepository.refrescarResultados();
      } catch (error) {
        console.log(error);
        await this.etapaRepository.update(idEtapa, {
          estadoPosicionamiento: Status.CLASIFICACION_ERROR,
        });
      }
    };

    start();
    return etapaAreaGrados;
  }

  /**
   * aplica las reglas de clasificacion
   * @param examenes array de examenes con sus notas
   * @param reglas objeto con las reglas para la clasificacion
   */
  evaluarClasificados(examenes: Array<any>, reglas: any): Array<any> {
    let clasificados = examenes;
    let condecorados = [];
    let idsInscripcion = [];
    if (reglas && reglas.criterioCalificacion) {
      clasificados = clasificados.filter(
        (examen: any) =>
          parseFloat(examen.puntaje) >=
          parseFloat(reglas.puntajeMinimoClasificacion),
      );
    }
    if (reglas?.criterioMedallero) {
      // extraemos del original
      condecorados = examenes.filter(
        (examen: any) =>
          examen.inscripcion.idMedalleroPosicionManual ||
          examen.inscripcion.idMedalleroPosicionAutomatica,
      );
      // console.log('total condecorados', condecorados.length);
      clasificados.unshift(...condecorados);
    }
    // recuperar solo los ids inscripcion para eliminar items repetidos
    clasificados.map((clasificado: any) => {
      idsInscripcion.push(clasificado.inscripcion.id);
    });
    // eliminar items repetidos
    idsInscripcion = [...new Set(idsInscripcion)];
    if (
      reglas?.cantidadMaximaClasificados &&
      reglas?.cantidadMaximaClasificados > 0
    ) {
      idsInscripcion = idsInscripcion.splice(
        0,
        reglas.cantidadMaximaClasificados,
      );
    }
    // console.log('total isncripciones sin repetir', idsInscripcion);
    return idsInscripcion;
  }

  /**
   * obtiene los clasificados de una etapa
   * @param paginacionQueryDto PaginacionQueryDto
   */
  async obtenerClasificados(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.obtencionClasificadosRepository.obtenerClasificados(
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  /**
   * valida que la etapa tenga generados los clasificados
   * @param idEtapa string id de la etapa
   */
  async verificaEstadoClasificadoGenerado(idEtapa: string): Promise<boolean> {
    const etapa = await this.etapaRepository.findOne(idEtapa);
    if (!etapa) {
      throw new PreconditionFailedException('Etapa inexistente.');
    }
    if (etapa?.estadoPosicionamiento !== Status.GENERAR_CLASIFICADOS) {
      throw new PreconditionFailedException(
        'Esta etapa aun no tiene la lista de clasificados generada.',
      );
    }
    return true;
  }
}

import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartamentoRepository } from '../repository/departamento.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import {
  tiposEtapa,
  tiposAreasGeograficas,
  Status,
  Order,
  RUTA_LOGO_MINISTERIO,
} from '../../../common/constants';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';
import { MedalleroPosicionRuralRepository } from '../repository/medalleroPosicionRural.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { ResultadosRepository } from '../repository/resultados.repository';
import { MedalleroPosicion } from '../entity/MedalleroPosicion.entity';
import { MedalleroPosicionRural } from '../entity/MedalleroPosicionRural.entity';
import { EtapaService } from '../service/etapa.service';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { ObtencionMedalleroRepository } from '../repository/obtencionMedallero.repository';
import { Etapa } from '../entity/Etapa.entity';
import { Connection } from 'typeorm';
import * as carbone from '@alvaromq/carbone';
import * as dayjs from 'dayjs';
import * as fs from 'fs';

@Injectable()
export class ObtencionMedalleroService {
  constructor(
    @InjectRepository(ObtencionMedalleroRepository)
    private obtencionMedalleroRepository: ObtencionMedalleroRepository,
    @InjectRepository(EtapaRepository)
    private etapaRepository: EtapaRepository,
    @InjectRepository(DepartamentoRepository)
    private departamentoRepository: DepartamentoRepository,
    @InjectRepository(MedalleroPosicionRepository)
    private medalleroPosicionRepository: MedalleroPosicionRepository,
    @InjectRepository(MedalleroPosicionRuralRepository)
    private medalleroPosicionRuralRepository: MedalleroPosicionRuralRepository,
    @InjectRepository(InscripcionRepository)
    private inscripcionRepository: InscripcionRepository,
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepository: EtapaAreaGradoRepository,
    @InjectRepository(ResultadosRepository)
    private resultadosRepository: ResultadosRepository,
    private readonly etapaService: EtapaService,
    private connection: Connection,
  ) {}

  async obtencionMedallero(id: string, usuarioAuditoria: string) {
    const etapa = await this.etapaRepository.findOne(id, {
      select: ['tipo', 'estadoPosicionamiento'],
    });
    if (!etapa) {
      throw new PreconditionFailedException(`Etapa con id ${id} no encontrado`);
    }

    if (etapa.estadoPosicionamiento == Status.OBTENCION_MEDALLERO_PROCESO) {
      throw new PreconditionFailedException(`Los medalleros están en proceso`);
    }

    if (
      etapa.estadoPosicionamiento &&
      etapa.estadoPosicionamiento != Status.CALIFICACION &&
      etapa.estadoPosicionamiento != Status.OBTENCION_MEDALLERO_ERROR
    ) {
      throw new PreconditionFailedException(
        `Los medallero ya fueron generados`,
      );
    }

    await this.etapaService.obtenerEtapaVigente(id, [
      Status.OBTENCION_MEDALLERO,
    ]);
    try {
      await this.etapaRepository.update(id, {
        estadoPosicionamiento: Status.OBTENCION_MEDALLERO_PROCESO,
      });
      const [areas, gradoEscolaridad] = await Promise.all([
        await this.obtencionMedalleroRepository.findAreasByEtapa(id),
        await this.obtencionMedalleroRepository.findGradosByEtapa(id),
      ]);
      let departamentos: { id: string }[] = [];
      departamentos =
        etapa.tipo != tiposEtapa.NACIONAL
          ? await this.departamentoRepository.find({ select: ['id'] })
          : [{ id: '0' }];

      await Promise.all(
        departamentos.map(async (departamento) => {
          let distritos: { idDistrito: string }[] = [];
          distritos =
            departamento.id != '0' && etapa.tipo == tiposEtapa.DISTRITAL
              ? await this.obtencionMedalleroRepository.findDistritosByEtapaAndDepartamento(
                  id,
                  departamento.id,
                )
              : [{ idDistrito: '0' }];
          await Promise.all(
            distritos.map(async (distrito) => {
              const datos: {
                id: string;
                idDepartamento: string;
                idDistrito: string;
                areas: { idArea: string }[];
                gradoEscolaridad: { idGradoEscolar: string }[];
              } = {
                id: id,
                idDepartamento: departamento.id,
                idDistrito: distrito.idDistrito,
                areas,
                gradoEscolaridad,
              };
              await this.listarByAreaGrado(datos, usuarioAuditoria);
            }),
          );
        }),
      );
      await this.etapaRepository.update(id, {
        estadoPosicionamiento: Status.OBTENCION_MEDALLERO,
      });
      await this.resultadosRepository.refrescarResultados();
    } catch (error) {
      console.log(error);
      await this.etapaRepository.update(id, {
        estadoPosicionamiento: Status.OBTENCION_MEDALLERO_ERROR,
      });
    }
    return { mensaje: 'Medallero registrado' };
  }

  async listarByAreaGrado(
    datos: {
      id: string;
      idDepartamento: string;
      idDistrito: string;
      areas: { idArea: string }[];
      gradoEscolaridad: { idGradoEscolar: string }[];
    },
    usuarioAuditoria: string,
  ) {
    await Promise.all(
      datos.areas.map(async (area) => {
        await Promise.all(
          datos.gradoEscolaridad.map(async (grado) => {
            const opciones: {
              id: string;
              idDepartamento: string;
              idDistrito: string;
              idArea: string;
              idGradoEscolar: string;
            } = {
              id: datos.id,
              idDepartamento: datos.idDepartamento,
              idDistrito: datos.idDistrito,
              idArea: area.idArea,
              idGradoEscolar: grado.idGradoEscolar,
            };
            const lista = await this.obtencionMedalleroRepository.findListaByNota(
              opciones,
            );
            if (lista.length > 0)
              await this.registrarMedallero(lista, usuarioAuditoria);
          }),
        );
      }),
    );
    return { mensaje: 'Medallero registrado' };
  }

  async registrarMedallero(lista: any[], usuarioAuditoria: string) {
    const idEtapaAreaGrado = lista[0].id_etapa_area_grado;
    const medalleroPosicion = await this.medalleroPosicionRepository.listaPorEtapaAreaGrado(
      idEtapaAreaGrado,
    );

    let ordenMedalleroRural = 1;
    let ordenLista = 0;
    let ordenListaRural = 1;
    let medalleroPosicionRural: MedalleroPosicionRural;
    for (const posicion of medalleroPosicion) {
      medalleroPosicionRural = await this.medalleroPosicionRuralRepository.listaPorEtapaAreaGradoPorOden(
        idEtapaAreaGrado,
        posicion.ordenGalardon,
        ordenMedalleroRural,
      );

      if (!lista[ordenLista]) return 0;

      let idInscripcion = await this.siCumpleNotaMinima(
        idEtapaAreaGrado,
        lista[ordenLista].puntaje,
        lista[ordenLista].id_inscripcion,
      );

      if (
        medalleroPosicionRural &&
        lista[ordenLista].area_geografica == tiposAreasGeograficas.RURAL &&
        +lista[ordenLista].puntaje >= +medalleroPosicionRural.notaMinima
      ) {
        ordenMedalleroRural++;
        idInscripcion = lista[ordenLista].id_inscripcion;
      }
      if (
        medalleroPosicionRural &&
        medalleroPosicionRural.posicionMinima == ordenListaRural &&
        lista[ordenLista].area_geografica == tiposAreasGeograficas.URBANO
      ) {
        const rural = this.buscarRural(
          lista,
          medalleroPosicionRural,
          ordenLista,
        );
        if (rural.existeRural == true) {
          idInscripcion = lista[rural.i - 1].id_inscripcion;
          lista.splice(rural.i - 1, 1);
          ordenLista--;
        }
        ordenMedalleroRural++;
      }

      await this.inscripcionMedallero(
        idInscripcion,
        posicion,
        usuarioAuditoria,
      );
      ordenLista++;
      ordenListaRural++;
    }
    return { mensaje: 'Medallero registrado' };
  }

  buscarRural(
    lista: any[],
    medalleroPosicionRural: MedalleroPosicionRural,
    ordenLista: number,
  ) {
    let existeRural = false;
    let i = ordenLista + 1;
    while (existeRural == false && i < lista.length) {
      if (
        lista[i].area_geografica == tiposAreasGeograficas.RURAL &&
        +lista[i].puntaje >= +medalleroPosicionRural.notaMinima
      ) {
        existeRural = true;
      }
      i++;
    }
    return {
      existeRural,
      i,
    };
  }

  async siCumpleNotaMinima(
    idEtapaAreaGrado: string,
    puntaje: number,
    idInscripcion: string,
  ) {
    const etapaAreaGrado = await this.etapaAreaGradoRepository.findOne({
      select: ['puntajeMinimoMedallero'],
      where: { id: idEtapaAreaGrado },
    });
    const data =
      (etapaAreaGrado && +etapaAreaGrado.puntajeMinimoMedallero <= +puntaje) ||
      !etapaAreaGrado
        ? idInscripcion
        : '0';
    return data;
  }

  async inscripcionMedallero(
    idInscripcion: string,
    posicion: MedalleroPosicion,
    usuarioAuditoria: string,
  ) {
    if (idInscripcion != '0')
      await this.inscripcionRepository.update(idInscripcion, {
        idMedalleroPosicionAutomatica: posicion,
        usuarioActualizacion: usuarioAuditoria,
      });
  }

  async listarMedallerosGenerados(
    paginacionQueryDto: PaginacionQueryDto,
    nivel: any,
  ) {
    const etapa = await this.etapaRepository.findOne(nivel.idEtapa, {
      select: ['tipo', 'comiteDesempate', 'estado', 'estadoPosicionamiento'],
    });
    if (
      !etapa ||
      etapa.estadoPosicionamiento == Status.OBTENCION_MEDALLERO_ERROR ||
      etapa.estadoPosicionamiento == Status.CALIFICACION ||
      !etapa.estadoPosicionamiento
    ) {
      return { total: -1, filas: [] };
    }
    const medalleros = await this.obtencionMedalleroRepository.listarMedallerosGenerados(
      nivel,
      paginacionQueryDto,
      etapa.tipo,
    );
    await Promise.all(
      medalleros.map(
        async (medallero: {
          id_etapa_area_grado: string;
          id_departamento: string;
          id_distrito: string;
          estudiantes: number;
          estado_medallero: boolean;
        }) => {
          const listas = await this.listarMedallero(
            medallero.id_etapa_area_grado,
            medallero?.id_departamento,
            medallero?.id_distrito,
          );
          medallero.estudiantes = listas.length;
          if (etapa.comiteDesempate) {
            const empates = await this.buscarEmpatesEnMedallero(listas);
            medallero.estado_medallero =
              empates && empates.length > 0 ? false : true;
          } else medallero.estado_medallero = true;
        },
      ),
    );
    const rowsTotal =
      medalleros.length > 0 ? parseInt(medalleros[0].rows_total) : 0;
    return {
      total: rowsTotal,
      filas: medalleros,
      etapaTipo: etapa.tipo,
      etapaEstado: etapa.estado,
      etapaEstadoPosicionamiento: etapa.estadoPosicionamiento,
      nivel,
    };
  }

  async listarMedallero(
    idEtapaAreaGrado: string,
    idDepartamento?: string,
    idDistrito?: string,
  ) {
    const medalleroPosicion = await this.medalleroPosicionRepository.find({
      select: ['id', 'ordenGalardon', 'denominativo'],
      where: { idEtapaAreaGrado, estado: Status.ACTIVE },
      order: { ordenGalardon: 'ASC' },
    });
    const listaMedallero = [];
    for (const posicion of medalleroPosicion) {
      const estudiante = await this.findDatosPosicion(
        posicion.id,
        idDepartamento,
        idDistrito,
      );
      if (estudiante) {
        listaMedallero.push(estudiante);
      }
    }
    return listaMedallero;
  }

  async findDatosPosicion(
    idPosicion: string,
    idDepartamento?: string,
    idDistrito?: string,
  ) {
    const datos: {
      idPosicion: string;
      idDepartamento: string;
      idDistrito: string;
    } = {
      idPosicion,
      idDepartamento,
      idDistrito,
    };
    let estudiante = await this.obtencionMedalleroRepository.findDatosPosicion(
      datos,
      'manual',
    );
    if (!estudiante) {
      estudiante = await this.obtencionMedalleroRepository.findDatosPosicion(
        datos,
        'automatico',
      );
    }
    return estudiante ? estudiante : null;
  }

  async buscarEmpatesEnMedallero(listas: any[]) {
    const listaAutomatico = [];
    let empate = [];
    for (const lista of listas) {
      if (lista.seleccion == 0)
        listaAutomatico.push({
          puntaje: lista.ee_puntaje,
        });
    }

    let empates = [];
    if (listaAutomatico.length > 1) {
      const busqueda = listaAutomatico.reduce((acc, r) => {
        const clave = JSON.stringify(r);
        acc[clave] = ++acc[clave] || 0;
        return acc;
      }, {});
      empates = listaAutomatico.filter((p) => {
        return busqueda[JSON.stringify(p)];
      });
      if (empates && empates.length > 1) {
        empate = Array.from(new Set(empates.map((s) => s.puntaje))).map(
          (puntaje) => {
            return {
              puntaje: puntaje,
            };
          },
        );
      }
    }
    return empate;
  }

  async listarMedalleroUnico(
    idEtapaAreaGrado: string,
    idDepartamento?: string,
    idDistrito?: string,
  ) {
    const etapa = await this.obtencionMedalleroRepository.findEtapaByEtapaAreaGrado(
      idEtapaAreaGrado,
    );

    this.revisarDatosMedallero(etapa, idDepartamento, idDistrito);

    const posicionesMedallero = await this.listarMedallero(
      idEtapaAreaGrado,
      idDepartamento,
      idDistrito,
    );

    const medalleroCabecera = await this.obtencionMedalleroRepository.medalleroCabecera(
      idEtapaAreaGrado,
    );

    const medalleroPosicionRural = await this.medalleroPosicionRuralRepository.find(
      {
        select: ['orden', 'posicionMaxima', 'posicionMinima', 'notaMinima'],
        where: { idEtapaAreaGrado, estado: Status.ACTIVE },
        order: { orden: Order.ASC },
      },
    );

    let empates = [];
    if (etapa.comiteDesempate)
      empates = await this.buscarEmpatesEnMedallero(posicionesMedallero);
    for (const empate of empates) {
      const estudiantesEmpatados = [];
      for (const posicion of posicionesMedallero) {
        if (empate.puntaje == posicion.ee_puntaje)
          estudiantesEmpatados.push({
            index: posicionesMedallero.indexOf(posicion),
            idMedallero: posicion.m_id,
            ordenGalardno: posicion.m_orden_galardon,
            denominativo: posicion.m_denominativo,
          });
      }

      for (const estudianteEmpatado of estudiantesEmpatados) {
        const estudiante = posicionesMedallero[estudianteEmpatado.index];
        estudiante.empates = estudiantesEmpatados;
      }
    }
    return { posicionesMedallero, medalleroCabecera, medalleroPosicionRural };
  }

  async medalleroComiteDepartamental(usuarioAuditoria: string, body: any) {
    if (!body || body.length < 1) {
      throw new PreconditionFailedException(
        `No existen registros necesarios para modificar el medallero por el COMMITE DEPARTAMENTAL`,
      );
    }
    await this.etapaService.obtenerEtapaVigente(body.idEtapa, [
      Status.DESEMPATE,
    ]);
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const posicion of body.posiciones) {
        await this.inscripcionRepository.update(posicion.idInscripcion, {
          idMedalleroPosicionManual: posicion.idMedallero,
          usuarioActualizacion: usuarioAuditoria,
        });
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
    return 0;
  }

  async getOlimpiadaByEtapa(idEtapa: string) {
    return await this.obtencionMedalleroRepository.getOlimpiadaByEtapa(idEtapa);
  }

  async validarObtencionMedallero(idEtapa: string) {
    const etapa = await this.etapaRepository.findOne(idEtapa, {
      select: ['tipo', 'comiteDesempate', 'estadoPosicionamiento'],
    });

    if (
      !etapa ||
      !etapa.estadoPosicionamiento ||
      (etapa && etapa.estadoPosicionamiento == Status.CALIFICACION)
    )
      throw new PreconditionFailedException(
        `No se puede realizar el cambio de estado a la Etapa, no se generó los medalleros`,
      );

    if (etapa.estadoPosicionamiento == Status.OBTENCION_MEDALLERO_ERROR)
      throw new PreconditionFailedException(
        `No se puede realizar el cambio de estado a la Etapa, existió un error al generar los medalleros, se debe volver a generar los medalleros`,
      );
  }

  async validarDesempates(idEtapa: string) {
    const etapa = await this.etapaRepository.findOne(idEtapa, {
      select: ['tipo', 'comiteDesempate', 'estadoPosicionamiento'],
    });
    let etapaAreaGrados = [];
    let departamentos = [{ id: '0' }];
    if (etapa.comiteDesempate) {
      etapaAreaGrados = await this.etapaAreaGradoRepository.find({
        select: ['id'],
        where: { idEtapa: idEtapa },
      });
      if (etapa.tipo != tiposEtapa.NACIONAL) {
        departamentos = await this.departamentoRepository.find({
          select: ['id'],
        });
      }
    }
    await Promise.all(
      departamentos.map(async (departamento) => {
        await Promise.all(
          etapaAreaGrados.map(async (etapaAreaGrado) => {
            let medallero = [];
            if (departamento.id == '0') {
              medallero = await this.listarMedallero(etapaAreaGrado.id);
              let empates = [];
              empates = await this.buscarEmpatesEnMedallero(medallero);
              if (empates.length > 0)
                throw new PreconditionFailedException(
                  `No se puede realizar el cambio de estado a la Etapa, porque existe medalleros con empates`,
                );
            } else {
              if (
                departamento.id != '0' &&
                etapa.tipo == tiposEtapa.DISTRITAL
              ) {
                let distritos: { idDistrito: string }[] = [];
                distritos = await this.obtencionMedalleroRepository.findDistritosByEtapaAndDepartamento(
                  idEtapa,
                  departamento.id,
                );
                await Promise.all(
                  distritos.map(async (distrito) => {
                    medallero = await this.listarMedallero(
                      etapaAreaGrado.id,
                      departamento.id,
                      distrito.idDistrito,
                    );
                    let empates = [];
                    empates = await this.buscarEmpatesEnMedallero(medallero);
                    if (empates.length > 0)
                      throw new PreconditionFailedException(
                        `No se puede realizar el cambio de estado a la Etapa, porque existe medalleros con empates`,
                      );
                  }),
                );
              } else {
                medallero = await this.listarMedallero(
                  etapaAreaGrado.id,
                  departamento.id,
                );
                let empates = [];
                empates = await this.buscarEmpatesEnMedallero(medallero);
                if (empates.length > 0)
                  throw new PreconditionFailedException(
                    `No se puede realizar el cambio de estado a la Etapa, porque existe medalleros con empates`,
                  );
              }
            }
          }),
        );
      }),
    );
  }

  revisarDatosMedallero(
    etapa: Etapa,
    idDepartamento?: string,
    idDistrito?: string,
  ) {
    if (!etapa) {
      throw new PreconditionFailedException(`Etapa no encontrado`);
    }
    if (etapa.tipo == tiposEtapa.DISTRITAL) {
      if (!idDepartamento && !idDistrito)
        throw new PreconditionFailedException(
          `Debe existir el Departamento y el Distrito ya que la etapa es DISTRITAL`,
        );
    }

    if (etapa.tipo == tiposEtapa.DEPARTAMENTAL) {
      if (!idDepartamento)
        throw new PreconditionFailedException(
          `Debe existir el Departamento ya que la etapa es DEPARTAMENTAL`,
        );
      if (idDistrito)
        throw new PreconditionFailedException(
          `No debe existir el Distrito ya que la etapa es DEPARTAMENTAL`,
        );
    }

    if (etapa.tipo == tiposEtapa.NACIONAL) {
      if (idDistrito)
        throw new PreconditionFailedException(
          `No debe existir el Distrito ya que la etapa es NACIONAL`,
        );
      if (idDepartamento)
        throw new PreconditionFailedException(
          `No debe existir el Departamento ya que la etapa es NACIONAL`,
        );
    }
  }

  async acta(
    idEtapa: string,
    idArea: string,
    idDepartamento?: string,
  ): Promise<string> {
    const options = {
      lang: 'es-bo',
      convertTo: 'pdf',
    };
    const body = await this.obtencionMedalleroRepository.acta(
      idEtapa,
      idArea,
      idDepartamento,
    );

    if (body.length <= 0)
      throw new PreconditionFailedException(
        `No existe ningun registro para visualizar`,
      );

    let subtitulo = `${body[0].nombreEtapa.toUpperCase()} (${body[0].tipoEtapa.toUpperCase()})`;
    if (body[0].tipoEtapa != tiposEtapa.NACIONAL)
      subtitulo = `${subtitulo} - ${body[0].nombreDepartamento.toUpperCase()}`;

    const gradosEscolares = body.reduce((acc, item) => {
      if (!acc.includes(item.nombreGradoEscolar)) {
        acc.push(item.nombreGradoEscolar);
      }
      return acc;
    }, []);

    const cuerpo = [];
    for (const grado of gradosEscolares) {
      const datos = [];
      for (const dato of body) {
        if (grado == dato.nombreGradoEscolar) {
          datos.push(dato);
        }
      }
      cuerpo.push({
        titulo: grado,
        datos,
      });
    }
    const olimpiada = await this.obtencionMedalleroRepository.getOlimpiadaByEtapa(
      idEtapa,
    );
    const data = {
      encabezado: {
        olimpiada: body[0].nombreOlimpiada.toUpperCase(),
        subtitulo,
        area: body[0].nombreArea.toUpperCase(),
        fecha: dayjs().format('DD/MM/YYYY'),
      },
      cuerpo,
      imageMinisterio: await this.readLogoMinisterio(RUTA_LOGO_MINISTERIO),
      image: olimpiada.logo.split('base64, ')[1],
      leyenda: olimpiada.leyenda,
    };

    return new Promise((resolve, reject) => {
      carbone.render(
        './src/application/olimpiada/templates_carbon/acta.odt',
        data,
        options,
        function (err: any, resultado: { toString: (arg0: string) => any }) {
          if (err) return reject(err);
          const archivoBase64 = resultado.toString('base64');
          resolve(archivoBase64);
        },
      );
    });
  }

  async readLogoMinisterio(ruta: string) {
    return fs.readFileSync(ruta, 'base64');
  }
}

import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReporteQueryDto } from 'src/common/dto/report-query.dto';
import { generarPDF, descargarPDF } from '../../common/lib/pdf.module';
import { OlimpiadaService } from '../olimpiada/olimpiada.service';
import { AreaRepository } from '../olimpiada/repository/area.repository';
import { DepartamentoRepository } from '../olimpiada/repository/departamento.repository';
import { DistritoRepository } from '../olimpiada/repository/distrito.repository';
import { EtapaRepository } from '../olimpiada/repository/etapa.repository';
import { GradoEscolaridadRepository } from '../olimpiada/repository/gradoEscolaridad.repository';
import { ReporteRepository } from './reporte.repository';
import * as fs from 'fs';
import { RUTA_LOGO_MINISTERIO, Status } from '../../common/constants';
import { EtapaService } from '../olimpiada/service/etapa.service';
import { CarboneService } from '../../../libs/carbone/src';

const RUTA_TEMPLATE = './src/application/olimpiada/templates_carbon';

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(ReporteRepository)
    readonly reporteRepository: ReporteRepository,
    private olimpiadaService: OlimpiadaService,
    @InjectRepository(EtapaRepository)
    private etapaRepository: EtapaRepository,
    @InjectRepository(AreaRepository)
    private areaRepository: AreaRepository,
    @InjectRepository(DistritoRepository)
    private distritoRepository: DistritoRepository,
    @InjectRepository(DepartamentoRepository)
    private departamentoRepository: DepartamentoRepository,
    @InjectRepository(GradoEscolaridadRepository)
    private gradoEscolaridadRepository: GradoEscolaridadRepository,
    private readonly etapaService: EtapaService,
    private carboneService: CarboneService,
  ) {}

  async generar(plantilla: string, parametros: any, ruta: string, config: any) {
    await generarPDF(plantilla, parametros, ruta, config);
    return ruta;
  }

  async descargarBase64(ruta: string) {
    return descargarPDF(ruta);
  }

  async obtenerFrecuenciasPorcentaje(reporteQueryDto: ReporteQueryDto) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(
      idEtapa,
      Status.IMPUGNACION_PREGUNTAS_RESPUESTAS,
    );

    const { format } = reporteQueryDto;
    const resultado = await this.reporteRepository.frecuenciasPorcentaje(
      reporteQueryDto,
    );
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);
    const nombreArchivo = 'frecuenciasPorcentajes';
    const data = await this.formatData(resultado, filtros);
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  async obtenerPromedioDepartamentoArea(reporteQueryDto: ReporteQueryDto) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(
      idEtapa,
      Status.IMPUGNACION_PREGUNTAS_RESPUESTAS,
    );
    const respuesta = await this.reporteRepository.obtenerPromedioDepartamentoArea(
      reporteQueryDto,
    );
    const promedio = this.addPromedioNacional(respuesta, 'nombre_area');
    const resultado = this.formatDynamicPivot(promedio, 'nombre_area');
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);
    const data = await this.formatData(resultado, filtros);
    const { format } = reporteQueryDto;
    const nombreArchivo = 'obtenerPromedioDepartamentoArea';
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  async obtenerPromedioAnioEscolaridadDepartamentoArea(
    reporteQueryDto: ReporteQueryDto,
  ) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(
      idEtapa,
      Status.IMPUGNACION_PREGUNTAS_RESPUESTAS,
    );

    const respuesta = await this.reporteRepository.obtenerPromedioAnioEscolaridadDepartamentoArea(
      reporteQueryDto,
    );
    const promedio = this.addPromedioNacional(respuesta, 'nombre_area');
    const resultado = this.formatDynamicPivot(promedio, 'nombre_area');
    console.log(JSON.stringify(resultado));
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);
    const data = await this.formatData(resultado, filtros);
    const { format } = reporteQueryDto;
    const nombreArchivo = 'obtenerPromedioAnioEscolaridadDepartamentoArea';
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  async obtenerPreguntas(reporteQueryDto: ReporteQueryDto) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(
      idEtapa,
      Status.CIERRE_PRUEBA_REZAGADOS,
    );

    const respuesta = await this.reporteRepository.obtenerPreguntas(
      reporteQueryDto,
    );
    const resultado = respuesta.map((item: any) => {
      if (!item.pregunta) {
        const nombreArchivo = item.imagen?.split('/').reverse()[0];
        item.pregunta = `${nombreArchivo} (imagen)`;
      }
      // porcentaje
      const porcentaje = (item.correcto * 100) / item.cantidad;
      item.porcentajeCorrectas = porcentaje.toFixed(2);
      return item;
    });
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);
    const data = await this.formatData(resultado, filtros);
    const { format } = reporteQueryDto;
    const nombreArchivo = 'preguntas';
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  async obtenerPreguntasAreaGrado(reporteQueryDto: ReporteQueryDto) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(
      idEtapa,
      Status.CIERRE_PRUEBA_REZAGADOS,
    );

    const respuesta = await this.reporteRepository.obtenerPreguntasAreaGrado(
      reporteQueryDto,
    );
    const resultado = respuesta.map((item: any) => {
      if (!item.pregunta) {
        const nombreArchivo = item.imagen?.split('/').reverse()[0];
        item.pregunta = `${nombreArchivo} (imagen)`;
      }
      // porcentaje
      const porcentaje = (item.correcto * 100) / item.cantidad;
      item.porcentajeCorrectas = porcentaje.toFixed(2);
      return item;
    });
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);
    const data = await this.formatData(resultado, filtros);
    const { format } = reporteQueryDto;
    const nombreArchivo = 'preguntasAreaGrado';
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  async obtenerParticipacion(reporteQueryDto: ReporteQueryDto) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(
      idEtapa,
      // Status.EXAMEN_SEGUN_CRONOGRAMA,
      Status.IMPUGNACION_PREGUNTAS_RESPUESTAS,
    );

    const respuesta = await this.reporteRepository.obtenerParticipacion(
      reporteQueryDto,
    );
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);
    const data = await this.formatData(respuesta, filtros);
    const { format } = reporteQueryDto;
    const nombreArchivo = 'participacion';
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  async obtenerParticipacionTipoPrueba(reporteQueryDto: ReporteQueryDto) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(
      idEtapa,
      // Status.CIERRE_PRUEBA_REZAGADOS,
      Status.IMPUGNACION_PREGUNTAS_RESPUESTAS,
    );

    const respuesta = await this.reporteRepository.obtenerParticipacionTipoPrueba(
      reporteQueryDto,
    );
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);
    const data = await this.formatData(respuesta, filtros);
    const { format } = reporteQueryDto;
    const nombreArchivo = 'participacionTipoPrueba';
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  async obtenerClasificados(reporteQueryDto: ReporteQueryDto) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(
      idEtapa,
      Status.PUBLICACION_RESULTADOS,
    );

    const { format } = reporteQueryDto;
    const resultado = await this.reporteRepository.obtenerClasificados(
      reporteQueryDto,
    );
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);
    const data = await this.formatData(resultado, filtros);
    const nombreArchivo = 'clasificados';
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  addPromedioNacional(respuesta: any, nameFirstColumn: string) {
    try {
      const resp = respuesta.map((item: any) => {
        let sumaNacional = 0;
        let contador = 0;
        for (const i in item) {
          if (!item[i] && i !== nameFirstColumn) {
            item[i] = '-';
          }
          if (i !== nameFirstColumn && item[i] !== '-') {
            sumaNacional += parseFloat(item[i]);
            contador += 1;
          }
        }
        const promedioNacional = sumaNacional / contador;
        item['NACIONAL'] = promedioNacional.toFixed(2);
        return item;
      });
      return resp;
    } catch (error) {
      throw new PreconditionFailedException(error.message);
    }
  }

  async obtenerNombresFiltros(reporteQueryDto: ReporteQueryDto) {
    const {
      idOlimpiada,
      idEtapa,
      idArea,
      idDistrito,
      idDepartamento,
      idGradoEscolar,
    } = reporteQueryDto;

    const filtros: any = {
      olimpiada: 'TODOS',
      etapa: 'TODOS',
      area: 'TODOS',
      distrito: 'TODOS',
      departamento: 'TODOS',
      gradoEscolar: 'TODOS',
      logo: null,
      leyenda: '',
    };

    if (idOlimpiada) {
      const olimpiada = await this.olimpiadaService.buscarPorId(idOlimpiada);
      filtros.olimpiada = olimpiada.nombre.toUpperCase();
      filtros.logo = olimpiada.logo;
      filtros.leyenda = olimpiada.leyenda;
    }
    if (idEtapa) {
      const data = await this.etapaRepository.buscarPorId(idEtapa);
      filtros.etapa = data.nombre.toUpperCase();
    }
    if (idArea) {
      const data = await this.areaRepository.buscarPorId(idArea);
      filtros.area = data.nombre.toUpperCase();
    }
    if (idDistrito) {
      const data = await this.distritoRepository.buscarPorId(idDistrito);
      filtros.distrito = data.nombre.toUpperCase();
    }
    if (idDepartamento) {
      const data = await this.departamentoRepository.buscarPorId(
        idDepartamento,
      );
      filtros.departamento = data.nombre.toUpperCase();
    }
    if (idGradoEscolar) {
      const data = await this.gradoEscolaridadRepository.buscarPorId(
        idGradoEscolar,
      );
      filtros.gradoEscolar = data.nombre.toUpperCase();
    }
    return filtros;
  }

  async obtenerMedallerosArea(reporteQueryDto: ReporteQueryDto) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(idEtapa, Status.CLOSED);

    const respuesta = await this.reporteRepository.obtenerMedallerosArea(
      reporteQueryDto,
    );

    const cuerpo = this.obtenerMedalleroFormateado(respuesta);

    const nombreArchivo = 'obtenerMedalleroArea';
    const { format } = reporteQueryDto;
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);

    const data = await this.formatData(cuerpo, filtros);
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  async obtenerMedallerosDepartamento(reporteQueryDto: ReporteQueryDto) {
    const { idEtapa } = reporteQueryDto;
    await this.etapaService.habilitarPorEtapaMinima(idEtapa, Status.CLOSED);

    const departamentos = await this.departamentoRepository.find({
      select: ['id', 'nombre'],
    });

    departamentos.push({
      id: null,
      nombre: 'Bolivia',
      codigo: '0',
      distritos: [],
      usuarioDepartamento: [],
    });
    const cuerpo = [];
    for (const departamento of departamentos) {
      const respuesta = await this.reporteRepository.obtenerMedallerosArea(
        reporteQueryDto,
        departamento.id,
      );
      const resp = this.obtenerMedalleroFormateado(respuesta);
      cuerpo.push({
        departamento: departamento.nombre,
        cuerpo: resp,
      });
    }
    const filtros = await this.obtenerNombresFiltros(reporteQueryDto);
    const data = await this.formatData(cuerpo, filtros);
    const { format } = reporteQueryDto;
    const nombreArchivo = 'obtenerMedalleroDepartamento';
    return this.carboneService.getBufferReporte(
      RUTA_TEMPLATE,
      nombreArchivo,
      data,
      format,
    );
  }

  obtenerMedalleroFormateado(respuesta: any[]) {
    const resp = respuesta.reduce(
      (acc: any[], item: { sub_grupo_medallero: any }) => {
        if (!acc.includes(item.sub_grupo_medallero)) {
          acc.push(item.sub_grupo_medallero);
        }
        return acc;
      },
      [],
    );

    const cuerpo = [];
    for (const res of resp) {
      const datos = [];
      const total = {
        nombre_area: 'TOTAL',
        masculino: 0,
        femenino: 0,
        fiscal: 0,
        privada: 0,
        convenio: 0,
        urbano: 0,
        rural: 0,
        total: 0,
      };
      for (const dato of respuesta) {
        if (res == dato.sub_grupo_medallero) {
          datos.push(dato);
          console.log(dato);
          total['masculino'] = +total['masculino'] + +dato.masculino;
          total['femenino'] = +total['femenino'] + +dato.femenino;
          total['fiscal'] = +total['fiscal'] + +dato.fiscal;
          total['privada'] = +total['privada'] + +dato.privada;
          total['convenio'] = +total['convenio'] + +dato.convenio;
          total['urbano'] = +total['urbano'] + +dato.urbano;
          total['rural'] = +total['rural'] + +dato.rural;
          total['total'] = +total['total'] + +dato.total;
        }
      }
      datos.push(total);
      cuerpo.push({
        sub_grupo_medallero: res,
        datos,
      });
    }
    return cuerpo;
  }

  async readLogo(base64: string) {
    const logo = base64.split('base64,');
    if (logo.length > 1) {
      return logo[1];
    }
    return null;
  }

  async readLogoMinisterio(ruta: string) {
    return fs.readFileSync(ruta, 'base64');
  }

  async formatData(resultado: any, filtros: any) {
    return {
      cuerpo: resultado,
      filtros: filtros,
      image: await this.readLogo(filtros.logo),
      imageMinisterio: await this.readLogoMinisterio(RUTA_LOGO_MINISTERIO),
      leyenda: filtros.leyenda,
    };
  }

  /*
   * Funcion que retorna un array de la siguiente forma
   * [
        {
        "fila":"FÍSICA",
        "contenido":[
           {
           "nombre":"PRIMERO DE SECUNDARIA",
           "valor":0
           },
          ]
        }
     ] */
  formatDynamicPivot(arrayPivot: [], nombreCampo: string) {
    return arrayPivot.map((item: any) => {
      const row: any = {};
      const arrayData: any = [];
      for (const key in item) {
        if (key === nombreCampo) {
          row.fila = item[key];
        } else {
          arrayData.push({
            nombre: key,
            valor: item[key],
          });
        }
      }
      row.contenido = arrayData;
      return row;
    });
  }
}

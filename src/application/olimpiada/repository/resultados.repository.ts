import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { ResultadosView } from '../entity/Resultados.entity';
import { GetJsonData } from '../../../common/lib/json.module';
import { Status } from '../../../common/constants';

@EntityRepository(ResultadosView)
export class ResultadosRepository extends Repository<ResultadosView> {
  async listar(
    idEtapa: string,
    paginacionQueryDto: PaginacionQueryDto,
    clasificado: string = null,
    medallero: string = null,
    estado: string = null,
  ) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(ResultadosView)
      .createQueryBuilder('r')
      .select([
        'r.id',
        'r.nombres',
        'r.idOlimpiada',
        'r.nombreOlimpiada',
        'r.gestion',
        'r.idEtapaAreaGrado',
        'r.idEtapa',
        'r.nombreEtapa',
        'r.tipoEtapa',
        'r.etapaEstado',
        'r.idArea',
        'r.nombreArea',
        'r.idGradoEscolar',
        'r.nombreGradoEscolar',
        'r.ordenGradoEscolar',
        'r.idDepartamento',
        'r.nombreDepartamento',
        'r.idDistrito',
        'r.nombreDistrito',
        'r.idUnidadEducativa',
        'r.codigoSie',
        'r.nombreUnidadEducativa',
        'r.idEstudiante',
        'r.rude',
        'r.idPersona',
        'r.nroDocumento',
        'r.nombres',
        'r.primerApellido',
        'r.segundoApellido',
        'r.fechaNacimiento',
        'r.clasificado',
        'r.medallero',
        'r.denominacionMedallero',
        'r.subGrupoMedallero',
        'r.ordenGalardonMedallero',
      ])
      .orderBy(`r.nombreArea, r.nombreGradoEscolar, r.ordenGradoEscolar`)
      .addOrderBy(
        `CASE WHEN r.tipoEtapa = 'DEPARTAMENTAL' OR r.tipoEtapa = 'DISTRITAL' THEN r.nombreDepartamento END`,
      )
      .addOrderBy(
        `CASE WHEN r.tipoEtapa = 'DISTRITAL' THEN r.nombreDistrito END`,
      )
      .where('r.idEtapa = :idEtapa', { idEtapa })
      .skip(saltar)
      .take(limite);

    if (parametros?.idEtapaAreaGrado)
      query.andWhere('r.idEtapaAreaGrado = :idEtapaAreaGrado', {
        idEtapaAreaGrado: parametros.idEtapaAreaGrado,
      });

    if (parametros?.idArea)
      query.andWhere('r.idArea = :idArea', {
        idArea: parametros.idArea,
      });

    if (parametros?.idGradoEscolar)
      query.andWhere('r.idGradoEscolar = :idGradoEscolar', {
        idGradoEscolar: parametros.idGradoEscolar,
      });

    if (parametros?.idDepartamento)
      query.andWhere('r.idDepartamento = :idDepartamento', {
        idDepartamento: parametros.idDepartamento,
      });

    if (parametros?.idDistrito)
      query.andWhere('r.idDistrito = :idDistrito', {
        idDistrito: parametros.idDistrito,
      });

    if (parametros?.idUnidadEducativa)
      query.andWhere('r.idUnidadEducativa = :idUnidadEducativa', {
        idUnidadEducativa: parametros.idUnidadEducativa,
      });

    if (parametros?.rude)
      query.andWhere('r.rude = :rude', { rude: parametros.rude });

    if (estado) query.andWhere('r.etapaEstado = :estado', { estado });

    if (clasificado && medallero) {
      query.andWhere(
        '(r.clasificado = :clasificado or r.medallero = :medallero)',
        {
          clasificado,
          medallero,
        },
      );
    } else {
      if (clasificado)
        query.andWhere('r.clasificado = :clasificado', {
          clasificado,
        });
      if (medallero)
        query.andWhere('r.medallero = :medallero', {
          medallero,
        });
    }
    if (medallero) query.addOrderBy(`r.ordenGalardonMedallero`);

    return query.getManyAndCount();
  }

  async listarMedallerosPublico(
    idEAG: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(ResultadosView)
      .createQueryBuilder('r')
      .select([
        'r.nombreDistrito',
        'r.nombreUnidadEducativa',
        'r.rude',
        'r.clasificado',
        'r.denominacionMedallero',
      ])
      .where('r.idEtapaAreaGrado = :idEAG', {
        idEAG,
      })
      .andWhere('(r.etapaEstado = :publicado or r.etapaEstado = :cerrado)', {
        publicado: Status.PUBLICACION_RESULTADOS,
        cerrado: Status.CLOSED,
      })
      .andWhere('r.medallero = :si', {
        si: 'SI',
      })
      .addOrderBy(
        `CASE WHEN r.tipoEtapa = 'DEPARTAMENTAL' OR r.tipoEtapa = 'DISTRITAL' THEN r.nombreDepartamento END`,
      )
      .addOrderBy(
        `CASE WHEN r.tipoEtapa = 'DISTRITAL' THEN r.nombreDistrito END`,
      )
      .addOrderBy(`r.ordenGalardonMedallero`)
      .skip(saltar)
      .take(limite);

    if (parametros?.idDepartamento)
      query.andWhere('r.idDepartamento = :idDepartamento', {
        idDepartamento: parametros.idDepartamento,
      });

    if (parametros?.idDistrito)
      query.andWhere('r.idDistrito = :idDistrito', {
        idDistrito: parametros.idDistrito,
      });

    if (parametros?.idUnidadEducativa)
      query.andWhere('r.idUnidadEducativa = :idUnidadEducativa', {
        idUnidadEducativa: parametros.idUnidadEducativa,
      });

    if (parametros?.rude)
      query.andWhere('r.rude = :rude', { rude: parametros.rude });

    return query.getManyAndCount();
  }

  async listarClasificadosPublico(
    idEAG: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(ResultadosView)
      .createQueryBuilder('r')
      .select(['r.nombreDistrito', 'r.nombreUnidadEducativa', 'r.rude'])
      .orderBy(`r.nombreArea, r.nombreGradoEscolar, r.ordenGradoEscolar`)
      .addOrderBy(
        `CASE WHEN r.tipoEtapa = 'DEPARTAMENTAL' OR r.tipoEtapa = 'DISTRITAL' THEN r.nombreDepartamento END`,
      )
      .addOrderBy(
        `CASE WHEN r.tipoEtapa = 'DISTRITAL' THEN r.nombreDistrito END`,
      )
      .where('r.idEtapaAreaGrado = :idEAG', {
        idEAG,
      })
      .andWhere('(r.etapaEstado = :publicado or r.etapaEstado = :cerrado)', {
        publicado: Status.PUBLICACION_RESULTADOS,
        cerrado: Status.CLOSED,
      })
      .andWhere('r.clasificado = :si', {
        si: 'SI',
      })
      .skip(saltar)
      .take(limite);

    if (parametros?.idDepartamento)
      query.andWhere('r.idDepartamento = :idDepartamento', {
        idDepartamento: parametros.idDepartamento,
      });

    if (parametros?.idDistrito)
      query.andWhere('r.idDistrito = :idDistrito', {
        idDistrito: parametros.idDistrito,
      });

    if (parametros?.idUnidadEducativa)
      query.andWhere('r.idUnidadEducativa = :idUnidadEducativa', {
        idUnidadEducativa: parametros.idUnidadEducativa,
      });

    if (parametros?.rude)
      query.andWhere('r.rude = :rude', { rude: parametros.rude });

    return query.getManyAndCount();
  }

  async refrescarResultados(): Promise<any[]> {
    return await this.query(`select sp_refrescar_vista_resultados()`);
  }
}

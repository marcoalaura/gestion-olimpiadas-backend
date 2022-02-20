import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, Repository } from 'typeorm';
import { ParametroDto } from './dto/parametro.dto';
import { Parametro } from './parametro.entity';

@EntityRepository(Parametro)
export class ParametroRepository extends Repository<Parametro> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, orden } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('parametro')
      .select([
        'parametro.id',
        'parametro.codigo',
        'parametro.nombre',
        'parametro.grupo',
      ])
      .orderBy('parametro.nombre', orden)
      .skip(saltar)
      .take(limite)
      .getManyAndCount();
    return queryBuilder;
  }

  async listarPorGrupo(grupo: string) {
    const queryBuilder = await this.createQueryBuilder('parametro')
      .select(['parametro.id', 'parametro.codigo', 'parametro.nombre'])
      .where('parametro.grupo = :grupo', {
        grupo,
      })
      .getMany();
    return queryBuilder;
  }

  async crear(parametroDto: ParametroDto) {
    const { codigo, nombre, grupo, descripcion } = parametroDto;

    const parametro = new Parametro();
    parametro.codigo = codigo;
    parametro.nombre = nombre;
    parametro.grupo = grupo;
    parametro.descripcion = descripcion;

    await this.save(parametro);
    return parametro;
  }
}

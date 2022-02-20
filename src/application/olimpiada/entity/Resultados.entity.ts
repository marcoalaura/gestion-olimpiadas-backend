import { PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'v_resultados',
  materialized: true,
  synchronize: false, // La vista se encuentra en seeder 1624260342851-vista_resultados
})
export class ResultadosView {
  @PrimaryColumn()
  @ViewColumn({ name: 'id' })
  id: string;

  @ViewColumn({ name: 'id_olimpiada' })
  idOlimpiada: string;

  @ViewColumn({ name: 'nombre_olimpiada' })
  nombreOlimpiada: string;

  @ViewColumn({ name: 'gestion' })
  gestion: number;

  @ViewColumn({ name: 'id_departamento' })
  idDepartamento: string;

  @ViewColumn({ name: 'nombre_departamento' })
  nombreDepartamento: string;

  @ViewColumn({ name: 'id_distrito' })
  idDistrito: string;

  @ViewColumn({ name: 'nombre_distrito' })
  nombreDistrito: string;

  @ViewColumn({ name: 'id_unidad_educativa' })
  idUnidadEducativa: string;

  @ViewColumn({ name: 'codigo_sie' })
  codigoSie: number;

  @ViewColumn({ name: 'nombre_unidad_educativa' })
  nombreUnidadEducativa: string;

  @ViewColumn({ name: 'tipo_unidad_educativa' })
  tipoUnidadEducativa: string;

  @ViewColumn({ name: 'area_geografica' })
  areaGeografica: string;

  @ViewColumn({ name: 'id_etapa_area_grado' })
  idEtapaAreaGrado: string;

  @ViewColumn({ name: 'id_etapa' })
  idEtapa: string;

  @ViewColumn({ name: 'nombre_etapa' })
  nombreEtapa: string;

  @ViewColumn({ name: 'tipo_etapa' })
  tipoEtapa: string;

  @ViewColumn({ name: 'etapa_estado' })
  etapaEstado: string;

  @ViewColumn({ name: 'id_area' })
  idArea: string;

  @ViewColumn({ name: 'nombre_area' })
  nombreArea: string;

  @ViewColumn({ name: 'id_grado_escolar' })
  idGradoEscolar: string;

  @ViewColumn({ name: 'nombre_grado_escolar' })
  nombreGradoEscolar: string;

  @ViewColumn({ name: 'orden_grado_escolar' })
  ordenGradoEscolar: number;

  @ViewColumn({ name: 'puntaje' })
  puntaje: number;

  @ViewColumn({ name: 'estado_puntaje' })
  estadoPuntaje: string;

  @ViewColumn({ name: 'id_estudiante' })
  idEstudiante: string;

  @ViewColumn({ name: 'rude' })
  rude: string;

  @ViewColumn({ name: 'id_persona' })
  idPersona: string;

  @ViewColumn({ name: 'nro_documento' })
  nroDocumento: string;

  @ViewColumn({ name: 'nombres' })
  nombres: string;

  @ViewColumn({ name: 'primer_apellido' })
  primerApellido: string;

  @ViewColumn({ name: 'segundo_apellido' })
  segundoApellido: string;

  @ViewColumn({ name: 'fecha_nacimiento' })
  fechaNacimiento: Date;

  @ViewColumn({ name: 'genero' })
  genero: string;

  @ViewColumn({ name: 'clasificado' })
  clasificado: string;

  @ViewColumn({ name: 'id_medallero_posicion' })
  idMedalleroPosicion: string;

  @ViewColumn({ name: 'medallero' })
  medallero: string;

  @ViewColumn({ name: 'denominacion_medallero' })
  denominacionMedallero: string;

  @ViewColumn({ name: 'sub_grupo_medallero' })
  subGrupoMedallero: string;

  @ViewColumn({ name: 'orden_galardon_medallero' })
  ordenGalardonMedallero: string;
}

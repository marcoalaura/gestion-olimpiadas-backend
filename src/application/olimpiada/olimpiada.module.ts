import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OlimpiadaController } from './olimpiada.controller';
import { ExamenController } from './controller/examen.controller';
import { AreaController } from './controller/area.controller';
import { GradoEscolaridadController } from './controller/gradoEscolaridad.controller';
import { EtapaController } from './controller/etapa.controller';
import { EtapaAreaGradoController } from './controller/etapaAreaGrado.controller';
import { DistritoController } from './controller/distrito.controller';
import { UnidadEducativaController } from './controller/unidadEducativa.controller';
import { DepartamentoController } from './controller/departamento.controller';
import { PreguntaController } from './controller/pregunta.controller';
import { EstudianteController } from './controller/estudiante.controller';
import { InscripcionController } from './controller/inscripcion.controller';
import { CalendarioController } from './controller/calendario.controller';
import { ExamenOfflineController } from './controller/examenOffline.controller';
import { CalificacionController } from './controller/calificacion.controller';
import { MedalleroController } from './controller/medallero.controller';
import { ClasificadosController } from './controller/clasificacion.controller';
import { ExamenAdministracionController } from './controller/examenAdministracion.controller';
import { RezagadosController } from './controller/rezagados.controller';
import { PublicoController } from './controller/publico.controller';

import { OlimpiadaService } from './olimpiada.service';
import { ExamenService } from './service/examen.service';
import { AreaService } from './service/area.service';
import { GradoEscolaridadService } from './service/gradoEscolaridad.service';
import { EtapaService } from './service/etapa.service';
import { GestionEtapaService } from './service/gestionEtapa.service';
import { EtapaAreaGradoService } from './service/etapaAreaGrado.service';
import { DistritoService } from './service/distrito.service';
import { UnidadEducativaService } from './service/unidadEducativa.service';
import { DepartamentoService } from './service/departamento.service';
import { EstudianteService } from './service/estudiante.service';
import { PreguntaService } from './service/pregunta.service';
import { InscripcionService } from './service/inscripcion.service';
import { CalendarioService } from './service/calendario.service';
import { ExamenOfflineService } from './service/examenOffline.service';
import { SorteoPreguntaService } from './service/sorteoPregunta.service';
import { CalificacionService } from './service/calificacion.service';
import { MedalleroService } from './service/medallero.service';
import { ObtenerClasificadosService } from './service/obtencion-clasificados.service';
import { ObtencionMedalleroService } from './service/obtencion-medallero.service';
import { PublicacionResultadoService } from './service/publicacionResultado.service';
import { RezagadosService } from './service/rezagados.service';

import { EstudianteRepository } from './repository/estudiante.repository';
import { EstudianteExamenRepository } from './repository/estudianteExamen.repository';
import { EstudianteExamenDetalleRepository } from './repository/estudianteExamenDetalle.repository';
import { OlimpiadaRepository } from './olimpiada.repository';
import { AreaRepository } from './repository/area.repository';
import { ResultadosRepository } from './repository/resultados.repository';
import { GradoEscolaridadRepository } from './repository/gradoEscolaridad.repository';
import { EtapaRepository } from './repository/etapa.repository';
import { EtapaAreaGradoRepository } from './repository/etapaAreaGrado.repository';
import { DistritoRepository } from './repository/distrito.repository';
import { UnidadEducativaRepository } from './repository/unidadEducativa.repository';
import { CalendarioRepository } from './repository/calendario.repository';
import { DepartamentoRepository } from './repository/departamento.repository';
import { PreguntaRepository } from './repository/pregunta.repository';
import { InscripcionRepository } from './repository/inscripcion.repository';
import { SeccionRepository } from './repository/seccion.repository';
import { LocalidadRepository } from './repository/localidad.repository';
import { MedalleroPosicionRepository } from './repository/medalleroPosicion.repository';
import { MedalleroPosicionRuralRepository } from './repository/medalleroPosicionRural.repository';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmpaquetadoModule } from 'src/core/external-services/empaquetado/empaquetado.module';
import { ExamenOfflineRepository } from './repository/examenOffline.repository';
import { UsuarioRepository } from '../usuario/usuario.repository';
import { UsuarioRolRepository } from '../usuario/usuario-rol.repository';
import { ObtencionMedalleroRepository } from './repository/obtencionMedallero.repository';
import { ObtencionClasificadosRepository } from 'src/application/olimpiada/repository/obtencionClasificados.repository';
import { TokenOlimpiadaService } from './service/tokenOlimpiada.service';
import { TokenOlimpiadaRepository } from './repository/tokenOlimpiada.repository';
import { FileModule } from '../../../libs/file/src';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EstudianteRepository,
      EstudianteExamenRepository,
      EstudianteExamenDetalleRepository,
      OlimpiadaRepository,
      AreaRepository,
      GradoEscolaridadRepository,
      EtapaRepository,
      EtapaAreaGradoRepository,
      DistritoRepository,
      UnidadEducativaRepository,
      CalendarioRepository,
      DepartamentoRepository,
      PreguntaRepository,
      InscripcionRepository,
      SeccionRepository,
      LocalidadRepository,
      ExamenOfflineRepository,
      UsuarioRepository,
      UsuarioRolRepository,
      MedalleroPosicionRepository,
      MedalleroPosicionRuralRepository,
      ObtencionMedalleroRepository,
      ResultadosRepository,
      ObtencionClasificadosRepository,
      TokenOlimpiadaRepository,
    ]),
    ConfigModule,
    EmpaquetadoModule,
    FileModule,
  ],
  controllers: [
    EstudianteController,
    ExamenController,
    OlimpiadaController,
    AreaController,
    GradoEscolaridadController,
    EtapaController,
    EtapaAreaGradoController,
    DistritoController,
    UnidadEducativaController,
    DepartamentoController,
    PreguntaController,
    InscripcionController,
    CalendarioController,
    ExamenOfflineController,
    CalificacionController,
    MedalleroController,
    ClasificadosController,
    ExamenAdministracionController,
    RezagadosController,
    PublicoController,
  ],
  providers: [
    EstudianteService,
    ExamenService,
    OlimpiadaService,
    AreaService,
    ConfigService,
    GradoEscolaridadService,
    EtapaService,
    GestionEtapaService,
    EtapaAreaGradoService,
    DistritoService,
    UnidadEducativaService,
    DepartamentoService,
    PreguntaService,
    InscripcionService,
    CalendarioService,
    ExamenOfflineService,
    SorteoPreguntaService,
    CalificacionService,
    MedalleroService,
    ObtencionMedalleroService,
    PublicacionResultadoService,
    ObtenerClasificadosService,
    RezagadosService,
    TokenOlimpiadaService,
  ],
  exports: [OlimpiadaService, EtapaService, TokenOlimpiadaService],
})
export class OlimpiadaModule {}

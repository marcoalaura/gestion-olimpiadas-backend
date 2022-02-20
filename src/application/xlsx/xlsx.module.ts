import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapaAreaGradoRepository } from '../olimpiada/repository/etapaAreaGrado.repository';
import { PreguntaRepository } from '../olimpiada/repository/pregunta.repository';
import { AreaRepository } from '../olimpiada/repository/area.repository';
import { GradoEscolaridadRepository } from '../olimpiada/repository/gradoEscolaridad.repository';
import { EtapaRepository } from '../olimpiada/repository/etapa.repository';
import { UnidadEducativaRepository } from '../olimpiada/repository/unidadEducativa.repository';
import { InscripcionRepository } from '../olimpiada/repository/inscripcion.repository';

import { PreguntaController } from './pregunta/pregunta.controller';
import { PreguntaService } from './pregunta/pregunta.service';
import { EstudianteController } from './estudiante/estudiante.controller';
import { EstudianteService } from './estudiante/estudiante.service';
import { ImagenesController } from './imagenes/imagenes.controller';
import { ImagenesService } from './imagenes/imagenes.service';

@Module({
  providers: [PreguntaService, EstudianteService, ImagenesService],
  controllers: [PreguntaController, EstudianteController, ImagenesController],
  imports: [
    TypeOrmModule.forFeature([
      EtapaRepository,
      AreaRepository,
      GradoEscolaridadRepository,
      EtapaAreaGradoRepository,
      PreguntaRepository,
      UnidadEducativaRepository,
      InscripcionRepository,
    ]),
  ],
})
export class XlsxModule {}

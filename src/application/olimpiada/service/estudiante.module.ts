import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteService } from './estudiante.service';
import { EstudianteRepository } from '../repository/estudiante.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { PersonaRepository } from '../../persona/persona.repository';

@Module({
  providers: [EstudianteService],
  exports: [EstudianteService],
  imports: [
    TypeOrmModule.forFeature([
      EstudianteRepository,
      PersonaRepository,
      EstudianteExamenDetalleRepository,
    ]),
  ],
  controllers: [],
})
export class EstudianteModule {}

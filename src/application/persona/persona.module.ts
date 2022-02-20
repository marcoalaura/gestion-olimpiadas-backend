import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonaRepository } from './persona.repository';
import { PersonaService } from './persona.service';

@Module({
  imports: [TypeOrmModule.forFeature([PersonaRepository])],
  providers: [PersonaService],
  exports: [PersonaService, PersonaRepository],
})
export class PersonaModule {}

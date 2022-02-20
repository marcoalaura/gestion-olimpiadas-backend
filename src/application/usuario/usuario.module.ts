import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PersonaRepository } from '../persona/persona.repository';
import { MensajeriaModule } from '../../core/external-services/mensajeria/mensajeria.module';
import { ConfigModule } from '@nestjs/config';
import { AuthorizationModule } from '../../core/authorization/authorization.module';
import { UsuarioRolRepository } from './usuario-rol.repository';
import { RolRepository } from '../../core/authorization/repository/rol.repository';
import { IopModule } from '../../core/external-services/iop/iop.module';
import { OlimpiadaRepository } from '../olimpiada/olimpiada.repository';
import { EtapaRepository } from '../olimpiada/repository/etapa.repository';
import { DepartamentoRepository } from '../olimpiada/repository/departamento.repository';
import { DistritoRepository } from '../olimpiada/repository/distrito.repository';
import { UnidadEducativaRepository } from '../olimpiada/repository/unidadEducativa.repository';
import { AreaRepository } from '../olimpiada/repository/area.repository';
import { UsuarioRolService } from '../usuario/usuario-rol.service';

@Module({
  providers: [UsuarioService, UsuarioRolService],
  exports: [UsuarioService, UsuarioRolService],
  imports: [
    TypeOrmModule.forFeature([
      UsuarioRepository,
      PersonaRepository,
      UsuarioRolRepository,
      RolRepository,
      OlimpiadaRepository,
      EtapaRepository,
      DepartamentoRepository,
      DistritoRepository,
      UnidadEducativaRepository,
      AreaRepository,
      UsuarioRolRepository,
    ]),
    MensajeriaModule,
    IopModule,
    ConfigModule,
    AuthorizationModule,
  ],
  controllers: [UsuarioController],
})
export class UsuarioModule {}

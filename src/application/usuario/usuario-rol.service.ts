import { Injectable } from '@nestjs/common';
import { UsuarioRolRepository } from './usuario-rol.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsuarioRolService {
  constructor(
    @InjectRepository(UsuarioRolRepository)
    private usuarioRolRepositorio: UsuarioRolRepository,
  ) {}
  async buscarPorId(id: string) {
    return this.usuarioRolRepositorio.buscarPorId(id);
  }

  async obtenerOlimpiadasPorRolUsuario(idRol: string, idUsuario: string) {
    return this.usuarioRolRepositorio.obtenerOlimpiadasPorRolUsuario(
      idRol,
      idUsuario,
    );
  }

  async obtenerNiveles(idUsuario: string, idRol: string, rol: string) {
    return this.usuarioRolRepositorio.obtenerNiveles(idUsuario, idRol, rol);
  }
}

export class ActualizarUsuarioDto {
  estado?: string;

  correoElectronico: string;

  contrasena?: string;

  intentos?: number;

  fechaBloqueo?: string;

  codigoDesbloqueo?: string;

  usuarioActualizacion: string;
}

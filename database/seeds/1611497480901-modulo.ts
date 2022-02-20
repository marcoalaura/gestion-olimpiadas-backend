import { TextService } from 'src/common/lib/text.service';
import { PropiedadesDto } from 'src/core/authorization/dto/crear-modulo.dto';
import { Modulo } from 'src/core/authorization/entity/modulo.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class modulo1611497480901 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre: 'configuraciones',
        url: '/configuraciones',
        label: 'Configuraciones',
        propiedades: {
          icono: 'settings',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
      },
      {
        nombre: 'Principal',
        url: '/principal',
        label: 'Principal',
        propiedades: {
          icono: 'home',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
      },
      {
        nombre: 'inicio',
        url: '/home',
        label: 'Inicio',
        propiedades: {
          icono: 'home',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
        fidModulo: TextService.textToUuid('Principal'),
      },
      {
        nombre: 'perfil',
        url: '/perfil',
        label: 'Perfil',
        propiedades: {
          icono: 'person',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
        fidModulo: TextService.textToUuid('Principal'),
      },
      {
        nombre: 'politicas',
        url: '/politicas',
        label: 'Políticas',
        propiedades: {
          icono: 'verified_user',
          color_light: '#6E7888',
          color_dark: '#A2ACBD',
        },
        fidModulo: TextService.textToUuid('configuraciones'),
      },
      {
        nombre: 'usuarios',
        url: '/usuarios',
        label: 'Usuarios',
        propiedades: {
          icono: 'manage_accounts',
          color_light: '#073F5C',
          color_dark: '#5FC5E6',
        },
        fidModulo: TextService.textToUuid('configuraciones'),
      },
      {
        nombre: 'parametros',
        url: '/parametros',
        label: 'Parámetros',
        propiedades: {
          icono: 'tune',
          color_light: '#5E88A9',
          color_dark: '#007594',
        },
      },
      {
        nombre: 'areas',
        url: '/areas',
        label: 'Áreas',
        propiedades: {
          icono: 'science',
          color_light: '#5E88A9',
          color_dark: '#007594',
        },
        fidModulo: TextService.textToUuid('parametros'),
      },
      {
        nombre: 'grados-escolares',
        url: '/grados-escolares',
        label: 'Grados escolares',
        propiedades: {
          icono: 'school',
          color_light: '#5E88A9',
          color_dark: '#007594',
        },
        fidModulo: TextService.textToUuid('parametros'),
      },
      {
        nombre: 'distritos',
        url: '/distritos',
        label: 'Distritos',
        propiedades: {
          icono: 'fmd_good',
          color_light: '#5E88A9',
          color_dark: '#007594',
        },
        fidModulo: TextService.textToUuid('parametros'),
      },
      {
        nombre: 'unidades-educativas',
        url: '/unidades-educativas',
        label: 'Unidades Educativas',
        propiedades: {
          icono: 'location_city',
          color_light: '#5E88A9',
          color_dark: '#007594',
        },
        fidModulo: TextService.textToUuid('parametros'),
      },
      {
        nombre: 'competencias',
        url: '/competencias',
        label: 'Competencias',
        propiedades: {
          icono: 'emoji_events',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
      },
      {
        nombre: 'olimpiadas',
        url: '/olimpiadas',
        label: 'Olimpiadas',
        propiedades: {
          icono: 'emoji_events',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'etapas',
        url: '/etapas',
        label: 'Etapas',
        propiedades: {
          icono: 'emoji_flags',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'etapas-areas-grados',
        url: '/etapas-areas-grados',
        label: 'Etapas - Áreas - Grados',
        propiedades: {
          icono: 'settings_input_component',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'inscripciones',
        url: '/inscripciones',
        label: 'Inscripciones',
        propiedades: {
          icono: 'badge',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'banco-preguntas',
        url: '/banco-preguntas',
        label: 'Banco de preguntas',
        propiedades: {
          icono: 'quiz',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'examen',
        url: '/examen',
        label: 'Examen',
        propiedades: {
          icono: 'receipt_long',
          color_light: '#fb6263',
          color_dark: '#fcacb4',
        },
      },
      {
        nombre: 'calificacion-publicacion',
        url: '/calificacion-publicacion',
        label: 'Reporte de pruebas',
        propiedades: {
          icono: 'rule',
          color_light: '#37ada8',
          color_dark: '#37ada8',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'impugnacion',
        url: '/impugnacion',
        label: 'Impugnación de preguntas',
        propiedades: {
          icono: 'gavel',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'medalleros-generar',
        url: '/medalleros-generar',
        label: 'Medallero',
        propiedades: {
          icono: 'military_tech',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'clasificar-etapas',
        url: '/clasificados',
        label: 'Ver clasificados',
        propiedades: {
          icono: 'menu_book',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'examen-offline',
        url: '/examen-offline',
        label: 'Pruebas offline',
        propiedades: {
          icono: 'wifi_off',
          color_light: '#fb6263',
          color_dark: '#fb6263',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'reportes',
        url: '/reportes',
        label: 'Reportes',
        propiedades: {
          icono: 'insert_chart',
          color_light: '#fb6263',
          color_dark: '#fb6263',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
      {
        nombre: 'reprogramacion-rezagados',
        url: '/reprogramacion-rezagados',
        label: 'Reprogramación de rezagados',
        propiedades: {
          icono: 'event',
          color_light: '#DDA01E',
          color_dark: '#DDA01E',
        },
        fidModulo: TextService.textToUuid('competencias'),
      },
    ];
    const modulos = items.map((item) => {
      const m = new Modulo();
      m.id = TextService.textToUuid(item.nombre);
      m.nombre = item.nombre;
      m.url = item.url;
      m.label = item.label;
      if (item.fidModulo) {
        const submodulo = new Modulo();
        submodulo.id = item.fidModulo;
        m.fidModulo = submodulo;
      }
      const propiedades = new PropiedadesDto();
      propiedades.color_dark = item.propiedades.color_dark;
      propiedades.color_light = item.propiedades.color_light;
      propiedades.icono = item.propiedades.icono;

      m.propiedades = propiedades;
      m.usuarioCreacion = '1';
      return m;
    });
    await queryRunner.manager.save(modulos);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}

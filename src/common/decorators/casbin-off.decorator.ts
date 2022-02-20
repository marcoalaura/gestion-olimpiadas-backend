import { SetMetadata } from '@nestjs/common';

export const IS_CASBIN_OFF = 'CasbinOff';

export const CasbinOff = () => SetMetadata(IS_CASBIN_OFF, true);

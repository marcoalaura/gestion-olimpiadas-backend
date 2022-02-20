import { Module } from '@nestjs/common';
import { FileModule } from '../../../libs/file/src';
import { CarboneService } from './carbone.service';

@Module({
  imports: [FileModule],
  providers: [CarboneService],
  exports: [CarboneService],
})
export class CarboneModule {}

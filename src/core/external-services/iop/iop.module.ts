import { Module } from '@nestjs/common';
import { SegipModule } from './segip/segip.module';

@Module({
  imports: [SegipModule],
  providers: [],
  exports: [SegipModule],
})
export class IopModule {}

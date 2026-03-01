import { Module } from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerController } from './container.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Container } from './entity/container.entity';
import { ContainerDocument } from './entity/container-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Container, ContainerDocument])],
  controllers: [ContainerController],
  providers: [ContainerService],
})
export class ContainerModule {}

import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileCleanupService } from 'src/file/file-cleanup.service';


@Module({

  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService, FileCleanupService],
  exports: [ApplicationService],
})
export class ApplicationModule {}

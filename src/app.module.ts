import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsModule } from './requests/presentation/requests.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JobsModule } from './jobs/presentation/jobs.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RequestsModule,
    JobsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
  ],
})
export class AppModule { }

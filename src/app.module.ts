import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestsModule } from './requests/presentation/requests.module';

@Module({
  imports: [
    RequestsModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    Logger,
  ],
})
export class AppModule { }

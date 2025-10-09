import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { DomainErrorFilter } from './shared/services/domain-error.filter';
import { LoggerInterceptor } from './shared/services/logger.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle('Notification System')
		.setDescription('The notification system API description')
		.setVersion('1.0')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);

	const logger: Logger = await app.resolve(Logger)
	app.useGlobalFilters(
		new DomainErrorFilter(logger),
	);
	app.useGlobalInterceptors(
		new LoggerInterceptor()
	)

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

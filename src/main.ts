import { Logger, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { HttpExceptionFilter } from '@/common/infrastructure/presentation/http/http-exception.filter'
import { HttpLoggingInterceptor } from '@/common/infrastructure/presentation/http/http-logging.interceptor'
import { HttpValidationPipe } from '@/common/infrastructure/presentation/http/http-validation.pipe'

import type { AppConfigType } from './app.config'
import { appConfig } from './app.config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // api versioning
  app.enableVersioning({ type: VersioningType.URI })
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new HttpLoggingInterceptor())
  app.useGlobalPipes(new HttpValidationPipe())

  // config
  const config = app.get<AppConfigType>(appConfig.KEY)

  // swagger setup
  if (config.mode.isDevelopment) {
    const swaggerConfig = new DocumentBuilder().setVersion('1.0').build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api/docs', app, document)
  }

  // start
  await app.listen(config.port, config.host)

  // post start logs
  const log = (text: string) => {
    Logger.log(text, 'Bootstrap')
  }
  const appUrl = await app.getUrl()
  log(`Application is listening on ${appUrl}`)
  if (config.mode.isDevelopment) {
    log(`Swagger documentation: ${appUrl}/api/docs`)
    log(`App is in development mode`)
  }
}

bootstrap().catch((error: unknown) => {
  Logger.error(error, 'Bootstrap')
})

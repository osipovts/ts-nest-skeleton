import type { ConfigType } from '@nestjs/config'
import { registerAs } from '@nestjs/config'
import { z } from 'zod'

const appConfigSchema = z.object({
  APP_HOST: z.string().trim().min(1).default('0.0.0.0'),
  APP_PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  NODE_ENV: z.string().min(1),
})

export const appConfig = registerAs('app', () => {
  const env = appConfigSchema.parse(process.env)

  return {
    host: env.APP_HOST,
    port: env.APP_PORT,
    mode: {
      isDevelopment: env.NODE_ENV === 'development',
      isProduction: env.NODE_ENV === 'production',
    },
  }
})

export type AppConfigType = ConfigType<typeof appConfig>

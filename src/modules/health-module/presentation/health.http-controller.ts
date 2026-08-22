import { Controller, Get, HttpCode, HttpStatus, VERSION_NEUTRAL } from '@nestjs/common'

import { SuccessHttpResponseDto } from '@/common/infrastructure/presentation/http/http-response.dto'

@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthHttpController {
  @Get()
  @HttpCode(HttpStatus.OK)
  health(): SuccessHttpResponseDto<{ success: true }> {
    return SuccessHttpResponseDto.create<{ success: true }>({ success: true })
  }
}

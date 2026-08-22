import { ApiProperty } from '@nestjs/swagger'
import { v7 } from 'uuid'

import {
  ErrorDto,
  ErrorHttpResponseDto,
} from '@/common/infrastructure/presentation/http/http-response.dto'
import { ExampleNotFoundException } from '@/modules/example-module/application/exceptions/example-not-found.exception'

export class ExampleNotFoundResponseDto extends ErrorHttpResponseDto<ErrorDto> {
  @ApiProperty({
    type: ErrorDto,
    example: new ExampleNotFoundException(v7()).toJSON(),
  })
  declare error: ErrorDto
}

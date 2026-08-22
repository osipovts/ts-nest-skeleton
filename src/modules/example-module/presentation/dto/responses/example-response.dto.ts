import { ApiProperty } from '@nestjs/swagger'
import { v7 } from 'uuid'

import { SuccessHttpResponseDto } from '@/common/infrastructure/presentation/http/http-response.dto'
import { ExampleEntity } from '@/modules/example-module/domain/example.entity'

export class ExampleResponseDto extends SuccessHttpResponseDto<ExampleEntity> {
  @ApiProperty({
    type: ExampleEntity,
    example: {
      props: {
        text: 'Some text',
      },
      id: v7(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  declare data: ExampleEntity
}

import { ApiProperty } from '@nestjs/swagger'

import { SuccessHttpResponseDto } from '@/common/infrastructure/presentation/http/http-response.dto'
import { PaginationMetaDto } from '@/common/infrastructure/presentation/http/pagination-response.dto'
import { ExampleEntity } from '@/modules/example-module/domain/example.entity'

export interface ExamplesListData {
  items: ExampleEntity[]
  meta: PaginationMetaDto
}

export class ExamplesListDataDto implements ExamplesListData {
  @ApiProperty({ type: ExampleEntity, isArray: true })
  declare items: ExampleEntity[]

  @ApiProperty({ type: PaginationMetaDto })
  declare meta: PaginationMetaDto
}

export class ExamplesListResponseDto extends SuccessHttpResponseDto<ExamplesListDataDto> {
  @ApiProperty({ type: ExamplesListDataDto })
  declare data: ExamplesListDataDto
}

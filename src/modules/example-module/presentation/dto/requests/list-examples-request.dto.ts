import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'

import { PaginationRequestDto } from '@/common/infrastructure/presentation/http/pagination-request.dto'
import { ExampleSortField } from '@/modules/example-module/application/use-cases/list-examples.use-case'

export class ListExamplesRequestDto extends PaginationRequestDto {
  @ApiPropertyOptional({ description: 'Case-insensitive text prefix' })
  @IsOptional()
  @IsString()
  declare text?: string

  @ApiPropertyOptional({ enum: ExampleSortField, default: ExampleSortField.CREATED_AT })
  @IsOptional()
  @IsEnum(ExampleSortField)
  override sortBy = ExampleSortField.CREATED_AT
}

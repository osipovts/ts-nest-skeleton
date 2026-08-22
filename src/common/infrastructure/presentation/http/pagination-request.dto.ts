import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

import { SortDirection } from '@/common/application/pagination'

export class PaginationRequestDto {
  @ApiPropertyOptional({ default: 1, minimum: 1, type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100, type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  declare sortBy?: string

  @ApiPropertyOptional({ enum: SortDirection, default: SortDirection.ASC })
  @IsEnum(SortDirection)
  sortDirection = SortDirection.ASC
}

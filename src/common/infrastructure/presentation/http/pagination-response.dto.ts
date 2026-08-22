import { ApiProperty } from '@nestjs/swagger'

import type { PaginationMeta } from '@/common/application/pagination'

export class PaginationMetaDto implements PaginationMeta {
  @ApiProperty({ minimum: 1 })
  declare page: number

  @ApiProperty({ minimum: 1 })
  declare pageSize: number

  @ApiProperty({ minimum: 0 })
  declare totalItems: number

  @ApiProperty({ minimum: 0 })
  declare totalPages: number
}

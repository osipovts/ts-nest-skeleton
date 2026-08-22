import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ExampleRequestDto {
  @ApiProperty()
  @IsUUID(7)
  declare id: string
}

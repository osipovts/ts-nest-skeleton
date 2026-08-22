import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class PostExampleRequestDto {
  @ApiProperty()
  @IsString()
  declare text: string
}

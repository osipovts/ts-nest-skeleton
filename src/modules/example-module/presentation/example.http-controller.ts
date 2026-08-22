import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger'

import { SuccessHttpResponseDto } from '@/common/infrastructure/presentation/http/http-response.dto'

import { CreateExampleUseCase } from '../application/use-cases/create-example.use-case'
import { DeleteExampleUseCase } from '../application/use-cases/delete.example.use-case'
import { GetExampleUseCase } from '../application/use-cases/get-example.use-case'
import { ExampleEntity } from '../domain/example.entity'
import { ExampleRequestDto } from './dto/requests/example-request.dto'
import { PostExampleRequestDto } from './dto/requests/post-example-request.dto'
import { ExampleResponseDto } from './dto/responses/example-response.dto'
import { ExampleNotFoundResponseDto } from './dto/responses/exceptions/example-not-found-response.dto'

@Controller({ path: 'examples', version: '1' })
export class ExampleHttpController {
  constructor(
    private readonly getExampleUseCase: GetExampleUseCase,
    private readonly createExampleUseCase: CreateExampleUseCase,
    private readonly deleteExampleUseCase: DeleteExampleUseCase,
  ) {}

  @Get(':id')
  @ApiOkResponse({ type: ExampleResponseDto })
  @ApiInternalServerErrorResponse({ type: ExampleNotFoundResponseDto })
  async get(@Param() req: ExampleRequestDto): Promise<SuccessHttpResponseDto<ExampleEntity>> {
    const entity = await this.getExampleUseCase.execute(req.id)
    return SuccessHttpResponseDto.create(entity)
  }

  @Post()
  @ApiCreatedResponse({ type: ExampleResponseDto })
  async post(@Body() req: PostExampleRequestDto): Promise<SuccessHttpResponseDto<ExampleEntity>> {
    const entity = await this.createExampleUseCase.execute(req.text)
    return SuccessHttpResponseDto.create(entity)
  }

  @Delete(':id')
  @ApiOkResponse({ type: ExampleResponseDto })
  @ApiInternalServerErrorResponse({ type: ExampleNotFoundResponseDto })
  async delete(@Param() req: ExampleRequestDto): Promise<SuccessHttpResponseDto<ExampleEntity>> {
    const entity = await this.deleteExampleUseCase.execute(req.id)
    return SuccessHttpResponseDto.create(entity)
  }
}

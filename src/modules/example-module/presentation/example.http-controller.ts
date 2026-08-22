import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger'

import { SuccessHttpResponseDto } from '@/common/infrastructure/presentation/http/http-response.dto'
import { CreateExampleUseCase } from '@/modules/example-module/application/use-cases/create-example.use-case'
import { DeleteExampleUseCase } from '@/modules/example-module/application/use-cases/delete.example.use-case'
import { GetExampleUseCase } from '@/modules/example-module/application/use-cases/get-example.use-case'
import { ListExamplesUseCase } from '@/modules/example-module/application/use-cases/list-examples.use-case'
import { ExampleEntity } from '@/modules/example-module/domain/example.entity'
import { ExampleRequestDto } from '@/modules/example-module/presentation/dto/requests/example-request.dto'
import { ListExamplesRequestDto } from '@/modules/example-module/presentation/dto/requests/list-examples-request.dto'
import { PostExampleRequestDto } from '@/modules/example-module/presentation/dto/requests/post-example-request.dto'
import { ExampleResponseDto } from '@/modules/example-module/presentation/dto/responses/example-response.dto'
import { ExamplesListResponseDto } from '@/modules/example-module/presentation/dto/responses/examples-list-response.dto'
import { ExampleNotFoundResponseDto } from '@/modules/example-module/presentation/dto/responses/exceptions/example-not-found-response.dto'

@Controller({ path: 'examples', version: '1' })
export class ExampleHttpController {
  constructor(
    private readonly getExampleUseCase: GetExampleUseCase,
    private readonly listExamplesUseCase: ListExamplesUseCase,
    private readonly createExampleUseCase: CreateExampleUseCase,
    private readonly deleteExampleUseCase: DeleteExampleUseCase,
  ) {}

  @Get()
  @ApiOkResponse({ type: ExamplesListResponseDto })
  async list(@Query() req: ListExamplesRequestDto): Promise<ExamplesListResponseDto> {
    const result = await this.listExamplesUseCase.execute({
      page: req.page,
      pageSize: req.pageSize,
      sortBy: req.sortBy,
      sortDirection: req.sortDirection,
      ...(req.text !== undefined && { text: req.text }),
    })

    return SuccessHttpResponseDto.create(result)
  }

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

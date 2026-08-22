# О проекте

Это "DDD / Clean Architecture" NestJS шаблон с уже настроенным Docker, Swagger и Prisma:

- Готовая к использованию инфраструктура доменных исключений с консистентными респонсами
- Готовые базовые CRUD-репозитории с поддержкой транзакций и с (почти)отсутствием сопутствующего болйерплейта
- Готовая структура папок под Clean Architecture

## Исключения

### Базовый пример

В своем модуле создайте класс исключения и унаследуйте его от `*Exception`:

- в слое инфраструктуры от `InfrastructureException`
- в слое приложения от `ApplicationException`
- в слое домена от `DomainException`

Заполните абстрактное поле module и текст об ошибке:

```typescript
export abstract class SomeDomainException extends DomainException {
  public readonly module = ModuleEnum.EXAMPLE

  public get message(): string {
    return `Some error occured`
  }
}
```

### Расширенный пример

Для типовых исключений, например `"${entity} ${id} not found"`, можно создать абстрактное исключение и наследоваться от него:

```typescript
// абстрактное исключение
export abstract class EntityNotFoundException extends ApplicationException {
  public abstract readonly module: ModuleEnum // заполнить в конкретном классе
  public abstract readonly entityName: string // заполнить в конкретном классе

  public get message(): string {
    return `${this.entityName} with id ${this.entityId} not found`
  }

  constructor(public readonly entityId: Entity['id']) {
    super()
  }
}

// конкретное исключение
export class UserNotFoundException extends EntityNotFoundException {
  public readonly module = ModuleEnum.USER
  public readonly entityName = UserEntity.name

  constructor(public readonly id: UserEntity['id']) {
    super(id)
  }
}
```

### Отображение исключения

Ваши исключения всегда будут консистентными благодаря интерфейсу `ExceptionInterface`. Это значительно облегчает работу с исключениями на фронтенде, а дополнительные поля `module` и `layer` помогут быстро локализовать проблемное место:

```typescript
export interface ExceptionInterface {
  layer: LayerEnum // слой: Domain, Application или Infrastructure
  module: ModuleEnum // имя модуля
  error: string // код ошибки
  message: string // человекочитаемое сообщение об ошибке
  details?: Record<string, unknown> // доп. информация (например, детали валидации)
}
```

В данном шаблоне уже реализован `HttpExceptionFilter`, который в паре с `HttpResponseDto` преобразует исключения в предсказуемый вид:

```typescript
{
  success: false,
  error: {
    module: 'USER',
    layer: 'APPLICATION',
    error: 'UserNotFoundException',
    message: 'User with id ... not found',
  }
}
```

Рекомендуется приводить вендорные исключения к `ExceptionInterface`: при соблюдении консистентности будет несложно написать фильтры и для других транспортов.

## CRUD

При создании доменной сущности, сохраняемой в БД с помощью Prisma, следуйте следующему алгоритму:

1. Создайте доменную сущность (см. `src/modules/example-module/domain`)
2. Создайте сущность в `schema.prisma`, сгенерируйте и мигрируйте сущность: `pnpm prisma:generate && pnpm prisma:migrate`
3. Создайте репозиторий и data-mapper (см. `src/modules/example-module/infrastructure`)
4. Создайте use-cases (см. `src/modules/example-module/application`)
5. Подключите use-cases к presentation-слою (см. `src/modules/example-module/presentation`)

## Конфигурация

Рекомендуется использовать `registerAs`-стиль конфигурации и использовать `zod` для валидации. Конфигурацию следует хранить непосредственно в модуле (или в common если конфиг используется многими модулями):

1. Создайте конфиг:

```typescript
const prismaConfigSchema = z.object({
  DATABASE_URL: z
    .url('DATABASE_URL must be a valid URL')
    .refine(
      (value) => ['postgres:', 'postgresql:'].includes(new URL(value).protocol),
      'DATABASE_URL must use the postgresql protocol',
    ),
})

export const prismaConfig = registerAs('prisma', () => {
  const env = prismaConfigSchema.parse(process.env)

  return {
    databaseUrl: env.DATABASE_URL,
  }
})

export type PrismaConfigType = ConfigType<typeof prismaConfig>
```

2. Зарегистрируйте конфиг в модуле (или в app.module.ts в ConfigModule.forRoot если конфигурация глобальна)

```typescript
@Module({
  imports: [ConfigModule.forFeature(prismaConfig)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

# Использование шаблона

Используйте этот репозиторий как шаблон для вашего проекта, копируя репозиторий с помощью интерфейса [Github](https://github.com) или вручную с помощью git clone.

Рекомендуется запустить `pnpm up` для обновления dev-зависимостей (eslint, tsx и т.д.) после копирования репозитория

## Копирование с помощью Github UI

[Здесь](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) описано как это сделать.

## Копирование вручную

```sh
git clone https://github.com/osipovts/ts-nest-skeleton ./project
cd project
git remote remove origin
git remote add origin <YOUR_REPO_URL>
git push -u origin --all
git push -u origin --tags
```

# Запуск

- `pnpm build && pnpm start`: Компиляция и запуск
- `pnpm start:dev`: Запуск в "watch" режиме для разработки
- `pnpm lint`: Запуск ESLint для проверки стиля кода

# Docker

Запуск в dev-режиме:

```
# установить пакеты (единожды на свежем репо
# или после добавления новых пакетов в проект)
docker compose run --rm app-dev pnpm install
# запуск
docker compose up app-dev
```

Запуск в prod-режиме:

```
docker compose --profile prod up -d app-prod --build
```

# Для пользователей VS Code

## Авто-линт при сохранении файла

Что бы Prettier и ESLint автоматически фиксили код при сохранении файла:

1. Установить расширения `dbaeumer.vscode-eslint` и `esbenp.prettier-vscode` через Extensions (`Ctrl + Shift + X`) или через Quick Open (`Ctrl + P`):

```
ext install dbaeumer.vscode-eslint
ext install esbenp.prettier-vscode
```

2. Отредактируйте ваши настройки settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "typescript", "typescriptreact", "javascriptreact"],
  "prettier.requireConfig": true
}
```

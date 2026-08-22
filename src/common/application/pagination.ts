export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface PaginationOptions<TSortField extends string = string> {
  page: number
  pageSize: number
  sortBy: TSortField
  sortDirection: SortDirection
}

export interface PaginationMeta {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PaginatedResult<TItem = object> {
  items: TItem[]
  meta: PaginationMeta
}

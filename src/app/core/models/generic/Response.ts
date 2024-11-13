import { Pageable } from "../interface/Page";

export interface Response<T> {
  statusCode: number,
  message: string,
  data: PaginationResponse<T> | T | T[]
}

export interface PaginationResponse<T> {
  totalElements: number;
  totalPages: number;
  content: T[],
  pagination: Pageable
}

export interface ApiError {
  field: string;
  errorMessage: string;
}

export interface ApiResponse<T = Record<string, unknown>> {
  message: string;
  code: number;
  data?: T;
  subCode: string;
  errors?: ApiError[] | null;
}
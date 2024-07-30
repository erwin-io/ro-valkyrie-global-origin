export class ApiResponse<T> {
  code: any;
  data: T;
  message: string;
  success: boolean;
}

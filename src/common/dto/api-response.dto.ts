/**
 * Global Response Data Transfer Object (DTO)
 * This class standardizes the format of all API responses.
 */
export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

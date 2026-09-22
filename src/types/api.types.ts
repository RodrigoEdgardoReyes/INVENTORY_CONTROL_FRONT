/**
 * Estructura estándar de respuesta del backend
 * Todos los endpoints devuelven: { success, message?, data }
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

// Eliminar de ser necesario ya que common.types.ts ya tiene la definición de ApiResponse y ApiError
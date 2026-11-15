// src/api/category.api.ts
import apiClient from "@/config/axios";
import type { ApiResponse } from "@/types/common.types";
import type { Category } from "@/types/product.types";

// Interfaz para la respuesta específica del backend
interface CategoriesResponse {
  categories: Category[];
}

export const categoryApiReal = {
  async getCategories(
    businessId: string,
    type: "PRODUCT" | "SERVICE" = "PRODUCT",
  ): Promise<Category[]> {
    const { data } = await apiClient.get<ApiResponse<CategoriesResponse>>(
      `/categories/business/${businessId}/type?type=${type}`,
    );
    // El backend devuelve las categorías dentro de data.categories
    return data.data.categories;
  },

  async createCategory(
    businessId: string,
    payload: Partial<Category>,
  ): Promise<Category> {
    const { data } = await apiClient.post<ApiResponse<{ category: Category }>>(
      "/categories",
      {
        ...payload,
        businessId,
      },
    );
    return data.data.category;
  },
  // ... update, delete
};

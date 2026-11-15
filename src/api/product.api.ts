import apiClient from "@/config/axios";
import type { ApiResponse, PaginatedResponse } from "@/types/common.types";
import type {
  Product,
  ProductFormData,
  ProductFilters,
  ProductListResponse,
} from "@/types/product.types";

type CreateProductPayload = ProductFormData & { businessId: string };

interface GetProductsParams {
  businessId: string;
  filters: ProductFilters;
}

// export const productApiReal = {
//   async getProducts(
//     businessId: string,
//     filters: ProductFilters,
//   ): Promise<PaginatedResponse<Product>> {
//     const { data } = await apiClient.get<
//       ApiResponse<PaginatedResponse<Product>>
//     >(`/products/business/${businessId}`, { params: filters });
//     return data.data;
//   },

export const productApiReal = {
  // Ahora la función recibe un solo objeto: { businessId, filters }
  async getProducts({ businessId, filters }: GetProductsParams): Promise<ProductListResponse> {
    const { data } = await apiClient.get<ApiResponse<ProductListResponse>>(
      `/products/business/${businessId}`, 
      { params: filters }
    );
    return data.data;
  },

  // ✅ 2. Tipado para obtener uno solo (asumiendo que el backend devuelve { product: ... })
  async getProductById(id: string): Promise<Product> {
    const { data } = await apiClient.get<ApiResponse<{ product: Product }>>(`/products/${id}`);
    return data.data.product;
  },

  // async getProductById(id: string): Promise<Product> {
  //   const { data } = await apiClient.get<ApiResponse<Product>>(
  //     `/products/${id}`,
  //   );
  //   return data.data;
  // },

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const { data } = await apiClient.post<ApiResponse<Product>>(
      "/products",
      payload,
    );
    return data.data;
  },

  // async getProducts(filters: ProductFilters): Promise<PaginatedResponse<Product>> {
  //   const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', { params: filters });
  //   return data.data;
  // },
  // async getProductById(id: string): Promise<Product> {
  //   const { data } = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  //   return data.data;
  // },
  // async createProduct(payload: ProductFormData): Promise<Product> {
  //   const { data } = await apiClient.post<ApiResponse<Product>>('/products', payload);
  //   return data.data;
  // },
  async updateProduct(
    id: string,
    payload: Partial<ProductFormData>,
  ): Promise<Product> {
    const { data } = await apiClient.put<ApiResponse<Product>>(
      `/products/${id}`,
      payload,
    );
    return data.data;
  },
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};

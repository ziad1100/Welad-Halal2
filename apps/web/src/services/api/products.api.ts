import { api } from './api';

export async function searchProducts(search = '', categoryId = '') {
  const { data } = await api.get('/products', { params: { search, categoryId } });
  return data;
}
export async function barcodeLookup(code: string) {
  const { data } = await api.get(`/products/barcode/${encodeURIComponent(code)}`);
  return data as { product: any; unit: any | null };
}
export async function listCategories() {
  const { data } = await api.get('/categories');
  return data;
}

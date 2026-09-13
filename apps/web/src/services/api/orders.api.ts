import { api } from './api';

export async function confirmOrder(payload: any) {
  const { data } = await api.post('/orders/confirm', payload);
  return data;
}
export async function holdOrder(payload: any) {
  const { data } = await api.post('/orders/hold', payload);
  return data;
}
export async function listOrders(status = '') {
  const { data } = await api.get('/orders', { params: status ? { status } : {} });
  return data;
}

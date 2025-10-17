import { Api } from '../../components/base/Api';
import { IProduct, IOrder, ApiListResponse } from '../../types';

export class WebLarekAPI {
  private _api: Api;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this._api = new Api(baseUrl, options);
  }

  // Получает список товаров с сервера
  async getProductList(): Promise<ApiListResponse<IProduct>> {
    return this._api.get<ApiListResponse<IProduct>>('/product/');
  }

  // Отправляет заказ на сервер
  async submitOrder(order: IOrder): Promise<{ id: string; total: number }> {
    return this._api.post<{ id: string; total: number }>('/order', order);
  }
}
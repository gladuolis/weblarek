import { IApi } from '../../types';
import { IProduct, IOrder, ApiListResponse, IOrderResult } from '../../types';

export class WebLarekAPI {
  constructor(private _api: IApi) {}

  // Получает список товаров с сервера
  async getProductList(): Promise<ApiListResponse<IProduct>> {
    return this._api.get<ApiListResponse<IProduct>>('/product/');
  }

  // Отправляет заказ на сервер
  async submitOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>('/order', order);
  }
}
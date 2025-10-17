export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Способ оплаты
export type TPayment = 'card' | 'cash';

// Данные о товаре
export interface IProduct {  
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Данные покупателя
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Данные для отправки заказа на сервер
export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // массив ID товаров
}

// Ответ от API для списков с пагинацией
export interface ApiListResponse<T> {
  total: number;
  items: T[];
}

// Для ошибок валидации
export interface IValidationErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}
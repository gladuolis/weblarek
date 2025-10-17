import { IProduct } from '../../types';

export class CartModel {
  private _items: IProduct[] = [];

  // Возвращает массив товаров в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавляет товар в корзину
  addItem(item: IProduct): void {
    this._items.push(item);
  }

  // Удаляет товар из корзины
  removeItem(item: IProduct): void {
    const index = this._items.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
      this._items.splice(index, 1);
    }
  }

  // Очищает корзину
  clearCart(): void {
    this._items = [];
  }

  // Возвращает общую стоимость товаров в корзине
  getTotalPrice(): number {
    return this._items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  // Возвращает количество товаров в корзине
  getItemsCount(): number {
    return this._items.length;
  }

  // Проверяет наличие товара в корзине по ID
  containsItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}
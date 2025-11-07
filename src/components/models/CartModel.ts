import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartModel {
  private _items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    return this._items;
  }

  addItem(item: IProduct): void {
    // Проверяем, нет ли уже такого товара в корзине
    if (!this.containsItem(item.id)) {
      this._items.push(item);
      this.events.emit('cart:changed', { items: this._items });
    }
  }

  removeItem(item: IProduct): void {
    const index = this._items.findIndex(cartItem => cartItem.id === item.id);
    if (index !== -1) {
      this._items.splice(index, 1);
      this.events.emit('cart:changed', { items: this._items });
    }
  }

  clearCart(): void {
    this._items = [];
    this.events.emit('cart:changed', { items: this._items });
  }

  getTotalPrice(): number {
    return this._items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  getItemsCount(): number {
    return this._items.length;
  }

  containsItem(id: string): boolean {
    return this._items.some(item => item.id === id);
  }
}
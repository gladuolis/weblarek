import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductModel {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;
  private events: EventEmitter;

  constructor() {
    this.events = new EventEmitter();
  }

  // Сохраняет массив товаров
  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('products:changed', { items: this._items });
  }

  // Возвращает массив всех товаров
  getItems(): IProduct[] {
    return this._items;
  }

  // Возвращает товар по ID
  getItemById(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  // Сохраняет товар для подробного отображения
  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
    this.events.emit('product:selected', { item: this._selectedItem });
  }

  // Возвращает выбранный товар
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }

  // Метод для подписки на события
  on(event: string, callback: (data: any) => void) {
    this.events.on(event, callback);
  }
}
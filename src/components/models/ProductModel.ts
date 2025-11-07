import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductModel {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('products:changed', { items: this._items });
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItemById(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this._selectedItem = item;
    this.events.emit('product:selected', { item: this._selectedItem });
  }

  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }

}
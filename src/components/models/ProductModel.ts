import { IProduct } from '../../types';

export class ProductModel {
  private _items: IProduct[] = [];
  private _selectedItem: IProduct | null = null;

  // Сохраняет массив товаров
  setItems(items: IProduct[]): void {
    this._items = items;
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
  }

  // Возвращает выбранный товар
  getSelectedItem(): IProduct | null {
    return this._selectedItem;
  }
}
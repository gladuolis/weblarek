import { IProduct } from '../../types';

export class BasketCard {
  protected _container: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteButton: HTMLButtonElement;
  protected _index: HTMLElement;

  constructor(
    container: HTMLElement,
    protected onDelete?: (product: IProduct) => void
  ) {
    this._container = container;
    
    // Находим элементы
    this._title = this._container.querySelector('.card__title') as HTMLElement;
    this._price = this._container.querySelector('.card__price') as HTMLElement;
    this._deleteButton = this._container.querySelector('.basket__item-delete') as HTMLButtonElement;
    this._index = this._container.querySelector('.basket__item-index') as HTMLElement;

    // Обработчик удаления
    this._deleteButton.addEventListener('click', () => {
      if (this.onDelete && this._product) {
        this.onDelete(this._product);
      }
    });
  }

  protected _product?: IProduct;
  protected _indexNumber?: number;

  render(data: IProduct, index: number) {
    this._product = data;
    this._indexNumber = index;

    // Заполняем данными
    this._title.textContent = data.title;
    this._price.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';
    this._index.textContent = (index + 1).toString();

    return this._container;
  }
}
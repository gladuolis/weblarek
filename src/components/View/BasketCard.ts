import { IProduct } from '../../types';

export class BasketCard {
  protected container: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteButton: HTMLButtonElement;
  protected _index: HTMLElement;
  protected _product?: IProduct;
  protected _indexNumber?: number;

  constructor(
    container: HTMLElement,
    protected onDelete?: (product: IProduct) => void
  ) {
    this.container = container;
    
    this._title = this.container.querySelector('.card__title') as HTMLElement;
    this._price = this.container.querySelector('.card__price') as HTMLElement;
    this._deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
    this._index = this.container.querySelector('.basket__item-index') as HTMLElement;

    console.log('🗑️ BasketCard elements found:', {
      title: !!this._title,
      price: !!this._price,
      deleteButton: !!this._deleteButton,
      index: !!this._index
    });

    this._deleteButton.addEventListener('click', () => {
      console.log('🗑️ DELETE BUTTON CLICKED!');
      if (this.onDelete && this._product) {
        this.onDelete(this._product);
      }
    });
  }

  render(data: IProduct, index: number) {
    console.log('🗑️ Rendering basket card with data:', data);
    
    this._product = data;
    this._indexNumber = index;

    // Заполняем данными
    this._title.textContent = data.title;
    console.log('🗑️ Title set to:', data.title);
    
    this._price.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';
    console.log('🗑️ Price set to:', data.price);
    
    this._index.textContent = (index + 1).toString();

    return this.container;
  }
}
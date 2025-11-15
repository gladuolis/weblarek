// View/BasketCard.ts
import { IProduct } from '../../types'; 
import { Card } from './Card';

export class BasketCard extends Card {
  protected _deleteButton: HTMLButtonElement;
  protected _index: HTMLElement;

  constructor( 
    container: HTMLElement, 
    protected onDelete?: (product: IProduct) => void 
  ) { 
    super(container);
    
    this._deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
    this._index = this.container.querySelector('.basket__item-index') as HTMLElement;

    if (this._deleteButton) {
      this._deleteButton.addEventListener('click', () => { 
        if (this.onDelete && this._product) { 
          this.onDelete(this._product); 
        } 
      }); 
    }
  } 

  setIndex(index: number): void {
    // Используем унаследованный метод setText вместо прямого .textContent
    this.setText(this._index, (index + 1).toString());
  }

  render(data: IProduct, index: number): HTMLElement { 
    this._product = data; 

    // Используем методы родительского класса
    this.setTitle(data.title);
    this.setPrice(data.price);
    this.setIndex(index); // Используем новый метод

    return this.container; 
  } 
}
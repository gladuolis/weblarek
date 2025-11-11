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

    this._deleteButton.addEventListener('click', () => { 
      if (this.onDelete && this._product) { 
        this.onDelete(this._product); 
      } 
    }); 
  } 

  render(data: IProduct, index: number): HTMLElement { 
    this._product = data; 

    this.setTitle(data.title);
    this.setPrice(data.price);
    this._index.textContent = (index + 1).toString();

    return this.container; 
  } 
} 
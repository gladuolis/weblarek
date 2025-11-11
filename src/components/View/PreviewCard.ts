// View/PreviewCard.ts
import { IProduct } from '../../types'; 
import { Card } from './Card';

export class PreviewCard extends Card { 
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor( 
    container: HTMLElement, 
    protected onAddToBasket?: (product: IProduct) => void, 
    protected onRemoveFromBasket?: (product: IProduct) => void, 
    protected isInBasket?: boolean 
  ) { 
    super(container);
    this._description = this.container.querySelector('.card__text') as HTMLElement;
    this._button = this.container.querySelector('.card__button') as HTMLButtonElement;

    this._button.addEventListener('click', () => { 
      if (this.isInBasket && this.onRemoveFromBasket && this._product) { 
        this.onRemoveFromBasket(this._product); 
      } else if (!this.isInBasket && this.onAddToBasket && this._product && this._product.price !== null) { 
        this.onAddToBasket(this._product); 
      } 
    }); 
  } 

  render(data: IProduct, isInBasket: boolean = false): HTMLElement { 
    this._product = data; 
    this.isInBasket = isInBasket; 
    
    this.renderBase(data);
    this._description.textContent = data.description;

    if (data.price === null) { 
      this._button.disabled = true; 
      this._button.textContent = 'Недоступно'; 
    } else if (isInBasket) { 
      this._button.disabled = false; 
      this._button.textContent = 'Удалить из корзины'; 
    } else { 
      this._button.disabled = false; 
      this._button.textContent = 'В корзину'; 
    } 

    return this.container; 
  } 
} 
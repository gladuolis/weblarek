// View/PreviewCard.ts
import { IProduct } from '../../types'; 
import { Card } from './Card';

export class PreviewCard extends Card { 
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _isInBasket: boolean = false;

  constructor( 
    container: HTMLElement, 
    protected onAddToBasket?: (product: IProduct) => void, 
    protected onRemoveFromBasket?: (product: IProduct) => void
  ) { 
    super(container);
    this._description = this.container.querySelector('.card__text') as HTMLElement;
    this._button = this.container.querySelector('.card__button') as HTMLButtonElement;

    if (this._button) {
      this._button.addEventListener('click', () => { 
        if (this._isInBasket && this.onRemoveFromBasket && this._product) { 
          this.onRemoveFromBasket(this._product); 
        } else if (!this._isInBasket && this.onAddToBasket && this._product && this._product.price !== null) { 
          this.onAddToBasket(this._product); 
        } 
      }); 
    }
  } 

  protected setDescription(description: string): void {
    this.setText(this._description, description);
  }

  protected setButtonText(text: string): void {
    this.setText(this._button, text);
  }

  protected updateButtonState(): void {
    if (!this._product) return;

    if (this._product.price === null) { 
      this._button.disabled = true; 
      this.setButtonText('Недоступно'); 
    } else if (this._isInBasket) { 
      this._button.disabled = false; 
      this.setButtonText('Удалить из корзины'); 
    } else { 
      this._button.disabled = false; 
      this.setButtonText('В корзину'); 
    } 
  }

  setBasketState(isInBasket: boolean): void {
    this._isInBasket = isInBasket;
    this.updateButtonState();
  }

  render(data: IProduct, index?: number): HTMLElement { 
    this._product = data; 
    
    this.renderBase(data);
    this.setDescription(data.description);
    this.updateButtonState(); 

    return this.container; 
  } 
}
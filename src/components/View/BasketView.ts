// View/BasketView.ts
import { IProduct } from '../../types'; 

export class BasketView { 
  protected _container: HTMLElement; 
  protected _list: HTMLElement; 
  protected _total: HTMLElement; 
  protected _button: HTMLButtonElement; 

  constructor( 
    container: HTMLElement, 
    protected onCheckout?: () => void
  ) { 
    this._container = container; 
    
    this._list = this._container.querySelector('.basket__list') as HTMLElement; 
    this._total = this._container.querySelector('.basket__price') as HTMLElement; 
    this._button = this._container.querySelector('.basket__button') as HTMLButtonElement; 

    if (this._button) { 
      this._button.addEventListener('click', () => { 
        if (this.onCheckout) { 
          this.onCheckout(); 
        } 
      }); 
    } 
  } 

  render(basketCards: HTMLElement[], total: number): HTMLElement { 
    this._list.innerHTML = ''; 

    if (basketCards.length === 0) { 
      const emptyMessage = document.createElement('div'); 
      emptyMessage.className = 'basket__empty'; 
      emptyMessage.textContent = 'Корзина пуста'; 
      emptyMessage.style.textAlign = 'center'; 
      emptyMessage.style.padding = '20px'; 
      this._list.appendChild(emptyMessage); 
      
      this._button.disabled = true; 
      this._total.textContent = '0 синапсов'; 
    } else { 
      this._button.disabled = false; 
      this._total.textContent = `${total} синапсов`; 

      basketCards.forEach(card => { 
        this._list.appendChild(card); 
      }); 
    } 

    return this._container; 
  } 
} 
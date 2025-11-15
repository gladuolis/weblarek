// View/BasketView.ts
import { IProduct } from '../../types'; 
import { Component } from '../base/Component';

// Создаем интерфейс для данных BasketView
interface IBasketData {
  basketCards: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketData> { 
  protected _list: HTMLElement; 
  protected _total: HTMLElement; 
  protected _button: HTMLButtonElement; 

  constructor( 
    container: HTMLElement, 
    protected onCheckout?: () => void
  ) { 
    super(container);
    
    this._list = this.container.querySelector('.basket__list') as HTMLElement; 
    this._total = this.container.querySelector('.basket__price') as HTMLElement; 
    this._button = this.container.querySelector('.basket__button') as HTMLButtonElement; 

    if (this._button) { 
      this._button.addEventListener('click', () => { 
        if (this.onCheckout) { 
          this.onCheckout(); 
        } 
      }); 
    } 
  } 

  private createEmptyMessage(): HTMLElement {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'basket__empty';
    emptyMessage.style.textAlign = 'center'; 
    emptyMessage.style.padding = '20px'; 
    
    this.setText(emptyMessage, 'Корзина пуста');
    
    return emptyMessage;
  }

  render(data?: Partial<IBasketData>): HTMLElement { 
    if (!data) return this.container;
    
    const { basketCards, total } = data;
    
    if (!basketCards || total === undefined) return this.container;

    this._list.innerHTML = ''; 

    if (basketCards.length === 0) { 
      this._list.appendChild(this.createEmptyMessage()); 
      this._button.disabled = true; 
      this.setText(this._total, '0 синапсов');
    } else { 
      this._button.disabled = false; 
      this.setText(this._total, `${total} синапсов`);

      basketCards.forEach(card => { 
        this._list.appendChild(card); 
      }); 
    } 

    return this.container; 
  } 
}
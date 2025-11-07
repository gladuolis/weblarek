import { IProduct } from '../../types';
import { BasketCard } from './BasketCard';

export class BasketView {
  protected _container: HTMLElement;
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected onCheckout?: () => void,
    protected onDelete?: (product: IProduct) => void // ← ДОБАВЬ ЭТО
  ) {
    this._container = container;
    
    // Находим элементы
    this._list = this._container.querySelector('.basket__list') as HTMLElement;
    this._total = this._container.querySelector('.basket__price') as HTMLElement;
    this._button = this._container.querySelector('.basket__button') as HTMLButtonElement;

    // Обработчик оформления заказа
    if (this._button) {
      this._button.addEventListener('click', () => {
        if (this.onCheckout) {
          this.onCheckout();
        }
      });
    }
  }

  render(items: IProduct[], total: number) {
    // Очищаем список
    this._list.innerHTML = '';

    if (items.length === 0) {
      // Показываем сообщение "Корзина пуста"
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'basket__empty';
      emptyMessage.textContent = 'Корзина пуста';
      emptyMessage.style.textAlign = 'center';
      emptyMessage.style.padding = '20px';
      this._list.appendChild(emptyMessage);
      
      this._button.disabled = true;
      this._total.textContent = '0 синапсов';
    } else {
      // Скрываем сообщение и показываем товары
      this._button.disabled = false;
      this._total.textContent = `${total} синапсов`;

      // Добавляем карточки товаров
      items.forEach((item, index) => {
        const template = document.getElementById('card-basket') as HTMLTemplateElement;
        const cardElement = template.content.cloneNode(true) as HTMLElement;
        const card = new BasketCard(
          cardElement as HTMLElement, 
          this.onDelete // ← ПЕРЕДАЕМ onDelete В BasketCard
        );
        card.render(item, index);
        this._list.appendChild(cardElement);
      });
    }

    return this._container;
  }
}
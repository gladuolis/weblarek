import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export class PreviewCard {
  protected _container: HTMLElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected onAddToBasket?: (product: IProduct) => void,
    protected onRemoveFromBasket?: (product: IProduct) => void,
    protected isInBasket?: boolean
  ) {
    this._container = container;
    
    // Находим элементы внутри контейнера
    this._title = this._container.querySelector('.card__title') as HTMLElement;
    this._image = this._container.querySelector('.card__image') as HTMLImageElement;
    this._category = this._container.querySelector('.card__category') as HTMLElement;
    this._description = this._container.querySelector('.card__text') as HTMLElement;
    this._price = this._container.querySelector('.card__price') as HTMLElement;
    this._button = this._container.querySelector('.card__button') as HTMLButtonElement;

    // Добавляем обработчик кнопки
    this._button.addEventListener('click', () => {
      if (this.isInBasket && this.onRemoveFromBasket && this._product) {
        this.onRemoveFromBasket(this._product);
      } else if (!this.isInBasket && this.onAddToBasket && this._product && this._product.price !== null) {
        this.onAddToBasket(this._product);
      }
    });
  }

  protected _product?: IProduct;

  render(data: IProduct, isInBasket: boolean = false) {
    this._product = data;
    this.isInBasket = isInBasket;
    
    // Заполняем карточку данными
    this._title.textContent = data.title;
    this._image.src = CDN_URL + data.image;
    this._image.alt = data.title;
    this._category.textContent = data.category;
    this._description.textContent = data.description;
    this._price.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';

    // Устанавливаем класс категории
    const categoryClass = categoryMap[data.category as keyof typeof categoryMap];
    this._category.className = `card__category ${categoryClass}`;

    // Настраиваем кнопку в зависимости от состояния
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

    return this._container;
  }
}
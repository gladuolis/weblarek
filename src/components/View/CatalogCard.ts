import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export class CatalogCard {
  protected _button: HTMLButtonElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;

  constructor(
    protected container: HTMLElement,
    protected onClick?: (product: IProduct) => void
  ) {
    // Находим элементы внутри контейнера
    this._button = this.container.querySelector('.card') as HTMLButtonElement;
    this._title = this.container.querySelector('.card__title') as HTMLElement;
    this._image = this.container.querySelector('.card__image') as HTMLImageElement;
    this._category = this.container.querySelector('.card__category') as HTMLElement;
    this._price = this.container.querySelector('.card__price') as HTMLElement;

    // Добавляем обработчик клика
    this._button.addEventListener('click', () => {
      if (this.onClick && this._product) {
        this.onClick(this._product);
      }
    });
  }

  protected _product?: IProduct;

  render(data: IProduct) {
    this._product = data;
    
    // Заполняем карточку данными
    this._title.textContent = data.title;
    this._image.src = CDN_URL + data.image;
    this._image.alt = data.title;
    this._category.textContent = data.category;
    this._price.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';

    // Устанавливаем класс категории
    const categoryClass = categoryMap[data.category as keyof typeof categoryMap];
    this._category.className = `card__category ${categoryClass}`;

    // Блокируем кнопку если товар недоступен
    if (data.price === null) {
      this._button.disabled = true;
      this._price.textContent = 'Недоступно';
    }

    return this.container;
  }
}
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export class CatalogCard {
  protected container: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _product?: IProduct;

  constructor(
    container: HTMLElement,
    protected onClick?: (product: IProduct) => void
  ) {
    this.container = container;
    this._button = this.container.querySelector('.card') as HTMLButtonElement;
    this._title = this.container.querySelector('.card__title') as HTMLElement;
    this._image = this.container.querySelector('.card__image') as HTMLImageElement;
    this._category = this.container.querySelector('.card__category') as HTMLElement;
    this._price = this.container.querySelector('.card__price') as HTMLElement;

    console.log('🔴 CatalogCard constructor - elements found:', {
      button: !!this._button,
      title: !!this._title,
      image: !!this._image,
      category: !!this._category,
      price: !!this._price
    });

    this._button.addEventListener('click', () => {
      console.log('🎯 BUTTON CLICKED!');
      if (this.onClick && this._product) {
        console.log('🎯 Calling onClick with product:', this._product.title);
        this.onClick(this._product);
      } else {
        console.error('🎯 Cannot call onClick:', {
          hasOnClick: !!this.onClick,
          hasProduct: !!this._product
        });
      }
    });
  }

  render(data: IProduct) {
    console.log('🔴 Rendering card:', data.title);
    this._product = data;
    
    this._title.textContent = data.title;
    this._image.src = CDN_URL + data.image;
    this._image.alt = data.title;
    this._category.textContent = data.category;
    this._price.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';

    const categoryClass = categoryMap[data.category as keyof typeof categoryMap];
    this._category.className = `card__category ${categoryClass}`;

    if (data.price === null) {
      this._button.disabled = false;
      this._button.style.opacity = '0.5';
    } else {
      this._button.disabled = false;
      this._button.style.opacity = '1';
    }

    console.log('🔴 Card rendered successfully');
    return this.container;
  }
}
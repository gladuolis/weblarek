// View/Card.ts
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export abstract class Card {
  protected container: HTMLElement;
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _product?: IProduct;

  constructor(container: HTMLElement) {
    if (!container) {
      console.error('❌ Card: container is null or undefined');
      this.container = document.createElement('div');
      return;
    }

    this.container = container as HTMLElement;
    
    this._title = this.container.querySelector('.card__title') as HTMLElement;
    this._image = this.container.querySelector('.card__image') as HTMLImageElement;
    this._category = this.container.querySelector('.card__category') as HTMLElement;
    this._price = this.container.querySelector('.card__price') as HTMLElement;
  }

  protected renderBase(product: IProduct): void {
    this.setTitle(product.title);
    this.setImage(product.image, product.title);
    this.setCategory(product.category);
    this.setPrice(product.price);
  }

  protected setTitle(title: string): void {
    if (this._title) {
      this._title.textContent = title;
    }
  }

  protected setImage(src: string, alt: string): void {
    if (this._image) {
      this._image.src = `${CDN_URL}/${src}`;
      this._image.alt = alt;
    }
  }

  protected setCategory(category: string): void {
    if (this._category) {
      this._category.textContent = category;
      const categoryClass = categoryMap[category as keyof typeof categoryMap];
      this._category.className = `card__category ${categoryClass}`;
    }
  }

  protected setPrice(price: number | null): void {
    if (this._price) {
      this._price.textContent = price ? `${price} синапсов` : 'Бесценно';
    }
  }

  abstract render(data: IProduct): HTMLElement;
}
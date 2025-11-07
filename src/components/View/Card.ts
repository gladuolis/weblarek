import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';
import { CDN_URL } from '../../utils/constants';

export class Card<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    
    this._title = this.container.querySelector('.card__title') as HTMLElement;
    this._image = this.container.querySelector('.card__image') as HTMLImageElement;
    this._category = this.container.querySelector('.card__category') as HTMLElement;
    this._price = this.container.querySelector('.card__price') as HTMLElement;
  }

  set title(value: string) {
    if (this._title) this.setText(this._title, value);
  }

  set image(value: string) {
    if (this._image) this.setImage(this._image, CDN_URL + value, value); // ← исправлено
  }

  set category(value: string) {
    if (this._category) {
      this.setText(this._category, value);
      const categoryClass = categoryMap[value as keyof typeof categoryMap];
      if (categoryClass) {
        this._category.className = `card__category ${categoryClass}`;
      }
    }
  }

  set price(value: number | null) {
    if (this._price) {
      this.setText(this._price, value === null ? 'Бесценно' : `${value} синапсов`);
    }
  }
}
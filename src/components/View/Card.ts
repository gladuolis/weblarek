// View/Card.ts
import { IProduct } from '../../types'; 
import { categoryMap } from '../../utils/constants'; 
import { CDN_URL } from '../../utils/constants'; 
import { Component } from '../base/Component';

export abstract class Card extends Component<IProduct> {
  protected _title: HTMLElement; 
  protected _image: HTMLImageElement; 
  protected _category: HTMLElement; 
  protected _price: HTMLElement; 
  protected _product?: IProduct; 

  constructor(container: HTMLElement) { 
    super(container);
    
    this._title = this.container.querySelector('.card__title') as HTMLElement; 
    this._image = this.container.querySelector('.card__image') as HTMLImageElement; 
    this._category = this.container.querySelector('.card__category') as HTMLElement; 
    this._price = this.container.querySelector('.card__price') as HTMLElement; 
  } 

  protected renderBase(product: IProduct): void { 
    this.setTitle(product.title); 
    this.setCardImage(product.image, product.title); // Используем новый метод
    this.setCategory(product.category); 
    this.setPrice(product.price); 
  } 

  protected setTitle(title: string): void { 
    this.setText(this._title, title);
  } 

  protected setCardImage(src: string, alt: string): void { 
    super.setImage(this._image, `${CDN_URL}/${src}`, alt);
  } 

  protected setCategory(category: string): void { 
    this.setText(this._category, category);
    
    const categoryClass = categoryMap[category as keyof typeof categoryMap]; 
    if (this._category) {
      this._category.className = `card__category ${categoryClass}`; 
    }
  } 

  protected setPrice(price: number | null): void { 
    const priceText = price ? `${price} синапсов` : 'Бесценно';
    this.setText(this._price, priceText);
  } 

  abstract render(data: IProduct, index?: number): HTMLElement; 
}
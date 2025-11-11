// View/CatalogCard.ts
import { IProduct } from '../../types'; 
import { Card } from './Card';

export class CatalogCard extends Card { 
  constructor( 
    container: HTMLElement, 
    protected onClick?: (product: IProduct) => void 
  ) { 
    super(container);

    if (!this.container) {
      return;
    }

    this.container.addEventListener('click', () => {
      if (this._product && this.onClick) {
        this.onClick(this._product);
      }
    }); 
  } 

  render(data: IProduct): HTMLElement { 
    if (!this.container) {
      return document.createElement('div');
    }

    this._product = data; 
    this.renderBase(data);

    const containerElement = this.container as HTMLElement;
    
    if (data.price === null) {
      containerElement.style.opacity = '0.5';
    } else {
      containerElement.style.opacity = '1';
    }

    return containerElement; 
  } 
}
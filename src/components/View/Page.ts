// View/Page.ts
import { Component } from '../base/Component';

export class Page extends Component<{ count: number }> {
  private _gallery: HTMLElement;
  private _basketCounter: HTMLElement;
  private _basketButton: HTMLElement;

  constructor(
    gallery: HTMLElement,
    basketCounter: HTMLElement,
    basketButton: HTMLElement
  ) {
    // Используем document.body как корневой контейнер
    super(document.body);
    
    // Сохраняем переданные элементы напрямую
    this._gallery = gallery;
    this._basketCounter = basketCounter;
    this._basketButton = basketButton;

    if (!this._gallery) throw new Error('Gallery element not found');
    if (!this._basketCounter) throw new Error('Basket counter element not found');
    if (!this._basketButton) throw new Error('Basket button element not found');
  }

  setGalleryContent(content: HTMLElement[]): void {
    this._gallery.replaceChildren(...content);
  }

  setBasketCounter(count: number): void {
    this.setText(this._basketCounter, count.toString());
  }

  setBasketButtonHandler(handler: () => void): void {
    this._basketButton.addEventListener('click', handler);
  }

  get gallery(): HTMLElement {
    return this._gallery;
  }

  get basketButton(): HTMLElement {
    return this._basketButton;
  }

  render(data?: { count: number }): HTMLElement {
    if (data && data.count !== undefined) {
      this.setBasketCounter(data.count);
    }
    return this.container;
  }
}
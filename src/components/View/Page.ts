// View/Page.ts
export class Page {
  private _gallery: HTMLElement;
  private _basketCounter: HTMLElement;
  private _basketButton: HTMLElement;

  constructor() {
    this._gallery = document.querySelector('.gallery') as HTMLElement;
    this._basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
    this._basketButton = document.querySelector('.header__basket') as HTMLElement;

    if (!this._gallery) throw new Error('Gallery element not found');
    if (!this._basketCounter) throw new Error('Basket counter element not found');
    if (!this._basketButton) throw new Error('Basket button element not found');
  }

  setGalleryContent(content: HTMLElement[]): void {
    this._gallery.replaceChildren(...content);
  }

  setBasketCounter(count: number): void {
    this._basketCounter.textContent = count.toString();
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
}
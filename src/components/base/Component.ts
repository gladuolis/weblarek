export class Component<T> {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  // Публичный геттер для доступа к container
  public getContainer(): HTMLElement {
    return this.container;
  }

  setText(element: HTMLElement, text: string): void {
    if (element) element.textContent = text;
  }

  setImage(element: HTMLImageElement, src: string, alt: string): void {
    if (element) {
      element.src = src;
      element.alt = alt;
    }
  }

  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data);
    return this.container;
  }
}
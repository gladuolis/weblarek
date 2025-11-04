export class Modal {
  protected _container: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    this._container = container;
    this._closeButton = this._container.querySelector('.modal__close') as HTMLButtonElement;

    // Назначаем обработчики событий
    this._closeButton.addEventListener('click', this.close.bind(this));
    this._container.addEventListener('click', this.handleOverlayClick.bind(this));
  }

  // Закрытие модального окна
  close() {
    this._container.classList.remove('modal_active');
  }

  // Открытие модального окна
  open() {
    this._container.classList.add('modal_active');
  }

  // Обработка клика по оверлею
  protected handleOverlayClick(event: MouseEvent) {
    if (event.target === this._container) {
      this.close();
    }
  }

  // Установка содержимого модального окна
  setContent(content: HTMLElement) {
    const body = this._container.querySelector('.modal__content') as HTMLElement;
    body.innerHTML = '';
    body.appendChild(content);
  }

  render() {
    return this._container;
  }
}
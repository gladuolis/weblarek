import { Component } from '../base/Component';

export class Modal extends Component<{}> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;
  protected _handleEscape: (event: KeyboardEvent) => void;

  constructor(container: HTMLElement) {
    super(container);
    
    this._closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
    this._content = this.container.querySelector('.modal__content') as HTMLElement;

    console.log('🎪 Modal elements found:', {
      closeButton: !!this._closeButton,
      content: !!this._content
    });

    // Обработчик Escape в виде стрелочного метода
    this._handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('⌨️ Escape pressed, closing modal');
        this.close();
      }
    };

    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    // Обработчик кнопки закрытия
    if (this._closeButton) {
      this._closeButton.addEventListener('click', () => {
        console.log('❌ Close button clicked');
        this.close();
      });
    }

    // Обработчик клика по оверлею
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        console.log('🎯 Overlay clicked, closing modal');
        this.close();
      }
    });
  }

  // Закрытие модального окна
  close(): void {
    console.log('🔴 Closing modal');
    this.container.classList.remove('modal_active');
    document.removeEventListener('keydown', this._handleEscape);
  }

  // Открытие модального окна
  open(): void {
    console.log('🟢 Opening modal');
    this.container.classList.add('modal_active');
    document.addEventListener('keydown', this._handleEscape);
  }

  // Установка содержимого модального окна
  setContent(content: HTMLElement): void {
    console.log('📦 Setting modal content');
    
    if (this._content) {
      this._content.innerHTML = '';
      this._content.appendChild(content);
      console.log('✅ Modal content set');
    } else {
      console.error('❌ Modal content element not found!');
    }
  }
}
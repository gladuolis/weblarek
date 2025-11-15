// View/OrderForm.ts
import { Component } from '../base/Component';
import { BuyerModel } from '../models/BuyerModel';
import { TPayment } from '../../types';

export class OrderForm extends Component<{ payment: TPayment; address: string }> {
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressInput: HTMLInputElement;
    private submitButton: HTMLButtonElement;
    private selectedPayment: TPayment | null = null;
    private errorElement: HTMLElement;

    constructor(
        container: HTMLElement,
        protected buyerModel: BuyerModel,
        protected onSubmit?: (data: { payment: TPayment; address: string }) => void
    ) {
        super(container);

        // Находим элементы
        this.paymentButtons = this.container.querySelectorAll('button[name="card"], button[name="cash"]');
        this.addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;
        this.submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorElement = this.container.querySelector('.form__errors') as HTMLElement;

        console.log('Found payment buttons:', this.paymentButtons.length);

        // Обработчики для кнопок выбора оплаты
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectPayment(button.name as TPayment);
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.updateSubmitButton();
        });

        // Обработчик формы
        const form = this.container.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        this.updateSubmitButton();
    }

    private selectPayment(payment: TPayment) {
        console.log('Payment selected:', payment);
        this.selectedPayment = payment;
        
        // Обновляем стили кнопок
        this.paymentButtons.forEach(button => {
            if (button.name === payment) {
                button.classList.add('button_alt-active');
                button.classList.remove('button_alt');
            } else {
                button.classList.add('button_alt');
                button.classList.remove('button_alt-active');
            }
        });
        
        this.updateSubmitButton();
    }

    private handleSubmit() {
        if (this.selectedPayment && this.addressInput.value.trim() && this.onSubmit) {
            this.onSubmit({
                payment: this.selectedPayment,
                address: this.addressInput.value.trim()
            });
        }
    }

    private updateSubmitButton() {
        const canSubmit = this.selectedPayment !== null && this.addressInput.value.trim() !== '';
        if (this.submitButton) {
            this.submitButton.disabled = !canSubmit;
        }
    }

    protected showErrors(message: string): void {
        if (this.errorElement) {
            this.setText(this.errorElement, message);
            this.errorElement.style.display = message ? 'block' : 'none';
        }
    }

    setData(payment: TPayment, address: string) {
        console.log('Setting data:', { payment, address });
        
        // Выбираем способ оплаты
        this.selectPayment(payment);
        
        // Устанавливаем адрес
        this.addressInput.value = address;

        this.updateSubmitButton();
    }

    render(): HTMLElement {
        this.updateSubmitButton();
        return this.container;
    }
}
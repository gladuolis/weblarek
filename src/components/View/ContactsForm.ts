// View/ContactsForm.ts
import { Component } from '../base/Component';
import { BuyerModel } from '../models/BuyerModel';

export class ContactsForm extends Component<{ email: string; phone: string }> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private submitButton: HTMLButtonElement;
    private errorElement: HTMLElement;

    constructor(
        container: HTMLElement,
        protected buyerModel: BuyerModel,
        protected onSubmit?: (data: { email: string; phone: string }) => void
    ) {
        super(container);
        
        this.emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        this.submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorElement = this.container.querySelector('.form__errors') as HTMLElement;

        this.emailInput.addEventListener('input', () => this.updateSubmitButton());
        this.phoneInput.addEventListener('input', () => this.updateSubmitButton());

        const form = this.container.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        this.updateSubmitButton();
    }

    private handleSubmit() {
        if (this.emailInput.value.trim() && this.phoneInput.value.trim() && this.onSubmit) {
            this.onSubmit({
                email: this.emailInput.value.trim(),
                phone: this.phoneInput.value.trim()
            });
        }
    }

    private updateSubmitButton() {
        const canSubmit = this.emailInput.value.trim() !== '' && this.phoneInput.value.trim() !== '';
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

    setData(email: string, phone: string) {
        this.emailInput.value = email;
        this.phoneInput.value = phone;
        this.updateSubmitButton();
    }

    render(): HTMLElement {
        this.updateSubmitButton();
        return this.container;
    }
}
import { ProductModel } from '../models/ProductModel';
import { CartModel } from '../models/CartModel';
import { BuyerModel } from '../models/BuyerModel';
import { WebLarekAPI } from '../Api/WebLarekAPI';
import { CatalogCard } from '../View/CatalogCard';
import { PreviewCard } from '../View/PreviewCard';
import { BasketView } from '../View/BasketView';
import { OrderForm } from '../View/OrderForm';
import { ContactsForm } from '../View/ContactsForm';
import { Modal } from '../View/Modal';
import { IProduct, IOrder } from '../../types';

export class AppPresenter {
  constructor(
    private productModel: ProductModel,
    private cartModel: CartModel,
    private buyerModel: BuyerModel,
    private api: WebLarekAPI,
    private modal: Modal,
    private gallery: HTMLElement,
    private basketButton: HTMLElement
  ) {
    this.init();
  }

  private init() {
    // Подписываемся на события моделей
    this.productModel.on('products:changed', this.renderCatalog.bind(this));
    this.cartModel.on('cart:changed', this.updateBasketCounter.bind(this));
    
    // Загружаем товары с сервера
    this.loadProducts();
    
    // Назначаем обработчик корзины
    this.basketButton.addEventListener('click', this.openBasket.bind(this));
  }

  private async loadProducts() {
    try {
      const productList = await this.api.getProductList();
      this.productModel.setItems(productList.items);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  }

  private renderCatalog() {
    const products = this.productModel.getItems();
    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    const cardElements: HTMLElement[] = [];

    products.forEach(product => {
      const cardElement = template.content.cloneNode(true) as HTMLElement;
      const card = new CatalogCard(cardElement as HTMLElement, this.openProductModal.bind(this));
      card.render(product);
      cardElements.push(cardElement as HTMLElement);
    });

    this.gallery.replaceChildren(...cardElements);
  }

  private openProductModal(product: IProduct) {
    this.productModel.setSelectedItem(product);
    
    const previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
    const previewElement = previewTemplate.content.cloneNode(true) as HTMLElement;
    const previewCard = new PreviewCard(previewElement as HTMLElement, this.addToBasket.bind(this));
    
    previewCard.render(product);
    this.modal.setContent(previewElement);
    this.modal.open();
  }

  private addToBasket(product: IProduct) {
    this.cartModel.addItem(product);
    this.modal.close();
  }

  private openBasket() {
    const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    const basketElement = basketTemplate.content.cloneNode(true) as HTMLElement;
    const basketView = new BasketView(
      basketElement as HTMLElement,
      this.openOrderForm.bind(this),
      this.removeFromBasket.bind(this)
    );
    
    const items = this.cartModel.getItems();
    const total = this.cartModel.getTotalPrice();
    basketView.render(items, total);
    this.modal.setContent(basketElement);
    this.modal.open();
  }

  private removeFromBasket(product: IProduct) {
    this.cartModel.removeItem(product);
    
    if (this.cartModel.getItemsCount() > 0) {
      this.openBasket();
    } else {
      this.modal.close();
    }
  }

  private updateBasketCounter() {
    const counter = document.querySelector('.header__basket-counter') as HTMLElement;
    counter.textContent = this.cartModel.getItemsCount().toString();
  }

  private openOrderForm() {
    const buyerData = this.buyerModel.getData();
    
    const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    const orderElement = orderTemplate.content.cloneNode(true) as HTMLElement;
    const orderForm = new OrderForm(
      orderElement as HTMLElement,
      (data) => {
        this.buyerModel.setData(data);
        this.openContactsForm();
      }
    );
    
    // Устанавливаем сохраненные данные если есть
    if (buyerData) {
      // Используем метод setData если он есть, иначе render
      if ((orderForm as any).setData) {
        (orderForm as any).setData(buyerData.payment, buyerData.address);
      } else {
        orderForm.render();
      }
    } else {
      orderForm.render();
    }
    
    this.modal.setContent(orderElement);
    this.modal.open();
  }

  private openContactsForm() {
    const buyerData = this.buyerModel.getData();
    
    const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    const contactsElement = contactsTemplate.content.cloneNode(true) as HTMLElement;
    const contactsForm = new ContactsForm(
      contactsElement as HTMLElement,
      (contactsData) => {
        this.buyerModel.setData(contactsData);
        this.submitOrder();
      }
    );
    
    // Устанавливаем сохраненные данные если есть
    if (buyerData) {
      // Используем метод setData если он есть, иначе render
      if ((contactsForm as any).setData) {
        (contactsForm as any).setData(buyerData.email, buyerData.phone);
      } else {
        contactsForm.render();
      }
    } else {
      contactsForm.render();
    }
    
    this.modal.setContent(contactsElement);
    this.modal.open();
  }

  private async submitOrder() {
    const buyerData = this.buyerModel.getData();
    
    if (!buyerData) {
      console.error('Данные покупателя не заполнены');
      return;
    }

    try {
      const order: IOrder = {
        payment: buyerData.payment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: this.cartModel.getTotalPrice(),
        items: this.cartModel.getItems().map(item => item.id)
      };

      const result = await this.api.submitOrder(order);
      
      // Очищаем корзину и данные покупателя
      this.cartModel.clearCart();
      this.buyerModel.clearData();
      
      this.modal.close();
      this.showSuccess(result.total);
      
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
    }
  }

  private showSuccess(total: number) {
    const successTemplate = document.getElementById('success') as HTMLTemplateElement;
    const successElement = successTemplate.content.cloneNode(true) as HTMLElement;
    
    const description = successElement.querySelector('.order-success__description') as HTMLElement;
    description.textContent = `Списано ${total} синапсов`;
    
    const closeButton = successElement.querySelector('.order-success__close') as HTMLButtonElement;
    closeButton.addEventListener('click', () => this.modal.close());
    
    this.modal.setContent(successElement);
    this.modal.open();
  }
}
import { ProductModel } from '../models/ProductModel';
import { CartModel } from '../models/CartModel';
import { BuyerModel } from '../models/BuyerModel';
import { WebLarekAPI } from '../Api/WebLarekAPI';
import { CatalogCard } from '../View/CatalogCard';
import { PreviewCard } from '../View/PreviewCard';
import { BasketView } from '../View/BasketView';
import { BasketCard } from '../View/BasketCard'; 
import { OrderForm } from '../View/OrderForm';
import { ContactsForm } from '../View/ContactsForm';
import { Modal } from '../View/Modal';
import { SuccessMessage } from '../View/SuccessMessage';
import { IProduct, IOrder, IOrderForm, IContactsForm } from '../../types';
import { EventEmitter } from '../base/Events';

export class AppPresenter {
  private successMessage: SuccessMessage;
  
  // Кэшируем шаблоны
  private catalogTemplate: HTMLTemplateElement;
  private previewTemplate: HTMLTemplateElement;
  private basketTemplate: HTMLTemplateElement;
  private basketCardTemplate: HTMLTemplateElement;
  private orderTemplate: HTMLTemplateElement;
  private contactsTemplate: HTMLTemplateElement;
  private successTemplate: HTMLTemplateElement;

  constructor(
    private productModel: ProductModel,
    private cartModel: CartModel,
    private buyerModel: BuyerModel,
    private api: WebLarekAPI,
    private modal: Modal,
    private gallery: HTMLElement,
    private basketButton: HTMLElement,
    private events: EventEmitter
  ) {
    this.cacheTemplates();
    this.createSuccessMessage();
    this.init();
  }

  private cacheTemplates(): void {
    this.catalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
    this.previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
    this.basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
    this.basketCardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
    this.orderTemplate = document.getElementById('order') as HTMLTemplateElement;
    this.contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
    this.successTemplate = document.getElementById('success') as HTMLTemplateElement;
  }

  private createSuccessMessage(): void {
    const successElement = this.successTemplate.content.cloneNode(true) as HTMLElement;
    this.successMessage = new SuccessMessage(
      successElement as HTMLElement,
      () => this.modal.close()
    );
  }

  private init() {
    // Подписываемся на события через единый events
    this.events.on('products:changed', this.renderCatalog.bind(this));
    this.events.on('cart:changed', this.updateBasketCounter.bind(this));
    
    // Назначаем обработчик корзины
    this.basketButton.addEventListener('click', this.openBasket.bind(this));
    
    // Загружаем товары с сервера
    this.loadProducts();
  }

  private async loadProducts() {
    try {
      console.log('Loading products from API...');
      const productList = await this.api.getProductList();
      console.log('Products loaded:', productList.items.length);
      this.productModel.setItems(productList.items);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  }

  private renderCatalog() {
    const products = this.productModel.getItems();
    console.log('=== RENDER CATALOG ===');
    console.log('Products to render:', products.length);

    const cardElements: HTMLElement[] = [];

    products.forEach((product, index) => {
      console.log(`Creating card ${index}:`, product.title);
      
      const cardElement = this.catalogTemplate.content.cloneNode(true) as HTMLElement;
      const card = new CatalogCard(
        cardElement as HTMLElement, 
        (productData) => {
          console.log('🎯🎯🎯 ONCLICK CALLBACK! Product:', productData.title);
          this.openProductModal(productData);
        }
      );
      
      card.render(product);
      cardElements.push(cardElement as HTMLElement);
    });

    this.gallery.replaceChildren(...cardElements);
    console.log('Catalog rendered');
  }

  private openProductModal(product: IProduct) {
    console.log('🎪 OPEN PRODUCT MODAL for:', product.title);
    
    this.productModel.setSelectedItem(product);
    
    const previewElement = this.previewTemplate.content.cloneNode(true) as HTMLElement;
    const isInBasket = this.cartModel.containsItem(product.id);
    
    const previewCard = new PreviewCard(
      previewElement as HTMLElement, 
      this.addToBasket.bind(this),
      this.removeFromBasket.bind(this),
      isInBasket
    );
    
    previewCard.render(product, isInBasket);
    this.modal.setContent(previewElement);
    this.modal.open();
  }

  private addToBasket(product: IProduct) {
    console.log('Adding to basket:', product.title);
    this.cartModel.addItem(product);
    this.modal.close();
  }

  private openBasket() {
    console.log('=== OPEN BASKET ===');
    const items = this.cartModel.getItems();
    console.log('Basket items:', items.length, items);
    
    const basketElement = this.basketTemplate.content.cloneNode(true) as HTMLElement;
    const basketView = new BasketView(
      basketElement as HTMLElement,
      this.openOrderForm.bind(this),
      this.removeFromBasket.bind(this)
    );
    
    const total = this.cartModel.getTotalPrice();
    basketView.render(items, total);
    this.modal.setContent(basketElement);
    this.modal.open();
  }

  private removeFromBasket(product: IProduct) {
    console.log('Removing from basket:', product.title);
    this.cartModel.removeItem(product);
    
    // Всегда переоткрываем корзину чтобы показать обновленное состояние
    this.openBasket();
  }

  private updateBasketCounter() {
    const count = this.cartModel.getItemsCount();
    console.log('Updating basket counter:', count);
    const counter = document.querySelector('.header__basket-counter') as HTMLElement;
    if (counter) {
      counter.textContent = count.toString();
    }
  }

  private openOrderForm() {
    console.log('📦 OPEN ORDER FORM called');
    
    const buyerData = this.buyerModel.getData();
    console.log('📦 Buyer data:', buyerData);
    
    const orderElement = this.orderTemplate.content.cloneNode(true) as HTMLElement;
    const orderForm: IOrderForm = new OrderForm(
      orderElement as HTMLElement,
      this.buyerModel,
      (data) => {
        console.log('📦📦📦 ORDER FORM SUBMITTED! Data:', data);
        this.buyerModel.setData(data);
        this.openContactsForm();
      }
    );
    
    if (buyerData) {
      console.log('📦 Setting existing buyer data');
      // УБРАН as any - теперь правильная типизация
      orderForm.setData(buyerData.payment, buyerData.address);
    } else {
      console.log('📦 Rendering empty form');
      orderForm.render();
    }
    
    this.modal.setContent(orderElement);
    this.modal.open();
  }

  private openContactsForm() {
    console.log('📞 OPEN CONTACTS FORM called');
    
    const buyerData = this.buyerModel.getData();
    
    const contactsElement = this.contactsTemplate.content.cloneNode(true) as HTMLElement;
    const contactsForm: IContactsForm = new ContactsForm(
      contactsElement as HTMLElement,
      this.buyerModel,
      (contactsData) => {
        console.log('📞📞📞 CONTACTS FORM SUBMITTED! Data:', contactsData);
        this.buyerModel.setData(contactsData);
        this.submitOrder();
      }
    );
    
    if (buyerData) {
      // УБРАН as any - теперь правильная типизация
      contactsForm.setData(buyerData.email, buyerData.phone);
    } else {
      contactsForm.render();
    }
    
    this.modal.setContent(contactsElement);
    this.modal.open();
  }

  private async submitOrder() {
    console.log('Submitting order');
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

      console.log('Submitting order data:', order);
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
    console.log('Showing success message, total:', total);
    
    this.successMessage.setTotal(total);
    this.modal.setContent(this.successMessage.container);
    this.modal.open();
  }
}
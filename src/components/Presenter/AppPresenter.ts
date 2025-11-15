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
import { Page } from '../View/Page';
import { IProduct, IOrder } from '../../types'; 
import { EventEmitter } from '../base/Events'; 
 
export class AppPresenter { 
  private page: Page;
  private orderForm: OrderForm;
  private contactsForm: ContactsForm;
  private successMessage: SuccessMessage;

  // Инициализируем шаблоны сразу
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
    // Инициализируем шаблоны
    this.catalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement; 
    this.previewTemplate = document.getElementById('card-preview') as HTMLTemplateElement; 
    this.basketTemplate = document.getElementById('basket') as HTMLTemplateElement; 
    this.basketCardTemplate = document.getElementById('card-basket') as HTMLTemplateElement; 
    this.orderTemplate = document.getElementById('order') as HTMLTemplateElement; 
    this.contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement; 
    this.successTemplate = document.getElementById('success') as HTMLTemplateElement; 

    // Проверяем что все шаблоны найдены
    this.validateTemplates();
    
    // Находим basketCounter
    const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
    
    if (!basketCounter) {
      console.error('Basket counter element not found');
    }

    // Создаем Page
    this.page = new Page(
      this.gallery,
      basketCounter || document.querySelector('.header__basket-counter') as HTMLElement,
      this.basketButton
    );

    // Создаем формы
    const orderElement = this.orderTemplate.content.cloneNode(true) as HTMLElement;
    const contactsElement = this.contactsTemplate.content.cloneNode(true) as HTMLElement;

    this.orderForm = new OrderForm(
      orderElement as HTMLElement,
      this.buyerModel,
      (data) => {
        this.buyerModel.setData(data);
        this.openContactsForm();
      }
    );

    this.contactsForm = new ContactsForm(
      contactsElement as HTMLElement,
      this.buyerModel,
      (contactsData) => {
        this.buyerModel.setData(contactsData);
        this.submitOrder();
      }
    );

    // Создаем success message
    const successElement = this.successTemplate.content.cloneNode(true) as HTMLElement; 
    this.successMessage = new SuccessMessage( 
      successElement as HTMLElement, 
      () => this.modal.close() 
    );

    this.init(); 
  } 

  private validateTemplates(): void {
    const templates = {
      catalog: this.catalogTemplate,
      preview: this.previewTemplate,
      basket: this.basketTemplate,
      basketCard: this.basketCardTemplate,
      order: this.orderTemplate,
      contacts: this.contactsTemplate,
      success: this.successTemplate
    };

    Object.entries(templates).forEach(([name, template]) => {
      if (!template) {
        console.error(`Template ${name} not found`);
      }
    });
  }

  private init() { 
    this.page.setBasketButtonHandler(this.openBasket.bind(this));
    this.updateBasketCounter();
    this.loadProducts(); 
  } 

  private async loadProducts() { 
    try { 
      console.log('🔄 Loading products...');
      const productList = await this.api.getProductList(); 
      console.log('✅ Products loaded:', productList.items.length);
      this.productModel.setItems(productList.items); 
      this.renderCatalog();
    } catch (error) { 
      console.error('❌ Ошибка загрузки товаров:', error); 
    } 
  } 

  private renderCatalog() { 
    const products = this.productModel.getItems(); 
    console.log('🔄 Rendering catalog with', products.length, 'products');
    
    const cardElements: HTMLElement[] = []; 

    products.forEach((product) => { 
      const cardFragment = this.catalogTemplate.content.cloneNode(true) as DocumentFragment;
      const cardElement = cardFragment.firstElementChild as HTMLElement;
      
      const card = new CatalogCard( 
        cardElement,  
        (productData) => { 
          this.openProductModal(productData); 
        } 
      ); 
       
      card.render(product); 
      cardElements.push(cardElement); 
    }); 

    console.log('✅ Cards created:', cardElements.length);
    this.page.setGalleryContent(cardElements); 
  } 

  private openProductModal(product: IProduct) { 
    this.productModel.setSelectedItem(product); 
     
    const previewElement = this.previewTemplate.content.cloneNode(true) as HTMLElement; 
    const isInBasket = this.cartModel.containsItem(product.id); 
     
    const previewCard = new PreviewCard( 
      previewElement as HTMLElement,  
      this.addToBasket.bind(this), 
      this.removeFromBasket.bind(this)
    ); 
     
    // Сначала рендерим карточку
    previewCard.render(product);
    // Затем устанавливаем состояние корзины
    previewCard.setBasketState(isInBasket);
    
    this.modal.setContent(previewElement); 
    this.modal.open(); 
  } 

  private addToBasket(product: IProduct) { 
    this.cartModel.addItem(product); 
    this.updateBasketCounter();
    this.modal.close(); 
  } 

  private openBasket() { 
    const items = this.cartModel.getItems(); 
    const basketCards: HTMLElement[] = [];
    
    items.forEach((item, index) => { 
      const cardElement = this.basketCardTemplate.content.cloneNode(true) as HTMLElement; 
      const basketCard = new BasketCard( 
        cardElement as HTMLElement,  
        this.removeFromBasket.bind(this)
      ); 
      basketCard.render(item, index);
      basketCards.push(cardElement as HTMLElement); 
    }); 

    const basketElement = this.basketTemplate.content.cloneNode(true) as HTMLElement;
    const basketView = new BasketView(
      basketElement as HTMLElement,
      this.openOrderForm.bind(this)
    );
    
    const total = this.cartModel.getTotalPrice(); 
    
    // ФИКС: передаем данные в правильном формате
    basketView.render({ 
      basketCards: basketCards, 
      total: total 
    }); 
    
    this.modal.setContent(basketElement); 
    this.modal.open(); 
  }  

  private removeFromBasket(product: IProduct) { 
    this.cartModel.removeItem(product); 
    this.updateBasketCounter();
    this.openBasket(); 
  } 

  private updateBasketCounter() { 
    const count = this.cartModel.getItemsCount(); 
    this.page.setBasketCounter(count); 
  } 

  private openOrderForm() { 
    const buyerData = this.buyerModel.getData(); 

    if (buyerData) { 
      this.orderForm.setData(buyerData.payment, buyerData.address); 
    } else { 
      this.orderForm.render(); 
    } 

    this.modal.setContent(this.orderForm.getContainer()); 
    this.modal.open(); 
  } 

  private openContactsForm() { 
    const buyerData = this.buyerModel.getData(); 
     
    if (buyerData) { 
      this.contactsForm.setData(buyerData.email, buyerData.phone); 
    } else { 
      this.contactsForm.render(); 
    } 
     
    this.modal.setContent(this.contactsForm.getContainer()); 
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

      console.log('🔄 Submitting order:', order);
      const result = await this.api.submitOrder(order); 
      console.log('✅ Order submitted successfully');
       
      this.cartModel.clearCart(); 
      this.buyerModel.clearData(); 
      this.updateBasketCounter();
       
      this.modal.close(); 
      this.showSuccess(result.total); 
       
    } catch (error) { 
      console.error('❌ Ошибка оформления заказа:', error); 
    } 
  } 

  private showSuccess(total: number) { 
    this.successMessage.setTotal(total); 
    this.modal.setContent(this.successMessage.getContainer()); 
    this.modal.open(); 
  } 
}
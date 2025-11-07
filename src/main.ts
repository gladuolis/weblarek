import './scss/styles.scss';
import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/Api/WebLarekAPI';
import { Api } from './components/base/Api';
import { Modal } from './components/View/Modal';
import { AppPresenter } from './components/Presenter/AppPresenter';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';

// Находим контейнеры
const gallery = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const basketButton = document.querySelector('.header__basket') as HTMLElement;

// Создаем единый EventEmitter для всего приложения
const events = new EventEmitter();

// Создаем модели с передачей единого EventEmitter
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);
const modal = new Modal(modalContainer);

// Создаем презентер
const app = new AppPresenter(
  productModel,
  cartModel,
  buyerModel,
  api,
  modal,
  gallery,
  basketButton,
  events
);
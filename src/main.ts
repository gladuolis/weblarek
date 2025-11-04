import './scss/styles.scss';
import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekAPI } from './components/Api/WebLarekAPI';
import { Api } from './components/base/Api';
import { Modal } from './components/View/Modal';
import { AppPresenter } from './components/Presenter/AppPresenter';
import { API_URL } from './utils/constants';

// Находим контейнеры
const gallery = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const basketButton = document.querySelector('.header__basket') as HTMLElement;

// Создаем все необходимые экземпляры
const productModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();
const baseApi = new Api(API_URL);
const api = new WebLarekAPI(baseApi);
const modal = new Modal(modalContainer);

// Создаем презентер, который свяжет всё вместе
const app = new AppPresenter(
  productModel,
  cartModel,
  buyerModel,
  api,
  modal,
  gallery,
  basketButton
);

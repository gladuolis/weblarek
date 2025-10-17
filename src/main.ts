import './scss/styles.scss';

import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { apiProducts } from './utils/data';
import { WebLarekAPI } from './components/Api/WebLarekAPI';
import { API_URL } from './utils/constants';


// Создаем экземпляры моделей ДО тестирования
const productsModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

// Тестирование моделей данных
console.log('=== Тестирование моделей данных ===');

// 1. Тестирование ProductModel
console.log('\n--- ProductModel ---');
productsModel.setItems(apiProducts.items);

console.log('Все товары:', productsModel.getItems());
console.log('Количество товаров:', productsModel.getItems().length);

const firstProduct = apiProducts.items[0];
productsModel.setSelectedItem(firstProduct);
console.log('Выбранный товар:', productsModel.getSelectedItem());

const productById = productsModel.getItemById('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Товар по ID:', productById);

// 2. Тестирование CartModel
console.log('\n--- CartModel ---');
console.log('Корзина пуста?:', cartModel.getItemsCount() === 0);

cartModel.addItem(firstProduct);
console.log('Добавили товар в корзину');
console.log('Товары в корзине:', cartModel.getItems());
console.log('Количество товаров в корзине:', cartModel.getItemsCount());
console.log('Общая стоимость корзины:', cartModel.getTotalPrice());
console.log('Содержит товар?:', cartModel.containsItem(firstProduct.id));

cartModel.removeItem(firstProduct);
console.log('Удалили товар из корзины');
console.log('Товары в корзине после удаления:', cartModel.getItems());

// 3. Тестирование BuyerModel
console.log('\n--- BuyerModel ---');
console.log('Данные покупателя (до заполнения):', buyerModel.getData());

buyerModel.setData({
  payment: 'card',
  email: 'test@test.ru',
  phone: '+79123456789',
  address: 'Москва, ул. Примерная, д. 1'
});

console.log('Данные покупателя (после заполнения):', buyerModel.getData());
console.log('Ошибки валидации:', buyerModel.validate());
console.log('Данные валидны?:', buyerModel.isValid());

// Тестирование частичного заполнения
buyerModel.setData({ email: 'new@test.ru' });
console.log('После частичного обновления email:', buyerModel.getData());

// Тестирование очистки
buyerModel.clearData();
console.log('После очистки:', buyerModel.getData());

// 4. Тестирование API
console.log('\n--- WebLarekAPI ---');

const api = new WebLarekAPI(API_URL);

// Тестируем получение товаров с сервера
try {
  console.log('Запрашиваем товары с сервера...');
  const productList = await api.getProductList();
  console.log('Товары получены с сервера:', productList);
  
  // Сохраняем в модель (теперь productsModel доступна)
  productsModel.setItems(productList.items);
  console.log('Товары сохранены в модель. Количество:', productsModel.getItems().length);
  
} catch (error) {
  console.error('Ошибка при получении товаров:', error);
}
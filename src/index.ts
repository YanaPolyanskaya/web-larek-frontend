import './scss/styles.scss';
// import 'src/scss/styles.scss'; выходит ошибка, если я указываю, путь, что вы аписали в замечании
import { EventEmitter } from './components/base/events';
import { ShopAPI } from './components/shopAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { AppStatus } from './components/data';
import { Page } from './components/page';
import { Modal } from './components/modal';
import { Basket } from './components/basket';
import { Order } from './components/order';
import { Card } from './components/card';
import { IOrder, ICard } from './types';
import { Success } from './components/success';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const rootElement = ensureElement<HTMLDivElement>('.page');
const modalElement = ensureElement<HTMLDivElement>('#modal-container', rootElement);

const appData = new AppStatus({}, events);
const page = new Page(rootElement, events);
const modal = new Modal(modalElement, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Order(cloneTemplate(contactsTemplate), events);

// API
api
	.getProducts()
	.then(appData.setStorage.bind(appData))
	// .catch((err) => console.log(err));
	.catch(console.error)


// Мониторинг событий 
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Изменение элементов каталога
events.on<{ catalog: ICard[] }>('items:changed', () => {
	page.catalog = appData.catalog.map((element) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', element),
		});

		return card.render({
			category: element.category,
			title: element.title,
			image: element.image,
			price: element.price,
		});
	});
});

// Открытие попапа карточки каталога
events.on('card:select', (element: ICard) => appData.setPreview(element));

// Изменение товара
events.on('preview:changed', (element: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('item:check', element);
			card.buttonElement =
				appData.basket.indexOf(element) === -1 ? 'В корзину' : 'Убрать из корзины';
		},
	});

	modal.render({
		content: card.render({
			category: element.category,
			title: element.title,
			image: element.image,
			description: element.description,
			button:
				appData.basket.indexOf(element) === -1 ? 'В корзину' : 'Убрать из корзины',
			price: element.price,
		}),
	});console.log(card)
});
//убрать консоль лог

// Блокировка и разблокировка скролла попапа
events.on('modal:open', page.lock.bind(page));
events.on('modal:close', page.unlock.bind(page));

// Изменение товаров в корзине через попап
events.on('item:check', (element: ICard) => {
	if (appData.basket.indexOf(element) === -1) events.emit('item:add', element);
	else events.emit('item:remove', element);
});

// Добавление товара в корзину
events.on('item:add', (element: ICard) => {
	appData.addToBasket(element);
	
//   element.selected = true;
//   appData.addToBasket(element);
  
//   modal.close();
console.log(appData)
});
//убрать консоль лог

// Удаление товара из корзины
events.on('item:remove', (element: ICard) => {
	appData.deleteFromBasket(element);
	if (!appData.basket.length) {
		basket.selected = appData.basket;
	  }
});

// Изменение счетчика товаров корзины
events.on('count:changed', () => (page.basketCounter = appData.basket.length));

// Обновление корзины
events.on('basket:changed', (items: ICard[]) => {
	basket.items = items.map((element, basketIndex) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('item:remove', element);
			},
		});
		return card.render({
			basketIndex: (basketIndex + 1).toString(),
			title: element.title,
			price: element.price,
		});
	});

	const total = items.reduce((total, element) => total + element.price, 0);

	basket.total = total;
	appData.order.total = total;
});

// Открытие корзины
events.on('basket:open', () => {
	basket.selected = appData.basket;

	modal.render({
		content: basket.render({}),
	});
});

// Открытие формы доставки
events.on('order:open', () => {
	appData.order.items = appData.basket.map((element) => element.id);

	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Проверка выбора способа оплаты
events.on('order:change', ({ name }: { name: string }) => {
	appData.order.payment = name;
	appData.validateOrderForm();
});

// Открытие формы контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Измененине состояния валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;

	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on('orderInput:change', (data: { field: keyof IOrder, value: string }) => {
	appData.setField(data.field, data.value);
});

// Отправление формы заказа
events.on('contacts:submit', () => {
	api
		.order(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			success.total = `Списано ${appData.order.total} синапсов`;
			appData.clearBasket();

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => console.error(err));
});

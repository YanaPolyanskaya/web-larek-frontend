import { IOrder, IFormErrors, ICard, IProduct } from '../types';
import { IEvents } from '../components/base/events';

export class Product<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	total: number | null;
	selected: boolean;

	constructor(data: unknown, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}

export class AppStatus extends Product<IProduct>{

	basket: ICard[] = [];
	catalog: ICard[];
	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: IFormErrors = {};

	addToBasket(element: ICard) {
		if (element.price !== null && this.basket.indexOf(element) === -1) {
			this.basket.push(element);
			this.emitChanges('count:changed', this.basket);
			this.emitChanges('basket:changed', this.basket);
		}
	}

	deleteFromBasket(element: ICard) {
		this.basket = this.basket.filter((it) => it != element);
		this.emitChanges('count:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges('count:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}

	getTotal() {
		return this.basket.reduce((total, element) => total + element.price, 0);
	}

	setStorage(items: ICard[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(element: ICard) {
		this.preview = element.id;
		this.emitChanges('preview:changed', element);
	}

	validateOrderForm() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	setField(field: keyof IOrder, value: string | number) {
		if (field === 'total') this.order[field] = value as number;

		else if (field === 'items') {
			this.order[field].push(value as string);
		}
		else this.order[field] = value as string;

		if (this.validateOrderForm()) this.events.emit('order:ready', this.order);
	}
}


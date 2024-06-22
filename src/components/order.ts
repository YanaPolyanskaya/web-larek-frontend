import { Form } from './form';
import { IOrder } from '../types';
import { IEvents } from './base/events';
import { ensureElements } from '../utils/utils';

export class Order extends Form<IOrder> {
	protected _payment: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._payment = ensureElements<HTMLButtonElement>('.button_alt', container);
		this._payment.forEach((button) => button.addEventListener('click', () => this.selected(button.name)));
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	selected(name: string) {
		this._payment.forEach((button) =>
			this.toggleClass(button, 'button_alt-active', button.name === name)
		);
		this.events.emit('order:change', { name });
	}


}
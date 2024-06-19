import { Component } from './base/component';
import { IEvents } from './base/events';
import { createElement } from '../utils/utils';
import { ICard, IBasket } from '../types/index';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;


	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._list = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button)
			this._button.addEventListener('click', () => events.emit('order:open'));

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) this._list.replaceChildren(...items);
		else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set selected(items: ICard[]) {
		if (items.length) this.setDisabled(this._button, false);
		else this.setDisabled(this._button, true);
	}

	set total(total: number) {
		this._total.textContent = String(total) + ' синапсов';
	}
}


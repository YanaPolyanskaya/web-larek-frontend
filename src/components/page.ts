import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IPage } from '../types/index';

export class Page extends Component<IPage> {
	protected _basketCounter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _pageWrapper: HTMLElement;
	protected _basketButton: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basketButton = ensureElement<HTMLElement>('.header__basket');

		this._basketButton.addEventListener('click', () =>
			this.events.emit('basket:open')

		);
	}

	set basketCounter(value: number) {
		this._basketCounter.textContent = String(value);
	}
	set catalog(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	lock() {
		this._pageWrapper.classList.add('page__wrapper_locked');
	}

	unlock() {
		this._pageWrapper.classList.remove('page__wrapper_locked');
	}
}

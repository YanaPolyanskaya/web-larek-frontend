import { ICard, ICardActions } from '../types';
import { Component } from './base/component';

export class Card extends Component<ICard> {
	protected _basketIndexElement: HTMLElement;
	protected _categoryElement: HTMLElement;
	protected _titleElement: HTMLElement;
	protected _imageElement: HTMLImageElement;
	protected _cardTextElement: HTMLElement;
	protected _buttonElement: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._basketIndexElement = container.querySelector('.basket__item-index');
		this._categoryElement = container.querySelector('.card__category');
		this._titleElement = container.querySelector('.card__title');
		this._imageElement = container.querySelector('.card__image');
		this._cardTextElement = container.querySelector('.card__text');
		this._buttonElement = container.querySelector('.card__button');
		this._price = container.querySelector('.card__price');

		if (actions.onClick) {
			if (this._buttonElement) {
				this._buttonElement.addEventListener('click', actions.onClick);
			} else {
				this.container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set basketIndex(value: string) {
		this._basketIndexElement.textContent = value;
	}

	get basketIndex(): string {
		return this._basketIndexElement.textContent || '';
	}

	// set categoryView(value: string) {

	// 	switch (value) {
	// 		case 'другое':
	// 			this._categoryElement.classList.add('card__category_other');
	// 			break;
	// 		case 'софт-скил':
	// 			this._categoryElement.classList.add('card__category_soft');
	// 			break;
	// 		case 'дополнительное':
	// 			this._categoryElement.classList.add('card__category_additional');
	// 			break;
	// 		case 'кнопка':
	// 			this._categoryElement.classList.add('card__category_button');
	// 			break;
	// 		case 'хард-скил':
	// 			this._categoryElement.classList.add('card__category_hard');
	// 			break;
	// 		default:
	// 			this._categoryElement.classList.add('card__category_other');
	// 			break;
	// 	}
	// }

	protected _categoryColor = <Record<string, string>>{ // описания категории
		"софт-скил": "soft",
		"другое": "other",
		"дополнительное": "additional",
		"кнопка": "button",
		"хард-скил": "hard"
	}

	// метод установки содержимой категории
	set category(value: string) {
		this._categoryElement.textContent = String(value);
		this.toggleClass(this._categoryElement, `card__category_${this._categoryColor[value]}`, true)
	}

	set title(value: string) {
		this._titleElement.textContent = String(value);
	}

	set image(src: string) {
		this._imageElement.src = src;
	}

	set description(description: string) {
		this._cardTextElement.textContent = description;
	}

	set buttonElement(value: string) {
		this._buttonElement.textContent = value;
	}

	set price(value: number | null) {
		// if (value === null) this.setText(this._price, 'Бесценно');
		//if (value === null) this._price.textContent = String(this._price) + ' Бесценно';
		if (value === null) this._price.textContent = 'Бесценно';
		else this._price.textContent = `${value.toString()} синапса(-ов)`
	}

	get price(): number {
		return Number(this._price.textContent || '');
	}
}

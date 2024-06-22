import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IFormStatus } from '../types/index';

export class Form<T> extends Component<IFormStatus> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);

		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement,
				field = target.name as keyof T,
				value = target.value;

			this.inputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();

			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected inputChange(field: keyof T, value: string) {
		this.events.emit('orderInput:change', {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	set errors(value: string) {
		this._errors.textContent = String(value);

	}

	render(status: Partial<T> & IFormStatus) {
		const { valid, errors, ...inputs } = status;

		super.render({ valid, errors });
		Object.assign(this, inputs);

		return this.container;
	}
}
export abstract class Component<T> {

	protected constructor(protected container: HTMLElement) { }

	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	setDisabled(element: HTMLElement, status: boolean) {
		if (element) {
			if (status) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});

		return this.container;
	}
}
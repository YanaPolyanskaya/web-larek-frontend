export type IApiResponse<T> = {
	total: number,
	items: T[]
}

export type IBasket = {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export type IProduct = {
	id: string;
	description: string;
	image: string;
	title: string;
	category: 
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';
	price?: number | null;
	selected: boolean;
}
export interface ICard extends IProduct {
	basketIndex?: string;
	button: string;
	isInBasket: boolean;
	index: number;
	productId?: string;
}

export type ICardActions = {
	onClick: (event: MouseEvent) => void;
}

export type IFormStatus = {
	valid: boolean;
	errors: string[];
}

export type IFormErrors = Partial<Record<keyof IOrder, string>>;

export type IModalData ={
	content: HTMLElement;
}

export type IOrder = {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

export type IPage = {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export type IShopAPI = {
	getProducts(): Promise<IProduct[]>;
	order(order: IOrder): Promise<ISuccessOrder>;
	getProductById?(id: string): Promise<IProduct>;
}

export type ISuccessOrder = {
	id: string;
	total: number;
}

export type ISuccess = {
	total: number;
}

export type ISuccessActions = {
	onClick: () => void;
}

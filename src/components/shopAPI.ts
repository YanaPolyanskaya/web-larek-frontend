import { IProduct, IShopAPI, IOrder, ISuccessOrder, IApiResponse } from '../types';
import { Api } from './base/api';

export class ShopAPI extends Api implements IShopAPI {
	cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);

		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: IApiResponse<IProduct>) =>
			data.items.map((element) => ({
				...element,
				image: this.cdn + element.image,
			}))
		);
	}

	order(order: IOrder): Promise<ISuccessOrder> {
		return this.post('/order', order).then((data: ISuccessOrder) => data);
	}
}

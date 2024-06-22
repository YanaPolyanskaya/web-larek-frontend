# Проектная работа "Веб-ларек"

Веб-ларек - это онлайн магазин для програмистов, в нем можно найти различные товары для разработчика.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

npm install
npm run start

или

yarn
yarn start

## Сборка

npm run build

или

yarn build

## Об архитектуре 

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.
 
## Классы в проекте и их описание

*Components/base*

# class EventEmitter implements IEvents

Класс предоставляет механизм для работы с событиями. Позволяет устанавливать слушатели на определённые события, инициировать события, и поддерживает дополнительные возможности: подписка на все события и использование шаблонов для слушателей.

свойства класса:

    _events: Map<EventName, Set<Subscriber>>

    constructor()

методы класса:
        
    trigger — делает коллбек триггер, генерирующий событие при вызове;
    on — добавляет слушателя на событие;
    off - удаляет слушателя с события;
    offAll - удаляет все слушатели с события;
    onAll - добавляет слушателя на все события;
    emit - инициирует событие;


# class Api

Класс предоставляет интерфейс для работы с внешними системами хранения и обработки данных для выполнения HTTP-запросов(GET, POST, PUT и DELETE).

свойства класса:

    baseUrl: string;
    options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально);

методы класса: 

    get — получает данные методом GET и преобразовывать в тип T;
    post — выполняет HTTP-запрос (POST, PUT, DELETE) по указанному URI и преобразовывать полученный результат в тип T;
    handleResponse — обрабатывает ответ от сервера, проверяет статус. Если статус ок - возвращает JSON-данные. Или же ошибку с аналогичным сообщением.

# abstract class Component<T>

Абстрактный класс представляет собой базовый компонент, в основе которого лежат все визуальные представления, включающие в себя базовые операции по использованию компонентов. Класс является дженериком и принимает тип данных для дальнейшей обработки данных этого типа в процессе отрисовки.

свойства класса:

    constructor(protected container: HTMLElement) — принимает данные из DOM;
    
методы класса:

    toggleClass - метод, который переключает класс;
    setDisabled - меняет статус disabled;
    render - возврашает корневой DOM-элемент.

*Components*

# class Basket extends Component<IBasket>

Класс для работы с отображением товаров в корзине. Наследуется от базового компонента. Позволяет удалить один или несколько выбранных товаров, увидеть их общую стоимость, или оформить заказ. Наследуется от базового компонента. Содержит приватные свойста.

свойства класса:

    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) — принимает DOM-элемент и обработчик событий;

методы класса: 

    set items - отображает товары в корзине;
    set selected — делает кнопку в корзине активной или нет, в зависимости от наличия товаров;
    set total — выводит общую стоимость товаров.

# class Card extends Component<ICard>

Класс для работы с карточкой товара и ее отображением в корзине, модальном окне или на странице. Наследуется от базового компонента. Содержит приватные свойства.

свойства класса:

    protected _basketIndexElement: HTMLElement;
	protected _categoryElement: HTMLElement;
	protected _titleElement: HTMLElement;
	protected _imageElement: HTMLImageElement;
	protected _cardTextElement: HTMLElement;
	protected _buttonElement: HTMLButtonElement;
	protected _price: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) — принимает HTML-элемент и обработчик события действий;

методы класса:

    set/get id — сеттер и геттер для уникального ID товара в каталоге;
    set/get basketIndex — идентификатор товара в корзине;
    set category — метод установки содержимой категории;
    set title — название товара;
    set image — устанавливает изображение товара;
    set description — устанавливает описание товара;
    set buttonElement — устанавливает значение для кнопки в карточке товара;
    get price — устанавливает стоимость товара;

# class AppStatus extends Product<IProduct>

Класс отслеживает изменения данных в корзине (добавление, удаление, оформление).

свойства класса:

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

методы класса:

    formErrors — объект с ошибками при валидации формы;
    addToBasket - добовляет выбранный товар в корзину;
    deleteFromBasket - удвляет выбранный товар из корзины;
    clearBasket — очищает корзину;
    getTotal — выводит общую сумму товаров;
    setStorage — устанавливает список товаров в каталоге;
    setPreview — предварительный просмотр выбранного товара;
    validateOrderForm — валидирует данные формы контактов и доставки;
    setField — устанавливает введеные данные в поля заказа если valid.

# class Form<T> extends Component<IFormStatus>

Класс для работы с контактной информацией, ввод данных и валидации в форме. Наследуется от базового компонента. Содержит приватные свойства.

свойства класса:

    protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) - принимает HTML-элемент и объект событий для обработки действий;

методы класса:

    protected inputChange — проверяет изменение значений в поле формы;
    set valid — устанавливает состояние валидности формы;
    set errors — выводит сообщение об ошибке;
    render — рендерит форму с передачей данных о состоянии и ошибках, если они есть.

# class Modal extends Component<IModalData> 

Класс для работы с модальными окнами. Реализует открытие, закрытие модального окна. Наследуется от базового компонента. 

свойства класса:

	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) - принимает HTML-элемент и объект событий для обработки действий;

методы класса:

    set content — выводит данные модального окна;
    open — открывает модальное окно;
    close — закрывает модальное окно;
    render — рендерит модальное окно с передачей данных о контенте.

# class Order extends Form<IOrder> 

Класс для работы с оформлением заказа. Представляет модальное окно оформления заказа с выбором типа оплаты, указанием адреса и контактных данных. Наследуется от базового компонента. Содержит приватные свойства.

свойства класса:

	protected _payment: HTMLButtonElement[];
	
	constructor(container: HTMLFormElement, events: IEvents) - принимает HTML-элемент и объект событий для обработки действий;

методы класса:

    set address - выводит адрес доставки;
    set email — выводит электронную почту;
    set phone — выводит номер телефона;
    selected — делает выбранный метод активным.

# class Page extends Component<IPage>  

Класс для работы с основной страницей. Отображает каталог товаров, иконку корзины с счетчиков выбранных товаров. Инициирует события в брокер при нажатии на кнопку корзины. Наследуется от базового компонента. Содержит приватные свойства.

свойства класса:

	protected _basketCounter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _pageWrapper: HTMLElement;
	protected _basketButton: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) — принимает HTML-элемент и объект событий для обработки действий;

методы класса:

    set basketCounter - элемент счетчика товаров в корзине;
    set catalog - каталог товаров;
    lock - блокирует скролл;
    unlock - разблокирует скролл.

# class ShopAPI extends Api implements IShopAPI 

Класс для работы с API. Отвечает за взаимодействие с внешним сервисом интернет-магазина. Наследуется от класса API.

свойства класса:

	cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) - принимает API_URL, CDN_URL и дополнительные опции;

методы класса:

    getProducts - получает каталог товаров;
    order - оформляет заказ.

# class Success extends Component<ISuccess> 

Класс для отоброжения модального окна с успешным оформлением заказа. Наследуется от базового компонента. Содержит приватные свойства.

свойства класса:

	protected _total: HTMLElement;
	protected _close: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions)

методы класса:

    set total - выводит итоговую сумму заказа.

# Types

Тип, описывающий входные данные
type IApiResponse<T> = {
	total: number,
	items: T[]
}

Тип, описывающий корзину товаров
type IBasket = {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

Тип, описывающий карточку товара в магазине
type IProduct = {
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

Интерфейс, описывающий карточку товара
interface ICard extends IProduct {
	basketIndex?: string;
	button: string;
	isInBasket: boolean;
	index: number;
	productId?: string;
}

Тип, описывающий метод onClick
type ICardActions = {
	onClick: (event: MouseEvent) => void;
}

Тип, описывающий статус валидации
type IFormStatus = {
	valid: boolean;
	errors: string[];
}

Тип, описывающий ошибки валидации форм
type IFormErrors = Partial<Record<keyof IOrder, string>>;

Тип, описывающий класс для работы с модальными окнами
type IModalData ={
	content: HTMLElement;
}

Тип, описывающий окно оформления товара
type IOrder = {
	payment: string;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

Тип, описывающий страницу
type IPage = {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

Тип, описывающий методы для работы с данными
type IShopAPI = {
	getProducts(): Promise<IProduct[]>;
	order(order: IOrder): Promise<ISuccessOrder>;
	getProductById?(id: string): Promise<IProduct>;
}

Тип, описывающий окно успешного заказа
type ISuccessOrder = {
	id: string;
	total: number;
}
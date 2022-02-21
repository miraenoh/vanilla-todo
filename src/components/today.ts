export default class Today {
	public el: HTMLHeadingElement;

	protected date: string;

	constructor() {
		const date = new Date();
		this.date = new Date().toISOString().split('T')[0];
		this.date = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${date
			.getDate()
			.toString()
			.padStart(2, '0')}`;

		this.el = document.createElement('h1');
		this.el.textContent = this.date;
	}
}

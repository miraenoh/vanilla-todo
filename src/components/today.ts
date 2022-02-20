export default class Today {
	public el: HTMLHeadingElement;

	protected date: string;

	constructor() {
		const date: Date = new Date();
		this.date = new Date().toISOString().split('T')[0];
		this.date = `${date.getFullYear()}-${this.leftPad(date.getMonth())}-${this.leftPad(
			date.getDate()
		)}`;

		this.el = document.createElement('h1');
		this.el.textContent = this.date;
	}

	protected leftPad(n: number): string {
		return `${n >= 10 ? n : '0' + n}`;
	}
}

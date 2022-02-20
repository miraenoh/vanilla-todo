import { TodoData } from '../entities/todo-data.entity';
import TodoList from './todo-list';

export default class Todo {
	public el: HTMLLIElement;

	protected data: TodoData;
	protected parent: TodoList;

	constructor(data: TodoData, parent: TodoList) {
		this.data = data;
		this.parent = parent;

		this.el = this.createEl();
	}

	protected createEl(): HTMLLIElement {
		const todoEl: HTMLLIElement = document.createElement('li');
		todoEl.classList.add('todo');
		todoEl.id = this.data.id.toString();

		// input, title text 그룹 (left)
		const leftSpanEl: HTMLSpanElement = document.createElement('span');
		const todoCheckboxEl: HTMLInputElement = document.createElement('input');
		todoCheckboxEl.setAttribute('type', 'checkbox');
		const todoTitleEl: HTMLSpanElement = document.createElement('span');
		todoTitleEl.classList.add('todo-title');
		todoTitleEl.textContent = this.data.title;
		leftSpanEl.append(todoCheckboxEl);
		leftSpanEl.append(todoTitleEl);

		// button 그룹 (right)
		const rightSpanEl: HTMLSpanElement = document.createElement('span');
		const todoEditButton: HTMLButtonElement = document.createElement('button');
		todoEditButton.textContent = '수정';
		const todoDeleteButton: HTMLButtonElement = document.createElement('button');
		todoDeleteButton.addEventListener('click', () => {
			this.parent.deleteTodo(this.el);
		});
		todoDeleteButton.textContent = '삭제';
		rightSpanEl.append(todoEditButton);
		rightSpanEl.append(todoDeleteButton);

		todoEl.append(leftSpanEl);
		todoEl.append(rightSpanEl);

		return todoEl;
	}
}

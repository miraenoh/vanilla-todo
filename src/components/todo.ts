import { ITodo } from '../entities/todo-data.entity';
import TodoList from './todo-list';

export default class Todo {
	public el: HTMLLIElement;

	public data: ITodo;
	protected parent: TodoList;

	constructor(data: ITodo, parent: TodoList) {
		this.data = data;
		this.parent = parent;

		this.el = this.createEl();
		if (this.data.completed) this.el.classList.add('todo-completed');
	}

	protected createEl(): HTMLLIElement {
		const todoEl: HTMLLIElement = document.createElement('li');
		todoEl.classList.add('todo');
		todoEl.id = this.data.id.toString();
		todoEl.insertAdjacentHTML(
			'afterbegin',
			`
		<span>
			<input type="checkbox" class="todo-checkbox" ${this.data.completed ? 'checked' : ''} />
			<span class="todo-title">${this.data.title}</span>
		</span>
		<span>
			<button class="todo-edit-button">수정</button>
			<button class="todo-delete-button">삭제</button>
		</span>
		`
		);

		return todoEl;
	}

	public complete(): void {
		this.data.completed = true;

		this.el.classList.add('todo-completed');
	}

	public unComplete(): void {
		this.data.completed = false;

		this.el.classList.remove('todo-completed');
	}
}

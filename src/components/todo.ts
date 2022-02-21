import { ITodo } from '../entities/todo-data.entity';
import TodoList from './todo-list';

export default class Todo {
	public el: HTMLLIElement;

	protected data: ITodo;
	protected parent: TodoList;

	constructor(data: ITodo, parent: TodoList) {
		this.data = data;
		this.parent = parent;

		this.el = this.createEl();
	}

	protected createEl(): HTMLLIElement {
		const todoEl: HTMLLIElement = document.createElement('li');
		todoEl.classList.add('todo');
		todoEl.id = this.data.id.toString();
		todoEl.insertAdjacentHTML(
			'afterbegin',
			`
		<span>
			<input type="checkbox" />
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
}

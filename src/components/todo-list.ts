import { SERVER_URL } from '../config';
import { ITodo } from '../entities/todo-data.entity';
import Todo from './todo';

export default class TodoList {
	public todosEl: HTMLUListElement;
	public leftTodosEl: HTMLSpanElement;
	public formEl: HTMLFormElement;

	protected leftTodos: number;

	constructor() {
		this.todosEl = document.createElement('ul');
		this.leftTodosEl = document.createElement('span');
		this.formEl = document.createElement('form');

		this.leftTodos = 0;

		this.getTodosData()
			.then((todosData) => {
				this.leftTodos = todosData.length;

				for (const todoData of todosData) {
					this.todosEl.append(new Todo(todoData, this).el);
				}
			})
			.finally(() => {
				this.updateLeftTodosEl();
				this.createFormElement();

				this.todosEl.addEventListener('click', this.clickEventHandler);
				this.formEl.addEventListener('submit', this.addTodo);
			});
	}

	// TODO 1. eventListener를 todosEl에 등록?
	protected clickEventHandler = (event: Event) => {
		const targetEl = event.target as HTMLElement;
		if (targetEl.classList.contains('todo-delete-button')) {
			this.deleteTodo(targetEl.parentElement?.parentElement as HTMLLIElement);
		}
	};

	protected addTodo = async (event: Event): Promise<void> => {
		event.preventDefault();

		const inputEl = document.querySelector('#todo-title-input') as HTMLInputElement;

		const res: Response = await fetch(`${SERVER_URL}/todos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				title: inputEl.value,
				completed: false
			})
		});
		if (res.ok) {
			const todoData: ITodo = await res.json();
			this.leftTodos++;

			inputEl.value = '';
			this.todosEl.append(new Todo(todoData, this).el);
			this.updateLeftTodosEl();
		} else console.error(res);
	};

	public deleteTodo = async (todoEl: HTMLLIElement): Promise<void> => {
		const res: Response = await fetch(`${SERVER_URL}/todos/${todoEl.id}`, { method: 'DELETE' });
		if (res.ok) {
			this.leftTodos--;
			todoEl.remove();

			this.updateLeftTodosEl();
		} else console.error(res);
	};

	protected async getTodosData(): Promise<ITodo[]> {
		const res: Response = await fetch(`${SERVER_URL}/todos`);
		if (res.ok) {
			return await res.json();
		} else {
			console.error(res);
			return [];
		}
	}

	protected updateLeftTodosEl(): void {
		this.leftTodosEl.textContent = `할 일이 ${this.leftTodos}개 남았습니다.`;
	}

	protected createFormElement(): void {
		this.formEl.classList.add('box');
		this.formEl.insertAdjacentHTML(
			'afterbegin',
			`
		<input id="todo-title-input" type="text" required />
		`
		);
	}
}

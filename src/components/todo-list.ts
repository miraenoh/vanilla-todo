import { SERVER_URL } from '../config';
import { TodoData } from '../entities/todo-data.entity';
import Todo from './todo';

export default class TodoList {
	public todosEl: HTMLUListElement;
	public leftTodosEl: HTMLSpanElement;
	public formEl: HTMLFormElement;
	protected inputEl: HTMLInputElement;

	protected leftTodos: number;

	constructor() {
		this.todosEl = document.createElement('ul');
		this.leftTodosEl = document.createElement('span');
		this.formEl = document.createElement('form');
		this.inputEl = document.createElement('input');

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
			});
	}

	protected addTodo = async (event: Event): Promise<void> => {
		event.preventDefault();

		const res: Response = await fetch(`${SERVER_URL}/todos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				title: this.inputEl.value,
				completed: false
			})
		});

		if (res.ok) {
			const todoData: TodoData = await res.json();
			this.increaseLeftTodos();

			this.inputEl.value = '';
			this.todosEl.append(new Todo(todoData, this).el);
			this.updateLeftTodosEl();
		} else console.error(res);
	};

	public deleteTodo = async (todoEl: HTMLLIElement): Promise<void> => {
		const res: Response = await fetch(`${SERVER_URL}/todos/${todoEl.id}`, { method: 'DELETE' });
		if (res.ok) {
			this.decreaseLeftTodos();
			todoEl.remove();

			this.updateLeftTodosEl();
		} else console.error(res);
	};

	protected async getTodosData(): Promise<TodoData[]> {
		const res: Response = await fetch(`${SERVER_URL}/todos`);
		if (res.ok) {
			return await res.json();
		} else {
			console.error(res);
			return [];
		}
	}

	public increaseLeftTodos(): void {
		this.leftTodos++;
	}

	public decreaseLeftTodos(): void {
		this.leftTodos--;
	}

	protected updateLeftTodosEl(): void {
		this.leftTodosEl.textContent = `할 일이 ${this.leftTodos}개 남았습니다.`;
	}

	protected createFormElement(): void {
		this.inputEl.id = 'todo-title-input';
		this.inputEl.setAttribute('type', 'text');
		this.inputEl.setAttribute('required', 'true');

		this.formEl.classList.add('box');
		this.formEl.append(this.inputEl);
		this.formEl.addEventListener('submit', this.addTodo);
	}
}

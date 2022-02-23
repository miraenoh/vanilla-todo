import { ITodo } from '../entities/i-todo.entity';
import Todo from './todo';
import todoApi from '../apis/todo.api';

export default class TodoList {
	public todosEl: HTMLUListElement;
	public leftTodosEl: HTMLSpanElement;
	public formEl: HTMLFormElement;

	protected todos: { [id: number]: Todo };
	constructor() {
		this.todosEl = document.createElement('ul');
		this.leftTodosEl = document.createElement('span');
		this.leftTodosEl.classList.add('left-todos');
		this.formEl = document.createElement('form');
		this.todosEl.addEventListener('click', this.clickEventHandler);
		this.formEl.addEventListener('submit', this.addTodo);

		this.todos = [];
		todoApi
			.getAll()
			.then((todosData) => {
				for (const todoData of todosData) {
					this.createTodo(todoData);
				}
			})
			.finally(() => {
				this.renderLeftTodos();
				this.renderForm();
			});
	}

	protected clickEventHandler = (event: Event) => {
		const targetEl = event.target as HTMLElement;

		if (targetEl.classList.contains('todo-delete-button')) {
			// Delete button clicked
			const todoEl = targetEl.parentElement?.parentElement as HTMLLIElement;
			this.deleteTodo(todoEl);
		} else if (targetEl.classList.contains('todo-edit-button')) {
			// Edit button clicked
			const todoEl = targetEl.parentElement?.parentElement as HTMLLIElement;
			this.updateTodoTitle(todoEl);
		} else if (targetEl instanceof HTMLInputElement && targetEl.type === 'checkbox') {
			// Checkbox clicked
			const todoEl = targetEl.parentElement?.parentElement?.parentElement as HTMLLIElement;
			this.updateTodoCompleted(todoEl, targetEl.checked);
		}
	};

	protected addTodo = async (event: Event): Promise<void> => {
		event.preventDefault();

		const inputEl = document.querySelector('#todo-title-input') as HTMLInputElement;

		const todoData = await todoApi.add(inputEl.value);
		this.createTodo(todoData);

		inputEl.value = '';
		this.renderLeftTodos();
	};

	protected createTodo(todoData: ITodo): void {
		const todo = new Todo(todoData, this);
		this.todos[todoData.id] = todo;

		this.todosEl.append(todo.el);
	}

	protected updateTodoCompleted = async (
		todoEl: HTMLLIElement,
		completed: boolean
	): Promise<void> => {
		await todoApi.updateCompleted(todoEl.id, completed);

		const todo = this.todos[+todoEl.id];
		completed ? todo.complete() : todo.unComplete();

		this.renderLeftTodos();
	};

	protected updateTodoTitle = async (todoEl: HTMLLIElement): Promise<void> => {
		const todoTitleEl = todoEl.querySelector('.todo-title') as HTMLSpanElement;
		const newTodoTitle = prompt(
			'변경할 투두 제목을 입력해주세요.',
			todoTitleEl.textContent ? todoTitleEl.textContent : ''
		);

		if (newTodoTitle && newTodoTitle !== todoTitleEl.textContent) {
			await todoApi.updateTitle(+todoEl.id, newTodoTitle);

			this.todos[+todoEl.id].updateTitle(newTodoTitle);
		}
	};

	protected deleteTodo = async (todoEl: HTMLLIElement): Promise<void> => {
		await todoApi.delete(todoEl.id);

		delete this.todos[+todoEl.id];

		todoEl.remove();
		this.renderLeftTodos();
	};

	get leftTodos() {
		return Object.values(this.todos).filter((todo) => !todo.data.completed).length;
	}

	protected renderLeftTodos(): void {
		this.leftTodosEl.textContent = `할 일이 ${this.leftTodos}개 남았습니다.`;
	}

	protected renderForm(): void {
		this.formEl.classList.add('box');
		this.formEl.insertAdjacentHTML(
			'afterbegin',
			`
		<input id="todo-title-input" type="text" required />
		`
		);
	}
}

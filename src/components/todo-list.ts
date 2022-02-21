import { SERVER_URL } from '../config';
import { ITodo } from '../entities/i-todo.entity';
import Todo from './todo';

export default class TodoList {
	public todosEl: HTMLUListElement;
	public leftTodosEl: HTMLSpanElement;
	public formEl: HTMLFormElement;

	protected todos: { [id: number]: Todo };

	constructor() {
		this.todosEl = document.createElement('ul');
		this.leftTodosEl = document.createElement('span');
		this.formEl = document.createElement('form');

		this.todos = [];

		this.getTodosData()
			.then((todosData) => {
				for (const todoData of todosData) {
					this.createTodo(todoData);
				}
			})
			.finally(() => {
				this.updateLeftTodosEl();
				this.createFormElement();

				// TODO 1. eventListener를 todosEl에 등록?
				this.todosEl.addEventListener('click', this.clickEventHandler);
				this.formEl.addEventListener('submit', this.addTodo);
			});
	}

	protected clickEventHandler = (event: Event) => {
		const targetEl = event.target as HTMLElement;
		const todoEl = targetEl.parentElement?.parentElement as HTMLLIElement;

		if (targetEl.classList.contains('todo-delete-button')) {
			// Delete button clicked
			this.deleteTodo(todoEl);
		} else if (targetEl.classList.contains('todo-edit-button')) {
			// Edit button clicked
			this.changeTodoTitle(todoEl);
		} else if (targetEl instanceof HTMLInputElement && targetEl.type === 'checkbox') {
			// Checkbox clicked
			this.updateTodoCompleted(todoEl, targetEl.checked);
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
			this.createTodo(todoData);

			inputEl.value = '';
			this.updateLeftTodosEl();
		} else console.error(res);
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
		const res: Response = await fetch(`${SERVER_URL}/todos/${todoEl.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				completed
			})
		});

		if (res.ok) {
			const todo = this.todos[+todoEl.id];
			completed ? todo.complete() : todo.unComplete();

			this.updateLeftTodosEl();
		} else console.error(res);
	};

	protected changeTodoTitle = async (todoEl: HTMLLIElement): Promise<void> => {
		const todoTitleEl = todoEl.querySelector('.todo-title') as HTMLSpanElement;
		const newTodoTitle = prompt(
			'변경할 투두 제목을 입력해주세요.',
			todoTitleEl.textContent ? todoTitleEl.textContent : ''
		);

		if (newTodoTitle && newTodoTitle !== todoTitleEl.textContent) {
			this.updateTodoTitle(+todoEl.id, newTodoTitle);
		}
	};

	protected updateTodoTitle = async (todoId: number, newTodoTitle: string): Promise<void> => {
		const res: Response = await fetch(`${SERVER_URL}/todos/${todoId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				title: newTodoTitle
			})
		});

		if (res.ok) {
			this.todos[todoId].updateTitle(newTodoTitle);
		} else console.error(res);
	};

	protected deleteTodo = async (todoEl: HTMLLIElement): Promise<void> => {
		const res: Response = await fetch(`${SERVER_URL}/todos/${todoEl.id}`, { method: 'DELETE' });
		if (res.ok) {
			delete this.todos[+todoEl.id];
			console.log(this.todos);

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
		/* TODO 2. 이렇게 계산 할지 leftTodo를 property로 만들어서 ++, -- 할지?
		이렇게 하려면 Todo.data를 public으로 해야 하는데 괜찮나?
		*/
		const leftTodos = Object.values(this.todos).filter((todo) => !todo.data.completed).length;
		this.leftTodosEl.textContent = `할 일이 ${leftTodos}개 남았습니다.`;
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

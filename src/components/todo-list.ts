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
				this.updateLeftTodosEl();
				this.createFormElement();
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
			this.changeTodoTitle(todoEl);
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
		this.updateLeftTodosEl();
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

		this.updateLeftTodosEl();
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
		await todoApi.updateTitle(todoId, newTodoTitle);

		this.todos[todoId].updateTitle(newTodoTitle);
	};

	protected deleteTodo = async (todoEl: HTMLLIElement): Promise<void> => {
		await todoApi.delete(todoEl.id);

		delete this.todos[+todoEl.id];

		todoEl.remove();
		this.updateLeftTodosEl();
	};

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

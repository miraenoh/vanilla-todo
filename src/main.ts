import './style.css';

import { SERVER_URL } from './config';
import { Todo } from './entities/todo.entity';
import { CreateTodoDTO } from './dto/create-todo.dto';

let todos: Todo[] = [];

const todoListEl = document.querySelector<HTMLUListElement>('#todo-list');
const todoFormEl = document.querySelector<HTMLFormElement>('#todo-form');

// 오늘 날짜 표시
const paintDate = (): void => {
	const dateEl = document.querySelector<HTMLHeadingElement>('#date');
	dateEl ? (dateEl.innerText = new Date().toISOString().split('T')[0]) : null;
};

const updateNLeftTodos = (): void => {
	const nleftTodosEl = document.querySelector<HTMLSpanElement>('#n-left-todos');
	nleftTodosEl ? (nleftTodosEl.innerHTML = todos.length.toString()) : null;
};

const alertError = (res: Response): void => {
	alert('HTTP ERROR' + res.status);
};

const createTodoElement = (todo: Todo): HTMLLIElement => {
	// 투두 li
	const todoEl: HTMLLIElement = document.createElement('li');
	todoEl.classList.add('todo');
	todoEl.id = todo.id.toString();

	// input, title text 그룹 (left)
	const leftSpanEl: HTMLSpanElement = document.createElement('span');
	const todoCheckboxEl: HTMLInputElement = document.createElement('input');
	todoCheckboxEl.setAttribute('type', 'checkbox');
	const todoTitleEl: HTMLSpanElement = document.createElement('span');
	todoTitleEl.classList.add('todo-title');
	todoTitleEl.innerText = todo.title;
	leftSpanEl.appendChild(todoCheckboxEl);
	leftSpanEl.appendChild(todoTitleEl);

	// button 글룹 (right)
	const rightSpanEl: HTMLSpanElement = document.createElement('span');
	const todoEditButton: HTMLButtonElement = document.createElement('button');
	todoEditButton.classList.add('todo-edit-button');
	todoEditButton.innerText = '수정';
	const todoDeleteButton: HTMLButtonElement = document.createElement('button');
	todoDeleteButton.classList.add('todo-edit-button');
	todoDeleteButton.innerText = '삭제';
	rightSpanEl.appendChild(todoEditButton);
	rightSpanEl.appendChild(todoDeleteButton);

	todoEl.appendChild(leftSpanEl);
	todoEl.appendChild(rightSpanEl);

	return todoEl;
};

// 투두 목록 읽어온 후 표시
const paintTodos = async (): Promise<void> => {
	// 투두 읽어오기
	const res: Response = await fetch(SERVER_URL + '/todos');
	if (res.ok) {
		todos = await res.json();
	} else alertError(res);

	// 투두 그리기
	for (const todo of todos) {
		todoListEl ? todoListEl.appendChild(createTodoElement(todo)) : null;
	}
};

const addTodo = async (event: Event): Promise<void> => {
	event.preventDefault();

	// 추가할 todo 생성
	const todoTitleInputEl = document.querySelector<HTMLInputElement>('#todo-title-input');
	const todoTitle: string = todoTitleInputEl!.value;
	const newTodoData: CreateTodoDTO = {
		title: todoTitle,
		completed: false
	};
	console.log(JSON.stringify(newTodoData));

	// POST로 todo 추가 request 전송
	const res: Response = await fetch(SERVER_URL + '/todos', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(newTodoData)
	});

	if (res.ok) {
		// todo 추가 성공. 화면 update
		todoTitleInputEl!.value = '';
		const todo = await res.json();
		todos.push(todo);
		todoListEl?.appendChild(createTodoElement(todo));
		updateNLeftTodos();
	} else alertError(res);
};

paintDate();
paintTodos().then(updateNLeftTodos);

todoFormEl?.addEventListener('submit', addTodo);

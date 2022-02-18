import './style.css';

import { SERVER_URL } from './config';
import { Todo } from './entities/todo.entity';

// 오늘 날짜 표시
const paintDate = (): void => {
	const dateEl = document.querySelector<HTMLHeadingElement>('#date');
	dateEl ? (dateEl.innerText = new Date().toISOString().split('T')[0]) : null;
};

const alertError = (res: Response) => {
	alert('HTTP ERROR' + res.status);
};

let todos: Todo[] = [];

// 투두 목록 읽어온 후 표시
const paintTodos = async (): Promise<void> => {
	// 투두 읽어오기
	const res: Response = await fetch(SERVER_URL + '/todos');
	if (res.ok) {
		todos = await res.json();
	} else alertError(res);

	// 투두 그리기
	for (const todo of todos) {
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
		const todoListEl = document.querySelector<HTMLUListElement>('#todo-list');
		todoListEl ? todoListEl.appendChild(todoEl) : null;
	}
};

paintDate();
paintTodos();

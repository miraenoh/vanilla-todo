import Today from './components/today';
import TodoList from './components/todo-list';
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
	const headerEl = document.querySelector<HTMLElement>('header');
	const mainEl = document.querySelector<HTMLElement>('main');

	const today: Today = new Today();
	headerEl && headerEl.append(today.el);

	const todoList: TodoList = new TodoList();
	headerEl && headerEl.append(todoList.leftTodosEl);
	mainEl && mainEl.append(todoList.todosEl);
	mainEl && mainEl.after(todoList.formEl);
});

import Today from './components/today';
import TodoList from './components/todo-list';

document.addEventListener('DOMContentLoaded', () => {
	const headerEl = document.querySelector('header') as HTMLElement;
	const mainEl = document.querySelector('main') as HTMLElement;

	const today = new Today();
	headerEl.append(today.el);

	const todoList = new TodoList();
	headerEl.append(todoList.leftTodosEl);
	mainEl.append(todoList.todosEl);
	mainEl.after(todoList.formEl);
});

import { SERVER_URL } from '../config';
import { ITodo } from '../entities/i-todo.entity';

async function request(url: string, options?: RequestInit) {
	try {
		const res = await fetch(url, options);
		if (res.ok) {
			return await res.json();
		} else console.error(await res.json());
	} catch (err) {
		console.error(err);
	}
}

const todoApi = {
	add: async (title: string): Promise<ITodo> => {
		return await request(`${SERVER_URL}/todos`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				title,
				completed: false
			})
		});
	},
	getAll: async (): Promise<ITodo[]> => {
		return await request(`${SERVER_URL}/todos`);
	},
	updateTitle: async (id: number | string, title: string) => {
		return await request(`${SERVER_URL}/todos/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				title: title
			})
		});
	},
	updateCompleted: async (id: number | string, completed: boolean) => {
		return await request(`${SERVER_URL}/todos/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify({
				completed
			})
		});
	},
	delete: async (id: number | string) => {
		return await request(`${SERVER_URL}/todos/${id}`, { method: 'DELETE' });
	}
};

export default todoApi;

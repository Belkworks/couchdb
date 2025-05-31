import { RequestClient } from "./RequestClient";

type BaseDocument = {
	_id: string;
	_rev: string;
};

type DocumentResponse = {
	id: string;
	ok: true;
	rev: string;
};

export class Database {
	constructor(
		private readonly client: RequestClient,
		readonly name: string,
	) {}

	async create<T extends object>(data: T) {
		return this.client.post<DocumentResponse>({
			path: `/${this.name}`,
			body: data,
		});
	}

	async get<T = object>(id: string, rev?: string) {
		return this.client.get<T & BaseDocument>({
			path: `/${this.name}/${id}`,
			query: { rev },
		});
	}

	async update<T extends object>(id: string, data: T, rev?: string) {
		return this.client.put<DocumentResponse>({
			path: `/${this.name}/${id}`,
			body: data,
			query: { rev },
		});
	}

	async delete(id: string, rev: string) {
		return this.client.delete<DocumentResponse>({
			path: `/${this.name}/${id}`,
			query: { rev },
		});
	}

	async bulkGet<T = object>(ids: (string | { id: string; rev?: string })[]) {
		return this.client.post<{ results: { id: string; docs: T & BaseDocument }[] }>({
			path: `/${this.name}/_all_docs`,
			body: { keys: ids.map((id) => (typeIs(id, "string") ? { id } : id)) },
		});
	}
}

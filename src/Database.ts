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

type DocumentDiscriminator = string | { id: string; rev?: string };

type MangoQuery<T> = {
	selector: Partial<T> & object;
	limit?: number;
	skip?: number;
	bookmark?: string;
	sort?: (string | { [key: string]: "asc" | "desc" })[];
	fields?: (keyof T)[];
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

	async get<T extends object = object>(id: string, rev?: string) {
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

	async bulkGet<T extends object = object>(ids: DocumentDiscriminator[]) {
		return this.client.post<{ results: { id: string; docs: T & BaseDocument }[] }>({
			path: `/${this.name}/_all_docs`,
			body: { keys: ids.map((id) => (typeIs(id, "string") ? { id } : id)) },
		});
	}

	async find<T extends object = object>(query: MangoQuery<T & BaseDocument>) {
		return this.client.post<{ docs: (T & BaseDocument)[]; bookmark: string }>({
			path: `/${this.name}/_find`,
			body: query,
		});
	}
}

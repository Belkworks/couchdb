import { Database } from "./Database";
import { RequestClient } from "./RequestClient";

type CouchDBOptions = {
	url: string;
	// TODO: auth options
};

export class CouchDB {
	private readonly client: RequestClient;

	constructor(options: CouchDBOptions) {
		this.client = new RequestClient({
			baseUrl: options.url,
		});
	}

	database(name: string) {
		return new Database(this.client, name);
	}

	createDatabase(name: string) {
		return this.client.put({ path: `/${name}` });
	}

	listDatabases() {
		return this.client.get<string[]>({ path: "/_all_dbs" });
	}
}

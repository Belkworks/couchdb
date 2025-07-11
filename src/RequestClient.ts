import { HttpService } from "@rbxts/services";

const encodeURIComponent = (value: string | number | boolean): string => HttpService.UrlEncode(tostring(value));

export const queryString = (query?: Query): string => {
	if (!query) return "";

	let parts: string[] = [];

	for (const [key, value] of query as unknown as Map<string, string | number | boolean>)
		parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

	return parts.isEmpty() ? "" : `?${parts.join("&")}`;
};

export type Query = { [key: string]: string | number | boolean | undefined };

export type Request = {
	method: RequestAsyncRequest["Method"];
	path: string;
	body?: object;
	query?: Query;
};

type ClientOptions = {
	baseUrl: string;
	headers?: HttpHeaders;
};

export class RequestClient {
	constructor(private readonly options: ClientOptions) {}

	async execute<T>(request: Request): Promise<T> {
		const url = `${this.options.baseUrl}${request.path}${queryString(request.query)}`;

		const res = HttpService.RequestAsync({
			Method: request.method,
			Url: url,
			Body: request.body ? HttpService.JSONEncode(request.body) : undefined,
			Headers: this.options.headers,
		});

		assert(res.Success, `${request.method} ${request.path} ${res.StatusCode} ${res.StatusMessage}: ${res.Body}`);

		// TODO: custom errors

		return HttpService.JSONDecode(res.Body) as T;
	}

	private createMethod(method: RequestAsyncRequest["Method"]) {
		return <T>(request: Omit<Request, "method">) => this.execute<T>({ method, ...request });
	}

	readonly get = this.createMethod("GET");
	readonly post = this.createMethod("POST");
	readonly put = this.createMethod("PUT");
	readonly delete = this.createMethod("DELETE");
	readonly head = this.createMethod("HEAD");
	readonly patch = this.createMethod("PATCH");
}

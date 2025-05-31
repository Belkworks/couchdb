import { HttpService } from "@rbxts/services";
import { Request } from "./types";
import { queryString } from "./util";

type ClientOptions = {
	baseUrl: string;
	headers?: HttpHeaders;
};

export class RequestClient {
	constructor(private readonly options: ClientOptions) {}

	private async execute<T>(request: Request): Promise<T> {
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

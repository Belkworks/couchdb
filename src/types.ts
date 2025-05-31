export type Query = { [key: string]: string | number | boolean | undefined };

export type Request = {
	method: RequestAsyncRequest["Method"];
	path: string;
	body?: object;
	query?: Query;
};

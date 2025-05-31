import { HttpService } from "@rbxts/services";
import { Query } from "./types";

const encodeURIComponent = (value: string | number | boolean): string => HttpService.UrlEncode(tostring(value));

export const queryString = (query?: Query): string => {
	if (!query) return "";

	let parts: string[] = [];

	for (const [key, value] of query as unknown as Map<string, string | number | boolean>)
		parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

	return parts.isEmpty() ? "" : `?${parts.join("&")}`;
};

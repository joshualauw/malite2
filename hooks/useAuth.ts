import { AUTH_URL, BASE_URL, CODE_CHALLENGE, MAL_CLIENT_ID, MAL_CLIENT_SECRET, MAL_URL } from "../const/api";
import { Credentials } from "../types/Credentials";
import { User } from "../types/User";
import $axios from "../lib/axios";

export function useAuth() {
    function authorize(credentials: any) {
        const auth = JSON.parse(credentials || "{}") as Credentials;
        return auth.access_token;
    }

    async function refreshToken(token: string) {
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", token);

        return await $axios.post<Credentials>("/token", params, {
            baseURL: AUTH_URL,
            auth: { username: MAL_CLIENT_ID, password: MAL_CLIENT_SECRET },
        });
    }

    async function logout() {
        await $axios.delete("/api/auth", { baseURL: BASE_URL });

        window.location.reload();
    }

    function requestAuthPermission() {
        let baseUrl = `${AUTH_URL}/authorize?`;
        baseUrl += "response_type=code&";
        baseUrl += `client_id=${MAL_CLIENT_ID}&`;
        baseUrl += `code_challenge=${CODE_CHALLENGE}`;

        window.location.href = baseUrl;
    }

    async function login(code: string) {
        const params = new URLSearchParams();
        params.append("client_id", MAL_CLIENT_ID);
        params.append("client_secret", MAL_CLIENT_SECRET);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("code_verifier", CODE_CHALLENGE);

        return await $axios.post<Credentials>("/token", params, {
            baseURL: AUTH_URL,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
    }

    async function getMe(token: string) {
        return await $axios.get<User>("/users/@me", {
            params: {
                fields: "anime_statistics",
            },
            baseURL: MAL_URL,
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    return { requestAuthPermission, login, getMe, authorize, logout, refreshToken };
}

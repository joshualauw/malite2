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
            baseURL: process.env.AUTH_URL,
            auth: { username: process.env.MAL_CLIENT_ID, password: process.env.MAL_CLIENT_SECRET },
        });
    }

    async function logout() {
        await $axios.delete("/api/auth", { baseURL: process.env.BASE_URL });

        window.location.reload();
    }

    function requestAuthPermission() {
        let baseUrl = `${process.env.AUTH_URL}/authorize?`;
        baseUrl += "response_type=code&";
        baseUrl += `client_id=${process.env.MAL_CLIENT_ID}&`;
        baseUrl += `code_challenge=${process.env.CODE_CHALLENGE}`;

        window.location.href = baseUrl;
    }

    async function login(code: string) {
        const params = new URLSearchParams();
        params.append("client_id", process.env.MAL_CLIENT_ID);
        params.append("client_secret", process.env.MAL_CLIENT_SECRET);
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("code_verifier", process.env.CODE_CHALLENGE);

        return await $axios.post<Credentials>("/token", params, {
            baseURL: process.env.AUTH_URL,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
    }

    async function getMe(token: string) {
        return await $axios.get<User>("/users/@me", {
            params: {
                fields: "anime_statistics",
            },
            baseURL: process.env.MAL_URL,
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    return { requestAuthPermission, login, getMe, authorize, logout, refreshToken };
}

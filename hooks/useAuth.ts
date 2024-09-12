import { AUTH_URL, BASE_URL, CODE_CHALLENGE, MAL_CLIENT_ID, MAL_CLIENT_SECRET, MAL_URL } from "../const/api";
import { Credentials } from "../types/Credentials";
import $axios from "../lib/axios";
import { User } from "../types/User";

export function useAuth() {
    async function authorize(credentials: any) {
        const auth = JSON.parse(credentials || "{}") as Credentials;

        try {
            const res = await getMe(auth.access_token);
            if (res.status == 200 && res.data) {
                res.data.token = auth.access_token;
                return res.data;
            }
        } catch (e: any) {
            console.error(e.response?.data || e.message);
            //handle refresh token fallback
            return null;
        }
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

    return { requestAuthPermission, login, getMe, authorize, logout };
}

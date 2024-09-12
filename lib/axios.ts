import axios from "axios";
import https from "https";
import { MAL_CLIENT_ID } from "../const/api";

const $axios = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

$axios.defaults.headers["X-MAL-CLIENT-ID"] = MAL_CLIENT_ID;

export default $axios;

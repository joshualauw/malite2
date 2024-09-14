import axios from "axios";
import https from "https";

const $axios = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

$axios.defaults.headers["X-MAL-CLIENT-ID"] = process.env.MAL_CLIENT_ID;

export default $axios;

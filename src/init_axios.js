import axios from "axios";

const portNumber = 47789

export const axiosAPI = axios.create({
    baseURL : `http://localhost:${portNumber}/` // it's not recommended to have this info here.
});

export async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
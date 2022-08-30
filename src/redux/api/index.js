import axios from "axios";

const API = axios.create({ baseURL: "https://electron-project.herokuapp.com" });

export const signIn = (formData) => API.post("/user/signin", formData);
export const signUp = (formData) => API.post("/user/signup", formData);
export const lockUsdt = (usdtForm) => API.put('/pre/lockusdt',usdtForm)
export const lockEtr = (etrForm) => API.put('/pre/locketr',etrForm)
export const fetchUsdt = () => API.get('/pre/getusdt')
export const fetchEtr = () => API.get('/pre/getetr')
export const getKey = () => API.get('/pre/getkey')
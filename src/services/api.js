import axios from 'axios';

const api = axios.create({
    baseURL : 'https://brasil.io/api/dataset/genero-nomes/'
});

export default api;
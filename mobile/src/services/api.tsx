import axios from 'axios'

const api = axios.create({
    baseURL: 'https://192.168.1.100:5000'
})

export default api
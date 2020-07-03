import axios from 'axios'

const BASE_URL = 'https://codeforces.com/api'

export default axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
})

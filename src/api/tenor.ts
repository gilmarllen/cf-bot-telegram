import axios from 'axios'

const BASE_URL = 'https://api.tenor.com/v1/'

const API = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
})

async function getRandomYES(): Promise<string> {
  try {
    const response = await API.get('random?q=yes&limit=1')
    return response?.data?.results[0]?.media[0]?.gif?.url || ''
  } catch (error) {
    console.error(error)
  }
  return ''
}

export { getRandomYES }
export default API

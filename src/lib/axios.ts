import axios from "axios"

export const api = axios.create({
  baseURL: 'http://10.0.2.2:3333'
 // baseURL: 'http://10.0.0.1:3333'
}
)

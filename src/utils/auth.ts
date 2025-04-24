/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref } from 'vue'

export const isAuthenticated = ref(false)
export const nombre = ref('')

export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export const checkAuth = () => {
  const token = localStorage.getItem('token')
  if (token) {
    const payload = parseJwt(token)
    if (payload?.name) {
      isAuthenticated.value = true
      nombre.value = payload.name
    } else {
      isAuthenticated.value = false
      nombre.value = ''
    }
  } else {
    isAuthenticated.value = false
    nombre.value = ''
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  isAuthenticated.value = false
  nombre.value = ''
}

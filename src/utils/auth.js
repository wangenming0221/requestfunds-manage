
const TokenKey = 'Admin-Token'

const ExpiresInKey = 'Admin-Expires-In'

const siteFrom = 'Site-From'

const appMainFull = 'App-Main-Full'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function getExpiresIn() {
  return sessionStorage.getItem(ExpiresInKey) || -1
}

export function setExpiresIn(time) {
  return sessionStorage.setItem(ExpiresInKey, time)
}

export function removeExpiresIn() {
  return sessionStorage.removeItem(ExpiresInKey)
}

export function getSiteFrom() {
  return sessionStorage.getItem(siteFrom)
}

export function setSiteFrom(type) {
  return sessionStorage.setItem(siteFrom, type)
}

export function removeSiteFrom() {
  return sessionStorage.removeItem(siteFrom)
}

export function getAppMainFull() {
  return sessionStorage.getItem(appMainFull)
}

export function setAppMainFull(value) {
  return sessionStorage.setItem(appMainFull, value)
}

export function removeAppMainFull() {
  return sessionStorage.removeItem(appMainFull)
}

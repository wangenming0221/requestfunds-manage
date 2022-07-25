export function getBmpUserName() {
  return localStorage.getItem('bmpUserName')
}

export function setBmpUserName(bmpUserName) {
  return localStorage.setItem("bmpUserName", bmpUserName);
}

export function removeBmpUserName() {
  return localStorage.removeItem('bmpUserName')
}

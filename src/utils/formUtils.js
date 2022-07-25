function formUtil(params) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      formData.append(key, '')
    } else {
      formData.append(key, value)
    }
  }

  return formData
}

export default formUtil

export const useToast = () => {
  const message = ref({ text: '', type: '' })

  const showToast = (text: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    message.value = { text, type }
    
    setTimeout(() => {
      message.value = { text: '', type: '' }
    }, 5000)
  }

  const clearToast = () => {
    message.value = { text: '', type: '' }
  }

  return {
    message: readonly(message),
    showToast,
    clearToast
  }
}
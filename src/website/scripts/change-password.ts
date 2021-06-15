document.addEventListener('DOMContentLoaded', () => {
  const regex = /^([a-zA-Z0-9]{8,})*$/

  const submitButton = document.getElementById('submitButton')
  const passwordWarning = document.getElementById('password-match-warning')
  const passwordInput = document.getElementById('password') as HTMLInputElement
  const confirmPasswordInput = document.getElementById(
    'confirmPassword'
  ) as HTMLInputElement

  passwordInput.onchange = () => {
    const password = passwordInput.value

    if (regex.test(password) && confirmPasswordInput.value === password) {
      submitButton?.removeAttribute('disabled')
      passwordWarning?.setAttribute('hidden', '')
    } else {
      submitButton?.setAttribute('disabled', '')
      passwordWarning?.removeAttribute('hidden')
    }
  }

  confirmPasswordInput.onchange = () => {
    const password = passwordInput.value

    if (regex.test(password) && confirmPasswordInput.value === password) {
      submitButton?.removeAttribute('disabled')
      passwordWarning?.setAttribute('hidden', '')
    } else {
      submitButton?.setAttribute('disabled', '')
      passwordWarning?.removeAttribute('hidden')
    }
  }
})

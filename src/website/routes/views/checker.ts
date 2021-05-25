function validate() {
  const passwordMatchingWarning = document.getElementById(
    'password-match-warning'
  )
  const passwordLength = document.getElementById('password-length-warning')
  const password = (<HTMLInputElement>document.getElementById('password')).value
  const confirmPassword = (<HTMLInputElement>(
    document.getElementById('confirmPassword')
  )).value

  if (password !== confirmPassword) {
    passwordMatchingWarning?.removeAttribute('hidden')
    document.getElementById('myButton')?.setAttribute('disabled', 'true')
  } else {
    document.getElementById('myButton')?.removeAttribute('disabled')
    passwordMatchingWarning?.setAttribute('hidden', 'true')
    passwordLength?.setAttribute('hidden', 'true')
  }
  if (password.length < 8) {
    passwordLength?.removeAttribute('hidden')
  }
}

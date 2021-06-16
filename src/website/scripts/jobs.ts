document.addEventListener('DOMContentLoaded', () => {
  const selectAllCheckbox = document.getElementById(
    'select-all'
  ) as HTMLInputElement
  selectAllCheckbox.onchange = () => {
    const deviceCheckboxes = document.getElementsByClassName(
      'select-device'
    ) as HTMLCollectionOf<HTMLInputElement>

    for (const checkbox of deviceCheckboxes) {
      checkbox.checked = selectAllCheckbox.checked
    }
    setAttributes()
  }

  const deviceCheckboxes = document.getElementsByClassName(
    'select-device'
  ) as HTMLCollectionOf<HTMLInputElement>

  for (const box of deviceCheckboxes) {
    box.onchange = () => setAttributes()
  }

  function setAttributes() {
    const submitButton = document.getElementById('submit-btn') as HTMLElement
    const deviceCheckboxes = document.getElementsByClassName(
      'select-device'
    ) as HTMLCollectionOf<HTMLInputElement>

    let atLeastOneDeviceSelected = false
    for (const box of deviceCheckboxes) {
      if (box.checked) {
        atLeastOneDeviceSelected = true
      }
    }
    if (!atLeastOneDeviceSelected) {
      submitButton.setAttribute('disabled', '')
      selectAllCheckbox.checked = false
    } else {
      submitButton.removeAttribute('disabled')
    }
  }

  setAttributes()
})

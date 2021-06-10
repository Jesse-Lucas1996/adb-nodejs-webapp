document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add-btn')
  addButton?.addEventListener('click', () => {
    const innerContainer = document.createElement('div')
    innerContainer.setAttribute('class', 'asset__columns')

    const serialContainer = document.createElement('div')

    function createLabel(innerHTML: string) {
      const label = document.createElement('label')
      label.setAttribute('class', 'label')
      label.innerHTML = innerHTML
      return label
    }

    function createInput(name: string) {
      const input = document.createElement('input')
      input.setAttribute('class', 'atv-input-field')
      input.setAttribute('type', 'text')
      input.setAttribute('name', name)
      return input
    }
    const serialInput = createInput('serial[]')
    const serialLabel = createLabel('Serial')
    const nameLabel = createLabel('Name')
    const nameInput = createInput('name[]')

    serialContainer.appendChild(serialLabel)
    serialContainer.appendChild(serialInput)

    const nameContainer = document.createElement('div')

    nameContainer.appendChild(nameLabel)
    nameContainer.appendChild(nameInput)

    const deleteButton = document.createElement('button')
    deleteButton.setAttribute('class', 'atv-button')
    deleteButton.setAttribute('type', 'button')
    deleteButton.innerHTML = 'Delete'
    deleteButton.addEventListener('click', () => {
      innerContainer.parentElement?.removeChild(innerContainer)
    })
    innerContainer.appendChild(serialContainer)
    innerContainer.appendChild(nameContainer)
    innerContainer.appendChild(deleteButton)

    const entries = document.getElementById('entries')
    entries?.appendChild(innerContainer)
  })

  const deleteButtons = document.getElementsByName('delete-button')
  for (const button of deleteButtons) {
    button.addEventListener('click', () => {
      const outterContainer = button.parentElement
      outterContainer?.parentElement?.removeChild(outterContainer)
    })
  }
})

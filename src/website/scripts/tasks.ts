document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('add-btn')
  addButton?.addEventListener('click', () => {
    const innerContainer = document.createElement('div')
    setAttributes(innerContainer, { class: 'tasks__command-input' })

    const input = document.createElement('input')
    setAttributes(input, {
      class: 'atv-input-field',
      type: 'text',
      name: 'unitsOfWork[]',
    })

    const deleteButton = document.createElement('button')
    setAttributes(deleteButton, { class: 'atv-button', type: 'button' })
    deleteButton.innerHTML = 'Delete'
    deleteButton.addEventListener('click', () => {
      innerContainer.parentElement?.removeChild(innerContainer)
    })

    innerContainer.appendChild(input)
    innerContainer.appendChild(deleteButton)

    const outterContainer = document.getElementById('container')
    outterContainer?.appendChild(innerContainer)
  })

  const deleteButtons = document.getElementsByName('delete-btn')
  for (const button of deleteButtons) {
    button.addEventListener('click', () => {
      const outterContainer = button.parentElement
      outterContainer?.parentElement?.removeChild(outterContainer)
    })
  }
})

function setAttributes(
  element: HTMLElement,
  attributes: { [K in string]: string }
) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
}

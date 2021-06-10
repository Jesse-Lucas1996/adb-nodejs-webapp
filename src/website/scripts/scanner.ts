function addTextbox(id: string, name: string, placeholder: string) {
  // First create a DIV element.
  let txtNewInputBox = document.createElement('div')
  let newElementId = getRandomID(1000000)
  txtNewInputBox.setAttribute('id', `${newElementId}`)

  // Then add the content (a new input box) of the element.
  txtNewInputBox.innerHTML = `<input placeholder=${placeholder} class='atv-input-field' name=${name}[] type='text'/><button class='atv-button' onclick=deleteTextbox(${newElementId})>Delete</button>`

  // Finally put it where it is supposed to appear.
  document.getElementById(`${id}`)?.appendChild(txtNewInputBox)
}

function deleteTextbox(id: string) {
  let deletingDiv = document.getElementById(id)

  deletingDiv?.parentElement?.removeChild(deletingDiv)
}

function getRandomID(max: number) {
  return Math.floor(Math.random() * max)
}

type Block = {
  content: string
  locked: boolean
  id: string
  position: { x: number; y: number }
}

type InfoType = {
  [uuid: string]: Block
}
import { state } from './app.js'

export function createCard(info: Block) {
  const cardDiv = document.createElement('div')
  cardDiv.classList.add('draggable', 'card', 'bg-blue-500', 'p-4', 'text-white')
  // cardDiv.innerText = info.content
  const inputText = document.createElement('input')
  inputText.value = info.content
  inputText.type = 'text'
  inputText.classList.add('input', 'text-white', 'bg-transparent')
  inputText.value = info.content
  inputText.id = `${info.id}_content`
  cardDiv.setAttribute('data-id', info.id)
  cardDiv.id = info.id
  cardDiv.appendChild(inputText)
  inputText.addEventListener('input', (event) => {
    // @ts-ignore
    const value = event.target.value
    state.updateContent(value, info.id)
  })
  cardDiv.style.transform = `translate(${info.position.x}px, ${info.position.y}px)`
  return cardDiv
}

export function renderCards(info: InfoType, container: HTMLElement) {
  Object.values(info).map((i) => {
    container.append(createCard(i))
  })
}

import '../css/app.css'
import interact from 'interactjs'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { makeObservable, observable, action, toJS, runInAction } from 'mobx'
import { Application } from '@hotwired/stimulus'
import { definitionsFromContext } from '@hotwired/stimulus-webpack-helpers'
import { renderCards } from './utils'

window.Stimulus = Application.start()
const context = require.context('../controllers', true, /\.js$/)
Stimulus.load(definitionsFromContext(context))
const blocks = [
  {
    id: crypto.randomUUID(),
    position: { x: 0, y: 0 },
    locked: false,
    content: 'THIS IS draggable 03',
  },
  {
    id: crypto.randomUUID(),
    position: { x: 0, y: 0 },
    locked: false,
    content: 'THIS IS draggable 2',
  },
  {
    id: crypto.randomUUID(),
    position: { x: 0, y: 0 },
    locked: false,
    content: 'THIS IS draggable',
  },
]

const doc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', 'mahmoud mousa', doc)
provider.connect()
const docMap = doc.getMap('documentData')
provider.on('status', (event) => {
  console.log(event.status) // logs "connected" or "disconnected"
})

export let state
provider.on('status', (event) => {
  if (event.status === 'connected') {
    if (docMap.size === 0) {
      blocks.map((b) => {
        const blockMap = new Y.Map()
        const positionYMap = new Y.Map()
        positionYMap.set('x', b.position.x)
        positionYMap.set('y', b.position.y)
        blockMap.set('content', b.content)
        blockMap.set('position', positionYMap)
        blockMap.set('id', b.id)
        docMap.set(b.id, blockMap)
      })
    }
    state = new ApplicationState(docMap)

    const canvasCon = document.getElementById('canvas')
    renderCards(docMap.toJSON(), canvasCon)

    docMap.observeDeep((ymapEvent) => {
      const affectedBlocks = []
      ymapEvent.forEach((yEvent) => {
        const parentId = yEvent.target.parent.toJSON()['id']
        const objectId = yEvent.target.toJSON()['id']
        if (parentId) {
          affectedBlocks.push(parentId)
        } else {
          affectedBlocks.push(objectId)
        }
      })
      ymapEvent[0].changes.keys.forEach((change, key) => {
        if (change.action === 'update') {
          console.log(
            `Property "${key}" was updated. New value: "${docMap.get(key)}". Previous value: "${change.oldValue
            }".`
          )
        } else if (change.action === 'delete') {
          console.log(
            `Property "${key}" was deleted. New value: undefined. Previous value: "${change.oldValue}".`
          )
        }
      })
      runInAction(() => {
        state.sync(affectedBlocks)
      })
    })
  }
})
class ApplicationState {
  canvasData
  editing

  constructor(map) {
    makeObservable(this, {
      canvasData: observable,
      editing: observable,
      updateContent: action,
      move: action,
    })
    this.canvasData = map.toJSON()
    this.editing = []
  }

  updateContent(content, targetId) {
    const target = this.canvasData[targetId]
    target.content = content

    const blockMapObj = docMap.get(targetId)
    blockMapObj.set('content', content)
  }

  move(position, targetId) {
    const target = this.canvasData[targetId]
    // Update state
    target.position = position

    const blockMapObj = docMap.get(targetId)
    const blockPositionMap = blockMapObj.get('position')
    blockPositionMap.set('y', position.y)
    blockPositionMap.set('x', position.x)
  }

  sync(affectedArr) {
    console.log('syncing')
    // Logic here should be improved to run only when state and ymap are out of sync
    console.log(affectedArr, 'AFFECTED')

    affectedArr.map((e) => {
      this.canvasData[e] = docMap.get(e).toJSON()
      const editingCard = document.getElementById(e)
      editingCard.style.transform = `translate(${this.canvasData[e].position.x}px, ${this.canvasData[e].position.y}px)`
      const textInput = editingCard.getElementsByTagName('input')[0]
      textInput.value = this.canvasData[e].content
    })
  }
}

interact('.draggable').draggable({
  listeners: {
    move(event) {
      const targetFromState = toJS(state.canvasData)[event.currentTarget.dataset.id]

      const newLocation = {
        x: targetFromState.position.x + event.dx,
        y: targetFromState.position.y + event.dy,
      }
      state.move(newLocation, targetFromState.id)
    },
  },
})

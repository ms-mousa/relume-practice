import '../css/app.css'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { makeObservable, observable, action, autorun, computed, runInAction } from 'mobx'
import { Application } from '@hotwired/stimulus'
import { definitionsFromContext } from '@hotwired/stimulus-webpack-helpers'

window.Stimulus = Application.start()
const context = require.context('../controllers', true, /\.js$/)
Stimulus.load(definitionsFromContext(context))

const doc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', 'localdemo2', doc)
provider.connect()
provider.on('status', (event) => {
  console.log(event.status) // logs "connected" or "disconnected"
})
const ymap = doc.getMap('document')
ymap.set('data', { value: 0 })
ymap.set('meta', { user1: {} })

ymap.observe((event) => {
  console.log('🚀 ~ file: app.js:16 ~ yarray.observe ~ event:', event)
  console.log(ymap.get('data'))
  // state.data.text = ymap.get('data').text
})

class ApplicationState {
  value

  constructor(ymap) {
    makeObservable(this, {
      value: observable,
      double: computed,
      increment: action,
    })
    this.value = ymap.get('data').value
  }

  get double() {
    return this.value * 2
  }

  increment() {
    this.value++
    ymap.set('data', { value: this.value++ })
  }

  sync() {
    this.value = ymap.get('data').value
  }
}

const state = new ApplicationState(ymap)

// function ontextChange(event) {
//   console.log('🚀 ~ file: app.js:27 ~ ontextChange ~ event:', event.data)

//   if (event?.data === null) {
//     ytext.delete(0, 20)
//   }
//   ytext.insert(ytext.length, event?.data ?? '', { bold: true })
// }

// const button = document.getElementById('button')
// button.onclick = () => {
//   ytext.insert(0, 'Hello World!')
// }

const messgeDiv = document.getElementById('message')
const button = document.getElementById('button')
button.onclick = () => {
  state.increment()
}
// messgeDiv.oninput = (event) => state.updateText(event.data)
autorun(() => {
  console.log(state.double, 'DOUBLE')
  messgeDiv.innerHTML = state.value
})
ymap.observe(() => {
  runInAction(() => {
    state.sync()
  })
})

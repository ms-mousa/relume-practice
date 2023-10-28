import '../css/app.css'
import interact from 'interactjs'
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
ymap.set('data', { location: { x: 0, y: 0 } })
ymap.set('meta', { user1: {} })

class ApplicationState {
  location

  constructor(ymap) {
    makeObservable(this, {
      location: observable,
      double: computed,
      move: action,
    })
    this.location = ymap.get('data').location
  }

  get double() {
    return this.value * 2
  }

  move(position) {
    this.location = position
    ymap.set('data', { location: position })
  }

  sync() {
    this.location = ymap.get('data').location
  }
}

const state = new ApplicationState(ymap)

const messgeDiv = document.getElementById('message')
const button = document.getElementById('button')

autorun(() => {
  const draggableCard = document.getElementById('card')
  draggableCard.style.transform = `translate(${state.location.x}px, ${state.location.y}px)`
})

ymap.observe(() => {
  runInAction(() => {
    state.sync()
  })
})
// const position = ymap.get('data').location

interact('.draggable').draggable({
  listeners: {
    start(event) {
      console.log(event.type, event.target)
    },
    move(event) {
      console.log('STATE', state.location)
      // console.log('EVENT', position)
      // position.x += event.dx
      // position.y += event.dy

      const newLocation = { x: state.location.x + event.dx, y: state.location.y + event.dy }
      event.target.style.transform = `translate(${newLocation.x}px, ${newLocation.y}px)`
      state.move(newLocation)
    },
  },
})

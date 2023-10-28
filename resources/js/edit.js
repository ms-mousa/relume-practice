const { observable, action, autorun, computed } = mobx

const appState = observable({
  count: 0,
  message: 'Hello, Mobx!',
})

const incrementCount = action(() => {
  appState.count += 1
})

const changeMessage = action((newMessage) => {
  const message = document.getElementById('message')
  appState.message = newMessage
})

autorun(() => {
  const message = document.getElementById('message2')
  message.innerHTML = appState.message
})

function onEdit(element) {
  changeMessage(element.innerHTML)
}

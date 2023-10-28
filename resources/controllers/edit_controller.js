import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  connect() {
    function onEdit(evenet) {
      console.log('onEdit')
      console.log(event)
    }
  }
}

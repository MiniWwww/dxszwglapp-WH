import {
  createApp,
  watch
} from "vue"
import MyMessageBoxComponent from './index.vue'

function MyMessageBox(options) {
  const MyMessageBoxApp = createApp(MyMessageBoxComponent, options)
  showMessageBox(MyMessageBoxApp, {
    confirm: options.confirm,
    cancel: options.cancel,
    remove: options.remove
  })
}

function showMessageBox(app, {
  confirm,
  cancel,
  remove
}) {
  const oFragment = document.createDocumentFragment()
  const vm = app.mount(oFragment)
  var first = document.body.firstChild; //得到页面的第一个元素
  document.body.insertBefore(oFragment, first); //在得到的第一个元素之前插入
  vm.setVisible(true)

  watch(vm.state, (state) => {
    if (!state.visible) {
      switch (state.type) {
        case 'CONFIRM':
          typeof confrim === 'function' && confirm()
          break
        case 'CANCEL':
          typeof cancel === 'function' && cancel()
          break
        case 'DELETE':
          typeof remove === 'function' && remove()
          break
        default:
          break
      }

      hideMessageBox(app)
    }
  })
}

function hideMessageBox(app) {
  app.unmount()
}

export default MyMessageBox

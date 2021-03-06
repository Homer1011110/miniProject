import $ from 'zeptojs'
import CheckBox from '../components/checkbox'
import BaseApp from '../base/baseApp'
import util from '../base/util'
import setupWebViewJavascriptBridge from '../base/jsBridge'

class App extends BaseApp{
    initVariables(bridge) {
        super.initVariables(bridge)
        let self = this

        self.dingCheckBox = new CheckBox($('#ding'))
        self.addMineCheckBox = new CheckBox($('#add-mine'))
        self.addAllCheckBox = new CheckBox($('#add-all'))
        self.shareFriendCheckBox = new CheckBox($('#share-friends'))
    }
    registerHandler() {
        let self = this
        self.bridge.registerHandler('getPublishFormData', function(data, responseCallback) {
            console.log("getPublishFormData called with:", data)
            responseCallback({
                lat: self.myPoint.lat,
                lng: self.myPoint.lng,
                ding: self.dingCheckBox.checked,
                addMine: self.addMineCheckBox.checked,
                addAll: self.addAllCheckBox.checked,
            })
        })
    }
}

document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body)
    let bridge = {}
    setupWebViewJavascriptBridge(function(bridge) {
        // webviewjavascriptbridge
        let app = new App(bridge)
    })
})

window.onerror = function(err) {
    // report error
}
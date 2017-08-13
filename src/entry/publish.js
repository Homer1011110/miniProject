import $ from 'zeptojs'
import CheckBox from '../components/checkbox'
import BaseApp from '../base/baseApp'
import util from '../base/util'
import setupWebViewJavascriptBridge from '../base/jsBridge'

class App extends BaseApp{
    initVariables(bridge) {
        super.initVariables()
        let self = this

        self.dingCheckBox = new CheckBox($('#ding'))
        self.addMineCheckBox = new CheckBox($('#add-mine'))
        self.addAllCheckBox = new CheckBox($('#add-all'))
        self.shareFriendCheckBox = new CheckBox($('#share-friends'))
    }
    initMap() {
        let self = this
        let point = new BMap.Point(116.404, 39.915);
        self.map.centerAndZoom(point, 15);

        self.getCurrentPosition(function({lng, lat}) {
            console.log(lng, lat)
            self.myPoint = {lng, lat}
            self.update('renderMyPosition')
        })
    }
    registerHandler() {
        let self = this
        // self.bridge.registerHandler('getPublishFormData', function(data, responseCallback) {
        //     console.log("getPublishFormData called with:", data)
        //     responseCallback({
        //         lat: self.myPoint.lat,
        //         lng: self.myPoint.lng,
        //         ding: self.dingCheckBox.checked,
        //         addMine: self.addMineCheckBox.checked,
        //         addAll: self.addAllCheckBox.checked,
        //     })
        // })
    }
}




setupWebViewJavascriptBridge(function(bridge) {
	
    /* Initialize your app here */
    document.addEventListener("DOMContentLoaded", function() {
        // DOM fully loaded and parsed
        let app = new App(bridge)
    })

	// bridge.registerHandler('JS Echo', function(data, responseCallback) {
	// 	console.log("JS Echo called with:", data)
	// 	responseCallback(data)
	// })
	// bridge.callHandler('ObjC Echo', {'key':'value'}, function responseCallback(responseData) {
	// 	console.log("JS received response:", responseData)
	// })
})
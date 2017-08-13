import $ from 'zeptojs'
import CheckBox from '../components/checkbox'
import util from '../base/util'
import setupWebViewJavascriptBridge from '../base/jsBridge'

class App {
    constructor(bridge) {
        this.initVariables(bridge)
        this.initMap()
        this.bindEvent()
    }
    initMap() {
        let self = this
        let point = new BMap.Point(116.404, 39.915);
        self.map.centerAndZoom(point, 15);

        self.getCurrentPosition(function({lng, lat}) {
            console.log(lng, lat)
            self.myPoint = {lng, lat}
            self.update(self.UPDATE_POSITION)
        })
    }
    getCurrentPosition(cb) {
        let self = this;
        let geolocation = new BMap.Geolocation()

        geolocation.getCurrentPosition(function(res) {
            if(this.getStatus() == BMAP_STATUS_SUCCESS) {
                // cb 的 this 是否应该指向 app ?
                cb.call(self, res.point)
            } else {
                alert(`failed:${this.getStatus()}`)
            }
        })
        /*
            Note: getCurrentPosition() cannot work on insecure site origin
        */
    }
    initVariables(bridge) {
        let self = this
        self.bridge = bridge

        self.UPDATE_POSITION = 1

        self.dingCheckBox = new CheckBox($('#ding'))
        self.addMineCheckBox = new CheckBox($('#add-mine'))
        self.addAllCheckBox = new CheckBox($('#add-all'))
        self.shareFriendCheckBox = new CheckBox($('#share-friends'))

        self.map = new BMap.Map("map")
        self.myPoint = {}
    }
    bindEvent() {}
    renderMyPosition() {
        let self = this
        let point = new BMap.Point(self.myPoint.lng, self.myPoint.lat)
        let marker = new BMap.Marker(point)
        marker.setAnimation(BMAP_ANIMATION_BOUNCE) // not work in phone
        self.map.addOverlay(marker)
        self.map.panTo(point)
    }
    update(type='null') {
        let self=this
        switch(type) {
            case self.UPDATE_POSITION:
                self.renderMyPosition()
            default:
                break;
        }
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

/*bridge.registerHandler("getPublishFormData", function(data, responseCallback) {
    responseCallback({
        lat: 10,
        lng: 10,
        ding: true,
        addMine: true,
        addAll: true
    })
})*/
setupWebViewJavascriptBridge(function(bridge) {

	/* Initialize your app here */
    document.addEventListener("DOMContentLoaded", function() {
        // DOM fully loaded and parsed
        let app = new App(bridge)
    })

    
    /*
        register js handler
    */
	/*bridge.registerHandler('JS Echo', function(data, responseCallback) {
		console.log("JS Echo called with:", data)
		responseCallback(data)
	})
	bridge.callHandler('ObjC Echo', {'key':'value'}, function responseCallback(responseData) {
		console.log("JS received response:", responseData)
	})*/
})
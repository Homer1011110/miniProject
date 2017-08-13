import axios from 'axios'
import $ from 'zeptojs'
import util from '../base/util'
import RadioGroup from '../components/radiogroup'
import setupWebViewJavascriptBridge from '../base/jsBridge'

class App {
    constructor(bridge) {
        this.initVariables(bridge)
        this.initBMap()
        this.bindEvent()
    }
    initVariables(bridge) {
        this.bridge = bridge
        this.urlParams = util.search2Map(window.location.search)

        this.UPDATE_POSITION = 1
        this.UPDATE_NEAR_POINTS = 2

        this.map = new BMap.Map("map");
        this.radioGroup = new RadioGroup($('#radio-group'), 'friends')
        this.myPoint = {lng: 113.94289892826, lat: 22.5356489579}
        this.nearPoints = []
        this.nearMarkers = []
    }
    bindEvent() {
        let self = this
        this.radioGroup.onRadioChange = function(args) {
            self.onRadioChange(args)
        }
    }
    initBMap() {
        let self = this
        let point = new BMap.Point(116.404, 39.915);
        self.map.centerAndZoom(point, 15);

        self.map.addControl(new BMap.GeolocationControl())

        self.getCurrentPosition(function({lng, lat}) {
            self.myPoint = {lng, lat}
            self.update(self.UPDATE_POSITION)
        })
    }
    onRadioChange(radioId) {
        let self = this
        self.getNearbyMoments(radioId)
    }
    onMarkerClick(momentID) {
        /*
            call handler to show moment
        */
        console.log(momentID)
        let self = this
        self.bridge.callHandler('jumpToVideoWithMoment', momentID, function(responseData) {
            console.log("JS received response:", responseData)
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
    getNearbyMoments(type) {
        let self = this
        axios.get('/find/nearby', {
            params: {
                openid: 'xxx',
                lng: 11,
                lat: 11,
                type: type
            }
        }).then((resp)=> {
            console.log(resp)
        }).catch((err)=> {
            console.log(err)
            let resp = {
                ret: 20000,
                moments: [
                        {lng: 113.94289892826, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                        {lng: 113.94389292428, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                        {lng: 113.94489292430, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                ],
                msg: 'xxx'
            }
            self.clearNearMarkers()
            self.nearPoints = resp.moments
            self.nearMarkers = self.nearPoints.map(({lng, lat, momentID})=> {
                let point = new BMap.Point(lng, lat)
                let marker = new BMap.Marker(point)
                marker.addEventListener('click', function() {
                    self.onMarkerClick(momentID)
                })
                return marker
            })
            self.update(self.UPDATE_NEAR_POINTS)
        })
    }
    renderNearbyDots() {
        let self = this
        self.nearMarkers.forEach((marker)=> {
            self.map.addOverlay(marker)
        })
    }
    renderMyPosition() {
        let self = this
        let point = new BMap.Point(self.myPoint.lng, self.myPoint.lat)
        let marker = new BMap.Marker(point)
        let circle = new BMap.Circle(point, 1000)
        circle.setStrokeWeight(1)
        marker.setAnimation(BMAP_ANIMATION_BOUNCE) // not work in phone
        self.map.addOverlay(marker)
        self.map.addOverlay(circle)
        self.map.panTo(point)
    }
    clearNearMarkers() {
        let self = this
        self.nearMarkers.forEach(function(marker) {
            self.map.removeOverlay(marker)
        })
        self.nearPoints = []
        self.nearMarkers = []
    }
    update(type='null') {
        let self = this
        switch(type) {
            case self.UPDATE_POSITION:
                self.renderMyPosition()
                break
            case self.UPDATE_NEAR_POINTS:
                self.renderNearbyDots()
                break
            default:
                break
        }
    }
}



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
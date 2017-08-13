import axios from 'axios'
import $ from 'zeptojs'
import BaseApp from '../base/baseApp'
import util from '../base/util'
import RadioGroup from '../components/radiogroup'
import setupWebViewJavascriptBridge from '../base/jsBridge'

class App extends BaseApp {
    initVariables(bridge) {
        super.initVariables(bridge)
        this.radioGroup = new RadioGroup($('#radio-group'), 'friends')
        this.nearPoints = []
        this.nearMarkers = []
    }
    // initMap() {
    //     super.initMap()
    //     let self = this
    //     self.map.addControl(new BMap.GeolocationControl())
    // }
    bindEvent() {
        super.bindEvent()
        let self = this
        this.radioGroup.onRadioChange = function(args) {
            self.onRadioChange(args)
        }
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

            self.clearNearMarkers() // should go in self.renderxxx
            self.nearPoints = resp.moments
            self.nearMarkers = self.nearPoints.map(({lng, lat, momentID})=> {
                let point = new BMap.Point(lng, lat)
                let marker = new BMap.Marker(point)
                marker.addEventListener('click', function() {
                    self.onMarkerClick(momentID)
                })
                return marker
            })
            self.update('renderNearbyMoments')
        })
    }
    renderNearbyMoments() {
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

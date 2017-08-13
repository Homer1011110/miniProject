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
            self.resp2Action(resp)
        }).catch((err)=> {
            console.log(err)
            alert(err)
        })
    }
    resp2Action(resp) {
        let self = this
        switch(resp.ret) {
            case -6:
                self.showReminder('无法获取您的QQ好友列表')
                break
            case -7:
                self.showReminder('无法获取您的QQ信息')
                break
            case -8:
                self.showReminder('您尚未登录，请登录后再试')
                break
            case 0:
                self._renderNearbyMoments(data)
        }
    }
    _renderNearbyMoments(data) {
        self.clearNearMarkers() // should go in self.renderxxx
        self.nearPoints = data.moments
        self.nearMarkers = self.nearPoints.map(({lng, lat, momentID})=> {
            let point = new BMap.Point(lng, lat)
            let marker = new BMap.Marker(point)
            marker.addEventListener('click', function() {
                self.onMarkerClick(momentID)
            })
            return marker
        })
        self.update('renderNearbyMoments')
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
    showReminder(msg) {
        let self = this
        self.bridge.callHandler('showReminder', msg, function responseCallback(responseData) {
            console.log("JS received response:", responseData)
        })
    }
}


document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body)
    // let bridge = {}
    setupWebViewJavascriptBridge(function(bridge) {
        // webviewjavascriptbridge
        let app = new App(bridge)
    })
})

window.onerror = function(err) {
    // report error
}
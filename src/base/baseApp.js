import $ from 'zeptojs'
import util from '../base/util'

class App {
    constructor(bridge) {
        this.initVariables(bridge)
        this.initMap()
        this.bindEvent()
        // this.registerHandler()
    }
    initVariables(bridge) {
        let self = this
        self.bridge = bridge
        self.urlParams = util.search2Map(window.location.search)
        self.myPoint = {lng: 116.404, lat: 39.915}
        self.myMarker = null
        self.map = new BMap.Map("map")
        self.geolocation = new BMap.Geolocation()
    }
    initMap() {
        let self = this
        let point = new BMap.Point(self.myPoint.lng, self.myPoint.lat);
        self.map.centerAndZoom(point, 15);

        setInterval(function() {
            self.getCurrentPosition(function({lng, lat}) {
                self.myPoint = {lng, lat}
                self.update('renderMyPosition')
            })
        }, 5 * 1000)
        self.getCurrentPosition(function({lng, lat}) {
            self.myPoint = {lng, lat}
            self.update('renderMyPosition')
        })
    }
    getCurrentPosition(cb) {
        let self = this;

        self.geolocation.getCurrentPosition(function(res) {
            if(this.getStatus() == BMAP_STATUS_SUCCESS) {
                // cb 的 this 是否应该指向 app ?
                cb.call(self, res.point)
            } else {
                alert(`failed:${this.getStatus()}`)
            }
        })
    }
    
    bindEvent() {}
    renderMyPosition() {
        let self = this
        let point = new BMap.Point(self.myPoint.lng, self.myPoint.lat)
        self.myMarker && self.map.removeOverlay(self.myMarker)
        self.myMarker = new BMap.Marker(point)
        self.myMarker.setAnimation(BMAP_ANIMATION_BOUNCE) // not work in phone
        self.map.addOverlay(self.myMarker)
        self.map.panTo(point)
    }
    update(fnName) {
        let self=this
        if(typeof self[fnName] == 'function') {
            self[fnName]()
        }
    }
    registerHandler() {}
}


export default App
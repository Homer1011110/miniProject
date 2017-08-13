import $ from 'zeptojs'
import util from '../base/util'

class App {
    constructor(bridge) {
        this.initVariables(bridge)
        this.initMap()
        this.bindEvent()
        this.registerHandler()
    }
    initVariables(bridge) {
        let self = this
        self.bridge = bridge
        self.urlParams = util.search2Map(window.location.search)
        self.myPoint = {lng: 116.404, lat: 39.915}
        self.map = new BMap.Map("map")
    }
    initMap() {
        let self = this
        let point = new BMap.Point(self.myPoint.lng, self.myPoint.lat);
        self.map.centerAndZoom(point, 15);

        self.getCurrentPosition(function({lng, lat}) {
            self.myPoint = {lng, lat}
            self.update('renderMyPosition')
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
    
    bindEvent() {}
    renderMyPosition() {
        let self = this
        let point = new BMap.Point(self.myPoint.lng, self.myPoint.lat)
        let marker = new BMap.Marker(point)
        marker.setAnimation(BMAP_ANIMATION_BOUNCE) // not work in phone
        self.map.addOverlay(marker)
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
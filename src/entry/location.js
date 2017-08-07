import axios from 'axios'

class App {
    constructor() {
        this.initVariables()
        this.initBMap()
    }
    initVariables() {
        this.map = new BMap.Map("map");
    }

    initBMap() {
        let self = this
        let point = new BMap.Point(116.404, 39.915);
        self.map.centerAndZoom(point, 15);

        self.map.addControl(new BMap.GeolocationControl())

        self.getCurrentPosition(function(point) {
            let marker = new BMap.Marker(point)  // 创建标注
            let circle = new BMap.Circle(point, 1000)
            circle.setStrokeWeight(1)
            marker.setAnimation(BMAP_ANIMATION_BOUNCE) //跳动的动画
            self.map.addOverlay(marker)
            self.map.addOverlay(circle)
            self.map.panTo(point)
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
        // Note: getCurrentPosition() cannot work on insecure site origin
        navigator.geolocation && navigator.geolocation.getCurrentPosition(function(pos) {
            let currentLat = pos.coords.latitude
            let currentLon = pos.coords.longitude
            let gpsPoint = new BMap.Point(currentLon, currentLat)

            self.converCoordinate(gpsPoint, function(point) {
                cb.call(null, point)
            })
        })
        */
    }

    converCoordinate(point, cb) {
        let convertor = new BMap.Convertor()
        let pointArr = [point]
        convertor.translate(pointArr, 1, 5, function(data) {
            if(data.status === 0) {
                cb.call(null, data.points[0])
            }
        })
    }

    getNearbyMoment(type) {

    }
}

document.addEventListener("DOMContentLoaded", function() {
    // DOM fully loaded and parsed
    let app = new App()
})


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

        self.getCurrentPosition(function(point) {
            let mark = new BMap.Marker(point)
            self.map.addOverlay(mark)
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
                /*self.converCoordinate(res.point, function(point) {
                    cb.call(self, point)
                })*/
                
            } else {
                alert(`failed:${this.getStatus()}`)
            }
        })
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

}

document.addEventListener("DOMContentLoaded", function() {
    // DOM fully loaded and parsed
    let app = new App()
})


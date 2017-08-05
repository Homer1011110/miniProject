import Promise from '../lib/promise.js'

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
            console.log(BMAP_STATUS_SUCCESS)
            if(this.getStatus() == BMAP_STATUS_SUCCESS) {
                // cb 的 this 是否应该指向 app ?
                console.log(res, res.point)
                cb.call(self, res.point)
            } else {
                alert(`failed:${this.getStatus()}`)
            }
        })
    }

    converCoordinate(point, cb) {
        let convertor = new BMap.Convertor()
        let pointArr = [point]
        convertor.translate(pointArr, 1, 5, cb)
    }

}

document.addEventListener("DOMContentLoaded", function() {
    // DOM fully loaded and parsed
    // let app = new App()
    let p = new Promise(function(resolve, reject) {
        console.log('start:', Math.floor(Date.now() / 1000))
        setTimeout(function() {
            resolve('ok')
        }, 10 * 1000)
    }).then(function(msg) {
        console.log(`success: ${msg}`, Math.floor(Date.now() / 1000))
    }, function(err) {
        console.error(`fail: ${err}`)
    })
})


import axios from 'axios'
import $ from 'zeptojs'

class App {
    constructor() {
        this.initVariables()
        this.initBMap()
        this.bindEvent()
    }
    initVariables() {
        this.map = new BMap.Map("map");
        this.radioGroup = new RadioGroup($('#radio-group'), 'friends')
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

        self.getCurrentPosition(function(point) {
            let marker = new BMap.Marker(point)  // 创建标注
            let circle = new BMap.Circle(point, 1000)
            circle.setStrokeWeight(1)
            marker.setAnimation(BMAP_ANIMATION_BOUNCE) //跳动的动画
            // self.map.addOverlay(marker)
            self.map.addOverlay(circle)
            self.map.panTo(point)
        })
    }

    onRadioChange(id) {
        let self = this
        self.getNearbyMoments(id)
    }

    onMarkerClick(momentID) {
        console.log(momentID)
    }

    getCurrentPosition(cb) {
        let self = this;
        let geolocation = new BMap.Geolocation()

        geolocation.getCurrentPosition(function(res) {
            if(this.getStatus() == BMAP_STATUS_SUCCESS) {
                // cb 的 this 是否应该指向 app ?
                console.log(res.point)
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

    getNearbyMoments(type) {
        let self = this
        axios.get('/moments', {
            params: {}
        }).then((resp)=> {
            console.log(resp)
        }).catch((err)=> {
            console.log(err)
            let resp = {
                ret: 20000,
                moments: [
                        {lng: 113.94189292426, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                        {lng: 113.94189292428, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                ],
                msg: 'xxx'
            }
            self.renderNearbyDots(resp.moments)
        })
    }
    renderNearbyDots(moments) {
        let self = this
        moments.forEach(({lng, lat, momentID})=> {
            console.log(lng, lat)
            let point = new BMap.Point(lng, lat)
            let marker = new BMap.Marker(point)
            marker.addEventListener('click', function() {
                self.onMarkerClick(momentID)
            })
            self.map.addOverlay(marker)
        })
    }
}

class RadioGroup {
    constructor($dom, activeRadioId='friends') {
        let self = this
        this.$radios = $dom.find('.radio')
        this.bindEvent()
        $dom.find(`[data-radio-id=${activeRadioId}]`).addClass('radio-active')
        setTimeout(function() {
            self.onRadioChange(activeRadioId)
        },  1)
    }
    bindEvent() {
        let self = this
        this.$radios.on('click', function(e) {
            let $this = $(this)
            self.$radios.removeClass('radio-active')
            $this.addClass('radio-active')
            self.onRadioChange($this.attr('data-radio-id'))
        })
    }
    changeRadio() {}
    onRadioChange(radioId) {}
}

document.addEventListener("DOMContentLoaded", function() {
    // DOM fully loaded and parsed
    let app = new App()
})


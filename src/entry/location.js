import axios from 'axios'
import $ from 'zeptojs'

class App {
    constructor() {
        this.initVariables()
        this.initBMap()
        this.bindEvent()
    }
    initVariables() {
        this.UPDATE_POSITION = 1
        this.UPDATE_NEAR_POINTS = 2
      
        this.map = new BMap.Map("map");
        this.radioGroup = new RadioGroup($('#radio-group'), 'friends')
        this.myPoint = {lng: 113.94289892826, lat: 22.5356489579}
        this.nearPoints = []
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
            debugger
            self.update(self.UPDATE_POSITION)
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
                cb.call(self, res.point)
            } else {
                alert(`failed:${this.getStatus()}`)
            }
        })
        /*
          Note: getCurrentPosition() cannot work on insecure site origin
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
                        {lng: 113.94289892826, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                        {lng: 113.94189292428, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                        {lng: 113.94189292430, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                        {lng: 113.94189292435, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                        {lng: 113.94189292440, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                        {lng: 113.94189292456, lat: 22.5356489579, openID: 'xxxx', momnetID: '1234'},
                ],
                msg: 'xxx'
            }
            self.nearPoints = resp.moments
            self.update(self.UPDATE_NEAR_POINTS)
        })
    }
    renderNearbyDots() {
        let self = this
        self.nearPoints.forEach(({lng, lat, momentID})=> {
            // console.log(lng, lat)
            let point = new BMap.Point(lng, lat)
            let marker = new BMap.Marker(point)
            marker.addEventListener('click', function() {
                self.onMarkerClick(momentID)
            })
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


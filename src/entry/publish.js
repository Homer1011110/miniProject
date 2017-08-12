import $ from 'zeptojs'

class App {
    constructor() {
        this.initData()
        this.initVariables()
        this.initMap()
        this.bindEvent()
    }
    initMap() {

    }
    bindEvent() {

    }
    initVariables() {
        let self = this
        self.data = {}
        
        self.dingCheckBox = new CheckBox($('#ding'))
        self.addMineCheckBox = new CheckBox($('#add-mine'))
        self.addAllCheckBox = new CheckBox($('#add-all'))
        self.shareFriendCheckBox = new CheckBox($('#share-friends'))

        self.map = new BMap.Map("map")
    }
    initData() {

    }
}

class CheckBox {
    constructor($dom, checked=false) {
        let self = this
        self.$dom = $dom
        self.checked = checked
        self.bindEvent()
    }
    bindEvent() {
        let self = this
        self.$dom.on('click', function() {
            self.checked = !self.checked
            self.update()
        })
    }
    update() {
        let self = this
        if(self.checked) {
            self.$dom.addClass('active')
        } else {
            self.$dom.removeClass('active')
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let app = new App()
})

/*bridge.registerHandler("getPublishFormData", function(data, responseCallback) {
    responseCallback({
        ding: true,
        addMine: true,
        addAll: true
    })
})*/
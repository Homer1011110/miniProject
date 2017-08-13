import $ from 'zeptojs'

class CheckBox {
    constructor($dom, checked=false) {
        let self = this
        self.$dom = $dom
        self.checked = checked
        self.bindEvent()
        setTimeout(function() {
            self.onChange(self.checked) 
        }, 1);
    }
    bindEvent() {
        let self = this
        self.$dom.on('click', function() {
            self.checked = !self.checked
            self.update()
            self.onChange(self.checked)
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
    onChange(checked) {}
}

export default CheckBox
import $ from 'zeptojs'

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

export default RadioGroup
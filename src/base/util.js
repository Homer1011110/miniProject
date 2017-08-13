export default {
    search2Map(searchString) {
        // todo: detect param type
        let map = {}
        let index = searchString.indexOf('?')
        searchString = searchString.substr(index + 1)
        if(searchString.length <= 0) return map
        let paramArr = searchString.split('&')
        paramArr.forEach(function(param) {
            let arr = param.split('=')
            map[arr[0]] = arr[1]
        })
        return map
    }
}
function MomentMarker(center, length, color) {
    this._center = center
    this._length = length
    this._color = color
}

MomentMarker.prototype = new BMap.Overlay()

MomentMarker.prototype.initialize = function(map){    
    // 保存map对象实例   
    this._map = map
    // 创建div元素，作为自定义覆盖物的容器   
    var div = document.createElement("div")
    div.style.position = "absolute"
    // 可以根据参数设置元素外观
    div.style.width = this._length + "px"
    div.style.height = this._length + "px"
    div.style.borderRadius = "50%"
    div.style.background = this._color
    // 将div添加到覆盖物容器
    map.getPanes().markerPane.appendChild(div)
    // 保存div实例
    this._div = div
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、   
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。   
    return div;    
}
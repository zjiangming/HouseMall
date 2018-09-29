function _BMAP(container) {
    this.map = new BMap.Map(container || "allmap");       // 创建Map实例
    this.defaultPoint = new BMap.Point(116.404, 39.915);  // 默认北京定位坐标
    // 初始化地图,设置中心点坐标和地图级别
    this.map.centerAndZoom(this.defaultPoint, 12);
    // 开启鼠标滚轮缩放
    this.map.enableScrollWheelZoom(true);
}
// 设置地图显示的城市
_BMAP.prototype.setCurrentCity = function(city) {
    this.map.setCurrentCity(city)
}
// 增加地图控件
_BMAP.prototype.addControl = function(attrs) {
    if (!attrs) return
    var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}), // 左上角，添加比例尺
        top_left_navigation = new BMap.NavigationControl(),  //左上角，添加默认缩放平移控件
        top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}), //右上角，仅包含平移和缩放按钮
        overViewOpen = new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});  //添加地图类型和缩略图
    if (attrs.indexOf('tl_control') > -1) {
        this.map.addControl(top_left_control)
    }
    if (attrs.indexOf('tl_navigation') > -1) {
        this.map.addControl(top_left_navigation)
    }
    if (attrs.indexOf('tr_navigation') > -1) {
        this.map.addControl(top_right_navigation)
    }
    if (attrs.indexOf('overView') > -1) {
        this.map.addControl(overViewOpen)
    }
}
// 添加标记
_BMAP.prototype.markerAdd = function(info) {
    /**
     * @params info
     * lat，lng，title，imgUrl, content
     */
    var marker = new BMap.Marker(new BMap.Point(info.lat, info.lng)); // 创建点
    this.map.addOverlay(marker);            //增加点
    this.markerLabel(marker, info)
    this.markerClick(marker, info)          // 增加点击事件
}
// 标记label
_BMAP.prototype.markerLabel = function(marker, info) {
    var label = new BMap.Label(info.title, {offset:new BMap.Size(20,-10)});
	marker.setLabel(label);
}
// 移除标记
_BMAP.prototype.clearOverlays = function() {
    this.map.clearOverlays();
}
// 标记点击事件
_BMAP.prototype.markerClick = function(marker, info) {
    var sContent =
        "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>"+ info.title +"</h4>" +
        "<img style='float:right;margin:4px' id='imgDemo' src='"+ info.imgUrl +"' width='139' height='104' title=''/>" +
        "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>"+ info.content +"</p>" +
        "</div>";
    var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
    marker.addEventListener("click", function(){
	   this.openInfoWindow(infoWindow);
	   //图片加载完毕重绘infowindow
       var img = document.createElement('img')
       img.src = info.imgUrl
	   img.onload = function (){
		   infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
	   }
	});
}
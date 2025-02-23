var map = L.map('map').setView([31.2304, 121.4737], 6); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


var geojsonUrls = [
    "https://mmmuilk.github.io/huadong_map/gonglu.geojson",
];

fetch(geojsonUrl)
    .then(response => response.json())
    .then(data => {
        var geojsonLayer = L.geoJSON(data, {
            style: function (feature) {
                return { color: "blue", weight: 2 }; // 线的颜色
            }
        }).addTo(map);
        
        // 让地图自动适应数据范围
        map.fitBounds(geojsonLayer.getBounds());
    })
    .catch(error => console.error("加载 GeoJSON 出错: ", error));
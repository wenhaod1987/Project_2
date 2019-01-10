// Filtering Params


// function buildmap() {
// }


function createmap() {


    //  Leaflet.js Housing Map
    // Doumentation - https://leafletjs.com/reference-1.3.4.html
    //  ################################################################


    //  Custom CSS for Leaflet Popup
    /* css to customize Leaflet default styles  */

    var customPopupStyle = {
        'maxWidth': '300',
        'className': 'custom leaflet-popup-content-wrapper'
    }
    //  Create our map
    var map = L.map("map", {
        // center will be overwritten by bounds of target layer
        center: [33.6618381, -116.3906276],
        zoom: 8,
    })

    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", { attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>", maxZoom: 18, id: "mapbox.streets", accessToken: API_KEY })
    .addTo(map)

    // What is this datatype? I can't iterate over it nor can I access properties
    // d3.json('/data2', function(data2) {
    //     for (var i=0; i<data2.length; i++) {
    //         var d2marker = L.marker(
    //             [data2[i].Lat,data2[i].Long])
    //             .addTo(map)
    //     }
    // })


    //  Create House Icon
    var myHouseIcon = L.icon({
        iconUrl: 'http://www.clker.com/cliparts/5/b/2/3/13334898041186092727Cartoon%20House.svg.med.png',
        iconSize: [32,37],
        //  Anchor - Make sure the second number is the height of the icon size
        iconAnchor: [16, 37],
        //  Popup Anchor - Make sure the first number is half the size of the icon size
        popupAnchor: [16, -30],
    })


    // var max_size = d3.select('max_size')
    // var min_size = d3.select('min_size')
    // var max_price = d3.select('max_price')
    // var min_price = d3.select('min_price')
    // console.log(min_price)

    //  Creating a ?request to our data2 route and generating a function
    // d3.json(`/data?input1=${input1}`, function(data) {
    

    d3.json('/data', function(data) {
        // console.log(data)

        //  Create an open cluster group to push in markers

        var clusterGroup = new L.markerClusterGroup();
        for (var i=0; i<data.length; i++) {

        
	        var housingMarker = L.marker(
	            [data[i].lat, data[i].long],{
	            radius:250,
	            icon:myHouseIcon
	        })
        	.bindPopup("<h5> Address: " + data[i].address +","
	        	+data[i].city+ "</h5> <hr>" 
	            +"<h6> Type:"+data[i].property_type+"<hr>"+
	            "Price: " + data[i].price +"<hr>"+
	            "Square Feet: " + data[i].sq_feet+
	            "<hr>Beds & Baths: " + data[i].BnB  + "</h6>",
                customPopupStyle)

        // .on('dblclick', function() {
        // window.open(data[i]['URL (SEE http://www.redfin.com/buy-a-home/comparative-market-analysis FOR INFO ON PRICING)'], '_blank')})
        
        	clusterGroup.addLayer(housingMarker)

        // var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", { attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>", maxZoom: 18, id: "mapbox.streets", accessToken: API_KEY });
        // var earth = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", { attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>", maxZoom: 18, id: "mapbox.outdoors", accessToken: API_KEY });

        // var baseMaps = {Streets: streets, Earth: earth}
    	}
    // for loop ended
    map
    .addLayer(clusterGroup)
    .fitBounds(clusterGroup.getBounds())
    .on('moveend', function(e) {
        console.log(map.getCenter())
    })


    // L.control.layers(baseMaps).addTo(map)

    })


}
createmap()

// d3.select('input').on('change',createmap)
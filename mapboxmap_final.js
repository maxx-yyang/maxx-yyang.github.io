mapboxgl.accessToken = 'pk.eyJ1Ijoic2NoZXcyIiwiYSI6ImNsOWVjNmd0ZDI3Y2gzcGw5aTVnMnNoMXMifQ.uYA52Qg_9j0JJD8nO7Y64w';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/dark-v10', // custom style url from https://studio.mapbox.com/
	center: [-73.978,40.711], // starting position
	zoom: 10 // starting zoom
});
var popup;

map.on('load', () => {
	map.addSource('vacant_2020', {
	  type: 'geojson',
	  data: './intermediate/geo_2020.geojson'
	});
	map.addSource('vacant_2021', {
		type: 'geojson',
		data: './intermediate/old/geo_2021.geojson'
	  });
	  map.addSource('nta_changes',{
		type: 'geojson',
		data: './intermediate/nta_storefront_change.geojson'
	});

	map.addLayer({
		id:'nta_change_polygon_choro',
		source:'nta_changes',
		type:'fill',
		paint:{
			'fill-color': {
				property: 'change', // this will be your density property form you geojson
				stops: [
				  [0, '#2B325E'],
				  [30, '#7EA5D5'],
				  [40, '#B9D3E9'],
				  [80, '#E6EFF5'],
				  [100, '#E7EFF5']
				]
			},// -781, to 500
			'fill-opacity':{
				stops: [
					[14,.5],
					[15,.2]
			],
			}
		}
	});
	  map.addLayer({
		id:'nta_change_polygon_fill',
		source:'nta_changes',
		type: 'fill',
		paint: {
			'fill-color':'transparent',
			'fill-outline-color': '#d3d3d3'
			
		}
	});
	// add heatmap layer here
	// add circle layer here
	drawmap('vacant_2020','#f5b74d')
	drawmap('vacant_2021','#FF5900')
	map.setLayoutProperty('vacant_2021','visibility','none')
		map.setLayoutProperty('vacant_2020','visibility','none')
		map.setLayoutProperty('nta_change_polygon_choro','visibility','none')
		
	d3.select("#yr2020").on("click",function(){
		
		//Remove the other chart and add 2019 
		map.setLayoutProperty('vacant_2021','visibility','none')
		map.setLayoutProperty('vacant_2020','visibility','none')
		map.setLayoutProperty('vacant_2021-point','visibility','none')
		map.setLayoutProperty('vacant_2020-point','visibility','visible')
		map.setLayoutProperty('vacant_2020','visibility','visible')
		map.setLayoutProperty('nta_change_polygon_choro','visibility','none')
		hover('nta_change_polygon_fill','vacant_2020')
	})
	d3.select("#yr2021").on("click",function(){
		
		//Remove the other chart and add 2021
		map.setLayoutProperty('vacant_2021','visibility','none')
		map.setLayoutProperty('vacant_2020','visibility','none')
		map.setLayoutProperty('vacant_2021-point','visibility','visible')
		map.setLayoutProperty('vacant_2020-point','visibility','none')
		map.setLayoutProperty('vacant_2021','visibility','visible')
		map.setLayoutProperty('nta_change_polygon_choro','visibility','none')
		hover('nta_change_polygon_fill','vacant_2021')
	})
	d3.select("#yrChange").on("click",function(){
		//Remove the other chart and add 2021
		map.setLayoutProperty('vacant_2021','visibility','none')
		map.setLayoutProperty('vacant_2020','visibility','none')
		map.setLayoutProperty('nta_change_polygon_choro','visibility','visible')
		map.setLayoutProperty('vacant_2021-point','visibility','visible')
		map.setLayoutProperty('vacant_2020-point','visibility','visible')
		hover('nta_change_polygon_fill','change')
		});
	d3.select("#astoria").on("click",function(){
		//Remove the other chart and add 2021
		map.flyTo({center: [-73.918988,40.758969], zoom: 15});
		popup.remove();
	})
	d3.select("#flushing").on("click",function(){
		map.flyTo({center: [-73.828651,40.761098], zoom: 15});
		popup.remove();
	});
  });
function hover(layer,field){
		popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});
		map.on('mousemove', layer, function(e) {
		// Change the cursor style as a UI indicator.
		map.getCanvas().style.cursor = 'pointer';
		// Single out the first found feature.
		var feature = e.features[0];
		// Display a popup with the name of the county
		popup.setLngLat(e.lngLat)
			.setText(feature.properties.ntaname + ': ' +feature.properties[field])
			.addTo(map);
	});
	map.on('mouseleave', layer, function() {
		map.getCanvas().style.cursor = '';
		popup.remove();
	});
	}

  function drawmap(source,color) {
	map.addLayer(
		{
		  id: source,
		  type: 'heatmap',
		  source: source,
		  maxzoom: 15,
		  paint: {
			// assign color values be applied to points depending on their density
			'heatmap-color': [// Change the Thresholds - It's doing it on the fly
			  'interpolate', //Book end, half it, half it, etc. - TRY BRINGING IT INTO mapbox studio
			  ['linear'],
			  ['heatmap-density'],
			  0,
			  'rgba(0,0,0,0)',
			  0.1,
			  '#7EA5D5',
			  0.3,
			  '#B9D3E9',
			  0.5,
			  '#E6EFF5',
			  0.7,
			  '#E7EFF5',
			  1,
			  '#fff'
			],
			// increase radius as zoom increases
			'heatmap-radius': {
			  stops: [
				[8,5],
				[11, 10],
				[15, 15]
			  ]
			},
			// decrease opacity to transition into the circle layer
			'heatmap-opacity': {
			  default: .75,
			  type: 'exponential',
			  stops: [
				[14, .75],
				[15, 0.5]
			  ]
			}
		  }
		},
	  );

	  map.addLayer(
		{
		  id: source + '-point',
		  type: 'circle',
		  source: source,
		  minzoom: 12,
		  paint: {
			'circle-color': 'rgba(0,0,0,0)', //'#f5b74d'
			'circle-stroke-color': color,
			'circle-stroke-width': 1
		  }
		}
	  );

	  map.on('click', source + '-point', (event) => {
		new mapboxgl.Popup()
		  .setLngLat(event.features[0].geometry.coordinates)
		  .setHTML(`<strong>Year:</strong> ${event.features[0].properties.reporting_year}<br>`+ `\n`+ 
		  `<strong>Address:</strong> ${event.features[0].properties.property_street_address_or_storefront_address}<br>`+ `\n`+ 
		  `<strong>Neighborhood:</strong> ${event.features[0].properties.nbhd}<br>`)
		  .addTo(map);
	  });
	//https://docs.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ 
  }
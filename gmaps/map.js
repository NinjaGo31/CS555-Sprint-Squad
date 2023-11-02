function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7449, lng: -74.0245 }, // Updated coordinates for Stevens Institute of Technology
        zoom: 17, // Zoom level for a closer view
      });
    
      var stevensMarker = new google.maps.Marker({
        position: { lat: 40.7449, lng: -74.0245 }, // Coordinates for Stevens Institute of Technology
        map: map,
        title: 'Stevens Institute of Technology',
      });
    
      var hobokenMarker = new google.maps.Marker({
        position: { lat: 40.7434, lng: -74.0324 }, // Coordinates for Hoboken, NJ
        map: map,
        title: 'Hoboken, NJ',
      });
    
      var churchSquareParkMarker = new google.maps.Marker({
        position: { lat: 40.7447, lng: -74.0315 }, // Coordinates for Church Square Park
        map: map,
        title: 'Church Square Park',
      });
  }
  
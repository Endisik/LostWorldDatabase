var currentMarker;
var markers = []; // Ein Array, um alle Marker zu speichern

document.addEventListener('DOMContentLoaded', (event) => {
  var mymap = L.map('mapid').setView([51.1657, 10.4515], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap Contributors'
  }).addTo(mymap);

  var draggableMarker = document.getElementById('draggable-marker');

  draggableMarker.addEventListener('dragstart', function(event) {
    event.dataTransfer.setData('text', 'marker');
  }, false);

  mymap.getContainer().addEventListener('dragover', function(event) {
    event.preventDefault(); // Erlaubt das Ablegen des Elements
  }, false);

// In dem Event-Listener für 'drop' solltest du sicherstellen, dass currentMarker gesetzt wird
  mymap.getContainer().addEventListener('drop', function(event) {
    event.preventDefault();
    var point = mymap.containerPointToLatLng(L.point(event.clientX, event.clientY));
    currentMarker = L.marker(point).addTo(mymap); // Stelle sicher, dass diese Zeile ausgeführt wird
    openModal(); // Zeigt das Modal und das Overlay an
  }, false);

  function openModal() {
    document.getElementById("modal").style.display = "block";
    document.getElementById("map-overlay").style.display = "block"; // Zeigt das Overlay an
  }

  function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("map-overlay").style.display = "none"; // Versteckt das Overlay
  }

  window.onclick = function(event) {
    var modal = document.getElementById("modal");
    if (event.target == modal) {
      closeModal();
    }
  }


  window.submitMarkerDetails = function() {
    var name = document.getElementById('modal-name').value;
    console.log('Fertig geklickt', name); // Überprüfe, ob der Name korrekt erfasst wurde
    if (currentMarker) {
      var tooltip = currentMarker.bindTooltip(name, {
        permanent: true,
        direction: 'right',
        className: 'marker-label'
      });
      markers.push(currentMarker);
      // Verwalte die Sichtbarkeit direkt nach dem Hinzufügen
      manageTooltipVisibility(currentMarker);
    } else {
      console.log('Kein Marker definiert'); // Sollte nicht auftreten, wenn ein Marker platziert wurde
    }
    closeModal();
  };

  function manageTooltipVisibility(marker) {
    var zoomLevel = mymap.getZoom();
    var tooltip = marker.getTooltip();
    if (zoomLevel > 15) {
      if (!mymap.hasLayer(tooltip)) {
        tooltip.addTo(mymap); // Füge den Tooltip nur hinzu, wenn er noch nicht auf der Karte ist
      }
    } else {
      tooltip.remove(); // Entferne den Tooltip von der Karte
    }
  }



  document.querySelector('.close').addEventListener('click', closeModal);
});

function checkLabels() {
  var zoomLevel = mymap.getZoom();
  markers.forEach(function(marker) {
    var label = marker.getTooltip();
    if (zoomLevel > 15) { // Zoomstufe, bei der Labels angezeigt werden sollen
      label.setOpacity(1); // Zeige das Label
    } else {
      label.setOpacity(0); // Verstecke das Label
    }
  });
  // Zusätzliche Logik, um Überlappungen zu prüfen und entsprechend Labels zu verstecken
  for (var i = 0; i < markers.length; i++) {
    for (var j = i + 1; j < markers.length; j++) {
      if (markers[i].getLatLng().distanceTo(markers[j].getLatLng()) < 40) { // Distanz in Metern
        markers[i].getTooltip().setOpacity(0);
        markers[j].getTooltip().setOpacity(0);
      }
    }
  }
}

mymap.on('zoomend', function() {
  markers.forEach(function(marker) {
    manageTooltipVisibility(marker);
  });
});

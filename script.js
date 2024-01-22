var mymap; // Globale Variable für die Karte
var currentMarker; // Aktueller Marker
var markers = []; // Array, um alle Marker zu speichern

document.addEventListener('DOMContentLoaded', (event) => {
  // Initialisierung der Karte
  mymap = L.map('mapid').setView([51.1657, 10.4515], 6);
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

  mymap.getContainer().addEventListener('drop', function(event) {
    event.preventDefault();
    var point = mymap.containerPointToLatLng(L.point(event.clientX, event.clientY));
    currentMarker = L.marker(point).addTo(mymap); // Marker wird gesetzt
    openModal(); // Öffnet das Modal
  }, false);

  document.querySelector('.close').addEventListener('click', closeModal);

  mymap.on('zoomend', function() {
    markers.forEach(function(marker) {
      manageTooltipVisibility(marker);
    });
  });
});

function openModal() {
  document.getElementById('modal-name').value = ''; // Setzt den Namen zurück
  document.getElementById('modal-description').value = ''; // Setzt die Beschreibung zurück
  var modal = document.getElementById('modal');
  modal.classList.add('show'); // Zeigt das Modal mit Animation
}

function closeModal() {
  var modal = document.getElementById('modal');
  modal.classList.remove('show'); // Schließt das Modal mit Animation
}

window.submitMarkerDetails = function() {
  var name = document.getElementById('modal-name').value;
  var description = document.getElementById('modal-description').value;
  if (currentMarker) {
    var tooltip = currentMarker.bindTooltip(name, {
      permanent: true,
      direction: 'right',
      className: 'marker-label'
    });
    markers.push(currentMarker);
    manageTooltipVisibility(currentMarker);
  } else {
    console.log('Kein Marker definiert');
  }
  closeModal();
};

function manageTooltipVisibility(marker) {
  var zoomLevel = mymap.getZoom();
  var tooltip = marker.getTooltip();
  if (zoomLevel > 15) {
    if (!mymap.hasLayer(tooltip)) {
      tooltip.addTo(mymap);
    }
  } else {
    tooltip.remove();
  }
}

function checkLabels() {
  var zoomLevel = mymap.getZoom();
  markers.forEach(function(marker) {
    var label = marker.getTooltip();
    if (zoomLevel > 15) {
      label.setOpacity(1);
    } else {
      label.setOpacity(0);
    }
  });

  for (var i = 0; i < markers.length; i++) {
    for (var j = i + 1; j < markers.length; j++) {
      if (markers[i].getLatLng().distanceTo(markers[j].getLatLng()) < 40) {
        markers[i].getTooltip().setOpacity(0);
        markers[j].getTooltip().setOpacity(0);
      }
    }
  }
}

<script setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onMounted, useId, watch } from 'vue';

let { center, zoom } = defineProps(['center', 'zoom']);

let id = 'map-' + useId();
let map;
let marker;
let polygon;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
});

onMounted(() => {
  map = L.map(id).setView(center, zoom);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  marker = L.marker(center).addTo(map).bindPopup('🏠 Home');

  polygon = L.polygon(makePolygonBounds(center), { color: 'blue' }).addTo(map);
});

watch(() => center, (newCenter) => {
  if (map && marker && polygon) {
    map.panTo(newCenter);
    marker.setLatLng(newCenter);
    polygon.setLatLngs(makePolygonBounds(newCenter));
  }
});

watch(() => zoom, (newZoom) => {
  if (map) {
    map.setZoom(newZoom);
  }
});

function makePolygonBounds([lat, lng]) {
  const latOffset = 0.000065; // vertical (height)
  const lngOffset = 0.0008; // horizontal (width)

  return [
    [lat + latOffset, lng + lngOffset],
    [lat + latOffset, lng - lngOffset],
    [lat - latOffset, lng - lngOffset],
    [lat - latOffset, lng + lngOffset]
  ];
}

</script>

<template>
  <div :id="id"></div>
</template>

<style scoped>
div {
  height: 40vh;
}
</style>

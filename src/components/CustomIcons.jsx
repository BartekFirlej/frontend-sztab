// CustomIcons.jsx
import L from 'leaflet';

// Import images using your bundler (make sure the file paths are correct)
import bwpImg from '../images/bwp.png';
import howitzerImg from '../images/howitzer.png';
import mortarImg from '../images/mortar.png';
import rocketLauncherImg from '../images/rocketlauncher.png';
import defaultImg from '../images/default.png';
import droneImg from '../images/drone.png';
import markerIconImg from 'leaflet/dist/images/marker-icon.png';

// Define and export custom icons
export const bwpIcon = L.icon({
  iconUrl: bwpImg,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

export const howitzerIcon = L.icon({
  iconUrl: howitzerImg,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

export const mortarIcon = L.icon({
  iconUrl: mortarImg,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

export const rocketLauncherIcon = L.icon({
  iconUrl: rocketLauncherImg,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

export const defaultIcon = L.icon({
  iconUrl: defaultImg,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

export const droneObserverIcon = L.icon({
  iconUrl: droneImg,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

export const markerIcon = L.icon({
  iconUrl: markerIconImg,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -25]
});

// MapWithDraw.jsx
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import {
  bwpIcon,
  howitzerIcon,
  mortarIcon,
  rocketLauncherIcon,
  defaultIcon,
  droneObserverIcon,
} from "./CustomIcons";

// Fix for default marker icons not displaying correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const getIconByTargetType = (targetType) => {
  switch (targetType?.toLowerCase()) {
    case "bwp":
      return bwpIcon;
    case "haubica":
      return howitzerIcon;
    case "mozdzierz":
      return mortarIcon;
    case "wyrzutnia":
      return rocketLauncherIcon;
    case "drone":
      return droneObserverIcon;
    default:
      return defaultIcon;
  }
};

const MapWithDraw = () => {
  const [layers, setLayers] = useState([]);
  const [targets, setTargets] = useState([]);
  const [drones, setDrones] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle creation of drawn layers
  const onCreated = (e) => {
    const { layerType, layer } = e;
    console.log(`Created layer of type: ${layerType}`);
    setLayers((prevLayers) => [...prevLayers, layer]);
  };

  const onEdited = (e) => {
    console.log("Edited layers", e.layers);
  };

  const onDeleted = (e) => {
    console.log("Deleted layers", e.layers);
  };

  // Polling for targets
  const fetchTargets = async () => {
    try {
      const response = await fetch("https://localhost:7135/targets");
      if (!response.ok) {
        throw new Error("Failed to fetch targets");
      }
      const data = await response.json();
      setTargets(data);
    } catch (error) {
      console.error("Error fetching targets:", error);
    }
  };

  const fetchDrones = async () => {
    try {
      const response = await fetch("http://localhost:5219/flights/positions");
      if (!response.ok) {
        throw new Error("Failed to fetch positions");
      }
      const data = await response.json();
      setDrones(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    fetchTargets();
    fetchDrones();

    const interval = setInterval(() => {
      fetchTargets();
      fetchDrones();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handlePreviewClick = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  return (
    <>
      <MapContainer
        center={[50.2156, 22.531122]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={onCreated}
            onEdited={onEdited}
            onDeleted={onDeleted}
            draw={{
              rectangle: true,
              circle: false,
              polyline: true,
              polygon: true,
              marker: true,
              circlemarker: false,
            }}
          />
        </FeatureGroup>

        {targets.map((target) => {
          const icon = getIconByTargetType(target.targettypename);
          return (
            <Marker
              key={target.targetid}
              position={[target.x, target.y]}
              icon={icon}
            >
              <Popup>
                <div className="space-y-2">
                  <p>
                    <strong>ID:</strong> {target.targetid}
                  </p>
                  <p>
                    <strong>X:</strong> {target.x}
                  </p>
                  <p>
                    <strong>Y:</strong> {target.y}
                  </p>
                  <p>
                    <strong>Z:</strong> {target.z}
                  </p>
                  <p>
                    <strong>Data wykrycia:</strong>{" "}
                    {new Date(target.detectiontime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Komentarz:</strong> {target.comment}
                  </p>
                  <p>
                    <strong>Target Type ID:</strong> {target.targettypeid}
                  </p>
                  <p>
                    <strong>Target Type Name:</strong> {target.targettypename}
                  </p>
                  <p>
                    <strong>Flight ID:</strong> {target.flightid}
                  </p>
                  {target.imagelink && (
                    <button
                      onClick={() => handlePreviewClick(target.imagelink)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Podgląd
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {drones.map((flight) => (
          <Marker
            key={flight.flightID}
            position={[flight.x, flight.y]}
            icon={droneObserverIcon}
          >
            <Popup>
              <div className="space-y-2">
                <p>
                  <strong>Lot:</strong> {flight.flightID}
                </p>
                <p>
                  <strong>Operator:</strong> {flight.operatorID}
                </p>
                <p>
                  <strong>Drużyna:</strong> {flight.teamID}
                </p>
                <p>
                  <strong>Pluton:</strong> {flight.platoonID}
                </p>
                <p>
                  <strong>X:</strong> {flight.x}
                </p>
                <p>
                  <strong>Y:</strong> {flight.y}
                </p>
                <p>
                  <strong>Z:</strong> {flight.z}
                </p>
                <p>
                  <strong>Czas rozpoczęcia:</strong>{" "}
                  {new Date(flight.beginTime).toLocaleString()}
                </p>
                <p>
                  <strong>Komentarz:</strong> {flight.comment}
                </p>
                {flight.videoStream && (
                  <button
                    onClick={() => handlePreviewClick(flight.videoStream)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Podgląd
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {previewImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
          <div className="relative bg-white p-4 rounded-lg z-10">
            <img src={previewImage} className="max-w-[90vw] max-h-[90vh]" />
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MapWithDraw;

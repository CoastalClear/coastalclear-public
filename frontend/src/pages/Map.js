import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useRef, useEffect, useState } from "react";
import BeachCalendar from "../components/BeachCalendar";
import dayjs from "dayjs";
import { createRoot } from "react-dom/client";
import PopUp from "../components/PopUp";
import RightModal from "../components/RightModal";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { useLocation } from "../LocationsContext";
import api from "../utility/api";
import { useFeedbackLocation } from "../FeedbackLocationContext";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function getColorHexString(value) {
  if (value / 4000 < 0.33) {
    return "#46C75A";
  } else if (value / 4000 < 0.66) {
    return "#FDD05E";
  } else {
    return "#E75454";
  }
}

function findDatesWithinRange(inputDate, bookings) {
  if (!bookings) return [];

  const targetDate = new Date(inputDate);
  const threeDays = 3 * 24 * 60 * 60 * 1000;
  let count = 0;

  for (let b of bookings) {
    const currentDate = new Date(b.date);
    const diff = Math.abs(currentDate - targetDate);
    if (diff <= threeDays) {
      count++;
    }
  }

  return count;
}

function calculatePolygonCenter(coordinates) {
  let centroid = { longitude: 0, latitude: 0 };

  // Check if the input is valid
  if (coordinates.length === 0) {
    return null; // Return null or an appropriate default value if coordinates are empty
  }

  // Sum up all longitudes and latitudes
  for (let i = 0; i < coordinates.length; i++) {
    centroid.longitude += coordinates[i][0]; // Longitude
    centroid.latitude += coordinates[i][1]; // Latitude
  }

  // Divide by the number of points to get the average
  centroid.longitude /= coordinates.length;
  centroid.latitude /= coordinates.length;

  return [centroid.longitude, centroid.latitude];
}

export default function Map() {
  const navigation = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [openSnack, setOpenSnack] = useState(false);
  const defaultCoords = { lng: 103.82, lat: 1.35 };
  const [lng, setLng] = useState(defaultCoords.lng);
  const [lat, setLat] = useState(defaultCoords.lat);
  const [zoom, setZoom] = useState(11.2);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [currentFeature, setCurrentFeature] = useState({ id: "-1" });
  const popUp = new mapboxgl.Popup({
    closeButton: false,
    offset: {
      top: [0, -15],
    },
  });
  const { feedbackLocation, setFeedbackLocation } = useFeedbackLocation();
  const feedbackMarker = useRef(new mapboxgl.Marker());

  function zoomToSpot(coords) {
    if (!map.current) return;
    map.current.flyTo({
      center: [coords.lng, coords.lat],
      zoom: 15,
      speed: 2,
      curve: 1,
    });
  }

  useEffect(() => {
    if (!map.current) return;
    if (!feedbackLocation || !feedbackLocation?.lng) {
      feedbackMarker.current.remove();
      map.current.flyTo({
        center: [defaultCoords.lng, defaultCoords.lat],
        zoom: 11.2,
        speed: 2,
        curve: 1,
      });
      return;
    }
    feedbackMarker.current
      .setLngLat([feedbackLocation.lng, feedbackLocation.lat]) // Marker position [lng, lat]
      .addTo(map.current); // Add the marker to the map
    console.log("feedbackLocation: ", feedbackLocation);
    zoomToSpot(feedbackLocation);
  }, [feedbackLocation]);

  const { setLocationsArr } = useLocation();

  function handleClose() {
    setOpenSnack(false);
  }

  function dateDidChange(newDate) {
    if (currentFeature === undefined || currentFeature?.id === -1) {
      setOpenSnack(true);
    }
    setDate(newDate);
  }

  function updatePolygons(data) {
    for (let feature of data) {
      if (map.current.getLayer("ecp-layer" + feature.id)) {
        map.current.setPaintProperty(
          "ecp-layer" + feature.id,
          "fill-color",
          getColorHexString(feature.cleanliness_score)
        );
      }
    }
  }

  function paintPolygons(data) {
    for (let feature of data) {
      let colorString = getColorHexString(feature.cleanliness_score);
      map.current.addSource(feature.id, {
        type: "geojson",
        data: feature.geojson,
      });
      map.current.addLayer({
        id: "ecp-layer" + feature.id,
        type: "fill",
        source: feature.id, // reference the data source
        layout: {},
        paint: {
          "fill-color": colorString, // blue color fill
          "fill-opacity": 0.5,
        },
      });
      // Add a black outline around the polygon.
      map.current.addLayer({
        id: "outline" + feature.id,
        type: "line",
        source: feature.id,
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 3,
        },
      });
      map.current.on("mouseenter", "ecp-layer" + feature.id, (e) => {
        map.current.getCanvas().style.cursor = "pointer";
        const popupNode = document.createElement("div");
        popupNode.className = "custom-popup-container";
        const root = createRoot(popupNode); // Create a root.
        root.render(
          <PopUp
            feature={feature}
            count={findDatesWithinRange(date, feature.bookings)}
          />
        );

        popUp
          .setLngLat(
            calculatePolygonCenter(feature?.geojson?.geometry?.coordinates[0])
          )
          .setDOMContent(popupNode)
          .addTo(map.current);
      });
      map.current.on("mouseleave", "ecp-layer" + feature.id, (e) => {
        popUp.remove();
      });
      map.current.on("click", "ecp-layer" + feature.id, (e) => {
        setCurrentFeature((prevFeature) => {
          if (prevFeature.id === "-1") {
            map.current.setPaintProperty(
              "ecp-layer" + feature.id,
              "fill-opacity",
              1.0
            );
            map.current.setPaintProperty(
              "outline" + feature.id,
              "line-color",
              "#FFF"
            );
            setShowModal(true);
            return feature;
          } else if (prevFeature.id === feature.id) {
            map.current.setPaintProperty(
              "ecp-layer" + prevFeature.id,
              "fill-opacity",
              0.5
            );
            map.current.setPaintProperty(
              "outline" + prevFeature.id,
              "line-color",
              "#000"
            );
            setShowModal(false);
            setTimeout(() => {
              setCurrentFeature({ id: "-1" });
            }, 300);
            return prevFeature;
          } else {
            map.current.setPaintProperty(
              "ecp-layer" + prevFeature.id,
              "fill-opacity",
              0.5
            );
            map.current.setPaintProperty(
              "outline" + prevFeature.id,
              "line-color",
              "#000"
            );
            map.current.setPaintProperty(
              "ecp-layer" + feature.id,
              "fill-opacity",
              1.0
            );
            map.current.setPaintProperty(
              "outline" + feature.id,
              "line-color",
              "#FFF"
            );
            setShowModal(true);
            return feature; // Return new state for currentFeature
          }
        });
      });
    }
  }

  function parseLocations(data) {
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      data[i]["id"] = data[i]["id"] + "";
      data[i].geojson.properties = {};
      newData[i] = data[i];
    }
    paintPolygons(newData);
  }

  function updateLocations(data) {
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      data[i]["id"] = data[i]["id"] + "";
      data[i].geojson.properties = {};
      newData[i] = data[i];
    }
    updatePolygons(newData);
  }

  function didDismissRModal() {
    setShowModal(false);
    map.current.setPaintProperty(
      "ecp-layer" + currentFeature.id,
      "fill-opacity",
      0.5
    );
    map.current.setPaintProperty(
      "outline" + currentFeature.id,
      "line-color",
      "#000"
    );
    setCurrentFeature({ id: "-1" });
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/taneuzin/clxfxfn3z006k01r21tgx0ma8",
      center: [lng, lat],
      zoom: zoom,
      maxBounds: [
        [103.5, 1.1], // Southwest coordinates
        [104.2, 1.65], // Northeast coordinates
      ],
    });

    map.current.on("load", () => {
      api
        .queryLocations(dayjs())
        .then((loc) => {
          parseLocations(loc);
          setLocationsArr(loc);
        })
        .catch((err) => console.error(err));
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    api.queryLocations(date).then((loc) => {
      updateLocations(loc);
      setLocationsArr(loc);
    });
  }, [date, setLocationsArr]);

  return (
    <div className="app-container">
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnack}
        onClose={handleClose}
        autoHideDuration={3000}
        message="Please Log in"
        style={{ marginRight: "9px", marginBottom: "360px" }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          color="warning"
          sx={{ width: "100%" }}
        >
          Select a Location on the Map
        </Alert>
      </Snackbar>
      <RightModal
        show={showModal}
        setShow={setShowModal}
        date={date}
        feature={currentFeature}
        navigation={navigation}
        didDismissRModal={didDismissRModal}
        setFeature={setCurrentFeature}
      />
      <div className="map-container">
        <div ref={mapContainer} className="map" />
        <BeachCalendar
          modalOpened={showModal}
          onChange={dateDidChange}
          date={date}
        />
      </div>
    </div>
  );
}

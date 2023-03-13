import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Box } from "@mui/material";
import Loading from "./Loading";
import "@reach/combobox/styles.css";

const GoogleMapsIntegration = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_API_KEY_MAPS,
    libraries: ["places"],
  });

  const [userLocation, setUserLocation] = useState(null);

  function setLocation(position) {
    setUserLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  }
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setLocation);
    } else {
      setUserLocation("Geolocation not suported");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else
    return (
      <>
        <Box>
          {" "}
          <GoogleMap
            zoom={15}
            center={
              props.marker !== ""
                ? props.marker
                : (userLocation === null ? { lat: 51.500942, lng: -0.177498 } : userLocation)
            }
            mapContainerClassName="map-container"
          >
            {" "}
            <Box>{props.marker && <MarkerF position={props.marker} />} </Box>
          </GoogleMap>
        </Box>{" "}
      </>
    );
};

export default GoogleMapsIntegration;

import React from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { Box } from "@mui/material";
import Loading from "./Loading";
import "@reach/combobox/styles.css";

const GoogleMapsIntegration = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_API_KEY_MAPS,
    libraries: ["places"],
  });

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
                : { lat: 51.500942, lng: -0.177498 }
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

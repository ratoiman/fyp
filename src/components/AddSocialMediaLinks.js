import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { isMobile } from "react-device-detect";
import { ThemeProvider } from "@mui/material/styles";
import { Grid, Stack, Typography } from "@mui/material";
import { Tiktok } from "react-bootstrap-icons";
import { Instagram } from "react-bootstrap-icons";
import { Facebook } from "react-bootstrap-icons";
import { Twitter } from "react-bootstrap-icons";
import {
  new_event_social_media_box,
  new_event_social_media_button,
  new_event_social_media_inner_box,
  new_event_social_media_inner_box_mobile,
  new_event_social_media_inner_box_disabled,
  new_event_social_media_inner_box_mobile_disabled,
  submitButtonTheme,
  socialMediaButtonTheme,
  popupStyle,
  StyledTextField,
} from "../ui_styles/MuiStyles";
import { useState } from "react";
import { Modal } from "@mui/material";
import AddSocialMediaLinkPopover from "./AddSocialMediaLinkPopover";
import { useEffect } from "react";

const AddSocialMediaLinks = (props) => {
  // what text should be displayed when hovering over button
  const [hoverInstaText, setHoverInstaText] = useState("Instagram");
  const [hoverTiktokText, setHoverTiktokText] = useState("TikTok");
  const [hoverTwitterText, setHoverTwitterText] = useState("Twitter");
  const [hoverFacebookText, setHoverFacebookText] = useState("Facebook");

  // Change button colors when a link is added
  const [disableInsta, setDisableInsta] = useState(true);
  const [disableTiktok, setDisableTiktok] = useState(true);
  const [disableTwitter, setDisableTwitter] = useState(true);
  const [disableFacebook, setDisableFacebook] = useState(true);

  useEffect(() => {
    if (props.instagram === "") {
      setDisableInsta(true);
    } else {
      setDisableInsta(false);
    }
  }, [props.instagram]);

  useEffect(() => {
    if (props.facebook === "") {
      setDisableFacebook(true);
    } else {
      setDisableFacebook(false);
    }
  }, [props.facebook]);

  useEffect(() => {
    if (props.tiktok === "") {
      setDisableTiktok(true);
    } else {
      setDisableTiktok(false);
    }
  }, [props.tiktok]);

  useEffect(() => {
    if (props.twitter=== "") {
      setDisableTwitter(true);
    } else {
      setDisableTwitter(false);
    }
  }, [props.twitter]);

  const handleInsta = () => {
    props.setOpenPopup(true);
    props.setPlatform("Instagram");
  };
  const handleTiktok = () => {
    props.setOpenPopup(true);
    props.setPlatform("TikTok");
  };
  const handleTwitter = () => {
    props.setOpenPopup(true);
    props.setPlatform("Twitter");
  };
  const handleFacebook = () => {
    props.setOpenPopup(true);
    props.setPlatform("Facebook");
  };


  return (
    <>
      <Box sx={{ width: "100%" }}>
        <ThemeProvider theme={socialMediaButtonTheme}>
          <Grid sx={{ width: "100%" }} columns={16}>
            <Box sx={new_event_social_media_box}>
              <Box
                sx={
                  isMobile
                    ? props.instagram === ""
                      ? new_event_social_media_inner_box_mobile_disabled
                      : new_event_social_media_inner_box_mobile
                    : props.instagram === ""
                    ? new_event_social_media_inner_box_disabled
                    : new_event_social_media_inner_box
                }
              >
                <Button
                  color={props.instagram === "" ? "disabled" : "primary"}
                  sx={new_event_social_media_button}
                  startIcon={<Instagram />}
                  onMouseEnter={() => {
                    setHoverInstaText("Add link");
                  }}
                  onMouseLeave={() => {
                    setHoverInstaText("Instagram");
                  }}
                  onClick={handleInsta}
                >
                  {hoverInstaText}
                </Button>
              </Box>

              <Box
                sx={
                  isMobile
                    ? props.tiktok === ""
                      ? new_event_social_media_inner_box_mobile_disabled
                      : new_event_social_media_inner_box_mobile
                    : props.tiktok === ""
                    ? new_event_social_media_inner_box_disabled
                    : new_event_social_media_inner_box
                }
              >
                <Button
                  color={props.tiktok === "" ? "disabled" : "primary"}
                  sx={new_event_social_media_button}
                  startIcon={<Tiktok />}
                  onMouseEnter={() => {
                    setHoverTiktokText("Add link");
                  }}
                  onMouseLeave={() => {
                    setHoverTiktokText("TikTok");
                  }}
                  onClick={handleTiktok}
                >
                  {hoverTiktokText}
                </Button>
              </Box>
            </Box>

            <Box sx={new_event_social_media_box}>
              <Box
                sx={
                  isMobile
                    ? props.twitter=== ""
                      ? new_event_social_media_inner_box_mobile_disabled
                      : new_event_social_media_inner_box_mobile
                    : props.twitter=== ""
                    ? new_event_social_media_inner_box_disabled
                    : new_event_social_media_inner_box
                }
              >
                <Button
                  color={props.twitter=== "" ? "disabled" : "primary"}
                  sx={new_event_social_media_button}
                  startIcon={<Twitter />}
                  onMouseEnter={() => {
                    setHoverTwitterText("Add link");
                  }}
                  onMouseLeave={() => {
                    setHoverTwitterText("Twitter");
                  }}
                  onClick={handleTwitter}
                >
                  {hoverTwitterText}
                </Button>
              </Box>
              <Box
                sx={
                  isMobile
                    ? props.facebook === ""
                      ? new_event_social_media_inner_box_mobile_disabled
                      : new_event_social_media_inner_box_mobile
                    : props.facebook === ""
                    ? new_event_social_media_inner_box_disabled
                    : new_event_social_media_inner_box
                }
              >
                <Button
                  color={props.facebook === "" ? "disabled" : "primary"}
                  sx={new_event_social_media_button}
                  startIcon={<Facebook />}
                  onMouseEnter={() => {
                    setHoverFacebookText("Add link");
                  }}
                  onMouseLeave={() => {
                    setHoverFacebookText("Facebook");
                  }}
                  onClick={handleFacebook}
                >
                  {hoverFacebookText}
                </Button>
              </Box>
            </Box>
          </Grid>
        </ThemeProvider>

      </Box>
    </>
  );
};

export default AddSocialMediaLinks;

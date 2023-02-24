import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { isMobile } from "react-device-detect";
import { ThemeProvider } from "@mui/material/styles";
import { Grid, Stack, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Tiktok } from "react-bootstrap-icons";
import { Instagram } from "react-bootstrap-icons";
import { Facebook } from "react-bootstrap-icons";
import { Twitter } from "react-bootstrap-icons";
import {
  new_event_social_media_box,
  new_event_social_media_button,
  new_event_social_media_inner_box,
  new_event_social_media_inner_box_mobile,
  submitButtonTheme,
  socialMediaButtonTheme,
  new_event_social_media_button_overlay,
  popupStyle,
  StyledTextField,
} from "../ui_styles/MuiStyles";
import { useState } from "react";
import { Modal } from "@mui/material";
import ConfirmAction from "./ConfirmAction";

const AddSocialMediaLinks = (props) => {
  const [isInstaValid, setIsInstaValid] = useState(false);
  const [isTiktokValid, setIsTiktokValid] = useState(false);
  const [isTwitterValid, setIsTwitterValid] = useState(false);
  const [isFacebookValid, setIsFacebookValid] = useState(false);

  // what text should be displayed when hovering over button
  const [hoverInstaText, setHoverInstaText] = useState("Instagram");
  const [hoverTiktokText, setHoverTiktokText] = useState("TikTok");
  const [hoverTwitterText, setHoverTwitterText] = useState("Twitter");
  const [hoverFacebookText, setHoverFacebookText] = useState("Facebook");

  const checkInsta = () => {};

  const checkTiktok = () => {};

  const checkTwitter = () => {};

  const checkFacebook = () => {};

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <ThemeProvider theme={socialMediaButtonTheme}>
          <Grid sx={{ width: "100%" }} columns={16}>
            <Box sx={new_event_social_media_box}>
              <Box
                // className="social-media-inner-box"
                sx={
                  isMobile
                    ? new_event_social_media_inner_box_mobile
                    : new_event_social_media_inner_box
                }
              >
                <Button
                  sx={new_event_social_media_button}
                  startIcon={<Instagram />}
                  onMouseEnter={() => {
                    setHoverInstaText("Add link");
                  }}
                  onMouseLeave={() => {
                    setHoverInstaText("Instagram");
                  }}
                >
                  {hoverInstaText}
                </Button>
              </Box>

              <Box
                sx={
                  isMobile
                    ? new_event_social_media_inner_box_mobile
                    : new_event_social_media_inner_box
                }
              >
                <Button
                  sx={new_event_social_media_button}
                  startIcon={<Tiktok />}
                  onMouseEnter={() => {
                    setHoverTiktokText("Add link");
                  }}
                  onMouseLeave={() => {
                    setHoverTiktokText("TikTok");
                  }}
                >
                  {hoverTiktokText}
                </Button>
              </Box>
            </Box>

            <Box sx={new_event_social_media_box}>
              <Box
                sx={
                  isMobile
                    ? new_event_social_media_inner_box_mobile
                    : new_event_social_media_inner_box
                }
              >
                <Button
                  sx={new_event_social_media_button}
                  startIcon={<Twitter />}
                  onMouseEnter={() => {
                    setHoverTwitterText("Add link");
                  }}
                  onMouseLeave={() => {
                    setHoverTwitterText("Twitter");
                  }}
                >
                  {hoverTwitterText}
                </Button>
              </Box>
              <Box
                sx={
                  isMobile
                    ? new_event_social_media_inner_box_mobile
                    : new_event_social_media_inner_box
                }
              >
                <Button
                  sx={new_event_social_media_button}
                  startIcon={<Facebook />}
                  onMouseEnter={() => {
                    setHoverFacebookText("Add link");
                  }}
                  onMouseLeave={() => {
                    setHoverFacebookText("Facebook");
                  }}
                >
                  {hoverFacebookText}
                </Button>
              </Box>
            </Box>
          </Grid>
        </ThemeProvider>

        <Modal sx={{ overflow: "auto" }} open={false}>
          <Box sx={popupStyle}>
            <Typography variant="h4" color="primary">
              {" "}
              Add instagram profile
            </Typography>
            <StyledTextField
              color="secondary"
              placeholder="Instagram profile"
            />

            <Button>Submit</Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default AddSocialMediaLinks;

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { isMobile } from "react-device-detect";
import { ThemeProvider } from "@mui/material/styles";
import { Grid} from "@mui/material";
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
  socialMediaButtonTheme,
} from "../ui_styles/MuiStyles";
import { useState } from "react";
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
      setHoverInstaText("Instagram");
    } else {
      setDisableInsta(false);
      setHoverInstaText(
        props.instagram.match(
          /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/
        )[1]
      );
    }
  }, [props.instagram]);

  useEffect(() => {
    if (props.facebook === "") {
      setDisableFacebook(true);
      setHoverFacebookText("Facebook");
    } else {
      setDisableFacebook(false);
      setHoverFacebookText(props.facebook.match(
        /(?:(?:http|https):\/\/)?(?:www.)?(?:facebook.com)\/(\w+.+)/
      )[1]);
    }
  }, [props.facebook]);

  useEffect(() => {
    if (props.tiktok === "") {
      setDisableTiktok(true);
      setHoverTiktokText("TikTok");
    } else {
      setDisableTiktok(false);
      setHoverTiktokText(
        props.tiktok
          .match(/(?:(?:http|https):\/\/)?(?:www.)?(?:tiktok.com)\/(@\w+)/)[1]
          .replace("@", "")
      );
    }
  }, [props.tiktok]);

  useEffect(() => {
    if (props.twitter === "") {
      setDisableTwitter(true);
      setHoverTwitterText("Twitter");
    } else {
      setDisableTwitter(false);
      setHoverTwitterText(
        props.twitter.match(
          /(?:(?:http|https):\/\/)?(?:www.)?(?:twitter.com)\/(\w+)/
        )[1]
      );
    }
  }, [props.twitter]);

  const handleInsta = () => {
    props.setOpenPopup(true);
    props.setPlatform("Instagram");
    props.setProfile(props.instagram);
  };
  const handleTiktok = () => {
    props.setOpenPopup(true);
    props.setPlatform("TikTok");
    props.setProfile(props.tiktok);
  };
  const handleTwitter = () => {
    props.setOpenPopup(true);
    props.setPlatform("Twitter");
    props.setProfile(props.twitter);
  };
  const handleFacebook = () => {
    props.setOpenPopup(true);
    props.setPlatform("Facebook");
    props.setProfile(props.facebook);
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
                    props.instagram === ""
                      ? setHoverInstaText("Add link")
                      : setHoverInstaText("Edit link");
                  }}
                  onMouseLeave={() => {
                    setHoverInstaText(
                      props.instagram === ""
                        ? "Instagram"
                        : props.instagram.trim().split("/").at(-2)
                    );
                  }}
                  onClick={handleInsta}
                >
                  {isMobile ? "Instagram" : hoverInstaText}
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
                    props.tiktok === ""
                      ? setHoverTiktokText("Add link")
                      : setHoverTiktokText("Edit link");
                  }}
                  onMouseLeave={() => {
                    setHoverTiktokText(
                      props.tiktok === ""
                        ? "TikTok"
                        : props.tiktok.trim().split("/").at(-1).replace("@", "")
                    );
                  }}
                  onClick={handleTiktok}
                >
                  {isMobile ? "TikTok" : hoverTiktokText}
                </Button>
              </Box>
            </Box>

            <Box sx={new_event_social_media_box}>
              <Box
                sx={
                  isMobile
                    ? props.twitter === ""
                      ? new_event_social_media_inner_box_mobile_disabled
                      : new_event_social_media_inner_box_mobile
                    : props.twitter === ""
                    ? new_event_social_media_inner_box_disabled
                    : new_event_social_media_inner_box
                }
              >
                <Button
                  color={props.twitter === "" ? "disabled" : "primary"}
                  sx={new_event_social_media_button}
                  startIcon={<Twitter />}
                  onMouseEnter={() => {
                    props.twitter === ""
                      ? setHoverTwitterText("Add link")
                      : setHoverTwitterText("Edit link");
                  }}
                  onMouseLeave={() => {
                    setHoverTwitterText(
                      props.twitter === ""
                        ? "Twitter"
                        : props.twitter.trim().split("/").at(-1)
                    );
                  }}
                  onClick={handleTwitter}
                >
                  {isMobile ? "Twitter" : hoverTwitterText}
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
                    props.facebook === ""
                      ? setHoverFacebookText("Add link")
                      : setHoverFacebookText("Edit link");
                  }}
                  onMouseLeave={() => {
                    setHoverFacebookText(
                      props.facebook === ""
                        ? "Facebook"
                        : props.facebook.trim().split("/").at(-1)
                    );
                  }}
                  onClick={handleFacebook}
                >
                  {isMobile ? "Facebook" : hoverFacebookText}
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

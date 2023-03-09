import React, { useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import { Typography } from "@mui/material";
import {
  StyledTextField,
  linkPopupStyleMobile,
  submitButtonTheme,
} from "../ui_styles/MuiStyles";
import { Button } from "@mui/material";
import { linkPopupStyle } from "../ui_styles/MuiStyles";
import { IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { editButtonStyle } from "../ui_styles/MuiStyles";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const AddSocialMediaLinkPopover = (props) => {
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const [profile, setProfile] = useState(props.profile);

  const checkInsta = () => {
    if (
      profile !== "" &&
      profile.match(
        /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com)\/(\w+)/
      ) !== null
    ) {
      props.setInsta(profile);
      props.closePopup();
    } else {
      setShowError(true);
      setError("Invalid link");
    }
  };

  const checkTiktok = () => {
    if (
      profile !== "" &&
      profile.match(
        /(?:(?:http|https):\/\/)?(?:www.)?(?:tiktok.com)\/(@\w+)/
      ) !== null
    ) {
      props.setTiktok(profile);
      props.closePopup();
    } else {
      setShowError(true);
      setError("Invalid link");
    }
  };

  const checkTwitter = () => {
    if (
      profile !== "" &&
      profile.match(
        /(?:(?:http|https):\/\/)?(?:www.)?(?:twitter.com)\/(\w+)/
      ) !== null
    ) {
      props.setTwitter(profile);
      props.closePopup();
    } else {
      setShowError(true);
      setError("Invalid link");
    }
  };

  const checkFacebook = () => {
    if (
      profile !== "" &&
      profile.match(
        /(?:(?:http|https):\/\/)?(?:www.)?(?:facebook.com)\/(\w+.+)/
      ) !== null
    ) {
      props.setFacebook(profile);
      props.closePopup();
    } else {
      setShowError(true);
      setError("Invalid link");
    }
  };

  const handleSubmit = () => {
    switch (props.platform) {
      case "Instagram":
        checkInsta();
        break;

      case "TikTok":
        checkTiktok();
        break;

      case "Twitter":
        checkTwitter();
        break;

      case "Facebook":
        checkFacebook();
        break;
    }
  };

  const handleDelete = () => {
    switch (props.platform) {
      case "Instagram":
        props.setInsta("");
        props.closePopup();
        break;

      case "TikTok":
        props.setTiktok("");
        props.closePopup();
        break;

      case "Twitter":
        props.setTwitter("");
        props.closePopup();
        break;

      case "Facebook":
        props.setFacebook("");
        props.closePopup();
        break;
    }
  };

  console.log("tiktok", props.tiktok);
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={isMobile ? linkPopupStyleMobile : linkPopupStyle}>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "right" }}>
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => {
                props.closePopup();
              }}
            >
              {/* using same style as edit button, no need to create new style */}
              <CloseOutlinedIcon sx={editButtonStyle} />
            </IconButton>
          </Box>
          <ThemeProvider theme={submitButtonTheme}>
            <Typography
              variant="h4"
              color="primary"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {" "}
              {props.profile === "" ? "Add" : "Edit"} {props.platform} profile
              link
            </Typography>{" "}
          </ThemeProvider>
          <StyledTextField
            onChange={(e) => setProfile(e.target.value)}
            error={showError}
            helperText={showError === false ? "" : error}
            sx={{ width: "100%", marginTop: "15px" }}
            color="secondary"
            placeholder={`${props.platform} profile`}
            value={profile}
          />
          <ThemeProvider theme={submitButtonTheme}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
              }}
            >
              <Box sx={{ width: "100%", marginRight: "10%" }}>
                <Button
                  // disabled={profile === "" ? true : false}
                  // disabled
                  // disableRipple
                  color={profile === "" ? "disabled" : "secondary"}
                  startIcon={<DeleteOutlineOutlinedIcon />}
                  variant="outlined"
                  sx={{ width: "100%" }}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Box>
              <Box sx={{ width: "100%", marginLeft: "10%" }}>
                <Button
                  variant="outlined"
                  sx={{ width: "100%" }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </ThemeProvider>
        </Box>
      </Box>
    </>
  );
};

export default AddSocialMediaLinkPopover;

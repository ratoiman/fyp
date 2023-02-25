import React, { useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import { Typography } from "@mui/material";
import { StyledTextField, submitButtonTheme } from "../ui_styles/MuiStyles";
import { Button } from "@mui/material";
import { linkPopupStyle } from "../ui_styles/MuiStyles";
import { IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { editButtonStyle } from "../ui_styles/MuiStyles";

const AddSocialMediaLinkPopover = (props) => {
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const [profile, setProfile] = useState("");

  const checkInsta = () => {
    if (profile !== "") {
      console.log("profile", profile);
      props.setInsta(profile);
      props.closePopup();
    } else {
      setShowError(true);
      setError("Invalid link");
    }
  };

  const checkTiktok = () => {
    if (profile !== "") {
      props.setTiktok(profile);
      props.closePopup();
    } else {
      setShowError(true);
      setError("Invalid link");
    }
  };

  const checkTwitter = () => {
    if (profile !== "") {
      props.setTwitter(profile);
      props.closePopup();
    } else {
      setShowError(true);
      setError("Invalid link");
    }
  };

  const checkFacebook = () => {
    if (profile !== "") {
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

  return (
    <>
      <Box sx={linkPopupStyle}>
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
          <Typography variant="h4" color="primary">
            {" "}
            Add {props.platform} profile link
          </Typography>{" "}
        </ThemeProvider>
        <StyledTextField
          onChange={(e) => setProfile(e.target.value)}
          error={showError}
          helperText={showError === false ? "" : error}
          sx={{ width: "100%", marginTop: "15px" }}
          color="secondary"
          placeholder={`${props.platform} profile profile`}
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
            <Button
              variant="outlined"
              sx={{ width: "50%" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </ThemeProvider>
      </Box>
    </>
  );
};

export default AddSocialMediaLinkPopover;

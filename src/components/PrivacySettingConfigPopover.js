import React, { useState } from "react";
import {
  Alert,
  Box,
  FormControlLabel,
  Link,
  Snackbar,
  Stack,
  ThemeProvider,
} from "@mui/material";
import { Typography } from "@mui/material";
import {
  StyledTextField,
  linkPopupStyleMobile,
  privacyAndCategoryTheme,
  submitButtonTheme,
} from "../ui_styles/MuiStyles";
import { Button } from "@mui/material";
import { linkPopupStyle } from "../ui_styles/MuiStyles";
import { IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { editButtonStyle } from "../ui_styles/MuiStyles";
import { isMobile } from "react-device-detect";
import Switch from "@mui/material/Switch";
import { v4 as uuid } from "uuid";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const PrivacySettingConfigPopover = (props) => {
  const [joinByCode, setJoinByCode] = useState(props.joinByCodeOpen);
  const [code, setCode] = useState(props.joinCode);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleJoinCode = () => {
    if (code === "") {
      setCode(uuid().slice(0, 8).toUpperCase());
    }
    setJoinByCode(!joinByCode);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = () => {
    if (joinByCode) {
      props.setJoinCode(code);
      props.setJoinByCodeOpen(true);
    } else {
      props.setJoinCode("");
      props.setJoinByCodeOpen(false);
    }
    props.setIsPrivacyConfigured(true);
    props.closePopup();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={isMobile ? linkPopupStyleMobile : linkPopupStyle}>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "right" }}>
            <IconButton
              aria-label="close"
              size="small"
              onClick={() => {
                props.setConfigurePrivacyPopout(false);
              }}
            >
              {/* using same style as edit button, no need to create new style */}
              <CloseOutlinedIcon sx={editButtonStyle} />
            </IconButton>
          </Box>

          <Stack
            direction="column"
            spacing={3}
            sx={{ padding: 3, paddingTop: 0 }}
          >
            <ThemeProvider theme={submitButtonTheme}>
              <Typography
                variant="h4"
                color="primary"
                sx={{ display: "flex", justifyContent: "center" }}
              >
                Privacy settings
              </Typography>{" "}
              <StyledTextField
                label={"Add user manually (work in progress)"}
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            </ThemeProvider>
            <Box>
              <ThemeProvider theme={privacyAndCategoryTheme}>
                <Stack
                  direction="row"
                  spacing={4}
                  sx={{
                    display: "flex",
                    borderBottomStyle: "solid",
                    borderColor: "gray",
                    borderWidth: "1px",
                    paddingTop: 2,
                    paddingBottom: 2,
                    marginBottom: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      paddingLeft: 2,
                      paddingTop: 1.3,
                    }}
                  >
                    Join by code{" "}
                  </Typography>

                  <FormControlLabel
                    sx={{
                      color: "#DAA520",
                      borderStyle: "solid",
                      borderColor: "#DAA520",
                      borderWidth: "1px",
                      borderRadius: "5px",
                      paddingRight: 2,
                      paddingLeft: 2,
                      paddingY: 1,
                    }}
                    label={joinByCode ? "Yes" : "No"}
                    control={
                      <Switch
                        defaultChecked={joinByCode ? true : false}
                        color="primary"
                        size="large"
                        style={{ color: "white" }}
                        onClick={() => {
                          handleJoinCode();
                        }}
                      />
                    }
                  />
                </Stack>
                <Box
                  display={joinByCode ? "" : "none"}
                  sx={{
                    color: "white",
                    padding: 2,
                  }}
                >
                  <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={1000}
                    onClose={handleSnackbarClose}
                    sx={{
                      position: "absolute",
                      transform: "translate(190%, -210%)",
                    }}
                  >
                    <Alert
                      onClose={handleSnackbarClose}
                      severity="success"
                      sx={{ width: "100%" }}
                    >
                      Copied to clipboard
                    </Alert>
                  </Snackbar>
                  <Stack direction="row">
                    <Typography variant="h4"> Join code:</Typography>
                    <Link
                      underline="none"
                      onClick={() => {
                        navigator.clipboard.writeText(code);
                        setSnackbarOpen(true);
                      }}
                      variant="h4"
                      sx={{ marginLeft: 3 }}
                    >
                      {code}
                      <IconButton>
                        <ContentCopyOutlinedIcon
                          color="primary"
                          style={{
                            marginLeft: 3,
                            width: "30px",
                            height: "40px",
                          }}
                        />
                      </IconButton>
                    </Link>
                  </Stack>
                </Box>
              </ThemeProvider>
            </Box>
            <ThemeProvider theme={submitButtonTheme}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "15px",
                }}
              >
                <Box
                  sx={{ width: "100%", marginLeft: "30%", marginRight: "30%" }}
                >
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
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default PrivacySettingConfigPopover;

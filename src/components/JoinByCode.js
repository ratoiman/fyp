import React from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import {
  StyledTextField,
  linkPopupStyle,
  submitButtonTheme,
  editButtonStyle,
  linkPopupStyleMobile,
} from "../ui_styles/MuiStyles";
import { useState } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { isMobile } from "react-device-detect";

const JoinByCode = (props) => {
  const [userCode, setUserCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(false);

  const checkCode = (code) => {
    if (code === props.joinCode) {
      setIsValid(true);

      props.closePopup();
      props.joinedByCode();
    } else {
      setIsValid(false);
      setError(true);
    }
  };

  return (
    <Box sx={isMobile ? linkPopupStyleMobile : linkPopupStyle}>
      <Stack
        direction="column"
        sx={{ display: "flex", justifyContent: "center" }}
      >
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
        <Typography
          variant="h4"
          color="white"
          sx={{
            marginTop: 0,
            marginBottom: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Please insert the join code
        </Typography>
        <StyledTextField
          error={error}
          helperText={error ? "Invalid Code" : ""}
          label="Join Code"
          sx={{ marginLeft: "10%", width: "80%", marginBottom: 2 }}
          onChange={(event) => {
            setUserCode(event.target.value);
            setError(false);
          }}
        />
        <ThemeProvider theme={submitButtonTheme}>
          <Button
            sx={{ marginLeft: "25%", width: "50%" }}
            variant="outlined"
            onClick={() => checkCode(userCode)}
          >
            Confirm
          </Button>
        </ThemeProvider>
      </Stack>
    </Box>
  );
};

export default JoinByCode;

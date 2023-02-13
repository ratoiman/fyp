import { styled } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { inputLabelClasses } from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material";

export const StyledTextField = styled(TextField)({
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "gray",
  },
  [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "white",
    },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "#DAA520",
    },
  [`& .${outlinedInputClasses.input}`]: {
    color: "white",
  },
  [`&:hover .${outlinedInputClasses.input}`]: {
    color: "white",
  },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.input}`]:
    {
      color: "white",
    },
  [`& .${inputLabelClasses.outlined}`]: {
    color: "gray",
  },
  [`&:hover .${inputLabelClasses.outlined}`]: {
    color: "white",
  },
  [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
    color: "#DAA520",
  },
});

// Date and time picker style (svg = icon)
export const pickerStyle = {
  svg: { color: "#DAA520" },
};

// Add new activity popup style
export const popupStyle = {
  position: "absolute",
  top: "9%",
  left: "21%",
  width: "58%",
  bgcolor: "black",
  border: "2px solid #DAA520",
  boxShadow: 24,
  pt: 1,
  pb: 2,
  px: 2,
};

// style for displaying activity inside Create New event
export const eventActivityCardStyle = {
  bgcolor: "transparent",
  border: "1px solid #DAA520",
  color: "white",
  fontWeight: 600,
};

export const editButtonStyle = {
  color: "#DAA520",
};

export const closeButtonStyle = {
  color: "#DAA520",
  size: "small",
};

export const deleteButtonStyle = {
  color: "#c40808",
  size: "small",
  // pl:1
};

export const submitButtonTheme = createTheme({
  palette: {
    primary: {
      main: "#DAA520",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#ff3333",
      contrastText: "#FFF",
    },
  },
  // typography: {
  //   h5: {
  //     fontSize: "10px",
  //   },
  // },
});

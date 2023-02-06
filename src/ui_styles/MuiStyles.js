
import { styled } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { inputLabelClasses } from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

export const StyledTextField = styled(TextField)({
    [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]:
      {
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

  
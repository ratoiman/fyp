import { styled } from "@mui/material/styles";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { inputLabelClasses } from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material";
import background from "../resources/Concrete texture Wallpaper 5954.jpg";
import cardbg from "../resources/cardbg.jpg";
import cardbg_rotated from "../resources/13107748_5137843.jpg";

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
  top: "15%",
  left: "21%",
  width: "58%",
  bgcolor: "#161616",
  border: "2px solid #DAA520",
  boxShadow: 24,
  pt: 1,
  pb: 2,
  px: 2,
};

export const linkPopupStyle = {
  position: "absolute",
  // display:"flex",
  // justifyContent:"center",
  top: "20%",
  left: "25.5%",
  width: "50%",
  bgcolor: "#161616",
  border: "2px solid #DAA520",
  boxShadow: 24,
  pt: 1,
  pb: 2,
  px: 2,
};

export const linkPopupStyleMobile = {
  position: "absolute",
  // display:"flex",
  // justifyContent:"center",
  top: "40%",
  left: "5%",
  width: "90%",
  bgcolor: "black",
  border: "2px solid #DAA520",
  boxShadow: 24,
  pt: 1,
  pb: 2,
  px: 2,
};

export const popupStyleMobile = {
  overflow: "scroll",
  position: "absolute",
  // display: "flex",
  justifyContent: "center",
  top: "9%",
  left: "2.5%",
  width: "95%",
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
  border: "solid",
  borderWidth: "1px",
  borderColor: "#DAA520",
  fontWeight: 600,
  color: "white",
  marginLeft: 3,
  marginRight: 3,
  marginBottom: 3,
};

export const eventActivityCardStyleMobile = {
  bgcolor: "transparent",
  border: "solid",
  borderWidth: "1px",
  borderColor: "#DAA520",
  fontWeight: 600,
  color: "white",
  marginBottom: 2,
  // marginLeft: 3,
  // marginRight: 3,
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
    disabled: {
      main: "#777a78",
      contrastText: "#FFF",
    },
  },
  // typography: {
  //   h5: {
  //     fontSize: "10px",
  //   },
  // },
});

export const privacyAndCategoryTheme = createTheme({
  palette: {
    primary: {
      main: "#DAA520",
      contrastText: "#161616",
    },
    secondary: {
      main: "#ff3333",
      contrastText: "#161616",
    },
    disabled: {
      main: "#777a78",
      contrastText: "#FFF",
    },
  },
  // typography: {
  //   h5: {
  //     fontSize: "10px",
  //   },
  // },
});

export const joinCodeBoxStyle = {
  borderStyle: "",
};

export const event_card_style_desktop = {
  minWidth: "100%",
  maxWidth: "100%",
  borderWidth: "1px",
  borderColor: "#DAA520",
  gap: 2,
  "&:hover": {
    boxShadow: "md",
    borderColor: "#DAA520",
    borderBlock: "2px solid",
    borderBlockColor: "#DAA520",
    textColor: "#DAA520",
  },
  mb: "4%",
};

export const event_card_style_mobile = {
  width: "100%",
  borderColor: "#DAA520",
  // gap: 2,
  // "&:hover": {
  //   boxShadow: "md",
  //   borderColor: "#DAA520",
  //   borderBlock: "2px solid",
  //   borderBlockColor: "#DAA520",
  //   textColor: "#DAA520",
  // },
  my: "2%",
};

export const event_page_card_title_box = {
  border: "1px",
  borderBottomStyle: "solid",
  borderColor: "#DAA520",
  mt: 1,
};

export const event_page_card_dates_box = {
  width: "100%",
  border: "1px",
  borderBottomStyle: "solid",
  borderColor: "#DAA520",
  textAlign: "center",
  p: 1,
  width: "100%",
};

export const sidebar_buttons = {
  display: "flex",
  minWidth: "110px",
  // minHeigth: "40px",
  flexDirection: "column",
  justifyContent: "center",
  size: "large",
};

export const topbar_buttons = {
  display: "flex",
  width: "25%",
  // minHeigth: "40px",
  flexDirection: "column",
  justifyContent: "center",
  // marginRight: 5,
  // marginLeft: 5,
};

export const following_button = {
  width: "110px",
  height: "30px",
  fontWeight: "bold",
  // backgroundColor: "rgb(17,17,17)",
  fontSize: "12px",
};

export const follow_button = {
  width: "120px",
  height: "30px",
  backgroundColor: "rgb(17,17,17)",
  fontWeight: "bold",
  fontSize: "12px",
};

export const display_events_category_box_title = {
  color: "#daa520",
  marginBottom: "1%",
  // marginRight:"4%"
};

export const display_events_category_box_title_stack = {
  display: "flex",
  justifyContent: "center",
  marginLeft: "40px",
  width: "100%",
};

export const card_action_style = {
  backgroundImage: `url(${cardbg})`,
  backgroundColor: "rgb(22, 22, 22)",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
};

export const card_action_style_mobile = {
  backgroundImage: `url(${cardbg_rotated})`,
  backgroundColor: "rgb(22, 22, 22)",

  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
};

export const event_page_card_mobile = {
  minWidth: "90%",
  maxWidth: "100%",
  minHeigth: "60%",
  mt: 3,
  backgroundColor: "rgb(22, 22, 22, 0.4)",
  border: "solid",
  borderWidth: "1px",
  borderColor: "#DAA520",

  // paddingBottom: "100px",
  // backgroundImage: `url(${cardbg_rotated})`,
  // backgroundSize: "cover",
  // backgroundRepeat: "no-repeat",
  // backgroundPosition: "center center",
};

export const event_page_card_desktop = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  border: "solid",
  borderWidth: "2px",
  borderColor: "#DAA520",
  backgroundColor: "rgb(22, 22, 22, 0.6)",
  // paddingLeft: 3,
};

export const event_location_stack_style = {
  marginTop: 3,
  display: "flex",
  justifyContent: "left",
  marginLeft: 3,
};

export const event_location_button = {
  marginLeft: 0,
  marginTop: 0.5,
};

export const event_location_button_mobile = {
  marginLeft: 1,
  marginTop: 0.5,
};

export const event_location_stack_mobile_style = {
  marginTop: 1.5,
  display: "flex",
  justifyContent: "left",
  width: "100%",
  // marginLeft: 3,
};

export const new_event_menu_item_style = {
  width: "100%",
  // display: "flex",
  justifyContent: "center",
  borderRadius: "25px",
  fontWeight: 600,
  letterSpacing: "1px",
};

export const new_event_menu_item_style_selected1 = {
  width: "100%",
  // display: "flex",
  justifyContent: "center",
  backgroundColor: "#a67e18",
  // borderRadius: "25px",
  // borderTopLeftRadius: "25px",
  // borderTopRightRadius: "25px",
};

export const new_event_menu_item_style_selected = {
  width: "100%",
  // display: "flex",
  justifyContent: "center",
  backgroundColor: "#a67e18",
  // borderRadius: "25px",
  borderBottomLeftRadius: "25px",
  borderBottomRightRadius: "25px",
};

export const new_event_social_media_box = {
  width: "100%",
  justifyContent: "center",
  display: "flex",
};

export const new_event_social_media_inner_box = {
  width: "30%",
  border: "solid",
  borderColor: "#DAA520",
  borderWidth: "1px",
  margin: "2%",
  position: "relative",
};

export const new_event_social_media_inner_box_disabled = {
  width: "30%",
  border: "solid",
  borderColor: "gray",
  borderWidth: "1px",
  margin: "2%",
  position: "relative",
};

export const new_event_social_media_inner_box_mobile = {
  width: "100%",
  border: "solid",
  borderColor: "#DAA520",
  borderWidth: "1px",
  margin: "2%",
  position: "relative",
};

export const new_event_social_media_inner_box_mobile_disabled = {
  width: "100%",
  border: "solid",
  borderColor: "gray",
  borderWidth: "1px",
  margin: "2%",
  position: "relative",
};

export const new_event_social_media_button = {
  width: "100%",
  // width: "140px",
  margin: "2%",
  position: "relative",
  top: "0",
  left: "0",
};

export const event_page_social_media_box = {
  marginTop: 3,
  marginBottom: 3,
  marginLeft: 1.5,
  marginRight: 1.5,
};

export const event_page_social_media_button = {
  width: "100%",
  // minWidth: "150px",
  // width: "140px",
  // marginTop: "2%",
  // position: "relative",
  // top: "0",
  // left: "0",
};

export const event_page_social_media_button_mobile = {
  minWidth: "150px",
  maxWidth: "100%",
  borderBottom: "solid",
  borderWidth: "1px",
  // minWidth: "150px",
  // width: "140px",
  // marginTop: "2%",
  // position: "relative",
  // top: "0",
  // left: "0",
};

export const socialMediaButtonTheme = createTheme({
  palette: {
    primary: {
      main: "#DAA520",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#ff3333",
      contrastText: "#FFF",
    },
    danger: {
      main: "#dd0132",
      contrastText: "#FFF",
    },
    disabled: {
      main: "rgb(128, 128, 128)",
      contrastText: "#FFF",
    },
  },
});

export const deleteLocationStyle = {
  // visibility:"hidden",
  // display: "flex",
  justifyContent: "center",
  width: "10%",
  borderRight: "solid",
  borderWidth: "1px",
  borderColor: "gray",
  borderBottomRightRadius: "3px",
  height: "56px",
};

export const deleteLocationStyle2 = {
  // display: "flex",
  justifyContent: "center",
  width: "10%",
  borderTop: "solid",
  borderBottom: "solid",
  borderLeft: "solid",
  borderRight: "solid",
  borderWidth: "1px",
  borderColor: "gray",
  borderBottomLeftRadius: "3px",
  borderTopLeftRadius: "3px",
  height: "56px",
};

export const deleteLocationStyle3 = {
  // display: "flex",
  justifyContent: "center",
  width: "5%",
  borderTop: "solid",
  borderBottom: "solid",
  borderLeft: "solid",
  borderRight: "solid",
  borderWidth: "1px",
  borderColor: "gray",
  borderBottomLeftRadius: "3px",
  borderTopLeftRadius: "3px",
  height: "56px",
};

export const deleteLocationStyleMobile = {
  // display: "flex",
  justifyContent: "center",
  width: "15%",
  borderTop: "solid",
  borderBottom: "solid",
  borderLeft: "solid",
  borderRight: "solid",
  borderWidth: "1px",
  borderColor: "gray",
  borderBottomLeftRadius: "3px",
  borderTopLeftRadius: "3px",
  height: "56px",
};

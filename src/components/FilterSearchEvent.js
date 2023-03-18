import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  ThemeProvider,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  StyledTextField,
  privacyAndCategoryTheme,
  submitButtonTheme,
  new_event_menu_item_style,
} from "../ui_styles/MuiStyles";
import ClearIcon from "@mui/icons-material/Clear";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const FilterSearchEvent = (props) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [options, setOptions] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [ifySet, setIfy] = useState(new Set());
  const [textValue, setTextValue] = useState("");
  const [configurePrivacyPopout, setConfigurePrivacyPopout] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [visibility, setVisibility] = useState("Privacy");
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [category, setCategory] = useState("Category");
  const categories = ["Music", "Improv", "Sports", "Drama", "Party", "General"];
  const [openCategory, setOpenCategory] = useState(false);

  const loading = () => {
    if (options) {
      if (options.length > 0) {
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleClose = (setAnchor, setOpen) => {
    setAnchor(null);
    setOpen(false);
  };

  const optionsConfig = (type) => {
    if (type === "admin") {
      props.eventsDetails.map((event) => {
        const found = props.events.find((ev) => ev["id"] === event.id);
        if (found.status === "admin") {
          setOptions((op) => {
            return new Set([...op, event]);
          });
        }
      });
    } else {
      if (type === "guest") {
        props.eventsDetails.map((event) => {
          const found = props.events.find((ev) => ev["id"] === event.id);
          if (found.status === "guest") {
            setOptions((op) => {
              return new Set([...op, event]);
            });
          }
        });
      } else {
        setOptions(props.eventsDetails);
      }
    }
  };

  const handlePrivacyClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleCategoryClick = (event) => {
    setCategoryAnchorEl(event.currentTarget);
    setOpenCategory(!openCategory);
  };

  useEffect(() => {
    console.log(props.searchType, "configure");
    optionsConfig(props.searchType);
    loading();
  }, [props.eventsDetails]);

  useEffect(() => {
    if (selected["details"]) {
    }
  }, [selected]);

  return (
    <>
      <Stack direction="row">
        <Box
          sx={{
            width: "60%",
            display: "flex",
            marginBottom: 3,
            marginLeft: 1.5,
            marginRight: 1.5,
          }}
        >
          <Autocomplete
            // freeSolo
            // clear
            onChange={(event, value) => {
              if (value && typeof value === "object") {
                props.setEventsDetails([value]);
              } else {
                props.refreshSearch();
              }
            }}
            clearIcon={<ClearIcon color="primary" />}
            open={searchOpen}
            clearOnEscape
            autoComplete
            sx={{ width: "100%", display: "flex" }}
            onOpen={() => {
              setSearchOpen(true);
            }}
            onClose={() => {
              setSearchOpen(false);
            }}
            options={Array.from(options)}
            isOptionEqualToValue={(option, value) => {
              if (value["details"]) {
                return option["details"].title === value["details"].title;
              }
            }}
            getOptionLabel={(option) => {
              if (option["details"]) {
                setSelected(option);
                // props.setUserEventsDetails(option)
                return option["details"].title;
              } else return "";
            }}
            renderInput={(params) => (
              <StyledTextField
                value={textValue}
                {...params}
                label={"Search event"}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      <ThemeProvider theme={submitButtonTheme}>
                        <SearchIcon
                          sx={{ transform: "translateX(20px)" }}
                          color="primary"
                        />
                      </ThemeProvider>
                    </React.Fragment>
                  ),
                  // endAdornment: null,
                }}
              />
            )}
          />
          {/* <IconButton
            onClick={() => {
              console.log("pressed");
              setTextValue("");
              console.log("pressed222", textValue);
            }}
          >
            <ClearIcon color="primary" />
          </IconButton> */}
        </Box>

        {/* Privacy filter */}
        <Box
          sx={{
            width: "20%",
            display: "flex",
            // marginBottom: 3,
            // marginLeft: 1.5,
            // marginRight: 1.5,
            height: "60px",
          }}
        >
          <ThemeProvider theme={privacyAndCategoryTheme}>
            <Button
              sx={{
                width: "100%",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
              variant="outlined"
              onClick={handlePrivacyClick}
              startIcon={
                visibility === "Public" ? (
                  <PublicOutlinedIcon />
                ) : visibility === "Private" ? (
                  <LockOutlinedIcon />
                ) : (
                  <></>
                )
              }
            >
              {visibility}
            </Button>
          </ThemeProvider>
          <Menu
            id="group-menu"
            anchorEl={anchorEl}
            open={open}
            // open={true}
            onClose={() => handleClose(setAnchorEl, setOpen)}
            aria-labelledby="group-demo-button"
            sx={{
              minWidth: "120px",
              // minHeight: "150px",
              fontWeight: "600",
              "--List-decorator-size": "24px",
              borderStyle: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "25px",
                bgcolor: "#daa520",
                zIndex: "2",
                minHeight: "80px",
              }}
            >
              <Stack direction="column">
                <Box className="menu-item">
                  <MenuItem
                    sx={new_event_menu_item_style}
                    onClick={() => {
                      setVisibility("Public");
                      handleClose(setAnchorEl, setOpen);
                    }}
                  >
                    <Stack direction="row" spacing={0}>
                      <Box sx={{ transform: "translateY(2px)" }}>
                        <ListItemDecorator>
                          <PublicOutlinedIcon fontSize="xs" />
                        </ListItemDecorator>
                      </Box>
                      <Box>Public</Box>
                    </Stack>
                  </MenuItem>
                </Box>

                <Box className="menu-item">
                  <MenuItem
                    sx={new_event_menu_item_style}
                    endIcon={<LockOutlinedIcon />}
                    onClick={() => {
                      setVisibility("Private");
                      handleClose(setAnchorEl, setOpen);
                    }}
                  >
                    <Stack direction="row" spacing={0}>
                      <Box sx={{ transform: "translateY(2px)" }}>
                        <ListItemDecorator>
                          <LockOutlinedIcon fontSize="xs" />
                        </ListItemDecorator>
                      </Box>
                      <Box>Private</Box>
                    </Stack>
                  </MenuItem>
                </Box>
              </Stack>
            </Box>
            <ListDivider />
          </Menu>
        </Box>
        <Box
          sx={{
            width: "20%",
            display: "flex",
            // marginBottom: 3,
            marginLeft: 1.5,
            marginRight: 1.5,
            height: "60px",
          }}
        >
          <ThemeProvider theme={privacyAndCategoryTheme}>
            <Button
              sx={{
                width: "100%",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
              variant="outlined"
              onClick={handleCategoryClick}
            >
              {category}
            </Button>{" "}
          </ThemeProvider>
          <Menu
            id="group-menu"
            anchorEl={categoryAnchorEl}
            open={openCategory}
            // open={true}
            onClose={() => handleClose(setCategoryAnchorEl, setOpenCategory)}
            aria-labelledby="group-demo-button"
            sx={{
              minWidth: 120,
              justifyContent: "center",
              fontWeight: "600",
              "--List-decorator-size": "24px",
              borderStyle: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "25px",
                bgcolor: "#daa520",
                zIndex: "2",
              }}
            >
              <Stack direction="column">
                {" "}
                {categories.map((cat) => {
                  return (
                    <Box className="menu-item">
                      <MenuItem
                        sx={new_event_menu_item_style}
                        onClick={() => {
                          setCategory(cat);
                          handleClose(setCategoryAnchorEl, setOpenCategory);
                        }}
                      >
                        {cat}
                      </MenuItem>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            <ListDivider />
          </Menu>
        </Box>
      </Stack>
    </>
  );
};

export default FilterSearchEvent;

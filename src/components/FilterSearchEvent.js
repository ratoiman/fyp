import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Button,
  ClickAwayListener,
  Fade,
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
  new_event_menu_item_style_selected,
  new_event_menu_item_style_selected1,
} from "../ui_styles/MuiStyles";
import ClearIcon from "@mui/icons-material/Clear";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import TuneIcon from "@mui/icons-material/Tune";

const FilterSearchEvent = (props) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [options, setOptions] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [textValue, setTextValue] = useState("");
  const [configurePrivacyPopout, setConfigurePrivacyPopout] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [visibility, setVisibility] = useState("Privacy");
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const [category, setCategory] = useState("Category");
  const categories = ["General", "Music", "Improv", "Sports", "Drama", "Party"];
  const [openCategory, setOpenCategory] = useState(false);
  const [clearAllVisible, setClearAllVisible] = useState(false);
  const [filterPrivacy, setFilterPrivacy] = useState(new Set());
  const [filterCategory, setFilterCategory] = useState(new Set());
  const [appliedFilters, setAppliedFilters] = useState(false);

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
        if (found && found !== undefined) {
          if (found.status === "admin") {
            setOptions((op) => {
              return new Set([...op, event]);
            });
          }
        }
      });
    } else {
      if (type === "guest") {
        props.eventsDetails.map((event) => {
          const found = props.events.find((ev) => ev["id"] === event.id);
          if (found && found !== undefined) {
            if (found.status === "guest") {
              setOptions((op) => {
                return new Set([...op, event]);
              });
            }
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

  const handlePrivacySelection = (privacy) => {
    if (filterPrivacy.has(privacy)) {
      let temp = filterPrivacy;
      temp.delete(privacy);
      setFilterPrivacy(new Set(temp));
      setAppliedFilters(false);
    } else {
      setFilterPrivacy((filter) => new Set([...filter, privacy]));
      setAppliedFilters(false);

      // handleClose(setAnchorEl, setOpen);
    }
  };

  const handleCategoryClick = (event) => {
    setCategoryAnchorEl(event.currentTarget);
    setOpenCategory(!openCategory);
  };

  const handleCategorySelection = (category) => {
    if (filterCategory.has(category)) {
      let temp = filterCategory;
      temp.delete(category);
      setFilterCategory(new Set(temp));
    } else {
      setFilterCategory((filter) => new Set([...filter, category]));
      // handleClose(setAnchorEl, setOpen);
    }
    setAppliedFilters(false);
  };

  const handleClearAll = () => {
    setSelected("");
    setVisibility("Privacy");
    setCategory("Category");
    setFilterPrivacy(new Set());
    setFilterCategory(new Set());
    setAppliedFilters(false);
    props.setFiltered(false);
    props.refreshSearch();
  };

  const displayClearAll = () => {
    if (textValue !== "" || filterCategory.size > 0 || filterPrivacy.size > 0) {
      setClearAllVisible(true);
    } else {
      setClearAllVisible(false);
    }
    setAppliedFilters(false);
  };

  const handleApplyFilters = () => {
    let filteredEvents = Array.from(options).filter((event) => {
      if (filterPrivacy.size > 0 && filterCategory.size > 0) {
        if (
          filterPrivacy.has(event["details"].privacy) &&
          filterCategory.has(event["details"].category)
        ) {
          return event;
        } else {
          return false;
        }
      } else {
        if (filterPrivacy.size > 0) {
          if (filterPrivacy.has(event["details"].privacy)) {
            return event;
          } else {
            return false;
          }
        } else {
          if (filterCategory.has(event["details"].category)) {
            return event;
          } else {
            return false;
          }
        }
      }
    });
    setAppliedFilters(true);
    props.setFiltered(true);
    props.setFilteredEventsDetails(filteredEvents);
  };

  const handlePrivacyFilterClear = () => {
    if (textValue === "" && filterCategory.size === 0) {
      handleClearAll();
    } else {
      setFilterPrivacy(new Set());
    }
  };

  const handleCategoryFilterClear = () => {
    if (textValue === "" && filterPrivacy.size === 0) {
      handleClearAll();
    } else {
      setFilterCategory(new Set());
    }
  };

  useEffect(() => {
    optionsConfig(props.searchType);
    loading();
  }, [props.eventsDetails]);

  useEffect(() => {
    if (selected["details"]) {
    }
  }, [selected]);

  useEffect(() => {
    displayClearAll();
  }, [selected, textValue, filterPrivacy, filterCategory]);

  return (
    <>
      <Stack direction="row" sx={{ marginTop: 2 }}>
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
            freeSolo
            onKeyDown={(event) => {
              console.log("keydown", event.key);
              if (event.key === "Escape") {
                if (textValue !== "") {
                  setTextValue("");
                  setSelected("");
                  // props.refreshSearch();
                } else {
                  setTextValue("");
                }
              }
            }}
            onChange={(event, value) => {
              if (value && typeof value === "object") {
                console.log("value", value)
                setTextValue(value["details"].title);
                props.setFilteredEventsDetails([value]);
              } else {
                setTextValue("");
                setSelected("");
                props.refreshSearch();
              }
            }}
            clearIcon={
              <ThemeProvider theme={submitButtonTheme}>
                <ClearIcon color="primary" />
              </ThemeProvider>
            }
            open={searchOpen}
            clearOnEscape
            // autoComplete
            sx={{ width: "100%", display: "flex" }}
            onOpen={() => {
              setSearchOpen(true);
            }}
            onClose={() => {
              // setTextValue("")
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
                return option["details"].title;
              } else return "";
            }}
            renderInput={(params) => (
              <StyledTextField
                onChange={(event) => {
                  setTextValue(event.target.value);
                }}
                {...params}
                label={"Search event"}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <React.Fragment>
                      <ThemeProvider theme={submitButtonTheme}>
                        <SearchIcon color="primary" />
                      </ThemeProvider>
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Box>

        {/* Privacy filter */}
        <Box
          sx={{
            width: "20%",
            display: "flex",
            height: "57px",
          }}
        >
          <ThemeProvider theme={privacyAndCategoryTheme}>
            {/* Clear privacy selection */}
            <Button
              sx={{
                width: "100%",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
              variant={filterPrivacy.size > 0 ? "contained" : "outlined"}
              onClick={handlePrivacyClick}
            >
              {filterPrivacy.size > 0
                ? `Privacy (${filterPrivacy.size})`
                : "Privacy"}
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
                {/* Clear all privacy */}
                <Box
                  className="menu-item"
                  sx={new_event_menu_item_style}
                  display={filterPrivacy.size > 0 ? "" : ""}
                >
                  <MenuItem
                    sx={new_event_menu_item_style}
                    onClick={(event) => {
                      if (filterPrivacy.size > 0) {
                        handlePrivacyFilterClear();
                        handlePrivacyClick(event);
                      }
                    }}
                  >
                    <Stack direction="row" spacing={0}>
                      <Box sx={{ transform: "translateY(2px)" }}>
                        <ListItemDecorator>
                          <ClearIcon fontSize="xs" />
                        </ListItemDecorator>
                      </Box>
                      <Box>Clear</Box>
                    </Stack>
                  </MenuItem>
                </Box>

                {/* Public menu item */}
                <Box
                  className="menu-item"
                  sx={
                    filterPrivacy.has("Public")
                      ? new_event_menu_item_style_selected1
                      : {}
                  }
                >
                  <MenuItem
                    sx={new_event_menu_item_style}
                    onClick={() => {
                      handlePrivacySelection("Public");
                      // handleClose(setAnchorEl, setOpen);
                    }}
                  >
                    <Stack direction="row" spacing={0}>
                      <Box sx={{ transform: "translateY(2px)" }}>
                        <ListItemDecorator>
                          <PublicOutlinedIcon fontSize="xs" />
                        </ListItemDecorator>
                      </Box>
                      <Box>Public</Box>
                      <Box
                        display={filterPrivacy.has("Public") ? "" : "none"}
                        sx={{ transform: "translate(3px, 2px)", marginLeft: 1 }}
                      >
                        <ListItemDecorator>
                          <DoneOutlinedIcon fontSize="xs" />
                        </ListItemDecorator>
                      </Box>
                    </Stack>
                  </MenuItem>
                </Box>

                {/* Private menu item */}
                <Box
                  className="menu-item"
                  sx={
                    filterPrivacy.has("Private")
                      ? new_event_menu_item_style_selected
                      : {}
                  }
                >
                  <MenuItem
                    sx={new_event_menu_item_style}
                    endIcon={<LockOutlinedIcon />}
                    onClick={() => {
                      handlePrivacySelection("Private");
                    }}
                  >
                    <Stack direction="row" spacing={0}>
                      <Box sx={{ transform: "translate(2px, 2px)" }}>
                        <ListItemDecorator>
                          <LockOutlinedIcon fontSize="xs" />
                        </ListItemDecorator>
                      </Box>
                      <Box>Private</Box>
                      <Box
                        display={filterPrivacy.has("Private") ? "" : "none"}
                        sx={{ transform: "translateY(2px)", marginLeft: 1 }}
                      >
                        <ListItemDecorator>
                          <DoneOutlinedIcon fontSize="xs" />
                        </ListItemDecorator>
                      </Box>
                    </Stack>
                  </MenuItem>
                </Box>
              </Stack>
            </Box>
            <ListDivider />
          </Menu>
        </Box>

        {/* Category filter */}

        <Box
          sx={{
            width: "20%",
            display: "flex",
            // marginBottom: 3,
            marginLeft: 1.5,
            marginRight: 1.5,
            height: "57px",
          }}
        >
          <ThemeProvider theme={privacyAndCategoryTheme}>
            <Button
              sx={{
                width: "100%",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
              variant={filterCategory.size > 0 ? "contained" : "outlined"}
              onClick={handleCategoryClick}
            >
              {filterCategory.size > 0
                ? `Category (${filterCategory.size})`
                : "Category"}
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
              width: "5%",
              minWidth: "100px",
              // display:"flex",
              justifyContent: "center",
              fontWeight: "600",
              "--List-decorator-size": "24px",
              borderStyle: "none",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                borderRadius: "25px",
                bgcolor: "#daa520",
                zIndex: "2",
              }}
            >
              <Stack
                direction="column"
                sx={{ paddingBottom: 1, paddingTop: 1 }}
              >
                <Box
                  className="menu-item"
                  sx={new_event_menu_item_style}
                  display={filterCategory.size > 0 ? "" : ""}
                >
                  <MenuItem
                    sx={new_event_menu_item_style}
                    onClick={(event) => {
                      if (filterCategory.size > 0) {
                        handleCategoryFilterClear();
                        handleCategoryClick(event);
                      }
                    }}
                  >
                    <Stack direction="row" spacing={0}>
                      <Box sx={{ transform: "translateY(2px)" }}>
                        <ListItemDecorator>
                          <ClearIcon fontSize="xs" />
                        </ListItemDecorator>
                      </Box>
                      <Box>Clear</Box>
                    </Stack>
                  </MenuItem>
                </Box>

                {categories.map((cat) => {
                  return (
                    <Box
                      className="menu-item"
                      sx={
                        filterCategory.has(cat)
                          ? categories.indexOf(cat) === categories.length - 1
                            ? new_event_menu_item_style_selected
                            : new_event_menu_item_style_selected1
                          : {}
                      }
                    >
                      <MenuItem
                        sx={new_event_menu_item_style}
                        onClick={() => {
                          // setCategory(cat);
                          handleCategorySelection(cat);
                          // handleClose(setCategoryAnchorEl, setOpenCategory);
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

        <Box
          sx={{
            display:
              filterCategory.size > 0 || filterPrivacy.size > 0 ? "" : "none",
          }}
        >
          <ThemeProvider theme={privacyAndCategoryTheme}>
            <Button
              sx={{ height: "56px", marginRight: 1.5, fontWeight:600, letterSpacing:"1px" }}
              startIcon={appliedFilters ? <></> : <TuneIcon />}
              onClick={handleApplyFilters}
              variant={appliedFilters ? "contained" : "outlined"}
            >
              {appliedFilters
                ? `Active (${filterCategory.size + filterPrivacy.size})`
                : "Apply"}
            </Button>
          </ThemeProvider>
        </Box>

        <Box display={clearAllVisible ? "" : "none"}>
          <ThemeProvider theme={privacyAndCategoryTheme}>
            <Button
              onClick={handleClearAll}
              variant="outlined"
              sx={{ height: "56px", marginRight: 1.5 }}
              startIcon={<ClearIcon />}
            >
              all
            </Button>
          </ThemeProvider>
        </Box>
      </Stack>
    </>
  );
};

export default FilterSearchEvent;

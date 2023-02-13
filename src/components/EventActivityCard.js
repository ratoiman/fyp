import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  eventActivityCardStyle,
  editButtonStyle,
} from "../ui_styles/MuiStyles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";

const EventActivityCard = (props) => {
  const [showContainer, setShowContainer] = useState("d-none");

  // Don't show activities container if there are no activities added
  const showActivities = () => {
    if (props.activities.length > 0) {
      setShowContainer("");
    } else {
      setShowContainer("d-none");
    }
  };

  const stringToDate = (stringDate) => {
    if (stringDate !== null && stringDate !== "") {
      let dateParts = stringDate.split("/");
      let dateObj = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
      return dateObj;
    } else {
      return null;
    }
  };

  const stringToTime = (stringTime) => {
    if (stringTime !== null && stringTime !== "") {
      stringTime = stringTime.split(":");
      let now = new Date();
      now.setHours(stringTime[0], stringTime[1], 0, 0);
      return now;
    } else {
      return null;
    }
  };

  const handleEdit = (activity) => {
    const actArr = props.activities.find((x) => x.id === activity.id);
    // const dateTo = stringToDate(actArr.startDate);
    // console.log(stringToDate(stringToDate(actArr.startDate)));
    props.setActivityID(activity.id);
    props.setActivityTitle(actArr.title);
    props.setActivityStartDate(stringToDate(actArr.startDate));
    props.setActivityStartTime(stringToTime(actArr.startTime));
    props.setActivityEndDate(stringToDate(actArr.endDate));
    props.setActivityEndTime(stringToTime(actArr.endTime));
    props.setActivityDescription(actArr.description);
    props.setActivityExpandDate("d-none");
    props.setActivityShowEndDate("");
    props.setTrigger(true);
  };

  useEffect(() => {
    showActivities();
  }, [props.activities]);

  return (
    // <Container className={`${showContainer} w-100`}>
    <Col className={`${showContainer}`}>
      {props.activities.map((activity) => {
        return (
          <Card sx={eventActivityCardStyle} variant="outlines">
            <CardContent>
              <Row className="d-flex flex-row justify-content-center  w-100">
                <Col fluid="md">{activity.title}</Col>
                <Col fluid="sm">
                  {/* Display just day and month */}
                  Start Date:{" "}
                  {activity.startDate.split("/")[0] +
                    "/" +
                    activity.startDate.split("/")[1]}
                </Col>
                <Col fluid="sm">Start Time: {activity.startTime}</Col>
                <Col sm={1}>
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={() => handleEdit(activity)}
                  >
                    <EditOutlinedIcon sx={editButtonStyle} />
                  </IconButton>
                </Col>
              </Row>
            </CardContent>
          </Card>
        );
      })}
    </Col>
    // </Container>
  );
};

export default EventActivityCard;

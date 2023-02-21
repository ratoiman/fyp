import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { handleUnfollow } from "../context/DbCallsContext";

const ConfirmAction = (props) => {
  return (
    <>
      <Box>
        <Card>
          <CardContent>
            <Typography> {props.message}</Typography>
          </CardContent>
          <CardContent>
            <Button onClick={props.unfollow}>Yes</Button>
            <Button onClick={() => props.setUnfollowPopup(false)}>No</Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ConfirmAction;

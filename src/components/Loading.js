import React from "react";
import { RingLoader} from "react-spinners";
import { Container } from "react-bootstrap";
import { isMobile } from "react-device-detect";


const Loading = () => {
  return (
    <>
      <Container className={isMobile ? "loading-mobile" : "loading"}>
        <RingLoader size="100px" color="#DAA520" />
      </Container>
    </>
  );
};

export default Loading;

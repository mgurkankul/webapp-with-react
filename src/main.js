import React from "react";
import Content from "./content";
import Navbar from "./navbar";
function Main(props) {
  return (
    <div id="body" className="dark-mode">
      <Navbar props={props} />
      <Content props={props} />
    </div>
  );
}

export default Main;

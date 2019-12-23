import React from "react";
import MainStructure from "../components/structure/MainStructure";
import NoteContainer from "../containers/NoteContainer";
// import {Accounts, Auth, NotFound} from "./index";
// import { Switch, Route } from "react-router-dom";

const Main = () => {
  return (
    <MainStructure>
      <NoteContainer />
    </MainStructure>
  );
};

export default Main;

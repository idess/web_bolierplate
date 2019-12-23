import React from "react";
// import styles from "./MainStructure.scss";
// import classNames from "classnames/bind";
import HeaderContainer from "../../../containers/HeaderContainer";
import {AsideContainer} from "../../../containers/AsideContainer";
// import {Accounts} from "../../../pages";

// const cx = classNames.bind(styles);

const MainStructure = ({ children }) => {
  console.log(children);
  return (
      <div>
        <HeaderContainer />
        <AsideContainer />
        <main>{children}</main>
      </div>
  );
};

export default MainStructure;
// <Route path="/accounts" exact={true} component={Accounts} />
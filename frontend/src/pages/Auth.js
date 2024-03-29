import React from "react";
import AuthContainer from "../containers/AuthContainer";

const Auth = ({ match }) => {
  const { kind } = match.params;
  console.log(kind);
  return (
      <div>
        <AuthContainer kind={kind} />
      </div>
  );
};

export default Auth;

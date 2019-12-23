import React, { Component } from "react";
import { connect } from "react-redux";
import AuthForm from "../components/auth/AuthForm";
import { withRouter } from "react-router-dom";
import * as authActions from "../store/modules/auth";
import {setItem} from "../service/local-storage.service";

export class AuthContainer extends Component {
  constructor(props) {
    super(props);
    setItem('AUTH.USERINFO', {});
  }
  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps, prevState) {
    const { history } = this.props;
    console.log(this.props);
    if (prevProps.kind !== this.props.kind) {
      this.initialize();
    }

    if (prevProps.logged !== this.props.logged && this.props.logged) {
      history.push("/home");
    }
  }

  initialize = () => {
    const { initializeInput, initializeError } = this.props;
    console.log(this.props);
    initializeError();
    initializeInput();
  };

  handleChangeInput = ({ name, value }) => {
    const { changeInput } = this.props;
    changeInput({ name, value });
  };

  handleLogin = () => {
    const { login } = this.props;
    console.log(this.props);
    login();
  };

  handleRegister = () => {
    const { register } = this.props;
    register();
  };

  render() {
    const { kind, username, password, error } = this.props;
    const { handleChangeInput, handleLogin, handleRegister } = this;
    return (
      <AuthForm
        kind={kind}
        username={username}
        password={password}
        onChangeInput={handleChangeInput}
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={error}
      />
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.form.username,
  password: state.auth.form.password,
  userInfo: state.auth.userInfo,
  logged: state.auth.logged,
  error: state.auth.error
});

const mapDispatchToProps = dispatch => {
  return {
    initializeInput: () => {
      dispatch(authActions.initializeInput());
    },
    changeInput: ({ name, value }) => {
      dispatch(authActions.changeInput({ name, value }));
    },
    initializeError: () => {
      dispatch(authActions.initializeError());
    },
    register: () => {
      dispatch(authActions.register());
    },
    login: () => {
      dispatch(authActions.login());
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthContainer)
);

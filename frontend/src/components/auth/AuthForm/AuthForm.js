import React from "react";
import styles from "./AuthForm.scss";
import classNames from "classnames/bind";
import { Form, Icon, Input, Button } from 'antd';

const cx = classNames.bind(styles);

const AuthForm = ({
  /*kind,*/
  onChangeInput,
  username,
  password,
  onLogin
  // onRegister,
}) => {
  const handleChange = e => {
    const { name, value } = e.target;
    onChangeInput({ name, value });
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      onLogin();
      // switch (kind) {
      //   // case "register":
      //   //   onRegister();
      //   //   return;
      //   case "login":
      //
      //     return;
      //   default:
      //     return;
      // }
    }
  };

  // const handleSubmit = e => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       console.log('Received values of form: ', values);
  //     }
  //   });
  // };

  // const { getFieldDecorator } = this.props.form;
  return (
      <div className={cx("auth-form")}>
        <div className={cx("title")}>
          외부위협정보 수집 시스템
          {/*Login*/}
        </div>{/*{kind.toUpperCase()}*/}
        <Form className="login-form"> {/*onSubmit={onLogin} */}
          <Form.Item>
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" name="username" placeholder="Username" value={username} onChange={handleChange}
                   onKeyPress={handleKeyPress} />
          </Form.Item>
          <Form.Item>
            <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
            />
          </Form.Item>
          <Form.Item>
            <a className="login-form-forgot" href="/">
              Forgot password
            </a>
            <Button type="primary" onClick={onLogin} htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
  );
};
export default AuthForm;


/*<div className={cx("auth-form")}>
      <div className={cx("title")}>{kind.toUpperCase()}</div>
      <div className={cx("error")}>
        {error.triggered && (
          <div className={cx("message")}>{error.message}</div>
        )}
      </div>
      <div className={cx("line-wrapper")}>
        <div className={cx("input-title")}>username</div>
        <input type="text" name="username" value={username} onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className={cx("line-wrapper")}>
        <div className={cx("input-title")}>password</div>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      {kind === "register" ? (
        <div className={cx("auth-button")} onClick={onRegister}>
          {kind.toUpperCase()}
        </div>
      ) : (
        <div className={cx("auth-button")} onClick={onLogin}>
          {kind.toUpperCase()}
        </div>
      )}
      {kind === "register" ? (
        <Link to={`/auth/login`} className={cx("description")}>
          if you already have account...
        </Link>
      ) : (
        <Link to={`/auth/register`} className={cx("description")}>
          if you don't have an account...
        </Link>
      )}
    </div>*/
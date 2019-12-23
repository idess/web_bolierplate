import React, { Component } from "react";
import {Switch, Route, Link} from "react-router-dom";
import {
    Auth,
    NotFound,
    Accounts,
    // Notes,
    UserRules,
    UserDepartments,
    Dashboard,
    AuditLog,
    Categories,
    Services,
    Search
} from "../pages";
import BaseContainer from "../containers/BaseContainer";
import { Layout, Menu, Icon, Button, Tooltip } from 'antd';
import { connect } from "react-redux";
import { NotificationContainer } from 'react-notifications';
import * as authActions from '../store/modules/auth'
const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const pathname = window.location.pathname.replace('/', '');

class App extends Component {

    logined = false;

    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            current: pathname,
            currentOpen: pathname === 'accounts' || pathname === 'userRoles' || pathname === 'userDepartments' ? 'sub1' : ''
        };
        // this.setState({
        //     current: window.location.pathname.replace('/', '')
        // });
        this.logined = props.logged;
    }

    componentDidMount() {
        console.log(this.props);
        console.log(this.state);
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    logout = () => {
        const { logout } = this.props;
        logout();
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    };
  render() {
    return (

        <Layout>
            {this.props.logged && (
            <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                <div className="logo">외부위협정보 수집시스템</div>
                <Menu
                    defaultSelectedKeys={[this.state.current]}
                    onClick={this.handleClick}
                    mode="inline"
                    defaultOpenKeys={[this.state.currentOpen]}
                    selectedKeys={[this.state.current]}
                    theme="dark"
                >
                    <Menu.Item key="home">
                        <Icon type="pie-chart"/>
                        <span>대시보드</span>
                        <Link to="/home" />
                    </Menu.Item>
                    <Menu.Item key="search">
                        <Icon type="desktop"/>
                        <span>검색</span>
                        <Link to="/search" />
                    </Menu.Item>
                    <Menu.Item key="audit">
                        <Icon type="inbox"/>
                        <span>감사로그</span>
                        <Link to="/audit" />
                    </Menu.Item>
                    <Menu.Item key="services">
                        <Icon type="inbox"/>
                        <span>서비스 관리</span>
                        <Link to="/services" />
                    </Menu.Item>
                    {/*<Menu.Item key="categories">
                        <Icon type="inbox"/>
                        <span>카테고리 관리</span>
                        <Link to="/categories" />
                    </Menu.Item>*/}
                    <SubMenu
                        key="sub1"
                        title={
                          <span>
                            <Icon type="appstore"/>
                            <span>시스템 관리</span>
                          </span>
                        }
                    >
                        <Menu.Item key="userRoles">
                            권한 관리
                            <Link to="/userRoles" />
                        </Menu.Item>
                        <Menu.Item key="userDepartments">
                            부서 관리
                            <Link to="/userDepartments" />
                        </Menu.Item>
                        <Menu.Item key="accounts">
                            사용자 관리
                            <Link to="/accounts" />
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>)}
            <Layout>
                {this.props.logged && (
                <Header style={{background: '#fff', padding: 0}}>
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <div
                        style={ {lineHeight: '64px', float: 'right'} }
                    >
                        <Tooltip placement="bottom" title="사용자">
                            <Button type="link">
                                <Icon type="user" />
                                <Link to="/accounts" />
                            </Button>
                        </Tooltip>


                        <Tooltip placement="bottom" title="로그아웃">
                            <Button type="link" onClick={this.logout}>
                                <Icon type="poweroff" />
                                <Link to="/accounts" />
                            </Button>
                        </Tooltip>

                        <Tooltip placement="bottom" title="설정">
                            <Button type="link">
                                <Icon type="setting" />
                                <Link to="/accounts" />
                            </Button>
                        </Tooltip>
                    </div>
                </Header>
                )}
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: '#fff',
                        minHeight: 280,
                    }}
                >
                    <Switch>
                        <Route path="/" exact={true} component={Auth}/>
                        <Route path="/home" exact={true} component={Dashboard}/>
                        <Route path="/auth/:kind" exact={true} component={Auth}/>
                        <Route path="/accounts" exact={true} component={Accounts}/>
                        <Route path="/userRoles" exact={true} component={UserRules}/>
                        <Route path="/userDepartments" exact={true} component={UserDepartments}/>
                        <Route path="/audit" exact={true} component={AuditLog}/>
                        <Route path="/categories" exact={true} component={Categories}/>
                        <Route path="/services" exact={true} component={Services}/>
                        <Route path="/search" exact={true} component={Search}/>
                        <Route component={NotFound}/>
                    </Switch>
                    <BaseContainer/>
                    <NotificationContainer/>
                </Content>
            </Layout>
        </Layout>
    );
  }
}
/**
 * @function mapStateToProps App Component에서 사용하는 State Return
 * @return State auth 안에 userInfo, logged
 * */
const mapStateToProps = (state) => {
    const { userInfo, logged } = state.auth;
    return { userInfo, logged }
};

/**
 * @function mapStateToProps App Component에서 사용하는 State Return
 * @return State auth 안에 userInfo, logged
 * */
const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch(authActions.logout());
        }
    };
};

// export default App; // Component는 넘겼을때
export default connect( // State와 Connect 할때
    mapStateToProps,
    mapDispatchToProps
)(App);
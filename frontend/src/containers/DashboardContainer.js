import React, { Component } from "react";
import { connect } from "react-redux";
import RGL, { WidthProvider } from "react-grid-layout";

// import GridLayout from 'react-grid-layout';
// import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';

import * as userRulesActions from "../store/modules/UserRules";
import * as moment from "moment";
import classNames from "classnames/bind";
import styles from "../components/notes/NoteItem/NoteItem.scss";
import _ from "lodash";

// import {debounceTime, map} from "rxjs/operators";
const ReactGridLayout = WidthProvider(RGL);

const cx = classNames.bind(styles);

export class DashboardContainer extends Component {
    static defaultProps = {
        items: 2
    };

    state = {
        data: [],
        pagination: {},
        loading: false,
        visible: false,
        layout: []
    };

    visible = false;
    loading = false;

    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.setState({
            layout: layout
        });
    }


    componentDidMount() {
        this.getDashboard();
        window.addEventListener("scroll", this.handleScroll);
    }

    getDashboard = () => {
        console.log(this.props);
        console.log(this.state);
        // const { getUserRules } = this.props;
        // getUserRules({});
    };

    generateDOM() {
        return _.map(_.range(this.props.items), function(i) {
            return (
                <div key={i}>
                    <span className="text">{i}</span>
                </div>
            );
        });
    }

    generateLayout() {
        // const p = this.props;
        let layout = [
            {i: '0', x: 0, y: 0, w: 6, h: 5}, //, static: true
            {i: '1', x: 7, y: 0, w: 6, h: 5}, //, minW: 2, maxW: 4
            // {i: '2', x: 4, y: 0, w: 1, h: 2}
        ];
        return layout;
        // return _.map(new Array(p.items), function(item, i) {
        //     var y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
        //     return {
        //         x: (i * 2) % 12,
        //         y: Math.floor(i / 6) * y,
        //         w: 2,
        //         h: y,
        //         i: i.toString()
        //     };
        // });
    }


    render() {
        const { contents } = this.props;
        const { visible, row } = this.state;
        const layout = [
            {i: '0', x: 0, y: 0, w: 6, h: 5},
            {i: '1', x: 6, y: 0, w: 6, h: 5},
            {i: '2', x: 0, y: 5, w: 12, h: 5},
            {i: '3', x: 0, y: 10, w: 12, h: 5}
        ];
        const {
            generateDOM
        } = this;
        return (
            <div className={cx("contents-layout")} style={{display:'flex', flexDirection:'column', height:'100%'}}>
                <div className={cx("contents-header")}>
                    <h3>Dashboard</h3>
                </div>
                <ReactGridLayout
                    style={{flex:1}}
                    className="layout"
                    layout={layout}
                    isDraggable={false}
                    isResizable={false}
                    cols={12}
                    rowHeight={40}
                >
                    <div key="0">
                        <span className="text">Feeding</span>
                    </div>
                    <div key="1">
                        <span className="text">Search</span>
                    </div>
                    <div key="2">
                        <span className="text">최근 search 내역</span>
                    </div>
                    <div key="3">
                        <span className="text">감사로그</span>
                    </div>
                </ReactGridLayout>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    contents:state.userRules.contents,
    update:state.userRules.update,
    error:state.userRules.error
});

const mapDispatchToProps = dispatch => {
    return {
        getDashboard: ({ value }) => {
            dispatch(userRulesActions.userRulesRead({ value }));
        },
        // addUserRule: ({ id, realm, password, username, email, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }) => {
        //     console.log({ id, realm, password, username, email, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone });
        //     dispatch(userRulesActions.userRulesCreate({ id, realm, password, username, email, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }));
        // },
        // updateUserRule: ({ id, realm,  username, email, emailVerified, verificationtoken, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }) => {
        //     // console.log(row);
        //     dispatch(userRulesActions.userRulesUpdate({ id, realm,  username, email, emailVerified, verificationtoken, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }));
        // },
        // deleteUserRule: ({ id }) => {
        //     dispatch(userRulesActions.userRulesDelete({ id }));
        // }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DashboardContainer);

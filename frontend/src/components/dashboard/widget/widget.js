import React from "react";
import styles from "./widget.style.scss";
import classNames from "classnames/bind";
import { Table } from 'antd';

const cx = classNames.bind(styles);

const DashboardWidget = ({ title, widget }) => {
    const handleChange = e => {
        const { name, value } = e.target;
        // onChangeInput({ name, value });
    };

    const handleKeyPress = e => {
        // if (e.key === "Enter") {
        //     onLogin();
        // }
    };

    return (
        <div className={cx("dashboard-table")}>
            <Table>

            </Table>
        </div>
    );
};
export default DashboardWidget;

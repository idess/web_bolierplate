import React from "react";
import styles from "./table.style.scss";
import classNames from "classnames/bind";
import { Table } from 'antd';

const cx = classNames.bind(styles);

const DashboardTable = ({ column, data }) => {
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
export default DashboardTable;

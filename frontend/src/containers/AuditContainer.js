import React, { Component } from "react";
import { connect } from "react-redux";
import {Table, Icon, Button, Modal, Form, Input, Select, DatePicker } from 'antd'; //Select
import * as auditLogActions from "../store/modules/Audit";
import * as moment from "moment";
import * as _ from "lodash";
import classNames from "classnames/bind";
import styles from "../components/notes/NoteItem/NoteItem.scss";
// import {debounceTime, map} from "rxjs/operators";
const { Option } = Select;
const { Column } = Table;
const { RangePicker } = DatePicker;
const cx = classNames.bind(styles);
// const InputGroup = Input.Group;
// const { Option } = Select;

/**
 * @component AuditLogContainer 감사로그 Component
 * @return component
 * */
export class AuditLogContainer extends Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
        page: {
            order:'timestamp desc',
            limit:'30',
            offset:0
        },
        date: [
            moment().subtract(1, 'days'),
            moment(),
        ]
    };
    dateFormat = "YYYY-MM-DDTHH:mm:ss";
    componentDidMount() {
        this.getAuditLog();
        window.addEventListener("scroll", this.handleScroll);
    }

    getAuditLog = () => {
        const { getAuditLog } = this.props;
        const { page, date } = this.state;
        const { dateFormat } = this;
        let params = {
            filter: JSON.stringify({
                ...page,
                where: {
                    timestamp: _.map(date, d => moment(d).format(dateFormat))
                }
            })
        };
        getAuditLog(params);
    };

    handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination, filters, sorter);
        // const pager = { ...this.state.pagination };
        // pager.current = pagination.current;
        // this.setState({
        //     pagination: pager,
        // });
        // this.fetch({
        //     results: pagination.pageSize,
        //     page: pagination.current,
        //     sortField: sorter.field,
        //     sortOrder: sorter.order,
        //     ...filters,
        // });
    };

    handleCancel = () => {
        // this.visible = false;
        this.setState({
            visible: false
        });
    };

    onTypeChange = (value) => {
        console.log(`selected ${value}`);
    };

    onUserChange = (value) => {
        console.log(`selected ${value}`);
    };

    onDateChange = (value) => {
        console.log(value);
        const { getAuditLog } = this;
        this.setState({
            date: value
        });
        getAuditLog();
    };

    render() {
        const { contents } = this.props;
        const { visible, row, date } = this.state;
        const {
            // handleChange,
            onTypeChange,
            onUserChange,
            onDateChange,
            handleTableChange,
            dateFormat
        } = this;
        return (
            <div className={cx("contents-layout")}>
                <div className={cx("contents-header")}>
                    <h3>감사 로그</h3>
                    <p>
                        외부위협정보 수집시스템 감사 로그 페이지 입니다.<br />
                        외부위협정보 수집시스템에서 발생한 이벤트를 검색하실수 있습니다.
                    </p>
                </div>

                <div className={cx("table-header")}>
                    <div class={cx("table-header-total")}>
                        Total {contents.count}
                    </div>
                    <div className={cx("table-header-filter")}>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="종류 선택"
                            optionFilterProp="children"
                            onChange={onTypeChange}
                            /*onFocus={onFocus}
                            onBlur={onBlur}
                            onSearch={onSearch}*/
                            /*filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }*/
                        >
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                        </Select>
                        <Select
                            showSearch
                            style={{ width: 150 }}
                            placeholder="사용자 선택"
                            optionFilterProp="children"
                            onChange={onUserChange}
                            /*onFocus={onFocus}
                            onBlur={onBlur}
                            onSearch={onSearch}*/
                            /*filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }*/
                        >
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                        </Select>
                        <RangePicker defaultValue={date} format={dateFormat} showTime={true} onOk={onDateChange} />
                        <Button type="primary"><Icon type="reload" /></Button>
                    </div>
                </div>
                <Table
                    rowKey={record => record.uid}
                    dataSource={contents.data}
                    // pagination={this.state.pagination}
                    // loading={this.state.loading}
                    onChange={handleTableChange}
                    size="small"
                >
                    <Column title="ID" dataIndex="id" key="id" />
                    <Column title="권한명" dataIndex="name" key="name" />
                    <Column title="설명" dataIndex="description" key="description" />
                    <Column title="등록일"
                            dataIndex="created"
                            key="created"
                            render={d =>  moment(d).format('YYYY-MM-DD HH:mm:ss')}
                    />
                </Table>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    contents:state.auditLog.contents,
    error:state.auditLog.error
});

const mapDispatchToProps = dispatch => {
    return {
        getAuditLog: (filter) => {
            dispatch(auditLogActions.auditLogRead(filter));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuditLogContainer);

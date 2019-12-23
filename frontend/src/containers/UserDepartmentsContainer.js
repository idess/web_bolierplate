import React, { Component } from "react";
import { connect } from "react-redux";
import {Table, Icon, Button, Modal, Form, Input, Tooltip} from 'antd'; //Select
import * as userDeptActions from "../store/modules/UserDepartments";
import * as moment from "moment";
import classNames from "classnames/bind";
import styles from "../components/notes/NoteItem/NoteItem.scss";
// import {debounceTime, map} from "rxjs/operators";
const { Column } = Table;
const { TextArea } = Input;
const { confirm } = Modal;
const cx = classNames.bind(styles);


/**
 * @component CollectionCreateForm UserDepartment Form Component
 * @return component
 * */
const UserDepartmentCreateForm = Form.create({ name: 'form_in_modal' } )(
    // eslint-disable-next-line
    class extends React.Component {
        state = {
            confirmDirty: false,
        };

        render() {
            const { visible, onCancel, onCreate, form, data } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="부서 추가/수정"
                    okText="전송"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="부서명">
                            {getFieldDecorator( 'name', {
                                rules: [{
                                    required: true,
                                    message: '부서명을 입력해주세요.'
                                },
                                ]
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="설명">
                            {getFieldDecorator('description', {
                                rules: [{
                                    message: '부서 설명을 입력해주세요.'
                                }],
                            })(<TextArea />)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

export class UserDepartmentsContainer extends Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
        visible: false,
        page: {
            order:'regDate desc',
            limit:'30',
            offset:0
        },
        row: {
            id: null,
            name: '',
            description: ''
        }
    };

    visible = false;
    loading = false;

    /**
     * @function componentWillUpdate
     * Reactjs에서 State나 Props의 Change 이벤트 Next값을 받아온다.
     * Prvious 값을 받고 싶을땐 componentDidUpdate 사용
     **/
    componentWillUpdate(nextProps, nextState) {
        const { update } = nextProps;
        // props에 update가 'UPDATE'나 'CREATE'일때 리스트를 다시 받아온다
        if(update !== '') {
            const { getUserDepts, updateClearUserDept } = this.props;
            updateClearUserDept();
            const { page } = this.state;
            let params = { filter: JSON.stringify(page) };
            getUserDepts(params);
        }
    }

    componentDidMount() {
        console.log(this.props);
        console.log(this.state);
        this.getUserDepartments();
        window.addEventListener("scroll", this.handleScroll);
    }

    getUserDepartments = () => {
        const { getUserDepts } = this.props;
        const { page } = this.state;
        let params = { filter: JSON.stringify(page) };
        getUserDepts(params);
    };

    addUserDepartment = () => {
        const { addUserDept } = this.props;
        addUserDept();
    };

    updateUserDepartment = () => {
        const { updateUserDept } = this.props;
        updateUserDept();
    };

    deleteUserDepartment = ({ id }) => {
        const { deleteUserDept } = this.props;
        if (!this.props.isLoading) {
            deleteUserDept({ id });
        }
        const scrollHeight =
            (document.documentElement && document.documentElement.scrollHeight) ||
            document.body.scrollHeight;
        const clientHeight =
            (document.documentElement && document.documentElement.clientHeight) ||
            document.body.clientHeight;
        const offsetFlag = scrollHeight - clientHeight < 100;
        if (offsetFlag) {
            // const lastId = this.props.notes[this.props.notes.length - 1].id;
            // if (!this.props.isLast) {
            //     this.props.getMoreNotes({ lastId });
            // }
        }
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

    showModal = (d) => {
        let data = {
            id: null,
            name: '',
            description: ''
        };
        //  if(d.id) 수정
        data = d.id !== undefined ? d : data;
        // Form Modal Value Setting
        this.formRef.props.form.setFieldsValue(data);
        this.setState({
            visible: true,
            row: data
        });
    };

    showConfirm = (row) => {
        console.log(row);
        const { deleteUserDept } = this.props;
        confirm({
            title: '해당 부서를 삭제하시겠습니까??',
            content: '삭제를 계속 진행하시려면 "확인"버튼을 클릭해주세요.',
            okText:'확인',
            cancelText:'취소',
            onOk() {
                deleteUserDept(row);
                console.log('OK');
            },
            onCancel() { console.log('Cancel');},
        });
    };

    handleCreate = () => {
        const { form } = this.formRef.props;
        const { addUserDept, updateUserDept } = this.props;
        const { row } = this.state;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let dt = { ...row, ...values};
            if(dt.id !== null) {
                updateUserDept(dt); // 수정
            } else {
                addUserDept(dt); // 추가
            }
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        const { contents } = this.props;
        const { visible, row } = this.state;
        // const {
        //     // handleChange,
        //     // addNote,
        //     // handleToggle,
        //     // updateNote,
        //     // deleteNote
        // } = this;
        return (
            <div className={cx("contents-layout")}>
                <div className={cx("contents-header")}>
                    <h3>사용자 부서 관리</h3>
                    <p>
                        시스템 사용자 부서 관리 페이지 입니다. 사용자 부서을 추가 하시려면 오른쪽 '추가' 버튼을 클릭해주세요.<br />
                        기존 사용자 부서을 수정하거나 삭제하실려면 사용자 오른쪽 '수정', '삭제' 버튼을 클릭해주세요.
                    </p>
                    <div className={cx("btn-area")}>
                        <Button type="primary" ghost onClick={this.showModal}>
                            <Icon type="user-add" /> 부서 추가 {visible}
                        </Button>
                    </div>
                </div>

                <div className={cx("table-header")}>
                    Total {contents.count}
                </div>
                <Table
                    // columns={columns}
                    rowKey={record => record.id}
                    dataSource={contents.data}
                    // pagination={this.state.pagination}
                    // loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="small"
                >
                    <Column title="ID" width={100} dataIndex="id" key="id" />
                    <Column title="부서명" dataIndex="name" key="name" />
                    <Column title="설명" dataIndex="description" key="description" />
                    <Column title="등록일"
                            dataIndex="regDate"
                            key="regDate"
                            render={d =>  moment(d).format('YYYY-MM-DD HH:mm:ss')}
                    />
                    <Column
                        title="Action"
                        width={120}
                        key="action"
                        render={(text, record) => (
                            <span>
                                <Tooltip title="수정"><Button size={"small"} type={"primary"} style={{marginRight:"10px"}} onClick={(e) => { this.showModal(record); }}><Icon type="edit" /></Button></Tooltip>
                                <Tooltip title="삭제"><Button size={"small"} type={"danger"} onClick={(e) => { this.showConfirm(record); }}><Icon type="delete" /></Button></Tooltip>
                            </span>
                        )}
                    />
                </Table>

                <UserDepartmentCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    data={row}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    contents:state.userDepts.contents,
    update:state.userDepts.update,
    error:state.userDepts.error
});

const mapDispatchToProps = dispatch => {
    return {
        getUserDepts: (filter) => {
            dispatch(userDeptActions.userDeptsRead(filter));
        },
        addUserDept: ({id, name, description}) => {
            dispatch(userDeptActions.userDeptsCreate({id, name, description}));
        },
        updateUserDept: ({ id, name, description, regDate, editDate, regId, editId, isDelete }) => {
            dispatch(userDeptActions.userDeptsUpdate({id, name, description, regDate, editDate, regId, editId, isDelete}));
        },
        deleteUserDept: ({ id }) => {
            dispatch(userDeptActions.userDeptsDelete({ id }));
        },
        clearUserDept: () => {
            dispatch(userDeptActions.userDeptsClear());
        },
        updateClearUserDept: () => {
            dispatch(userDeptActions.userDeptsUpdateClear());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserDepartmentsContainer);
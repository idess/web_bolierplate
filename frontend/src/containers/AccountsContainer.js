import React, { Component } from "react";
import { connect } from "react-redux";
import {Col, Row, Select, Table, Icon, Button, Modal, Form, Input, Tooltip} from 'antd';
import { api } from "../service/common";

// import InsertForm from "../components/notes/InsertForm";
// import NoteWrapper from "../components/notes/NoteWrapper";
// import LoadingView from "../components/notes/LoadingView";

// import * as noteActions from "../store/modules/notes";
// import * as authActions from "../store/modules/auth";
// import NoteList from "../components/notes/NoteList/NoteList";
import * as accountsActions from "../store/modules/Accounts";
import * as moment from "moment";
import classNames from "classnames/bind";
import styles from "../components/notes/NoteItem/NoteItem.scss";
import {debounceTime, map} from "rxjs/operators";
const { Column } = Table;

const { confirm } = Modal;
const cx = classNames.bind(styles);
const InputGroup = Input.Group;
const { Option } = Select;


/**
 * @component CollectionCreateForm Account Form Component
 * @return component
 * */
const CollectionCreateForm = Form.create({ name: 'form_in_modal' } )(
    // eslint-disable-next-line
    class extends React.Component {
        state = {
            confirmDirty: false,
        };

        handleConfirmBlur = e => {
            const { value } = e.target;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        };

        compareToFirstPassword = (rule, value, callback) => {
            const { form } = this.props;
            if (value && value !== form.getFieldValue('password')) {
                callback('Two passwords that you enter is inconsistent!');
            } else {
                callback();
            }
        };

        validateToNextPassword = (rule, value, callback) => {
            const { form } = this.props;
            if (value && this.state.confirmDirty) {
                form.validateFields(['confirm'], { force: true });
            }
            callback();
        };

        validateToNextUsername = (rule, value, callback) => {
            // const { form } = this.props;
            if (value.length  === 0 ) {
                callback('ID를 입력해주세요.');
            } else {
                let params = { filter: JSON.stringify({ where: { username: value } }) };
                api('get',`/Accounts`, params).pipe(
                    debounceTime(500),
                    map(res => res.response)
                ).subscribe(res => {
                    console.log(res.count);
                    if(res.count > 0) {
                        callback(res.count > 0 ? '이미 사용중인 아이디 입니다.' : '');
                    } else {
                        callback();
                    }
                });
            }

        };

        render() {
            const { visible, onCancel, onCreate, form, data } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="사용자 추가/수정"
                    okText="전송"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="ID">
                            {getFieldDecorator( 'username', {
                                rules: [{
                                    required: true,
                                    message: 'ID를 입력해주세요.'
                                },
                                {
                                    validator: this.validateToNextUsername,
                                }
                                ]
                                })(<Input readOnly={data.id !== null ? true : false} />)}
                        </Form.Item>
                        <Form.Item label="이름">
                            {getFieldDecorator('displayName', {
                                rules: [{ required: true, message: '이름을 입력해주세요.' }],
                                initialValue: data.displayName
                            })(<Input />)}
                        </Form.Item>
                        {data.id === null && (
                        <InputGroup>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="비밀번호">
                                        {getFieldDecorator('password', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '비밀번호를 입력해주세요.'
                                                },
                                                {
                                                    validator: this.validateToNextPassword,
                                                }
                                            ],
                                        })(<Input.Password />)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="비밀번호 확인">
                                        {getFieldDecorator('passwordConfirm', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '비밀번호 확인를 입력해주세요.'
                                                },
                                                {
                                                    validator: this.compareToFirstPassword,
                                                }
                                                ],
                                        })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </InputGroup>
                        )}

                        <Form.Item label="Email">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'Email 형식이 아닙니다!',
                                    },
                                    {
                                        required: true,
                                        message: 'Email를 입력해주세요.'
                                    }
                                ],
                                // initialValue: data.email
                            })(<Input />)}
                        </Form.Item>

                        <InputGroup>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="권한">
                                        {getFieldDecorator('roleId', {
                                            rules: [{ required: true }],
                                            initialValue: data.roleId
                                        })(
                                        <Select style={{ width: '100%' }} size={'default'}>
                                            <Option value="0">관리자</Option>
                                            <Option value="1">사용자</Option>
                                        </Select>)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="부서">
                                        {getFieldDecorator('departmentId', {
                                            rules: [{ required: true }],
                                            // initialValue: data.departmentId
                                        })(
                                            <Select style={{ width: '100%' }}>
                                                <Option value="0">부서1</Option>
                                                <Option value="1">부서2</Option>
                                            </Select>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </InputGroup>

                        <Form.Item label="연락처">
                            {getFieldDecorator('contact', {
                                rules: [],
                                // initialValue: data.contact
                            })(<Input />)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

export class AccountsContainer extends Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
        visible: false,
        row: {
            id: null,
            realm: '',
            username: '',
            email: '',
            isUsed: 'Y',
            contact: '',
            roleId: null,
            level: null,
            departmentId: 1,
            displayName: ''
        }
    };

    visible = false;
    loading = false;

    componentDidMount() {
        this.getAccounts();
        window.addEventListener("scroll", this.handleScroll);
    }

    getAccounts = () => {
        const { getAccounts } = this.props;
        getAccounts({});
    };

    addAccount = () => {
        const { addAccount } = this.props;
        addAccount();
    };

    updateAccount = () => {
        const { updateAccount } = this.props;
        updateAccount();
    };

    deleteAccount = ({ id }) => {
        const { deleteAccount } = this.props;
        if (!this.props.isLoading) {
            deleteAccount({ id });
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
            realm: '',
            username: '',
            email: '',
            isUsed: 'Y',
            contact: '',
            roleId: null,
            level: null,
            departmentId: 1,
            displayName: ''
        };
        //  if(d.id) 수정
        data = d.id ? d : data;
        // Form Modal Value Setting
        this.formRef.props.form.setFieldsValue(data);
        this.setState({
            visible: true,
            row: data
        });
    };

    showConfirm = (id) => {
        console.log(id);
        confirm({
            title: 'Do you Want to delete these items?',
            content: 'Some descriptions',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    handleCreate = () => {
        const { form } = this.formRef.props;
        const { addAccount, updateAccount } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let dt = { ...this.state.row, ...values};
            if(dt.id !== null) {
                updateAccount(dt);
            } else {
                addAccount(dt);
            }
            console.log('Received values of form: ', values);
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
                    <h3>사용자 관리</h3>
                    <p>
                        시스템 사용자 관리 페이지 입니다. 사용자를 추가 하시려면 오른쪽 '추가' 버튼을 클릭해주세요.<br />
                        기존 사용자를 수정하거나 삭제하실려면 사용자 오른쪽 '수정', '삭제' 버튼을 클릭해주세요.
                    </p>
                    <div className={cx("btn-area")}>
                        <Button type="primary" ghost onClick={this.showModal}>
                            <Icon type="user-add" /> 사용자 추가 {visible}
                        </Button>
                    </div>
                </div>

                <div className={cx("table-header")}>
                    Total {contents.count}
                </div>
                <Table
                    // columns={columns}
                    bordered
                    rowKey={record => record.uid}
                    dataSource={contents.data}
                    // pagination={this.state.pagination}
                    // loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="small"
                >
                    <Column title="ID" width={100} dataIndex="username" key="username" />
                    <Column title="이름" dataIndex="displayName" key="displayName" />
                    <Column
                        title="사용여부"
                        dataIndex="gender"
                        key="gender"
                        render={d => d === 'Y' ? '사용' : '미사용'}
                    />
                    <Column title="Email" dataIndex="email" key="email" />
                    <Column title="연락처" dataIndex="contact" key="contact" />
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

                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    data={row}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
               {/* <Modal
                    visible={visible}
                    title="사용자 추가/수정"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            Return
                        </Button>,
                        <Button key="submit" type="primary" loading={this.loading} onClick={this.handleOk}>
                            Submit
                        </Button>,
                    ]}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>*/}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    contents:state.accounts.contents,
    update:state.accounts.update,
    error:state.accounts.error
});

const mapDispatchToProps = dispatch => {
    return {
        getAccounts: ({ value }) => {
            dispatch(accountsActions.accountsRead({ value }));
        },
        addAccount: ({ realm, password, username, email, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }) => {
            console.log({ realm, password, username, email, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone });
            dispatch(accountsActions.accountsCreate({ realm, password, username, email, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }));
        },
        updateAccount: ({ id, realm,  username, email, emailVerified, verificationtoken, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }) => {
            // console.log(row);
            dispatch(accountsActions.accountsUpdate({ id, realm,  username, email, emailVerified, verificationtoken, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }));
        },
        deleteAccount: ({ id }) => {
            dispatch(accountsActions.accountsDelete({ id }));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountsContainer);

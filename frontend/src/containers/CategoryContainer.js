import React, { Component } from "react";
import { connect } from "react-redux";
import {Table, Icon, Button, Modal, Form, Input, Tooltip} from 'antd'; //Select
import * as cateriesActions from "../store/modules/Category";
import * as moment from "moment";
import classNames from "classnames/bind";
import styles from "../components/notes/NoteItem/NoteItem.scss";
// import {debounceTime, map} from "rxjs/operators";
const { Column } = Table;
const { TextArea } = Input;
const { confirm } = Modal;
const cx = classNames.bind(styles);
// const InputGroup = Input.Group;
// const { Option } = Select;


/**
 * @component CollectionCreateForm Category Form Component
 * @return component
 * */
const CategoryCreateForm = Form.create({ name: 'form_in_modal' } )(
    // eslint-disable-next-line
    class extends React.Component {
        state = {
            confirmDirty: false,
        };

        render() {
            const { visible, onCancel, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="카테고리 추가/수정"
                    okText="전송"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    <Form layout="vertical">
                        <Form.Item label="name">
                            {getFieldDecorator( 'name', {
                                rules: [{
                                    required: true,
                                    message: '권한명을 입력해주세요.'
                                },
                                ]
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="설명">
                            {getFieldDecorator('description', {
                                rules: [],
                            })(<TextArea />)}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }
    },
);

export class CategoriesContainer extends Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
        visible: false,
        row: {
            id: null,
            name: '',
            service: '',
            type: ''
        },
        dummy: {
            count: 3,
            data: [
                {
                    id: 0,
                    name: 'CISCO',
                    service: 'Talos',
                    type: 'Indicator'
                },
                {
                    id: 1,
                    name: 'CISCO',
                    service: 'Umbrella',
                    type: 'Indicator'
                },
                {
                    id: 2,
                    name: 'CISCO',
                    service: 'Talos',
                    type: 'Indicator'
                }
            ]
        }
    };


    visible = false;
    loading = false;

    componentDidMount() {
        this.getCategories();
        window.addEventListener("scroll", this.handleScroll);
    }

    getCategories = () => {
        const { getCategories } = this.props;
        getCategories({});
    };

    addCategory = () => {
        const { addCategory } = this.props;
        addCategory();
    };

    updateCategory = () => {
        const { updateCategory } = this.props;
        updateCategory();
    };

    deleteCategory = ({ id }) => {
        const { deleteCategory } = this.props;
        if (!this.props.isLoading) {
            deleteCategory({ id });
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
        const { addCategory, updateCategory } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let dt = { ...this.state.row, ...values};
            if(dt.id !== null) {
                updateCategory(dt);
            } else {
                addCategory(dt);
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
        const { visible, row, dummy } = this.state;
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
                    <h3>카테고리 관리</h3>
                    {/*<p>
                        카테고리 관리 페이지 입니다.<br />
                        기존 카테고리를 수정하거나 삭제하실려면 사용자 오른쪽 '수정', '삭제' 버튼을 클릭해주세요.
                    </p>*/}
                    {/*<div className={cx("btn-area")}>
                        <Button type="primary" ghost onClick={this.showModal}>
                            <Icon type="user-add" /> 카테고리 추가 {visible}
                        </Button>
                    </div>*/}
                </div>

                <div className={cx("table-header")}>
                    Total {dummy.count}
                </div>
                <Table
                    // columns={columns}
                    rowKey={record => record.uid}
                    dataSource={dummy.data}
                    // pagination={this.state.pagination}
                    // loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="small"
                >
                    <Column title="ID" width={100} dataIndex="id" key="id" />
                    <Column title="업체명" dataIndex="name" key="name" />
                    <Column title="서비스명" dataIndex="service" key="service" />
                    <Column title="타입지정"
                            dataIndex="type"
                            key="type"
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

                <CategoryCreateForm
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
    contents:state.categories.contents,
    update:state.categories.update,
    error:state.categories.error
});

const mapDispatchToProps = dispatch => {
    return {
        getCategories: ({ value }) => {
            dispatch(cateriesActions.categoriesRead({ value }));
        },
        addCategory: ({ id, realm, password, username, email, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }) => {
            console.log({ id, realm, password, username, email, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone });
            dispatch(cateriesActions.categoriesCreate({ id, realm, password, username, email, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }));
        },
        updateCategory: ({ id, realm,  username, email, emailVerified, verificationtoken, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }) => {
            // console.log(row);
            dispatch(cateriesActions.categoriesUpdate({ id, realm,  username, email, emailVerified, verificationtoken, isDelete, isUsed, contact, roleId, level, departmentId, displayName, timezone }));
        },
        deleteCategory: ({ id }) => {
            dispatch(cateriesActions.categoriesDelete({ id }));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoriesContainer);

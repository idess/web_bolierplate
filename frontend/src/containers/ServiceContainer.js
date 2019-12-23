import React, { Component } from "react";
import { connect } from "react-redux";
import {Table, Icon, Button, Modal, Form, Input, Tooltip, Select} from 'antd'; //Select
import * as servicesActions from "../store/modules/Service";
import * as moment from "moment";
import * as _ from "lodash";
import classNames from "classnames/bind";
import styles from "../components/app.style.scss";
// import {debounceTime, map} from "rxjs/operators";
const { Column } = Table;
const { TextArea } = Input;
const { confirm } = Modal;
const cx = classNames.bind(styles);
// const InputGroup = Input.Group;
const { Option } = Select;


/**
 * @component CollectionCreateForm Service Form Component
 * @return component
 * */
const ServiceCreateForm = Form.create({ name: 'form_in_modal' } )(
    // eslint-disable-next-line
    class extends React.Component {
        state = {
            confirmDirty: false,
            auth: null
        };
        // auth = this.props.auth;

        /**
         * @function componentWillUpdate
         * Reactjs에서 State나 Props의 Change 이벤트 Next값을 받아온다.
         * Prvious 값을 받고 싶을땐 componentDidUpdate 사용
         **/
        componentWillUpdate(nextProps) {
            const { auth } = nextProps;
            if(auth !== this.state.auth) {
                this.setState({
                    auth: auth
                });
            }
        };

        onProductChange = (e) => {
            const { products, form } = this.props;
            let pro = _.find(products, d => d.id === e);
            form.setFieldsValue({
                vendor: pro.vendorId,
                type: pro.deviceType
            });

            this.setState({
                auth: pro.authType
            });
        };

        getDeviceType() {
            const { codes } = this.props;
            return _.filter(codes, d => d.parentType === 'deviceType');
        }

        render() {
            const { visible, onCancel, onCreate, form, vendors, products, codes } = this.props;
            const { auth } = this.state;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title="서비스 추가/수정"
                    okText="등록"
                    onCancel={onCancel}
                    onOk={onCreate}
                >

                    <Form layout="vertical">
                        <Form.Item label="업체명">
                            {getFieldDecorator('product', {
                                rules: [{ required: true }]
                            })(
                                <Select style={{ width: '100%' }} size={'default'}
                                        onChange={this.onProductChange}
                                >
                                    {
                                        products.map(d => {
                                            return (
                                                <Option value={d.id}>{d.name}</Option>
                                            )
                                        })
                                    }
                                </Select>)}
                        </Form.Item>
                        <Form.Item label="서비스명">
                            {getFieldDecorator('vendor', {
                                rules: [{ required: true }]
                            })(
                                <Select style={{ width: '100%' }} size={'default'}>
                                    {
                                        vendors.map(d => {
                                            return (
                                                <Option value={d.id}>{d.name}</Option>
                                            )
                                        })
                                    }
                                </Select>)}
                        </Form.Item>
                        <Form.Item label="서비스 종류">
                            {getFieldDecorator( 'type', {
                                rules: [{
                                    required: true,
                                    message: '서비스 종류 입력'
                                },
                                ]
                            })(<Select style={{ width: '100%' }} size={'default'}>
                                {
                                    this.getDeviceType().map(d => {
                                        return (
                                            <Option value={d.code}>{d.type}</Option>
                                        )
                                    })
                                }
                            </Select>)}
                        </Form.Item>

                        <Form.Item label="커넥션 종류">
                            {getFieldDecorator( 'connectionType', {
                                rules: [{
                                    required: true,
                                    message: '커넥션 종류 입력'
                                },
                                ]
                            })(<Select style={{ width: '100%' }} size={'default'}>
                                <Option value={1}>Taxii1</Option>
                                <Option value={2}>Taxii2</Option>
                                <Option value={3}>Rest API</Option>
                            </Select>)}
                        </Form.Item>

                        <Form.Item label="IP/Domain">
                            {getFieldDecorator( 'ip', {
                                rules: [{
                                    required: true,
                                    message: 'IP 또는 Domain 입력'
                                },
                                ]
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="Port">
                            {getFieldDecorator( 'port', {
                                rules: [{
                                    required: true,
                                    message: 'Port 입력'
                                },
                                ]
                            })(<Input type={'number'} />)}
                        </Form.Item>
                        <div className={ auth !== 1 ? 'hide' : ''}>
                        <Form.Item label="Auth ID">
                            {getFieldDecorator( 'authId', {
                                rules: [{
                                    message: '계정 ID값 입력'
                                },
                                ]
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Auth Password">
                            {getFieldDecorator( 'authPw', {
                                rules: [{
                                    message: '계정 Password값 입력'
                                },
                                ]
                            })(<Input />)}
                        </Form.Item>
                        </div>
                        <div className={ auth === 1 ? 'hide' : ''}>
                        <Form.Item label="Auth Key">
                            {getFieldDecorator( 'authKey', {
                                rules: [{
                                    message: '계정 key값 입력'
                                },
                                ]
                            })(<Input />)}
                        </Form.Item>
                        </div>
                    </Form>
                </Modal>
            );
        }
    },
);

export class ServicesContainer extends Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
        visible: false,
        authType: null,
        row: {
            name: '',
            remark: '',
            ip: '',
            port: null,
            authId: '',
            authPw: '',
            authKey: '',
            type: null,
            vendor: null,
            product: null,
            isDelete: 'N',
            connectionType: null,
            intervalUnit: '',
            intervalValue: '',
            feed: []
        }
    };


    visible = false;
    loading = false;

    componentDidMount() {
        const { getProduct, getVendor, getCode } = this.props;
        getCode();
        getProduct();
        getVendor();
        this.getServices();
        window.addEventListener("scroll", this.handleScroll);
    }

    getServices = () => {
        const { getServices } = this.props;
        getServices({});
    };

    addService = () => {
        const { addService } = this.props;
        addService();
    };

    updateService = () => {
        const { updateService } = this.props;
        updateService();
    };

    deleteService = ({ id }) => {
        const { deleteService } = this.props;
        if (!this.props.isLoading) {
            deleteService({ id });
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
        const { product } = this.props;
        let data = {
            name: '',
            remark: '',
            ip: '',
            port: null,
            authId: '',
            authPw: '',
            authKey: '',
            type: null,
            vendor: null,
            product: null,
            isDelete: 'N',
            connectionType: null,
            intervalUnit: '',
            intervalValue: '',
            feed: []
        };
        //  if(d.id) 수정
        let authType = null;
        if(d.id) {
            data = d;
            let vd = _.find(product, d1 => d1.id === d.product);
            authType = vd.authType;
        }
        console.log(authType);
        // Form Modal Value Setting
        this.formRef.props.form.setFieldsValue(data);
        this.setState({
            visible: true,
            row: data,
            authType: authType
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
        const { addService, updateService } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let dt = { ...this.state.row, ...values};
            console.log(dt);
            if(dt.id) {
                updateService(dt);
            } else {
                addService(dt);
            }
            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    displayVendor = (text) => {
      const {vendor} = this.props;
      let value = text;
      if(vendor.length > 0) {
          const vd = _.find(vendor, d => d.id === text);
          value = vd.name;
      }
      return value;
    };

    displayProduct = (text) => {
        const {product} = this.props;
        let value = text;
        if(product.length > 0) {
            const vd = _.find(product, d => d.id === text);
            value = vd.name;
        }
        return value;
    };

    render() {
        const { contents, product, vendor, code } = this.props;
        const { visible, row, authType } = this.state;
        const {
            displayVendor,
            displayProduct
        } = this;
        return (
            <div className={cx("contents-layout")}>
                <div className={cx("contents-header")}>
                    <h3>서비스 관리</h3>
                    <p>
                        서비스 관리 페이지 입니다. 서비스 추가 하시려면 오른쪽 '추가' 버튼을 클릭해주세요.<br />
                        기존 서비스를 수정하거나 삭제하실려면 사용자 오른쪽 '수정', '삭제' 버튼을 클릭해주세요.
                    </p>
                    <div className={cx("btn-area")}>
                        <Button type="primary" ghost onClick={this.showModal}>
                            <Icon type="user-add" /> 서비스 추가
                        </Button>
                    </div>
                </div>

                <div className={cx("table-header")}>
                    Total {contents.count}
                </div>
                <Table
                    // columns={columns}
                    rowKey={record => record.uid}
                    dataSource={contents.data}
                    // pagination={this.state.pagination}
                    // loading={this.state.loading}
                    onChange={this.handleTableChange}
                    size="small"
                >
                    <Column title="ID" width={100} dataIndex="id" key="id" />
                    <Column title="업체명" dataIndex="vendor" key="vendor"
                            render={(text, record) => (
                                <span>
                                    {displayVendor(text)}
                                </span>
                            )}
                    />
                    <Column title="서비스명" dataIndex="name" key="name" />
                    <Column title="제품명" dataIndex="product" key="product"
                            render={(text, record) => (
                                <span>
                                    {displayProduct(text)}
                                </span>
                            )}
                    />
                    {/*<Column title="디바이스타입" dataIndex="deviceType" key="deviceType"
                            render={(text, record) => (
                                <span>
                                    {displayType(text, 'deviceType')}
                                </span>
                            )}
                    />
                    <Column title="연결타입" dataIndex="connectionType" key="connectionType"
                            render={(text, record) => (
                                <span>
                                    {displayType(text, 'connectType')}
                                </span>
                            )}
                    />
                    <Column title="인증타입" dataIndex="authType" key="authType"
                            render={(text, record) => (
                                <span>
                                    {displayType(text, 'authType')}
                                </span>
                            )}
                    />*/}
                    <Column title="등록일"
                            dataIndex="regDate"
                            key="regDate"
                            render={d =>  moment(d).format('YYYY-MM-DD HH:mm:ss')}
                    />
                    <Column title="수정일"
                            dataIndex="editDate"
                            key="editDate"
                            render={d =>  moment(d).format('YYYY-MM-DD HH:mm:ss')}
                    />
                    <Column
                        title="Action"
                        key="action"
                        width={120}
                        render={(text, record) => (
                            <span>
                                <Tooltip title="수정"><Button size={"small"} type={"primary"} style={{marginRight:"10px"}} onClick={(e) => { this.showModal(record); }}><Icon type="edit" /></Button></Tooltip>
                                <Tooltip title="삭제"><Button size={"small"} type={"danger"} onClick={(e) => { this.showConfirm(record); }}><Icon type="delete" /></Button></Tooltip>
                            </span>
                        )}
                    />
                </Table>

                <ServiceCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    data={row}
                    vendors={vendor}
                    products={product}
                    codes={code}
                    auth={authType}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    contents:state.services.contents,
    update:state.services.update,
    error:state.services.error,
    product:state.services.product,
    vendor:state.services.vendor,
    code:state.services.code
});

const mapDispatchToProps = dispatch => {
    return {
        getServices: ({ value }) => {
            dispatch(servicesActions.servicesRead({ value }));
        },
        addService: ({ name, remark, ip, port, authId, authPw, authKey, type, vendor, product, connectionType, intervalUnit, intervalValue, feed }) => {
            dispatch(servicesActions.servicesCreate({ name, remark, ip, port, authId, authPw, authKey, type, vendor, product, connectionType, intervalUnit, intervalValue, feed }));
        },
        updateService: ({ id, name, remark, ip, port, authId, authPw, authKey, type, vendor, product, connectionType, intervalUnit, intervalValue, feed }) => {
            // console.log(row);
            dispatch(servicesActions.servicesUpdate({ id, name, remark, ip, port, authId, authPw, authKey, type, vendor, product, connectionType, intervalUnit, intervalValue, feed }));
        },
        deleteService: ({ id }) => {
            dispatch(servicesActions.servicesDelete({ id }));
        },
        getProduct: () => {
            dispatch(servicesActions.productsRead());
        },
        getVendor: () => {
            dispatch(servicesActions.vendorsRead());
        },
        getCode: () => {
            dispatch(servicesActions.codeRead());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ServicesContainer);

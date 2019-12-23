// import ReactAce from 'react-ace-editor';
import AceEditor from "react-ace";

import React, { Component } from "react";
import { connect } from "react-redux";
import {Table, Icon, Button, Modal, Form, Input, Select, DatePicker, Descriptions} from 'antd'; //Select
import * as searchActions from "../store/modules/Search";
import * as moment from "moment";
import classNames from "classnames/bind";
import styles from "../components/notes/NoteItem/NoteItem.scss";
// import {debounceTime, map} from "rxjs/operators";
import debounce from 'lodash.debounce';
import { errorMsg, warningMsg } from "../service/message";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-eclipse";

const { Column } = Table;
const { TextArea } = Input;
const { confirm } = Modal;
const cx = classNames.bind(styles);
const { Option } = Select;
const { RangePicker } = DatePicker;

// const InputGroup = Input.Group;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

/**
 * @component CollectionCreateForm Search Form Component
 * @return component
 * */
const SearchCreateForm = Form.create({ name: 'search_form' } )(
    class extends React.Component {
        state = {
            confirmDirty: false,
        };
        handleSubmit = e => {
            e.preventDefault();
            const {form, onCreate} = this.props;
            form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    console.log(this.props);
                    onCreate(values);
                    form.resetFields();
                }
            });
        };
        render() {
            const { form } = this.props;
            const { getFieldDecorator, getFieldsError } = form;
            return (
                <Form layout="inline" className={cx("table-header-filter")} onSubmit={this.handleSubmit}>
                    <Form.Item label="타입선택">
                        {getFieldDecorator('mode', {
                            rules: [{ required: true }]
                        })(
                            <Select size={'default'} style={{'width':"150px"}}>
                                <Option value={"all"}>전체</Option>
                                <Option value={"qradar"}>Qradar</Option>
                                <Option value={"umbrella"}>Umbrella</Option>
                            </Select>)}
                    </Form.Item>
                    <Form.Item label="키워드 입력">
                        {getFieldDecorator('keyword', {
                            rules: [{ required: true }]
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}><Icon type="play-circle" /> 평판조회시작
                        </Button>
                    </Form.Item>
                </Form>
            );
        }
    },
);

const SearchDetailItem = ({ data }) => (
    <div style={{'flex': 1, 'padding': '0 5px'}}>
        <Descriptions column={1} layout={'horizontal'} bordered size={'small'}>
            <Descriptions.Item label="서비스">{data._source.product_name}</Descriptions.Item>
            <Descriptions.Item label="상태">{data._source.search_status}</Descriptions.Item>
            <Descriptions.Item label="사용자">{data._source.requester_name}</Descriptions.Item>
            <Descriptions.Item label="업체">{data._source.vendor_name}</Descriptions.Item>
        </Descriptions>
        <AceEditor
            mode="json"
            theme="eclipse"
            // setReadOnly={true}
            value={JSON.stringify(data, null, '\t')}
            style={{ height: '400px', width: '100%' }}
        />
    </div>
);
export class SearchContainer extends Component {
    state = {
        date: [
            moment().subtract(1, 'days'),
            moment(),
        ],
        filter: {
            search_value: ''
            // index: '',
            // type: ''
        },
        data: [],
        pagination: {},
        loading: false,
        visible: false,
        row: {
            created: "",
            last_modified: "",
            search_id: "",
            search_value: "",
            services: "",
            status: ""
        }
    };
    dateFormat = "YYYY-MM-DDTHH:mm:ss";
    // visible = false;
    loading = false;
    constructor(props) {
        super(props);
        this.debouncedHandleChange = debounce(this.debouncedHandleChange, 500);
        console.log(props);
        if( props.fields.length === 0 ) props.getFields();
    }

    debouncedHandleChange = (event) => {
        console.log(event);
        // this.setState({
        //     eventTarget: event.target.tagName
        // })
    };

    componentDidMount() {
        this.getSearch();
        window.addEventListener("scroll", this.handleScroll);
    }

    /**
     * @function componentWillUpdate
     * Reactjs에서 State나 Props의 Change 이벤트 Next값을 받아온다.
     * Prvious 값을 받고 싶을땐 componentDidUpdate 사용
     **/
    componentWillUpdate(nextProps, nextState) {
        const { update } = nextProps;
        // props에 update가 'SAVE'일때 리스트를 다시 받아온다
        if(update !== '') {
            const { getSearch, searchUpdateClear } = this.props;
            searchUpdateClear();
            // const { page } = this.state;
            // let params = { filter: JSON.stringify(page) };
            setTimeout(() => {
                getSearch({});
            }, 1000);
        }
    }

    getSearch = () => {
        const { getSearch } = this.props;
        const { date, filter } = this.state;
        let where = {};
        if(filter.search_value.trim() !== '') {
            where = {
                where: {
                    search_value: {
                        like: '%' + filter.search_value + '%'
                    }
                }
            }
        }
        let params = {
          start_time: moment(date[0]).format('YYYY-MM-DDTHH:mm:ss'),
          end_time: moment(date[1]).format('YYYY-MM-DDTHH:mm:ss'),
          time_zone:'+09:00',
          filter: JSON.stringify(where)
        };
        getSearch(params);
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

    handleCreate = ({ mode, keyword }) => {
        const { searchSave } = this.props;
        searchSave({ mode, keyword });
    };

    handleCancel = () => {
        // this.visible = false;
        this.setState({
            visible: false
        });
    };

    showModal = (d) => {
        this.setState({
            visible: true,
            row: d
        });
    };

    onTypeChange = (value) => {
        console.log(`selected ${value}`);
        const { filter } = this.state;
        let newFilter = {
            ...filter,
            type: value
        };
        console.log(newFilter);
        this.setState({
            filter: newFilter
        });
    };

    onKeywordChange = (e) => {
        const { filter } = this.state;
        let newFilter = {
            ...filter
        };
        newFilter[e.target.name] = e.target.value;
        this.setState({
            filter: newFilter
        });
    };

    onDateChange = (value) => {
        this.setState({
            date: value
        });
        setTimeout(() => {
            this.getSearch();
        }, 1);
    };

    onReset = () => {
        this.setState({
            filter: {
                index: '',
                query: '',
                type: ''
            }
        });
    };

    onSave() {

    }

    onSearch = () => {
        const { filter } = this.state;
        const { getSearch } = this.props;

        if(filter.index === '') { // 필수 항목
            warningMsg({name:'입력값 누락', message:'index는 필수 입력값입니다.'});
            return;
        }
        if(filter.query === '') { // 필수 항목
            warningMsg({name:'입력값 누락', message:'query는 필수 입력값입니다.'});
            return;
        }
        getSearch(filter);
    };

    searchDetail = (d) => {
        console.log(d);
        const { search_id } = d;
        const { searchDetail } = this.props;
        searchDetail({ search_id });
        this.setState({
            visible: true,
            row: d
        });
    };

    render() {
        const { contents, fields, detail } = this.props;
        const { visible, row, date, filter } = this.state;
        const {
            onTypeChange,
            onKeywordChange,
            onDateChange,
            onReset,
            getSearch,
            onSearch,
            searchDetail,
            onSave,
            setState,
            dateFormat,
        } = this;
        return (
            <div className={cx("contents-layout")}>
                <div className={cx("contents-header")}>
                    <h3>Search</h3>
                </div>

                <div className={cx("table-header")}>
                    <SearchCreateForm
                        onCreate={this.handleCreate}
                    />
                </div>
                <div className={cx("contents-header")}>
                    <h3>Search 내역</h3>
                </div>

                <div className={cx("table-header")}>
                    <div className={cx("table-header-total")}>
                        Total {contents.total_count}
                    </div>
                    <div className={cx("table-header-filter")}>
                        {/*<Select
                            showSearch
                            style={{width: 150}}
                            placeholder="타입 선택"
                            value={filter.type}
                            onChange={onTypeChange}
                        >
                            <Option value="">선택안함</Option>
                            {
                                fields.map(field => {
                                    return (
                                        <Option value={field.field}>{field.description}</Option>
                                    )
                                })
                            }
                        </Select>
                        <Input
                            style={{width: 150}}
                            placeholder="Index 입력"
                            name={'index'}
                            value={ filter.index }
                            onChange={(e) => onKeywordChange(e)}
                        />*/}
                        <Input
                            style={{width: 150}}
                            placeholder="키워드 입력"
                            name={'search_value'}
                            value={ filter.search_value }
                            onChange={(e) => onKeywordChange(e)}
                        />
                        <RangePicker defaultValue={date} format={dateFormat} showTime={true} onOk={onDateChange}/>
                        <Button type="primary" onClick={onReset}><Icon type="reload"/></Button>
                        <Button type="primary" onClick={getSearch}><Icon type="search"/></Button>
                    </div>
                </div>
                <Table
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => searchDetail(record)
                        };
                    }}
                    bordered
                    rowKey={record => record.uid}
                    dataSource={contents.data}
                    onChange={this.handleTableChange}
                    size="small"
                >
                    <Column title="ID" dataIndex="search_id" />
                    <Column title="키워드" dataIndex="search_value" />
                    <Column title="검색일시"
                            dataIndex="created"
                            render={d =>  moment(d).format('YYYY-MM-DD HH:mm:ss')}
                    />
                    <Column title="Services" dataIndex="services" />
                    <Column title="상태" dataIndex="status" />
                    {/*<Column
                        title="Action"
                        key="action"
                        width={80}
                        render={(text, record) => (
                            <span>
                                <Button onClick={(e) => { this.showModal(record); }}><Icon type="search" /></Button>
                            </span>
                        )}
                    />*/}
                </Table>


                <Modal
                    title="Search 상세 정보"
                    visible={this.state.visible}
                    width={900}
                    centered
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                >
                    <Descriptions bordered size={'small'}>
                        <Descriptions.Item label="키워드">{row.search_value}</Descriptions.Item>
                        <Descriptions.Item label="검색일시">{row.created}</Descriptions.Item>
                    </Descriptions>
                    <div style={{'display':'flex', 'marginTop':'30px'}}>
                        {
                            detail.map(dt => {
                                return (
                                    <SearchDetailItem data={dt}/>
                                )
                            })
                        }
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    contents:state.search.contents,
    fields:state.search.fields,
    detail:state.search.detail,
    update:state.search.update,
    error:state.search.error
});

const mapDispatchToProps = dispatch => {
    return {
        getSearch: (filter) => {
            console.log(filter);
            dispatch(searchActions.searchRead(filter));
        },
        getFields: () => {
            dispatch(searchActions.searchFieldRead());
        },
        searchSave: ({ mode, keyword }) => {
            dispatch(searchActions.searchSave({ mode, keyword }));
        },
        searchUpdateClear: () => {
            dispatch(searchActions.searchUpdateClear());
        },
        searchDetail: ({ search_id }) => {
            dispatch(searchActions.searchDetailRead({ search_id }));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchContainer);

/**
 * 角色管理--列出所有权限资源，以供选择分配权限
 * @author Donny
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button } from 'antd';

import { Link, routerRedux } from 'dva/router';
import { forEach } from 'lodash';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './Assign.less';

@connect(({ resources, loading }) => ({
    resources,
    loading: loading.effects['resources/list'],
}))
export default class ResourcesList extends PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'resources/list',
            payload: {},
        });
    }
    render() {
        const { resources: { data }, loading, match: { params }, dispatch } = this.props;
        const dataSource = [];
        forEach(data, (value, key) => {
            dataSource.push({
                code: value.code,
                text: value.text,
            });
        });

        const returnBack = () => {
            dispatch(routerRedux.push('/sys/rolelist/index'));
        };
        // 表列定义
        const columns = [
            {
                title: '资源名称',
                key: 'text',
                dataIndex: 'text',
            },
            {
                title: '资源代码',
                key: 'code',
                dataIndex: 'code',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Link
                            to={`/sys/assign-role-res/${params.rid}/${record.code}/${record.text}`}
                        >
                            分配权限
                        </Link>
                    </span>
                ),
            },
        ];
        return (
            <PageHeaderWrapper title="权限资源分配">
                <Card bordered={false}>
                    <div className={styles.operatorSection}>
                        <Button icon="arrow-left" onClick={returnBack}>
                            返回
                        </Button>
                    </div>
                    <Table
                        rowKey={record => record.code}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                </Card>
            </PageHeaderWrapper>
        );
    }
}

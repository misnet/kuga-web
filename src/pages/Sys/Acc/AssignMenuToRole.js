/**
 * 角色管理--给角色分配菜单访问界面
 * @author Donny
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Form, Spin, Tree, Button } from 'antd';
import { union } from 'lodash';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './Assign.less';

@connect(({ menu, assignMenus, loading }) => ({
    menu,
    assignMenus,
    assignLoading: loading.effects['assignMenus/assign'],
    loading: loading.effects['menu/menuList'],
}))
@Form.create()
export default class AssignMenuToRole extends PureComponent {
    constructor(props) {
        super(props);
        this.checkedKeys = [];
        this.onCheckMenu = this.onCheckMenu.bind(this);
        this.state = {
            checkedMenuIds: { checked: [], halfChecked: [] },
            expandedMenuIds: [],
        };
    }

    componentDidMount() {
        const { dispatch, match: { params } } = this.props;
        dispatch({
            type: 'menu/menuList',
            payload: { rid: params.rid },
        });
    }

    componentWillReceiveProps(nextProps) {
        const { menu: { data } } = nextProps;
        // 从数据中分离出checked和halfChecked
        const checkedMenuIds = { checked: [], halfChecked: [] };
        const expandedMenuIds = [];
        data.map(record => {
            let noneCheckedLength = 0;
            expandedMenuIds.push(record.id);
            if (record.children) {
                noneCheckedLength = record.children.length;
                record.children.map(childItem => {
                    if (childItem.allow && childItem.allow > 0) {
                        noneCheckedLength--;
                        checkedMenuIds.checked.push(childItem.id);
                    }
                    expandedMenuIds.push(childItem.id);
                });
            }
            if (record.allow && record.allow > 0) {
                if (noneCheckedLength == 0) {
                    checkedMenuIds.checked.push(record.id);
                } else {
                    checkedMenuIds.halfChecked.push(record.id);
                }
            }
        });
        this.setState({ checkedMenuIds });
    }

    // 保存分配
    onSave = () => {
        const { dispatch, match: { params } } = this.props;
        dispatch({
            type: 'assignMenus/assign',
            payload: { rid: params.rid, menuIds: this.checkedKeys.join(',') },
        });
    };
    // 选中了某菜单
    onCheckMenu = (checkKeys, e) => {
        this.checkedKeys = union(checkKeys, e.halfCheckedKeys);
        this.setState({
            checkedMenuIds: {
                checked: checkKeys,
                halfChecked: e.halfCheckedKeys,
            },
        });
    };

    render() {
        const { loading, assignLoading, menu: { data }, dispatch } = this.props;
        const expandedMenuIds = [];
        data.map(record => {
            expandedMenuIds.push(record.id);
            if (record.children) {
                record.children.map(childItem => {
                    expandedMenuIds.push(childItem.id);
                });
            }
        });
        const returnBack = () => {
            dispatch(routerRedux.push('/sys/rolelist/index'));
        };

        return (
            <PageHeaderWrapper title="分配菜单">
                <Card bordered={false}>
                    <div className={styles.operatorSection}>
                        <Button
                            icon="check"
                            type="primary"
                            loading={assignLoading}
                            onClick={this.onSave}
                        >
                            保存
                        </Button>
                        <Button icon="arrow-left" onClick={returnBack}>
                            返回
                        </Button>
                    </div>

                    <Spin spinning={loading} size="large">
                        <Tree
                            checkable
                            onCheck={this.onCheckMenu}
                            expandedKeys={expandedMenuIds}
                            checkedKeys={this.state.checkedMenuIds}
                        >
                            {data.map(record => (
                                <Tree.TreeNode title={record.name} key={record.id}>
                                    {record.children &&
                                        record.children.map(submenu => (
                                            <Tree.TreeNode title={submenu.name} key={submenu.id} />
                                        ))}
                                </Tree.TreeNode>
                            ))}
                        </Tree>
                    </Spin>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

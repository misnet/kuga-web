
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Icon,List, Avatar } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { ChartCard, yuan, Field } from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';

import styles from './Workplace.less';
import moment from 'moment';
import config from '../../config';


@connect(({ global,user,stats }) => ({
  global,
  user,
  stats
}))
class Workplace extends PureComponent {
  componentDidMount(){
    this.props.dispatch({
      type:'stats/getShopOverview'
    });
  }
  render() {
    const {user:{currentUser},stats:{shopOverview}} = this.props;
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{currentUser.username}，祝你开心每一天！</div>
          <div>{moment().format(config.DATE_FORMAT)}</div>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout content={pageHeaderContent} >
     
        <Row gutter={24}>
          <Col xs={{span:24}} sm={{span:8}}>
          <ChartCard
            title="商品款数"
            avatar={
              <Icon
                style={{ fontSize:30,borderRadius:"50%",border:"1px solid #d9d9d9",padding:"10px" }}
                type="gold"
                theme="outlined"
              />
            }
            total={() => (
              <span>{shopOverview.productNum}</span>
            )}
          />
          </Col>
          <Col xs={{span:24}} sm={{span:8}}>
          <ChartCard
            title="库存数量"
            avatar={
              <Icon
                style={{ fontSize:30,borderRadius:"50%",border:"1px solid #d9d9d9",padding:"10px" }}
                type="database"
                theme="outlined"
              />
            }
            total={() => (
              <span>{shopOverview.skuNum}</span>
            )}
          />
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
export default Workplace;
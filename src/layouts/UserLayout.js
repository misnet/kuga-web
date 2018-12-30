import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '@/assets/logo.svg';

const links = [

];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 Depoga出品
  </Fragment>
);

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = 'Depoga Demo2';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Depoga Demo2`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={'Kuga'}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>Kuga OpenAPI Web</span>
                </Link>
              </div>
              <div className={styles.desc}>Kuga OpenAPI Web</div>
            </div>
              {this.props.children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;

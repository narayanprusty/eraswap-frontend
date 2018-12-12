import React from 'react';
import Layout from '../../../components/Layout';
import Users from './Users';

const title = 'Dashborad';
const menuKey =20.1;

function action() {
  return {
    title,
    component: (
      <Layout menukey={menuKey}>
        <Users title={title} />
      </Layout>
    ),
  };
}

export default action;

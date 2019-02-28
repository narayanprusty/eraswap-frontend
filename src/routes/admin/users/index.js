import React from 'react';
import Layout from '../../../components/Layout';
import Users from './Users';

const title = 'User Management';
const menuKey = 90.2;

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

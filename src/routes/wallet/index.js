import React from 'react';
import Layout from '../../components/Layout';
import Wallet from './Wallet';

const title ='Wallet'
const menukey ='5'

function action() {
    return {
      title,
      component: (
        <Layout menukey={menukey}>
          <Wallet title={title} />
        </Layout>
      ),
    };
  }

export default action;

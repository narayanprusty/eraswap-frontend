import React from 'react';
import Layout from '../../components/Layout';
// import Page from '../../components/Page';
import P2p from './Add-p2p';

const title ='P2P: Add listing'
const menukey ='3'

function action() {
    return {
      title,
      component: (
        <Layout menukey={menukey}>
          <P2p title={title} />
        </Layout>
      ),
    };
  }

export default action;

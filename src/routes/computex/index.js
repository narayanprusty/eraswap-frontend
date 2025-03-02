import React from 'react';
import Layout from '../../components/Layout';
// import Page from '../../components/Page';
import ComputeEx from './Computex';

const title ='ComputeEx'
const menukey ='1'

function action() {
    return {
      title,
      component: (
        <Layout menukey={menukey}>
          <ComputeEx title={title} menukey={menukey} />
        </Layout>
      ),
    };
  }

export default action;

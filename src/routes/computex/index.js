import React from 'react';
import Layout from '../../components/Layout';
// import Page from '../../components/Page';
import Computex from './Computex';

const title ='ComputeX'
const menukey ='1'

function action() {
    return {
      title,
      component: (
        <Layout menukey={menukey}>
          <Computex title={title} menukey={menukey} />
        </Layout>
      ),
    };
  }

export default action;

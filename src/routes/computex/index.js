import React from 'react';
import Layout from '../../components/Layout';
// import Page from '../../components/Page';
import Computex from './Computex';

const title ='ComputeX'

function action() {
    return {
      title,
      component: (
        <Layout>
          <Computex title={title} />
        </Layout>
      ),
    };
  }

export default action;

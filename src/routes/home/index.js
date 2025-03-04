/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import newsQuery from './news.graphql';
import Layout from '../../components/Layout';

async function action({ client }) {
  const data = await client.query({
    query: newsQuery,
  });
  const menuKey =0.002;
  const itsHome = true;
  return {
    title: 'Eraswap | Home',
    chunks: ['home'],
    component: (
      <Layout itsHome={itsHome} menukey={menuKey} >
        <Home />
      </Layout>
    ),
  };
}

export default action;

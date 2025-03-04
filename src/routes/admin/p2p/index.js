/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../../components/Layout';
import P2p from './P2p';

const title = 'All P2P Matches';
const menuKey = 90.3;

function action() {
  return {
    title,
    component: (
      <Layout menukey={menuKey}>
        <P2p title={title} />
      </Layout>
    ),
  };
}

export default action;

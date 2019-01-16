import React from 'react';
import Layout from '../../components/Layout';
import Wallet from './Wallet';
import AllWallets from './AllWallets';

const title ='Wallet'
const menukey ='5'

function action(context, params) {
    if(params.name)
    {
        return {
        title,
        component: (
            <Layout menukey={menukey}>
            <Wallet title={title} name={params.name} />
            </Layout>
        ),
        };
    }
    else{
        return {
            title,
            component: (
                <Layout menukey={menukey}>
                <AllWallets title={title} />
                </Layout>
            ),
            };
    }
  }

export default action;

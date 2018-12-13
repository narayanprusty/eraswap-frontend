/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable global-require */

// The top-level (parent) route
const routes = {
  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/contact',
      load: () => import(/* webpackChunkName: 'contact' */ './contact'),
    },
    {
      path: '/login',
      load: () => import(/* webpackChunkName: 'login' */ './login'),
    },
    {
      path: '/register',
      load: () => import(/* webpackChunkName: 'register' */ './register'),
    },
    {
      path: '/about',
      load: () => import(/* webpackChunkName: 'about' */ './about'),
    },
    {
      path: '/privacy',
      load: () => import(/* webpackChunkName: 'privacy' */ './privacy'),
    },
    {
      path: '/ComputeEx',
      load: () => import(/* webpackChunkName: 'admin' */ './computex'),
    },
    {
        path: '/wallet',
        load: () => import(/* webpackChunkName: 'wallet' */ './wallet'),
    },
    {
      path: '/wallet/:name',
      load: () => import(/* webpackChunkName: 'wallet' */ './wallet'),
    },{
      path:'/txnhistory',
      load: ()=> import('./TxnHistory'),
    },
    {
      path:'/add_p2p_listing',
      load: ()=> import('./add-p2p'),
    },
    {
      path:'/p2p',
      load: ()=> import('./p2p'),
    },
    {
        path: '/LendBorrow/placeOrder',
        load: () => import('./lendBorrow/placeOrder'),
    },
    {
        path: '/LendBorrow/agreements',
        load: () => import('./lendBorrow/agreements'),
    },
    {
        path: '/LendBorrow',
        load: () => import('./lendBorrow'),
    },
    {
      path: '/admin',
      load: ()=> import('./admin/dashboard'),
    },
    {
      path: '/admin/users',
      load: ()=> import('./admin/users'),
    },
    {
      path: '/admin/txns',
      load: ()=> import('./admin/txns'),
    },
    {
      path: '/admin/p2p',
      load: ()=> import('./admin/p2p'),
    },
    {
      path: '/admin/escrow',
      load: ()=> import('./admin/escrow'),
    },
    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - eraswap`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;

(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{569:function(e,t,o){"use strict";var n=o(3),r=o.n(n),a=(o(2),o(75));function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n])}return e}).apply(this,arguments)}function c(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function u(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?s(e):t}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var f=function(e){function t(){var e,o,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var r=arguments.length,i=new Array(r),l=0;l<r;l++)i[l]=arguments[l];return u(n,(o=n=u(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(i))),Object.defineProperty(s(n),"handleClick",{configurable:!0,enumerable:!0,writable:!0,value:function(e){n.props.onClick&&n.props.onClick(e),!function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}(e)&&function(e){return 0===e.button}(e)&&!0!==e.defaultPrevented&&(e.preventDefault(),a.a.push(n.props.to))}}),o))}var o,n,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.a.Component),o=t,(n=[{key:"render",value:function(){var e=this.props,t=e.to,o=e.children,n=function(e,t){if(null==e)return{};var o,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||(r[o]=e[o]);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)o=i[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}(e,["to","children"]);return r.a.createElement("a",l({href:t},n,{onClick:this.handleClick}),o)}}])&&c(o.prototype,n),i&&c(o,i),t}();Object.defineProperty(f,"defaultProps",{configurable:!0,enumerable:!0,writable:!0,value:{onClick:null}}),t.a=f},572:function(e,t,o){"use strict";(function(e){o(623);var n,r=o(611),a=o(3),i=o.n(a),l=(o(2),o(568)),c=o.n(l),u=o(622),s=o.n(u),f=o(621),p=o.n(f),y=o(575);function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e,t,o,r){n||(n="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=e&&e.defaultProps,i=arguments.length-3;if(t||0===i||(t={children:void 0}),t&&a)for(var l in a)void 0===t[l]&&(t[l]=a[l]);else t||(t=a||{});if(1===i)t.children=r;else if(i>1){for(var c=new Array(i),u=0;u<i;u++)c[u]=arguments[u+3];t.children=c}return{$$typeof:n,type:e,key:void 0===o?null:""+o,ref:null,props:t,_owner:null}}function v(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function m(e,t){return!t||"object"!==b(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}var h=d(o(576).a,{}),g=function(t){function o(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o),m(this,(o.__proto__||Object.getPrototypeOf(o)).apply(this,arguments))}var n,a,l;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(o,i.a.Component),n=o,(a=[{key:"componentDidMount",value:function(){"undefined"==typeof window||!window.document||window.document.createElement;console.log(e.env)}},{key:"render",value:function(){return d(r.a,{className:"layout"},void 0,d(y.a,{menukey:this.props.menukey,itsHome:this.props.itsHome}),this.props.children,h)}}])&&v(n.prototype,a),l&&v(n,l),o}();t.a=c()(s.a,p.a)(g)}).call(this,o(165))},575:function(e,t,o){"use strict";var n,r=o(3),a=o.n(r),i=o(568),l=o.n(i),c=o(620),u=o.n(c),s=o(569),f=(o(240),o(83)),p=(o(591),o(578)),y=(o(609),o(588)),b=o(63),d=o.n(b),v=o(618),m=o.n(v);function h(e){return(h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function g(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function w(e,t,o,r){n||(n="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=e&&e.defaultProps,i=arguments.length-3;if(t||0===i||(t={children:void 0}),t&&a)for(var l in a)void 0===t[l]&&(t[l]=a[l]);else t||(t=a||{});if(1===i)t.children=r;else if(i>1){for(var c=new Array(i),u=0;u<i;u++)c[u]=arguments[u+3];t.children=c}return{$$typeof:n,type:e,key:void 0===o?null:""+o,ref:null,props:t,_owner:null}}function S(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function O(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var k,P=y.a.SubMenu,_=w(y.a,{},void 0,w(y.a.Item,{},"1",w(s.a,{to:"/computex"},void 0,w(f.a,{type:"database",theme:"twoTone"}),"  ComputeX")),w(P,{title:"P2P Dashboards"},void 0,w(y.a.Item,{},"3",w(s.a,{to:"/add_p2p_listing"},void 0,"Manage P2P Listing")),w(y.a.Item,{},"4",w(s.a,{to:"/p2p"},void 0,"P2P MarketPlace"))),w(P,{title:"Wallets"},void 0,w(y.a.Item,{},"5",w(s.a,{to:"/wallet/Btc"},void 0,"Bitcoin")),w(y.a.Item,{},"6",w(s.a,{to:"/wallet/Eth"},void 0,"Ethereum")),w(y.a.Item,{},"7",w(s.a,{to:"/wallet/Est"},void 0,"EST Token"))),w(y.a.Item,{disabled:!0},"8",w(s.a,{to:"/LandB"},void 0,w(f.a,{type:"usergroup-add",theme:"twoTone"})," Lend ","&"," Borrow"))),j=w(f.a,{type:"appstore"}),N=w(f.a,{type:"down"}),E=w(f.a,{type:"logout"}),C=function(e){function t(e){var o,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),n=this,r=(t.__proto__||Object.getPrototypeOf(t)).call(this,e),o=!r||"object"!==h(r)&&"function"!=typeof r?O(n):r,Object.defineProperty(O(o),"menu",{configurable:!0,enumerable:!0,writable:!0,value:_}),Object.defineProperty(O(o),"loginStateSet",{configurable:!0,enumerable:!0,writable:!0,value:function(){localStorage.getItem("token")&&localStorage.getItem("token").length>0?o.setState({loggedIn:!0}):o.setState({loggedIn:!1})}}),Object.defineProperty(O(o),"logout",{configurable:!0,enumerable:!0,writable:!0,value:function(){return localStorage.clear(),o.setState({loggedIn:!1}),!0}}),o.state={loggedIn:!1},o}var o,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.a.Component),o=t,(n=[{key:"componentDidMount",value:function(){this.loginStateSet()}},{key:"render",value:function(){var e;return w("div",{className:m.a.root,role:"navigation"},void 0,3==this.props.menukey&&w(s.a,{className:m.a.link,to:"/p2p"},void 0,"P2P Marketplace"),4==this.props.menukey&&w(s.a,{className:m.a.link,to:"/add_p2p_listing"},void 0,"Manage Your Listings"),this.state.loggedIn&&w(p.a,{overlay:this.menu},void 0,w("a",(g(e={className:"ant-dropdown-link"},"className",m.a.link),g(e,"href","#"),e),void 0,j," ",N)),!this.state.loggedIn&&w("span",{className:m.a.spacer},void 0," | ")&&w(s.a,{className:m.a.link,to:"/login"},void 0,"Log in"),!this.state.loggedIn&&w("span",{className:m.a.spacer},void 0,"or")&&w(s.a,{className:d()(m.a.link,m.a.highlight),to:"/register"},void 0,"Sign up"),this.state.loggedIn&&w("span",{className:m.a.spacer},void 0," | ")&&w(s.a,{className:m.a.link,onClick:this.logout,to:"/login"},void 0,"  ",E," "))}}])&&S(o.prototype,n),r&&S(o,r),t}(),I=l()(m.a)(C),T=o(577),x=o.n(T);function D(e){return(D="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function $(e,t,o,n){k||(k="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var r=e&&e.defaultProps,a=arguments.length-3;if(t||0===a||(t={children:void 0}),t&&r)for(var i in r)void 0===t[i]&&(t[i]=r[i]);else t||(t=r||{});if(1===a)t.children=n;else if(a>1){for(var l=new Array(a),c=0;c<a;c++)l[c]=arguments[c+3];t.children=l}return{$$typeof:k,type:e,key:void 0===o?null:""+o,ref:null,props:t,_owner:null}}function M(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function A(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var L=$("img",{src:x.a,srcSet:x.a,width:"200",alt:"Eraswap"}),R=function(e){function t(e){var o,n,r;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),n=this,r=(t.__proto__||Object.getPrototypeOf(t)).call(this,e),o=!r||"object"!==D(r)&&"function"!=typeof r?A(n):r,Object.defineProperty(A(o),"loginState",{configurable:!0,enumerable:!0,writable:!0,value:function(){localStorage.getItem("token")&&localStorage.getItem("token").length>0?o.setState({loggedIn:!0}):o.setState({loggedIn:!1})}}),Object.defineProperty(A(o),"handleClick",{configurable:!0,enumerable:!0,writable:!0,value:function(e){console.log("click ",e),o.setState({current:e.key})}}),o.state={loggedIn:!1},o}var o,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.a.Component),o=t,(n=[{key:"componentDidMount",value:function(){this.loginState()}},{key:"render",value:function(){return $("div",{className:u.a.root},void 0,$("div",{className:u.a.container},void 0,$(I,{menukey:this.props.menukey}),$(s.a,{className:u.a.brand,to:"/"},void 0,L)),$("div",{},void 0,$("div",{className:u.a.banner},void 0,.002==this.props.menukey&&$("div",{},void 0,$("h1",{className:u.a.bannerTitle},void 0,"Home")),.1==this.props.menukey&&$("div",{},void 0,$("h1",{className:u.a.bannerTitle},void 0,"User Registration")),.2==this.props.menukey&&$("div",{},void 0,$("h1",{className:u.a.bannerTitle},void 0,"User Login")),1==this.props.menukey&&$("div",{},void 0,$("h1",{className:u.a.bannerTitle},void 0,"Computex"),$("p",{className:u.a.bannerDesc},void 0,"Computex Dashboard")),3==this.props.menukey&&$("div",{},void 0,$("h1",{className:u.a.bannerTitle},void 0,"Manage P2P"),$("p",{className:u.a.bannerDesc},void 0,"Manage Your P2P Listings")),4==this.props.menukey&&$("div",{},void 0,$("h1",{className:u.a.bannerTitle},void 0,"P2P MarketPlace"),$("p",{className:u.a.bannerDesc},void 0,"P2P Dash board")),5==this.props.menukey&&$("div",{},void 0,$("h1",{className:u.a.bannerTitle},void 0,"Wallets"),$("p",{className:u.a.bannerDesc},void 0,"Wallet Dashboard")))))}}])&&M(o.prototype,n),r&&M(o,r),t}();t.a=l()(u.a)(R)},576:function(e,t,o){"use strict";var n,r=o(3),a=o.n(r),i=o(568),l=o.n(i),c=o(617),u=o.n(c),s=o(569);function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,t,o,r){n||(n="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=e&&e.defaultProps,i=arguments.length-3;if(t||0===i||(t={children:void 0}),t&&a)for(var l in a)void 0===t[l]&&(t[l]=a[l]);else t||(t=a||{});if(1===i)t.children=r;else if(i>1){for(var c=new Array(i),u=0;u<i;u++)c[u]=arguments[u+3];t.children=c}return{$$typeof:n,type:e,key:void 0===o?null:""+o,ref:null,props:t,_owner:null}}function y(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function b(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}var d=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),b(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}var o,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.a.Component),o=t,(n=[{key:"render",value:function(){return p("div",{className:u.a.root},void 0,p("div",{className:u.a.container},void 0,p("span",{className:u.a.text},void 0,"© Eraswap"),p("span",{className:u.a.spacer},void 0,"·"),p(s.a,{className:u.a.link,to:"/"},void 0,"Home"),p("span",{className:u.a.spacer},void 0,"·"),p(s.a,{className:u.a.link,to:"/privacy"},void 0,"Privacy")))}}])&&y(o.prototype,n),r&&y(o,r),t}();t.a=l()(u.a)(d)},577:function(e,t,o){e.exports=o.p+"01742c55.png"},619:function(e,t,o){e.exports=o.p+"ecd18f10.jpg"},997:function(e,t,o){"use strict";o.r(t);var n,r=o(3),a=o.n(r),i=o(572),l=(o(2),o(568)),c=o.n(l),u=o(874),s=o.n(u);function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function p(e,t,o,r){n||(n="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=e&&e.defaultProps,i=arguments.length-3;if(t||0===i||(t={children:void 0}),t&&a)for(var l in a)void 0===t[l]&&(t[l]=a[l]);else t||(t=a||{});if(1===i)t.children=r;else if(i>1){for(var c=new Array(i),u=0;u<i;u++)c[u]=arguments[u+3];t.children=c}return{$$typeof:n,type:e,key:void 0===o?null:""+o,ref:null,props:t,_owner:null}}function y(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function b(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}var d,v=p("p",{},void 0,"Sorry, the page you were trying to view does not exist."),m=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),b(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}var o,n,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.a.Component),o=t,(n=[{key:"render",value:function(){return p("div",{className:s.a.root},void 0,p("div",{className:s.a.container},void 0,p("h1",{},void 0,this.props.title),v))}}])&&y(o.prototype,n),r&&y(o,r),t}(),h=c()(s.a)(m);function g(e,t,o,n){d||(d="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var r=e&&e.defaultProps,a=arguments.length-3;if(t||0===a||(t={children:void 0}),t&&r)for(var i in r)void 0===t[i]&&(t[i]=r[i]);else t||(t=r||{});if(1===a)t.children=n;else if(a>1){for(var l=new Array(a),c=0;c<a;c++)l[c]=arguments[c+3];t.children=l}return{$$typeof:d,type:e,key:void 0===o?null:""+o,ref:null,props:t,_owner:null}}var w="Page Not Found",S=g(i.a,{},void 0,g(h,{title:w}));t.default=function(){return{chunks:["not-found"],title:w,component:S,status:404}}}}]);
//# sourceMappingURL=not-found.0ee3334d.chunk.js.map
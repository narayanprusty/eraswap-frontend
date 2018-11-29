require("source-map-support").install(),exports.ids=[8],exports.modules={112:function(e,t,r){"use strict";r.r(t);var n,o=r(2),a=r.n(o),i=r(53),s=(r(3),r(16)),l=r.n(s),c=r(80),p=r.n(c),u=r(45),f=r(46),m=r.n(f);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(){return(y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function b(e,t,r,o){n||(n="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var a=e&&e.defaultProps,i=arguments.length-3;if(t||0===i||(t={children:void 0}),t&&a)for(var s in a)void 0===t[s]&&(t[s]=a[s]);else t||(t=a||{});if(1===i)t.children=o;else if(i>1){for(var l=new Array(i),c=0;c<i;c++)l[c]=arguments[c+3];t.children=l}return{$$typeof:n,type:e,key:void 0===r?null:""+r,ref:null,props:t,_owner:null}}function v(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function g(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var h,w=u.Form.Item,x=b(u.Input,{}),P=b(u.Input,{}),_=b(u.Input,{type:"password"}),S=b(u.Button,{type:"primary",htmlType:"submit"},void 0,"Register"),O=function(e){function t(e){var r,n,o;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),n=this,o=(t.__proto__||Object.getPrototypeOf(t)).call(this,e),r=!o||"object"!==d(o)&&"function"!=typeof o?g(n):o,Object.defineProperty(g(r),"handleSubmit",{configurable:!0,enumerable:!0,writable:!0,value:function(e){e.preventDefault(),r.props.form.validateFieldsAndScroll(function(e,t){e?(console.log(e),u.notification.open({message:"Error",description:"Unable to create Please try again."})):m.a.post("/auth/signup",t).then(function(e){var t="open".concat(Date.now()),r=b(u.Button,{type:"primary",size:"small",onClick:function(){return location.href="/login"}},void 0,"login");u.notification.open({message:"Success",description:"Account Has been created, please login",btn:r,key:t})}).catch(function(e){console.log(e),u.notification.open({message:"Error",description:"Unable to create Please try again."})})})}}),Object.defineProperty(g(r),"compareToFirstPassword",{configurable:!0,enumerable:!0,writable:!0,value:function(e,t,n){var o=r.props.form;t&&t!==o.getFieldValue("password")?n("Two passwords that you enter is inconsistent!"):n()}}),Object.defineProperty(g(r),"validateToNextPassword",{configurable:!0,enumerable:!0,writable:!0,value:function(e,t,n){var o=r.props.form;t&&r.state.confirmDirty&&o.validateFields(["confirm"],{force:!0}),n()}}),r.state={},r}var r,n,o;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.a.Component),r=t,(n=[{key:"render",value:function(){var e=this.props.form.getFieldDecorator,t={labelCol:{xs:{span:24},sm:{span:8}},wrapperCol:{xs:{span:24},sm:{span:16}}};return b("div",{className:p.a.root},void 0,b("div",{className:p.a.container},void 0,b(u.Form,{onSubmit:this.handleSubmit,style:{maxWidth:"500px",width:"40%",marginLeft:"25%",paddingBottom:"10em"}},void 0,a.a.createElement(w,y({},t,{label:"Username"}),e("username",{rules:[{required:!0,message:"Please enter the username!"}]})(x)),a.a.createElement(w,y({},t,{label:"E-mail"}),e("email",{rules:[{type:"email",message:"This is not valid E-mail!"},{required:!0,message:"Please input your E-mail!"}]})(P)),a.a.createElement(w,y({},t,{label:"Password"}),e("password",{rules:[{required:!0,message:"Please input your password!"},{validator:this.validateToNextPassword}]})(_)),a.a.createElement(w,y({},t,{label:"Confirm Password"}),e("confirm",{rules:[{required:!0,message:"Please confirm your password!"},{validator:this.compareToFirstPassword}]})(b(u.Input,{type:"password",onBlur:this.handleConfirmBlur}))),a.a.createElement(w,{wrapperCol:{xs:{span:24,offset:0},sm:{span:16,offset:8}}},S))))}}])&&v(r.prototype,n),o&&v(r,o),t}(),E=u.Form.create()(l()(p.a)(O));function F(e,t,r,n){h||(h="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103);var o=e&&e.defaultProps,a=arguments.length-3;if(t||0===a||(t={children:void 0}),t&&o)for(var i in o)void 0===t[i]&&(t[i]=o[i]);else t||(t=o||{});if(1===a)t.children=n;else if(a>1){for(var s=new Array(a),l=0;l<a;l++)s[l]=arguments[l+3];t.children=s}return{$$typeof:h,type:e,key:void 0===r?null:""+r,ref:null,props:t,_owner:null}}var k="New User Registration",j=F(i.a,{menukey:.1},void 0,F(E,{title:k}));t.default=function(){return{chunks:["register"],title:k,component:j}}},79:function(e,t,r){(t=e.exports=r(36)(!1)).push([e.i,':root{--font-family-base:"Segoe UI","HelveticaNeue-Light",sans-serif;--max-content-width:2150px;--screen-xs-min:480px;--screen-sm-min:768px;--screen-md-min:992px;--screen-lg-min:1200px}._2_v1F{padding-top:1.3em;padding-left:3.5em;padding-right:3.5em;width:94%}._2_v1F,._31Gk4{text-align:center;-ms-flex-item-align:center;align-self:center;max-width:2150px;max-width:var(--max-content-width)}._31Gk4{margin:0 auto;padding:0 0 40px;margin-top:2em;font-family:-apple-system,BlinkMacSystemFont,sans-serif}',""]),t.locals={root:"_2_v1F",container:"_31Gk4"}},80:function(e,t,r){var n=r(79),o=r(35);"string"==typeof n&&(n=[[e.i,n,""]]),e.exports=n.locals||{},e.exports._getContent=function(){return n},e.exports._getCss=function(){return n.toString()},e.exports._insertCss=function(e){return o(n,e)}}};
//# sourceMappingURL=register.js.map
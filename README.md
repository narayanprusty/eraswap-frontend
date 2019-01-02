# eraswap-frontend - Install and Run

1. Install Node.js and NPM
3. git clone https://github.com/BlockClusterApp/eraswap-frontend.git
4. cd eraswap-frontend && yarn install
5. yarn start


Build for Production [workaround] :
1> comment out this lines:

```
if (canUseDOM && __DEV__) {
     // Import the antThemeLoader.less file for hot reloading theme changes
       require('components/antThemeLoader.less');
     }
```
and do a

`yarn build --release`

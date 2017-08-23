"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var dotenv = require("dotenv");
var electronOauth2 = require("electron-oauth2");
exports.mainWindow = null;
dotenv.config();
var accessToken;
electron_1.app.on('ready', function () {
    var myApiOauth = electronOauth2({
        clientId: 'fmkkosg3lceokpmzkgv8g8sm76nmy2h',
        clientSecret: 'ec8iawsje6p35u8g3iyl3rbbygc89p',
        authorizationUrl: 'https://api.twitch.tv/kraken/oauth2/authorize',
        tokenUrl: 'https://api.twitch.tv/kraken/oauth2/token',
        useBasicAuthorizationHeader: false,
        redirectUri: 'http://localhost/'
    }, {
        alwaysOnTop: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            devTools: false
        }
    });
    myApiOauth.getAccessToken({
        scope: [
            'user_read',
            'user_blocks_edit',
            'user_blocks_read',
            'user_blocks_edit',
            'user_subscriptions',
            'channel_read',
            'channel_editor',
            'channel_commercial',
            'channel_subscriptions',
            'channel_check_subscription',
            'channel_feed_edit',
            'channel_feed_read',
            'collections_edit',
            'communities_edit',
            'communities_moderate',
            'chat_login',
            'viewing_activity_read'
        ].join(' ')
    })
        .then(function (token) {
        myApiOauth.refreshToken(token.refresh_token)
            .then(function (newToken) {
            // use your new token
            accessToken = JSON.stringify(newToken);
            exports.mainWindow.loadURL(process.env.HOST + '/token/' + accessToken);
            exports.mainWindow.once('ready-to-show', function () {
                exports.mainWindow.show();
            });
        })["catch"](function (e) {
            process.stderr.write(e.message + '\n');
            electron_1.app.quit();
        });
    })["catch"](function (e) {
        process.stderr.write(e.message + '\n');
        electron_1.app.quit();
    });
    exports.mainWindow = new electron_1.BrowserWindow({ frame: false, width: 1200, height: 800, show: false });
    exports.mainWindow.setMenu(null);
    // if (process.env.PACKAGE.toLowerCase() === 'true') {
    //     mainWindow.loadURL(url.format({
    //         pathname: path.join(__dirname, 'dist/index.html'),
    //         protocol: 'file:',
    //         slashes: true
    //     }));
    // } else {
    //     mainWindow.loadURL(process.env.HOST);
    //     mainWindow.webContents.openDevTools();
    // }
    exports.mainWindow.webContents.openDevTools();
    exports.mainWindow.on('closed', function () {
        exports.mainWindow = null;
    });
});
electron_1.app.on('activate', function () {
    if (exports.mainWindow === null) {
        // Re-create the window
        // electron.createWindow();
        electron_1.app.quit(); // todo: fixme
    }
    exports.mainWindow.show();
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});

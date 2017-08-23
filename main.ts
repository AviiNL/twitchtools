import {app, BrowserWindow} from 'electron';
import * as dotenv from 'dotenv';
import * as electronOauth2 from 'electron-oauth2';

export let mainWindow: Electron.BrowserWindow = null;

dotenv.config();

let accessToken: string;

app.on('ready', () => {

    const myApiOauth = electronOauth2({
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
            devTools: false,
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
        .then(token => {
            myApiOauth.refreshToken(token.refresh_token)
                .then(newToken => {
                    // use your new token
                    accessToken = JSON.stringify(newToken);

                    mainWindow.loadURL(process.env.HOST + '/token/' + accessToken);
                    mainWindow.once('ready-to-show', () => {
                        mainWindow.show();
                    });

                }).catch(e => {
                    process.stderr.write(e.message + '\n');
                    app.quit();
                }
            );

        })
        .catch(e => {
            process.stderr.write(e.message + '\n');
            app.quit();
        });


    mainWindow = new BrowserWindow({frame: false, width: 1200, height: 800, show: false});
    mainWindow.setMenu(null);

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

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });


});

app.on('activate', () => {
    if (mainWindow === null) {
        // Re-create the window
        // electron.createWindow();
        app.quit(); // todo: fixme
    }

    mainWindow.show();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

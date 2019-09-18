import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Amplify from "aws-amplify";
import { Auth } from 'aws-amplify';
import App from "./App";
// import config from './aws-exports';
// Use our custom config file instead
import config from './config';
import * as serviceWorker from './serviceWorker';
import './index.css';



Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: "notes",
                endpoint: config.apiGateway.URL,
                region: config.apiGateway.REGION,
                custom_header: async () => {
                    return {
                        Authorization: (await Auth.currentSession()).idToken.jwtToken,
                        "x-api-key": config.apiGateway.API_KEY,
                    }
                }
            },
        ]
    },
    Storage: {
        AWSS3: {
            bucket: config.s3.BUCKET,
            region: config.s3.REGION
        }
    }
});

ReactDOM.render(
    <Router>
        <App/>
    </Router>,
    document.getElementById("root")
);

serviceWorker.unregister();
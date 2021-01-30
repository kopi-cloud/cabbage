import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {App} from "App";
import {Config} from "Config";

import * as Sentry from "@sentry/browser";
import {SentrySupabaseTransport} from "Util/SentrySupabaseTransport";

/** Note that development builds will send render errors twice, see
 * {@link ReactErrorBoundary#componentDidCatch} */
Sentry.init({
  /* Sentry won't work if you don't give something that looks valid */
  dsn: Config.sentryDsn ?? "https://1@example.com/1",
  transport: Config.sentryDsn ? undefined : SentrySupabaseTransport,
  environment: Config.environmentName,
  release: "cabbage@" + Config.gitCommit,
  autoSessionTracking: false,
});

ReactDOM.render(<App />, document.getElementById('root'));

/* If you want your app to work offline and load faster, you can change
 unregister() to register() below. Note this comes with some pitfalls.
 Learn more about service workers: https://bit.ly/CRA-PWA */
serviceWorker.unregister();

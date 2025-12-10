
import React from 'react';
import {createRoot} from "react-dom/client";
import App from "./components/App";
import axios from "axios";
import config from "./config";
import './styles.css'

import moment from "moment";
import 'moment/locale/da';

moment.locale('da');

axios.defaults.baseURL = config.config.pathToApi;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.maxRedirects = 0;
axios.defaults.withCredentials = true;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App config={config}/>);
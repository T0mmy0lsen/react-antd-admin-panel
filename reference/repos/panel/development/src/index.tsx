
import config from "./config";
import React from 'react';
import {createRoot} from "react-dom/client";
import {default as App} from "./components/App";

import 'styles.css'

import axios from 'axios';

axios.defaults.baseURL = config.config.pathToApi;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.maxRedirects = 0;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App config={config}/>);

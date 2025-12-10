
import React from 'react';
import {createRoot} from "react-dom/client";
import {App} from "react-antd-admin-panel";
import axios from "axios";
import config from "./config";
import './styles.css'

axios.defaults.baseURL = config.config.pathToApi;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.maxRedirects = 0;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App config={config}/>);

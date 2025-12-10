import {Main, Button, Action, Typography, Route, Section} from "./typescript/index";
import {message} from "antd";
import {Formula, Get, Post, Sider, Space, Title} from "./typescript";
import Process from "./views/Process";
import {faHome} from "@fortawesome/free-solid-svg-icons/faHome";
import { currentEnvironment, environmentConfig, isProd } from "./auth";

// Use centralized environment configuration
const API_ENDPOINTS = {
    LOCAL: 'http://localhost:5251/api/v1/', // Changed to use DEV API endpoint
    DEV: 'https://sduexpense-api.dev.sdu.dk/api/v1/',
    PROD: 'https://sduexpense-api.ext.sdu.dk/api/v1/'
} as const;

const pathForAPI = API_ENDPOINTS[currentEnvironment];

// Console log for debugging
console.log(`🔧 API Environment: ${currentEnvironment}`);
console.log(`🔗 API URL: ${pathForAPI}`);

document.title = 'Rejseafregning';
export default {
    config: {
        debug: !isProd ? 1 : 0,
        drawer: { collapsed: true },
        pathToApi: pathForAPI,
        // pathToLogo: { src: '/logo192.png', height: 30, width: 30 },
        fallbackApi: pathForAPI,
        fallbackApiOn: [404],
        hideHeader: true,
        defaultRoute: () => '/',
        profile: (next: any, _: any, main: Main) => {
            next(new Section());
        },
        access: {
            accessViolationRoute: (main: Main) => {
                main.$route(`/error`)
            },
            accessViolationApi: (main: Main) => {
                main.tsxErrorMessage('Du har ikke adgang til denne funktionalitet');
            },
            access: (v) =>
            {
                if (typeof v === 'function') return v();
                return ({ hidden: false, access: true });
            },
        },
        bootFailed: () => {
            message.error('Der er sket en fejl under opstart. Prøv at genindlæse siden.');
            // window.location.href = '/';
        },
        boot: (main: Main, next: any) => {
            let get = new Get()
                .target('RejseAfregning')
                .header({
                    'Authorization': 'Bearer ' + main.$account.accessToken,
                })
                .onThen((data: any) => {
                    next();
                })
                .onCatch(() => {
                    new Post().target('RejseAfregning').header({
                        'Authorization': 'Bearer ' + main.$account.accessToken,
                    })
                });

            get.get()
        }
    },
    routes: [
        new Route().key('/')
            .component(Process),
    ],
    drawer: (next: any) => {
        next();
    },
}

import {Main, Button, Action, Typography, Route, Sider, Section, Get} from 'react-antd-admin-panel';
import {faClock, faTable} from "@fortawesome/free-solid-svg-icons";

import Empty from "./views/Empty";
import Error from "./views/Error";
import Jobopslag from "./views/Jobopslag";
import Ansoegninger from "./views/Ansoegninger";

let isProd = process.env.NODE_ENV === 'production';

export default {
    config: {
        debug: isProd ? 0 : 1,
        drawer: { collapsed: false },
        pathToApi: 'https://62f217cd25d9e8a2e7d6a612.mockapi.io',
        pathToLogo: { src: '/logo192.png', height: 30, width: 30 },
        fallbackApi: 'http://localhost',
        fallbackApiOn: [404],
        defaultRoute: () => '/',
        profile: (next: any) => {
            next(new Section()
                .addRowEnd([
                    new Typography()
                        .style({ marginTop: 1 })
                        .label(`John Doe`)
                ])
            );
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
            window.location.href = '/';
        },
        boot: (main: Main, next: any) => {
            next()
        }
    },
    routes: [
        new Route().key('/')
            .exact()
            .component(Empty),
        new Route().key('/error')
            .exact()
            .component(Error),
        new Route().key('/jobopslag')
            .component(Jobopslag)
            .get(new Get().target('/jobopslag')),
        new Route().key('/ansoegning')
            .component(Ansoegninger)
            .get(new Get().target('/ansoegning')),
    ],
    drawer: (next: any) => {
        next(new Section().add(new Sider().key(1)
            .add(new Button().access(true)
                .action(new Action().route(() => '/').label('Home').fontawesome(faClock)))
            .add(new Button().access(true)
                .action(new Action().route(() => '/jobopslag').label('Jobopslag').fontawesome(faTable)))
        ));
    },
}
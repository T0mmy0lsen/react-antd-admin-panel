import {Action, Button, Default, Get, Input, Main, Route, Section, Sider, Typography} from './typescript/index';
import {Formula, Post, Space} from "./typescript/index";

import Users from './views/Admin/Users';
import Areas from "./views/Admin/Areas";
import ValueSets from './views/Admin/ValueSets';
import FormularCreatorPreview from "./views/Moderator/FormularCreatorPreview";
import Formulars from './views/Readers/Formulars';
import Formular from "./views/Readers/Formular";
import FormularCreator from "./views/Moderator/FormularCreator";
import Dataset from './views/Dataist/Dataset';
import Datasets from './views/Dataist/Datasets';
import FormularCreators from "./views/Moderator/FormularCreators";
import LoginHeader from './addons/elements/LoginHeader';
import {message} from "antd";
import Tokens from './views/Admin/Tokens';
import {faFile, faFolder, faUser} from "@fortawesome/free-regular-svg-icons";
import {
    faFileEdit,
    faHome,
    faKey,
    faLayerGroup,
    faList,
    faMagnifyingGlassChart,
    faSitemap
} from "@fortawesome/free-solid-svg-icons";
import {faAppStore} from "@fortawesome/free-brands-svg-icons";

let isProd = process.env.NODE_ENV === 'production';

export default {
    config: {
        debug: isProd ? 0 : 1,
        drawer: { collapsed: false },
        pathToApi: isProd ? '' : 'http://localhost:8000/',
        pathToLogo: {
            text: 'DIN DATA PARTNER',
            textLogo: true,
            style: { marginLeft: 12, marginBottom: 4, fontSize: 16, fontWeight: 700, zIndex: 10000, color: '#75abf1', opacity: 1 },
        },
        fallbackApi: '',
        fallbackApiOn: [404],
        hideHeader: false,
        defaultRoute: () => '/',
        profile: (next: any, callback: any, main: Main) => {},
        access: {
            accessViolationRoute: (main: Main) => {
                // main.$route(`/error`)
            },
            accessViolationApi: (main: Main) => {
                main.tsxErrorMessage('Du har ikke adgang til denne funktionalitet');
            },
            access: (v) =>
            {
                if (typeof v === 'function') return v();
                return ({ hidden: false, access: v });
            },
        },
        bootFailed: () => {
            window.location.href = '/';
        },
        boot: (main: Main, next: any) => {

            let loginButton = new Button()

            let loginModal = () => {

                loginButton.tsxSetLoading(false);

                let section = new Section()

                let formula = new Formula(new Post()
                    .main(main)
                    .target(() => ({
                        target: '/login',
                    }))
                    .onThen(() => {
                        main.$modalLoading(false);
                        main.$modalClose();
                        loginCheck.get();
                    })
                    .onCatch(() => {
                        main.$modalLoading(false);
                        main.$modalClose();
                        loginCheck.get();
                    })
                )

                section.formula(formula)
                section.add(new Section().component(LoginHeader))
                section.add(new Input()
                    .key('email')
                    .label('Email')
                )
                section.add(new Input()
                    .key('password')
                    .label('Password')
                )
                section.addRowEnd([
                    new Button()
                        .disabled(true)
                        .link()
                        .action(new Action().label('Nulstil min kode').callback(() => {

                        new Post().target(() => ({
                            target: 'register',
                            params: {
                                "name": "Tommy Olsen",
                                "email": "tommy@live.dk",
                                "password": "password",
                                "password_confirmation": "password"
                            }
                        }))
                        .submit()

                        message.success("Vi har send dig en mail!")
                    }))
                ])
                section.add(new Space().top(12))
                section.add(loginButton
                    .primary()
                    .style({ width: '100%' })
                    .action(new Action()
                        .label('Login')
                        .callback(() => {
                            loginButton.tsxSetLoading(true);
                            formula.submit();
                        })
                    )
                )
                section.init()

                return ({
                    title: '',
                    label: '',
                    visible: true,
                    section: section,
                    mask: false,
                    maskClosable: false,
                    className: 'removeShadowBox',
                    closable: false,
                    footer: null,
                    handleCancel: () => main.$modalClose(),
                    handleOk: () => {
                        main.$modalLoading(true);
                        formula.submit();
                    }
                })
            }

            let csrf = new Get()
                .target(() => '/sanctum/csrf-cookie')
                .onThen((e) => {
                    loginCheck.get()
                })
                .onCatch(() => {
                    console.log('Sanctum CSRF Cookie failure.')
                })

            let loginCheck = new Get().target('/api/check')
                .onThen(e => {
                    if (!e.data) {
                        main.$modal(loginModal())
                    } else {
                        new Get()
                            .target('/api/user')
                            .onThen((r) => {
                                main.$user(r.data);
                                next();
                            })
                            .get()
                    }
                })
                .onCatch(e => {
                    console.log(e)
                })

            let loginOrCreate= new Post().target(() => ({
                    target: '/login',
                    params: { email: 'tommy@live.dk', password: 'password' }
                }))
                .onThen(e => {
                    next()
                })
                .onCatch(e => {
                    let register = new Post()
                        .target(() => ({
                            target: '/register',
                            params: {
                                name: 'Tommy Olsen',
                                email: 'tommy@live.dk',
                                password: 'password',
                                password_confirmation: 'password',
                            },
                        }))
                        .onThen(() => {
                            window.location.href = '/';
                        })
                        .onCatch((e) => {
                            console.log(e)
                        })
                    register.submit()
                })

            csrf.get()
        }
    },
    routes: [
        new Route().key('/')
            .exact()
            .component(Formulars),
        new Route().key('/formular')
            .exact()
            .component(Formular),
        new Route().key('/formularDataset')
            .exact()
            .component(Dataset),
        new Route().key('/formularDatasets')
            .exact()
            .component(Datasets),
        new Route().key('/formularCreators')
            .exact()
            .component(FormularCreators),
        new Route().key('/formularCreator')
            .exact()
            .component(FormularCreator),
        new Route().key('/formularCreatorPreview')
            .exact()
            .component(FormularCreatorPreview),
        /* ADMIN ROUTES */
        new Route().key('/adminUsers')
            .exact()
            .component(Users),
        new Route().key('/adminAreas')
            .exact()
            .component(Areas),
        new Route().key('/adminLists')
            .exact()
            .component(ValueSets),
        new Route().key('/adminTokens')
            .exact()
            .component(Tokens),
        /* ERROR ROUTE */
        new Route().key('/error')
            .exact()
            .component(Error),
    ],
    drawer: (next: any) => {

        let section = new Section()
            .immediate(() => new Get()
                .target('/api/check')
                .onThen((r: any) => {

                    section.add(new Sider()

                        .style({ marginTop: 60 })

                        .add(new Button().access(true).fontawesome(faHome).style({ fontSize: 24 })
                            .action(new Action().route(() => `/`).label('Hjem')))

                        .add(new Button().access(false).fontawesome(faFolder).style({ fontSize: 24 })
                            .action(new Action().route(() => `/formularOverview`).label('Mit indhold')))

                        .add(new Button().access(true).fontawesome(faMagnifyingGlassChart).style({ fontSize: 24 })
                            .action(new Action().route(() => `/formularDatasets`).label('Analyse')))
                        .add(new Button().access(true).fontawesome(faFileEdit).style({ fontSize: 24 })
                            .action(new Action().route(() => '/formularCreators').label('Rediger')))

                        // Administration
                        .add(new Button().access(true).fontawesome(faUser).style({ fontSize: 24 })
                            .action(new Action().route(() => '/adminUsers').label('Brugere')))
                        .add(new Button().access(true).fontawesome(faSitemap).style({ fontSize: 24 })
                            .action(new Action().route(() => '/adminAreas').label('Områder')))
                        .add(new Button().access(true).fontawesome(faList).style({ fontSize: 24 })
                            .action(new Action().route(() => '/adminLists').label('Lister')))
                        .add(new Button().access(true).fontawesome(faKey).style({ fontSize: 24 })
                            .action(new Action().route(() => '/adminTokens').label('Nøgler')))
                    )

                    // Return the Section to the caller.
                    next(section);
                }))
    },
}
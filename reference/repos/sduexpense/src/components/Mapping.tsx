import React from "react";
import {matchPath} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import Path from "../typescript/models/Path";
import {message} from "antd";

const Mapping = (props: any) => {

    const doNavigate = useNavigate();

    function buildPath(actualPath: string) {

        let url = new URL(`http://localhost${actualPath}`)
        let route: any = null;
        let match: any = null;
        let routes = Object.keys(props.main.$config.routes).map((key: string) => {
            let route = props.main.$config.routes[key];
            return { exact: route._exact ?? false, path: route._path._matchedPath, route: route }
        });

        routes.forEach(r => {
            let path = r.path;
            if (matchPath({ ...r, path }, url.pathname)) {
                route = r.route;
                match = matchPath({ ...r, path }, url.pathname)
            }
        });

        let obj = {
            route: route,
            search: url.search,
            params: match?.params,
            actualPath: url.pathname,
            matchedPath: match?.pathnameBase,
        };

        return new Path(obj);
    }

    function navigate(to: string) {
        props.main._setSiderRightClose();
        doNavigate(to);
    }

    props.main.$map.$navigate = navigate;
    props.main.$map.$loading = props.state.toggleLoading;
    props.main.$map.$path = buildPath;

    props.main.tsxErrorMessage = (m: any) => message.error(m);
    props.main.tsxSuccessMessage = (m: any) => message.success(m);

    return (
        <div style={{ display: 'none' }}>Mapping</div>
    )
}

export default Mapping;
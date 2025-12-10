import React from "react";

export default class Empty extends React.Component<any, any> {

    render() {
        return <div/>;
    }

    componentDidMount() {
        this.props.main.$route(`/`);
    }
}
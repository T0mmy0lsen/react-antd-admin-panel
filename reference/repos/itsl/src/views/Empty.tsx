import React from "react";

export default class Empty extends React.Component<any, any> {

    render() {
        return <div/>;
    }

    componentDidMount() {
        let faculty = this.props.main.User.faculties[0]?.name.toLowerCase();
        faculty = faculty ? faculty : 'Unauthorized'
        this.props.main.$route(`/scheduled/${faculty}`);
    }
}
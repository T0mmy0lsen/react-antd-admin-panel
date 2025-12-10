import React from "react";

import { Main } from "react-antd-admin-panel";
import {
  Typography,
  Section,
  Cycle,
  Title,
  Space,
  List,
  Get,
  ListHeader,
  Action,
  ListItem,
  Post,
} from "react-antd-admin-panel";

import { WarningOutlined } from "@ant-design/icons/lib";
import { SectionComponent } from "react-antd-admin-panel";
import { message } from "antd";
import helpers from "../helpers";

export default class Scheduled extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      section: false,
      faculty: false,
    };
  }

  build() {
    const main: Main = this.props.main;
    const faculty: string = main.$params("faculty");
    const cycle: Cycle = main.$cycle(`/scheduled/${faculty}`);
    const get: Get = main.$get(cycle, `/api/courses/scheduled`);

    const formatDate = (v: string) => {
      if (!v) return v;
      return `${v.substr(0, 10)}`;
    };

    const section = new Section();
    const courses = new List()
      .get(() => get)
      .style({ paddingTop: 16 })
      .emptyColumn(true)
      .emptyIcon(WarningOutlined)
      .emptyText("Listen er tom")
      .bordered()
      .appends({
        key: "type",
        value: (record: any) =>
          record.createType === "Course" ? "Kursus" : "Gruppe",
      })
      .appends({ key: "createStads", value: () => "2021-12-31T23:59:59" })
      .headerCreate(false)
      .headerPrepend(
        new ListHeader().key("courseId").title("Kursus ID").searchable()
      )
      .headerPrepend(
        new ListHeader().key("title").title("Navn").searchable().editable()
      )
      .headerPrepend(new ListHeader().key("term").title("Periode").filterable())
      .headerPrepend(new ListHeader().key("type").title("Type").filterable())
      .headerPrepend(
        new ListHeader()
          .key("createFrom")
          .type("date")
          .title("Oprettelses dato")
          .editable()
          .sortable()
          .render((v) => <span>{formatDate(v)}</span>)
      )
      .headerPrepend(
        new ListHeader()
          .key("createStads")
          .type("date")
          .title("Enrollment dato")
          .editable()
          .render((v) => <i style={{ opacity: 0.3 }}>Ukendt</i>)
      )
      .emptyColumn(true)
      .emptyIcon(WarningOutlined)
      .emptyText("Listen er tom")
      .actions(
        new Action().key("edit").access({ feature: "Override", level: 3 })
      )
      .onRecordWasSaved((item: ListItem) => {
        if (item["title"] && item["title"] !== item._object.title) {
          new Post()
            .target(() => ({
              target: `/api/courses/renames`,
              params: { courseId: item["courseId"], name: item["title"] },
            }))
            .header({
              Faculty: helpers.facultyEnums(main.$params("faculty"), main),
            })
            .onThen(() => message.success("Ændringen er blevet registeret."))
            .onCatch(() => message.error("Ændringen blev ikke registeret."))
            .submit();
        }
        if (
          item["createFrom"] &&
          item["createFrom"].substr(0, 10) !==
            item._object.createFrom.substr(0, 10)
        ) {
          new Post()
            .target(() => ({
              target: `/api/courses/override/scheduled-date`,
              params: {
                CourseId: item["courseId"],
                NewDate: `${item["createFrom"]}T00:00:00.000Z`,
              },
            }))
            .header({
              Faculty: helpers.facultyEnums(main.$params("faculty"), main),
              "Content-Type": "application/json",
            })
            .onThen(() => message.success("Ændringen er blevet registeret."))
            .onCatch(() => message.error("Ændringen blev ikke registeret."))
            .submit();
        }
        if (
          item["createStads"] &&
          item["createStads"].substr(0, 10) !==
            item._object.createStads.substr(0, 10)
        ) {
          new Post()
            .target(() => ({
              target: `/api/courses/override/enroll-date`,
              params: {
                courseId: item["courseId"],
                newDate: `${item["createStads"]}T00:00:00.000Z`,
                term: item["courseId"].substr(-3),
              },
            }))
            .header({
              Faculty: helpers.facultyEnums(main.$params("faculty"), main),
              "Content-Type": "application/json",
            })
            .onThen(() => message.success("Ændringen er blevet registeret."))
            .onCatch(() => message.error("Ændringen blev ikke registeret."))
            .submit();
        }
      });

    section.style({ padding: "24px 36px" });
    section.add(new Title().label("Planlagt").level(1));
    section.add(
      new Typography().label(
        "Listen indeholder de fag som er planlagt til overførsel til ITSLearning"
      )
    );
    section.add(new Space().top(12));
    section.add(courses);

    this.setState({ section: section, faculty: faculty });
  }

  render() {
    return (
      <>
        {!!this.state.section && (
          <SectionComponent
            key={this.state.faculty}
            main={this.props.main}
            section={this.state.section}
          />
        )}
      </>
    );
  }

  componentDidMount() {
    this.build();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return this.state.faculty !== this.props.main.$params("faculty");
  }

  componentDidUpdate(prevProps, prevState, snapshot?) {
    if (snapshot) this.build();
  }
}

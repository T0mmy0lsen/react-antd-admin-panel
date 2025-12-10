import React from "react";
import {
  Autocomplete,
  Typography,
  ListHeader,
  Formula,
  Section,
  Action,
  Button,
  Cycle,
  Title,
  Space,
  Post,
  List,
  Main,
  Item,
  Get,
} from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";

import { PlusOutlined, WarningOutlined } from "@ant-design/icons/lib";
import { message } from "antd";
import helpers from "../helpers";

export default class UnbundledOverview extends React.Component<any, any> {
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
    const cycle: Cycle = main.$cycle(`/unbundled/overview/${faculty}`);
    const get: Get = main.$get(cycle, `/api/unbundled`);
    const explain: string = "Her kan se de fag som er opsplittet.";

    const section = new Section();
    const unbundle = new List()
      .get(() => get)
      .emptyColumn(true)
      .emptyIcon(WarningOutlined)
      .emptyText("Listen er tom")
      .bordered()
      .headerCreate(false)
      .headerPrepend(
        new ListHeader().key("courseId").title("Kursus ID").searchable()
      )
      .headerPrepend(
        new ListHeader().key("title").title("Kursus titel").searchable()
      )
      .headerPrepend(
        new ListHeader().key("termname").title("Periode").filterable()
      )
      .headerPrepend(
        new ListHeader().key("createdBy").title("Oprettet af").filterable()
      )
      .actions(
        new Action()
          .key("deleteConfirm")
          .access({ feature: "Unbundled", level: 7 })
          .formula(
            new Formula(
              new Post()
                .target((args) => ({
                  method: "DELETE",
                  target: `/api/unbundled/${args.record.courseId}`,
                }))
                .header({
                  "Content-Type": "application/json",
                  Faculty: helpers.facultyEnums(faculty, main),
                })
                .onThen(() => unbundle.refresh(cycle))
            )
          )
      );

    section.style({ padding: "24px 36px" });
    section.add(new Title().label("Opsplittede Kurser").level(1));
    section.add(new Typography().label(explain));
    section.add(unbundle);
    section.init();

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

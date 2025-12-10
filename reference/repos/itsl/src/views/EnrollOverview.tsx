import React from "react";

import { Main } from "react-antd-admin-panel";
import {
  Typography,
  Formula,
  Section,
  Action,
  Cycle,
  Space,
  Title,
  List,
  Post,
  Get,
  ListHeader,
  ListItem,
  Button,
  Autocomplete,
  Item,
} from "react-antd-admin-panel";
import { SectionComponent } from "react-antd-admin-panel";
import helpers from "../helpers";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons/lib";
import { message } from "antd";

export default class EnrollOverview extends React.Component<any, any> {
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
    const cycle: Cycle = main.$cycle(`/enrollment/overview/${faculty}`);
    const get: Get = main.$get(cycle, `/api/enrollment`);

    const explain: string =
      "Listen indeholder STADS-koblingen mellem kurser og STADS-grupper";

    const section = new Section();
    const merged = new List();

    merged
      .get(() => get)
      .unique((r: any) => r.courseId)
      .emptyIcon(WarningOutlined)
      .emptyText("Listen er tom")
      .bordered()
      .appends({
        key: "stads",
        value: (v: any) => {
          let stadsGroups = v.stadsGroups ?? [];
          return stadsGroups.join(", ");
        },
      })
      .headerCreate(false)
      .headerPrepend(
        new ListHeader().key("courseId").title("Kursus ID").searchable()
      )
      .headerPrepend(
        new ListHeader().key("title").title("Kursus titel").searchable()
      )
      .headerPrepend(
        new ListHeader()
          .key("stads")
          .width("140px")
          .title("STADS-grupper")
          .searchable()
          .render((v: any) => (
            <div className="ellipsis" style={{ opacity: 0.3, width: 140 }}>
              <i>{v}</i>
            </div>
          ))
      )
      .headerPrepend(new ListHeader().key("term").title("Periode").filterable())
      .expandable((v: ListItem) => v._object.stadsGroups.length)
      .expandableSection((item: ListItem) => {
        let button = new Button();
        let section = new Section();
        let autocomplete = new Autocomplete();

        section.add(
          new List()
            .unique((r: any) => r)
            .default({
              dataSource: item._object.stadsGroups.map((r) => ({ kode: r })),
            })
            .footer(false)
            .header(false)
            .headerCreate(false)
            .headerPrepend(new ListHeader().key("kode").title("Kode"))
            .emptyText("")
            .emptyIcon(WarningOutlined)
            .emptyColumn(true)
            .actions(
              new Action()
                .key("deleteConfirm")
                .access({ feature: "Enrollment", level: 7 })
                .formula(
                  new Formula(
                    new Post()
                      .header({ Faculty: helpers.facultyEnums(faculty, main) })
                      .target((args) => ({
                        method: "delete",
                        target: `/api/enrollment/${item._object.courseId}/groups/${args.record.kode}`,
                      }))
                      .onThen(() => {
                        message.success("Rækken blev slettet.");
                        merged.refresh(cycle, () => {
                          merged.tsxSetExpandable(item);
                        });
                      })
                      .onCatch(() => {
                        message.error("Rækken blev ikke slettet.");
                      })
                  )
                )
            )
        );

        section.add(new Space().top(24));
        section.addRowEnd([
          autocomplete
            .key("courseId")
            .access({ feature: "Enroll", level: 8 })
            .label("Find STADS-gruppe")
            .styleForm({ marginBottom: 0, marginRight: 8 })
            .sizeString("middle")
            .ignoreOnChange(true)
            .label("Find STADS-gruppe")
            .get(() =>
              new Get()
                .header({ Faculty: helpers.facultyEnums(faculty, main) })
                .target((args) => ({
                  target: `/api/stap/groups/search`,
                  params: { q: args },
                }))
                .alter((v: any) =>
                  v.map((r: any) =>
                    new Item(r.studGruppeId)
                      .id(r.studGruppeId)
                      .title(r.kode)
                      .text(r.studGruppeId)
                      .object(r)
                  )
                )
            ),
          button.access({ feature: "Enroll", level: 8 }).action(
            new Action()
              .callback(() =>
                new Post()
                  .header({ Faculty: helpers.facultyEnums(faculty, main) })
                  .target(() => {
                    return {
                      target: `/api/enrollment/${item._object.courseId}/groups`,
                      params: {
                        studGruppeId: autocomplete._defaultObject.object.id,
                      },
                    };
                  })
                  .onThen(() => {
                    message.success("Rækken blev tilføjet.");
                    merged.refresh(cycle, () => {
                      merged.tsxSetExpandable(item);
                    });
                  })
                  .onCatch(() => {
                    message.error("Rækken blev ikke slettet.");
                  })
                  .submit()
              )
              .hideClear()
              .label("Tilføj til koblingen")
              .icon(PlusOutlined)
          ),
        ]);

        return section;
      });

    section.style({ padding: "24px 36px" });
    section.add(new Title().label("STADS-koblingen").level(1));
    section.add(new Typography().label(explain));
    section.add(new Space().top(12));
    section.add(merged);

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

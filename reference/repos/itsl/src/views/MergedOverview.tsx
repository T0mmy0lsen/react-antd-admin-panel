import React from "react";

import { Main } from "react-antd-admin-panel";
import {
  Typography,
  Formula,
  Section,
  Action,
  Cycle,
  Title,
  Space,
  List,
  Post,
  Get,
  ListHeader,
  ListItem,
  Button,
  Autocomplete,
  Item,
} from "react-antd-admin-panel";

import { PlusOutlined, WarningOutlined } from "@ant-design/icons/lib";
import { SectionComponent } from "react-antd-admin-panel";
import { message, Tooltip } from "antd";
import helpers from "../helpers";

export default class MergedOverview extends React.Component<any, any> {
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
    const cycle: Cycle = main.$cycle(`/merged/overview/${faculty}`);
    const get: Get = main.$get(cycle, `/api/merge`);

    const explain: string = "Listen indeholder samle-kurser";

    const merged = new List();

    merged
      .get(() => get)
      .unique((r: any) => r.courseId)
      .emptyIcon(WarningOutlined)
      .emptyText("Listen er tom")
      .bordered()
      .appends({
        key: "scenario",
        value: (raw: any) =>
          raw.sources[0]?.mergeScenario.substr(-1) ?? "Ugyldig",
      })
      .appends({
        key: "fromCourse",
        value: (v: any) => {
          console.log({ v });
          let sources = v.sources ?? [];
          return sources.map((r: any) => r.courseId).join(", ");
        },
      })
      .headerCreate(false)
      .headerPrepend(
        new ListHeader().key("courseId").title("Til-fag").searchable()
      )
      .headerPrepend(
        new ListHeader().key("title").title("Til-fag titel").searchable()
      )
      .headerPrepend(
        new ListHeader()
          .key("fromCourse")
          .width("100px")
          .title("Fra-fag")
          .searchable()
          .render((v: any) => {
            return (
              <Tooltip placement="right" title={v}>
                <div
                  className="ellipsis"
                  style={{ opacity: 0.3, width: 100, cursor: "pointer" }}
                >
                  <i>{v}</i>
                </div>
              </Tooltip>
            );
          })
      )
      .headerPrepend(
        new ListHeader().key("termName").title("Periode").filterable()
      )
      .headerPrepend(
        new ListHeader().key("scenario").title("Scenarie").filterable()
      )
      .headerPrepend(
        new ListHeader().key("createdBy").title("Oprettet af").filterable()
      )
      .expandable((v: ListItem) => v._object.sources.length)
      .expandableSingles()
      .expandableSection((item: ListItem) => {
        let button = new Button();
        let section = new Section();
        let autocomplete = new Autocomplete();

        section.add(
          new List()
            .unique((r: any) => r.courseId)
            .default({ dataSource: item._object.sources })
            .footer(false)
            .header(false)
            .bordered()
            .headerCreate(false)
            .headerPrepend(new ListHeader().key("courseId"))
            .headerPrepend(new ListHeader().key("title"))
            .emptyText("")
            .emptyIcon(WarningOutlined)
            .actions(
              new Action()
                .key("deleteConfirm")
                .access({ feature: "Merged", level: 7 })
                .formula(
                  new Formula(
                    new Post()
                      .header({ Faculty: helpers.facultyEnums(faculty, main) })
                      .target((args) => ({
                        method: "delete",
                        target: `/api/merge/${item._object.mergeId}/secondaries/${args.record.courseMergeSourceId}`,
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
            .access({ feature: "Merged", level: 3 })
            .label("Find kursus")
            .styleForm({ marginBottom: 0, marginRight: 8 })
            .sizeString("middle")
            .get((value) =>
              new Get()
                .target(() => {
                  return {
                    target: `/api/courses/search`,
                    params: {
                      with: 9,
                      query: value,
                      page: 1,
                      take: 25,
                    },
                  };
                })
                .alter((v: any) =>
                  v
                    .map((r: any) =>
                      new Item(r.courseId)
                        .id(r.courseId)
                        .title(r.title)
                        .text(r.courseId)
                        .object(r)
                    )
                    .filter((r: any) => {
                      return !(
                        (r._object.source === "TRANSFERRED" ||
                          r._object.source === "SCHEDULED") &&
                        v.some(
                          (s: any) =>
                            s.courseId === r._object.courseId &&
                            (s.source === "MANUAL" || s.source === "EXCLUDED")
                        )
                      );
                    })
                )
            ),
          button.access({ feature: "Merged", level: 3 }).action(
            new Action()
              .callback(() =>
                new Post()
                  .header({ Faculty: helpers.facultyEnums(faculty, main) })
                  .target(() => {
                    return {
                      target: `/api/merge/${item._object.mergeId}/secondaries`,
                      params: {
                        courseId: autocomplete._defaultObject.object.id,
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
                    message.error("Rækken blev ikke tilføjet.");
                  })
                  .submit()
              )
              .hideClear()
              .label("Tilføj til scenarie")
              .icon(PlusOutlined)
          ),
        ]);

        return section;
      });

    const section = new Section();

    section.style({ padding: "24px 36px" });
    section.add(new Title().label("Samlekurser").level(1));
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

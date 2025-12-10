import React from "react";
import {
  Get,
  Item,
  Main,
  Steps,
  Title,
  Section,
  StepsItem,
  Typography,
  Conditions,
  Autocomplete,
  ConditionsItem,
  Alert,
  Formula,
  Post,
  List,
  ListHeader,
  Action,
  Radio,
  RadioItem,
  Button,
  Result,
  ListItem,
} from "react-antd-admin-panel";

import { SectionComponent } from "react-antd-admin-panel";
import { CloseOutlined, WarningOutlined } from "@ant-design/icons/lib";
import { message } from "antd";
import helpers from "../helpers";
import texts from "../texts";

export default class Merged extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      section: false,
      faculty: false,
    };
  }

  sectionAccept({ accept, steps, clear }: any) {
    let button = new Button()
      .middle()
      .primary()
      .action(
        new Action().label("Godkend").callback(() => {
          button._formula._post
            .onThen(() => {
              clear();
              steps.clear();
              message.success("Samlingen af fag er registreret");
            })
            .onCatch(() => {
              button.tsxSetLoading(false);
              message.error("Samlingen af fag kunne ikke registreres");
            });
          button._formula.submit();
        })
      );

    accept.section = new Section().add(
      new Result()
        .title("Godkend")
        .status("success")
        .subTitle("Når du trykker godkend vil samle-fagene blive gemt")
        .add(new Section().row().center().add(button))
    );
  }

  sectionScenario({ scenario, main, steps }: any) {
    scenario.section.add(
      scenario.radio
        .key("mergeScenario")
        .add(
          new Item("Scenario1").render(() => (
            <SectionComponent
              main={main}
              section={new Section()
                .style({ marginLeft: 36, marginTop: -29 })
                .add(
                  new Typography()
                    .style({ margin: 0 })
                    .label(texts.merged.s1.title)
                    .strong()
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s1.text[0])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s1.text[1])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s1.text[2])
                )}
            />
          ))
        )
        .add(
          new Item("Scenario2").render(() => (
            <SectionComponent
              main={main}
              section={new Section()
                .style({ marginLeft: 36, marginTop: -29 })
                .add(
                  new Typography()
                    .style({ margin: 0 })
                    .label(texts.merged.s2.title)
                    .strong()
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s2.text[0])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s2.text[1])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s2.text[2])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s2.text[3])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s2.text[4])
                )}
            />
          ))
        )
        .add(
          new Item("Scenario3").render(() => (
            <SectionComponent
              main={main}
              section={new Section()
                .style({ marginLeft: 36, marginTop: -29 })
                .add(
                  new Typography()
                    .style({ margin: 0 })
                    .label(texts.merged.s3.title)
                    .strong()
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s3.text[0])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s3.text[1])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s3.text[2])
                )}
            />
          ))
        )
        .add(
          new Item("Scenario4").render(() => (
            <SectionComponent
              main={main}
              section={new Section()
                .style({ marginLeft: 36, marginTop: -29 })
                .add(
                  new Typography()
                    .style({ margin: 0 })
                    .label(texts.merged.s4.title)
                    .strong()
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s4.text[0])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s4.text[1])
                )
                .add(
                  new Typography()
                    .style({ margin: "0 24px" })
                    .label(texts.merged.s4.text[2])
                )}
            />
          ))
        )
        .onChange((object: any) => {
          if (object?.value) steps.done(1, true);
        })
    );
  }

  sectionPrimary({ primary, faculty, steps, main }: any) {
    primary.section
      .add(new Typography().label("Vælg TIL-faget. Du kan kun vælge ét fag."))
      .add(
        primary.autocomplete
          .key("mainCourseId")
          .label("Find kursus")
          .get((value) =>
            new Get()
              .target(() => ({
                target: `/api/courses/search`,
                params: {
                  with: 7,
                  query: value,
                  page: 1,
                  take: 25,
                },
              }))
              .header({ Faculty: helpers.facultyEnums(faculty, main) })
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
          )
          .onChange((object: any) => {
            if (object.value) {
              steps.done(2, true);
              primary.condition.checkCondition(object);
              primary.autocomplete.tsxSetDisabled(true);
            }
          })
      )
      .add(
        primary.condition.add(
          new ConditionsItem()
            .condition((value: any) => !!value?.value)
            .content((next, callback, main, args) => {
              next(
                new Section().add(
                  new Alert()
                    .add(
                      new Item("course")
                        .title(args.object.title)
                        .text(args.object.id)
                        .description("Dette er det valgte TIL-fag")
                    )
                    .clearable(true)
                    .onChange((object: any) => {
                      if (!object) {
                        steps.done(2, false);
                        primary.condition.checkCondition(false);
                        primary.autocomplete.clearSelf();
                        primary.autocomplete.tsxSetDisabled(false);
                      }
                    })
                )
              );
            })
        )
      );
  }

  sectionSecondary({ scenario, secondary, faculty, steps, main }: any) {
    secondary.section
      .add(new Typography().label("Vælg FRA-faget. Der kan vælges flere fag."))
      .add(
        secondary.autocomplete
          .ignoreOnChange(true)
          .label("Find kursus")
          .get((value) =>
            new Get()
              .target(() => {
                let excludeTransferred =
                  scenario.radio._defaultObject.value === "Scenario2";
                return {
                  target: `/api/courses/search`,
                  params: {
                    with: excludeTransferred ? 9 : 11,
                    query: value,
                    page: 1,
                    take: 25,
                  },
                };
              })
              .header({
                Faculty: helpers.facultyEnums(faculty, main),
                "Content-Type": "application/json",
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
                      //BØR FRAVÆLGE allerede valgte
                      (
                        (r._object.source === "TRANSFERRED" ||
                          r._object.source === "SCHEDULED") &&
                        v.some(
                          (s: any) =>
                            s.courseId === r._object.courseId &&
                            (s.source === "MANUAL" || s.source === "EXCLUDED")
                        )
                      )
                    );
                  })
              )
          )
          .onChange((object: any) => {
            if (object?.object) {
              secondary.list.setRecord(object.object.object);
              steps.done(3, true);
            }
          })
      )
      .add(secondary.list);
  }

  build() {
    const main: Main = this.props.main;
    const faculty: string = main.$params("faculty");

    const page = {
      clear: () => {
        page.scenario.radio.clearSelf();
        page.primary.autocomplete.clearSelf();
        page.secondary.autocomplete.clearSelf();
        page.secondary.list.clearSelf();
      },
      main: main,
      steps: new Steps(),
      section: new Section(),
      faculty: faculty,
      accept: {
        section: new Section(),
      },
      scenario: {
        radio: new Radio(),
        section: new Section(),
      },
      primary: {
        section: new Section(),
        condition: new Conditions(),
        autocomplete: new Autocomplete(),
      },
      secondary: {
        section: new Section(),
        autocomplete: new Autocomplete(),
        list: new List()
          .key("secondaryCourseIds")
          .format((v: any) => v.map((r: ListItem) => r._object.courseId))
          .footer(false)
          .actions(
            new Action().icon(CloseOutlined).callback(({ record }: any) => {
              if (page.secondary.list.getRecords().length === 1)
                page.steps.done(3, false);
              page.secondary.list.removeRecord(record);
            })
          )
          .addDummyColumn(true)
          .headerCreate(false)
          .emptyIcon(WarningOutlined)
          .emptyText("Der er ikke valgt nogen fag")
          .headerPrepend(
            new ListHeader()
              .key("courseId")
              .title("ID")
              .render((v: any) => <span>{v}</span>)
          )
          .headerPrepend(
            new ListHeader()
              .key("title")
              .title("Navn")
              .render((v: any) => <span>{v}</span>)
          ),
      },
    };

    this.sectionPrimary(page);
    this.sectionSecondary(page);
    this.sectionScenario(page);
    this.sectionAccept(page);

    page.steps
      .add(
        new StepsItem()
          .done(false)
          .title("Scenarie")
          .content((next) => next(page.scenario.section))
      )
      .add(
        new StepsItem()
          .done(false)
          .title("TIL-faget")
          .content((next) => next(page.primary.section))
      )
      .add(
        new StepsItem()
          .done(false)
          .title("FRA-faget")
          .content((next) => next(page.secondary.section))
      )
      .add(
        new StepsItem()
          .done(false)
          .title("Godkend")
          .content((next) => next(page.accept.section))
      );

    page.section.style({ padding: "24px 36px" });
    page.section.formula(
      new Formula(
        new Post()
          .target("/api/merge")
          .header({ Faculty: helpers.facultyEnums(page.faculty, page.main) })
      )
    );
    page.section.add(
      new Title().label("Samlekurser").level(1).style({ paddingBottom: 16 })
    );
    page.section.add(page.steps);
    page.section.init();

    this.setState({ section: page.section, faculty: faculty });
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

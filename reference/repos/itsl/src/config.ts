import {
  UserOutlined,
  CrownOutlined,
  HeartOutlined,
} from "@ant-design/icons/lib";

import {
  faPlus,
  faLink,
  faTable,
  faTrashAlt,
  faUserPlus,
  faAmbulance,
  faUserShield,
  faChalkboard,
  faExchangeAlt,
  faHeartBroken,
  faObjectGroup,
  faUmbrellaBeach,
  faProjectDiagram,
  faClock,
  faHeading,
  faCalendarPlus,
  faCopy,
  faAddressCard,
  faRandom,
} from "@fortawesome/free-solid-svg-icons";

import {
  Action,
  Button,
  Cycle,
  Get,
  Item,
  Main,
  Route,
  Section,
  Select,
  Sider,
  Typography,
} from "react-antd-admin-panel";
import helpers from "./helpers";

import ExternalsOverview from "./views/ExternalsOverview";
import CreateOverview from "./views/CreateOverview";
import MergedOverview from "./views/MergedOverview";
import EnrollOverview from "./views/EnrollOverview";
import Transferred from "./views/Transferred";
import Externals from "./views/Externals";
import Scheduled from "./views/Scheduled";
import Hierarchy from "./views/Hierarchy";
import UnbundledOverview from "./views/UnbundledOverview";
import Unbundled from "./views/Unbundled";
import Excluded from "./views/Excluded";
import Create from "./views/Create";
import Merged from "./views/Merged";
import Enroll from "./views/Enroll";
import Empty from "./views/Empty";
import Error from "./views/Error";
import Users from "./views/Users";
import OverrideTitle from "./views/OverrideTitle";
import Support from "./views/Support";
import Sandbox from "./views/Sandbox";
import OverrideScheduled from "./views/OverrideScheduled";
import Profile from "./views/Profile";
import ProfileOverview from "./views/ProfileOverview";

let isProd = process.env.NODE_ENV === "production";

export default {
  config: {
    debug: isProd ? 0 : 1,
    drawer: { collapsed: false },
    pathToApi: isProd ? "" : "https://localhost:5001",
    debugLevel: isProd ? 0 : 0,
    pathToLogo: isProd ? "/logo.svg" : "/logo.svg",
    fallbackApi: isProd ? false : "http://localhost",
    fallbackApiOn: isProd ? [] : [404],
    defaultRoute: (main: Main) =>
      main.Controller._cycles["/"]
        ? `/scheduled/:faculty`
        : main.$path()?._matchedPath,
    profile: (next, callback, main) => {
      next(
        new Section().addRowEnd([
          new Button()
            .style({ margin: "16px 8px", opacity: 0.8 })
            .action(new Action().callback(() => {}))
            .loadable(false)
            .link()
            .icon(
              main.User.isAdmin
                ? HeartOutlined
                : main.User._object.faculties.find(
                    (r) => r.name.toLowerCase() === main.$params("faculty")
                  )?.isAdmin
                ? CrownOutlined
                : UserOutlined
            ),
          new Typography()
            .style({ marginTop: 1 })
            .label(
              `${main.User._object.firstName} ${main.User._object.lastName}`
            ),
        ])
      );
    },
    access: {
      accessViolationRoute: (main: Main, cycle: Cycle) => {
        main.$route(`/error/${cycle.params("faculty")}`);
      },
      accessViolationApi: (main: Main) => {
        main.tsxErrorMessage("Du har ikke adgang til denne funktionalitet");
      },
      access: (args: any, main: Main, cycle?: Cycle) => {
        if (args === true) return { hidden: false, access: true };
        if (args === false) return { hidden: false, access: false };

        let user = main.User._object;
        let param = cycle
          ? cycle.params("faculty")
          : main.$params("faculty")?.toLowerCase();
        let faculty = user?.faculties.find(
          (r) => r.name.toLowerCase() === param
        );
        let feature = faculty?.permissions.find(
          (r) => r.feature === args.feature
        );

        if (args.level && args.level === 9) {
          return main.$config.config.debug
            ? { hidden: false, access: true }
            : { hidden: true, access: false };
        }

        if (args.level && args.level === 8) {
          return user.isAdmin
            ? { hidden: false, access: true }
            : { hidden: false, access: false };
        }

        if (
          args === true ||
          args === undefined ||
          !param ||
          user.isAdmin ||
          faculty.isAdmin
        ) {
          // If the faculty-param is not set - then we ignore access level
          // Moreover, if admin you have full access
          return { hidden: false, access: true };
        }

        if (args === false || !user || !faculty) {
          // Either the user is not set or the user is not associated with the given faculty
          return { hidden: false, access: false };
        }

        return {
          hidden: false,
          access:
            feature &&
            feature.level &&
            args.level &&
            feature.level >= args.level,
        };
      },
    },
    bootFailed: (main: Main) => {
      window.location.href = "/";
    },
    boot: (main: Main, next) => {
      try {
        window.localStorage.clear();
      } catch (e) {}
      let gets = [
        new Get().target("/api/user").onThen((r) => {
          main.$user(r.data);
          completed--;
          if (!completed) next();
        }),
        new Get().target("/api/system/faculties").onThen((r) => {
          main.$store(r.data, "faculty");
          completed--;
          if (!completed) next();
        }),
        new Get().target("/api/system/features").onThen((r) => {
          main.$store(r.data, "features");
          completed--;
          if (!completed) next();
        }),
        new Get().target("/api/system/cities").onThen((r) => {
          main.$store(r.data, "cities");
          completed--;
          if (!completed) next();
        }),
        new Get()
          .target("/api/system/semesters?from=2&amount=4")
          .onThen((r) => {
            main.$store(r.data, "semester");
            completed--;
            if (!completed) next();
          }),
        new Get()
          .target("/api/system/instrole")
          .header({ Faculty: "NAT" })
          .onThen((r) => {
            main.$store(r.data, "instrole");
            completed--;
            if (!completed) next();
          }),
      ];
      let completed = gets.length;
      gets.forEach((r) => r.get());
    },
  },
  routes: [
    new Route().key("/").exact().component(Empty),
    new Route().key("/error/:faculty").exact().component(Error),
    new Route()
      .access({ feature: "Scheduled", level: 1 })
      .key("/scheduled/:faculty")
      .component(Scheduled)
      .get(
        new Get()
          .target((cycle: Cycle) => `/api/courses/scheduled`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
      ),
    new Route()
      .access({ feature: "Created", level: 1 })
      .key("/transferred/:faculty")
      .component(Transferred)
      .get(
        new Get()
          .target((cycle: Cycle) => `/api/courses/transferred`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
      ),
    new Route()
      .access({ feature: "Merged", level: 3 })
      .key("/merged/:faculty")
      .exact()
      .component(Merged),
    new Route()
      .access({ feature: "Merged", level: 1 })
      .key("/merged/overview/:faculty")
      .component(MergedOverview)
      .get(
        new Get()
          .target(() => `/api/merge`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
      ),
    new Route()
      .access({ feature: "Excluded", level: 1 })
      .key("/excluded/:faculty")
      .component(Excluded)
      .get(
        new Get()
          .target((cycle: Cycle) => `/api/excluded`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
          .alter((data) => data.reverse())
      ),
    new Route()
      .access({ feature: "Unbundled", level: 3 })
      .key("/unbundled/:faculty")
      .exact()
      .component(Unbundled),
    new Route()
      .access({ feature: "Unbundled", level: 1 })
      .key("/unbundled/overview/:faculty")
      .component(UnbundledOverview)
      .get(
        new Get()
          .target((cycle: Cycle) => `/api/unbundled`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
      ),
    new Route()
      .access({ feature: "Override", level: 1 })
      .key("/override/title/:faculty")
      .component(OverrideTitle)
      .get(
        new Get()
          .target(() => `/api/courses/renames`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
      ),
    new Route()
      .access({ feature: "Override", level: 1 })
      .key("/override/scheduled/:faculty")
      .component(OverrideScheduled)
      .get(
        new Get()
          .target(() => ({
            target: `/api/courses/override/scheduled-date`,
            params: {
              take: 10000,
              page: 1,
            },
          }))
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
          .alter((data: any) => data.data.filter((r: any) => !!r.courseId))
      ),
    new Route()
      .access({ feature: "Override", level: 1 })
      .key("/override/enrollment/:faculty")
      .component(OverrideScheduled)
      .get(
        new Get()
          .target(() => ({
            target: `/api/courses/override/enroll-date`,
            params: {
              take: 10000,
              page: 1,
            },
          }))
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
          .alter((data: any) => data.data.filter((r: any) => !!r.courseId))
      ),
    new Route()
      .access({ feature: "Enrollment", level: 3 })
      .key("/enrollment/:faculty")
      .exact()
      .component(Enroll),
    new Route()
      .access({ feature: "Enrollment", level: 1 })
      .key("/enrollment/overview/:faculty")
      .component(EnrollOverview)
      .get(
        new Get()
          .target(() => `/api/enrollment`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
      ),
    new Route()
      .access({ feature: "Courses", level: 3 })
      .key("/courses/:faculty")
      .exact()
      .component(Create),
    new Route()
      .access({ feature: "Courses", level: 1 })
      .key("/courses/overview/:faculty")
      .component(CreateOverview)
      .get(
        new Get()
          .target(() => `/api/courses/manual`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
      ),
    new Route()
      .access({ feature: "Profile", level: 3 })
      .key("/profile/:faculty")
      .exact()
      .component(Profile),
    new Route()
      .access({ feature: "Profile", level: 1 })
      .key("/profile/overview/:faculty")
      .component(ProfileOverview)
      .get(
        new Get()
          .target(() => ({
            target: `/api/person/profile`,
            params: {
              take: 10000,
              page: 1,
            },
          }))
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
          .alter((data: any) => data.data)
      ),
    new Route()
      .access({ feature: "ExternalUser", level: 3 })
      .key("/externaluser/:faculty")
      .exact()
      .component(Externals),
    new Route()
      .access({ feature: "ExternalUser", level: 1 })
      .key("/externaluser/overview/:faculty")
      .component(ExternalsOverview)
      .get(
        new Get()
          .target(() => `/api/external-users?take=10000`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
          .fail([])
      ),
    new Route()
      .access({ feature: "Hierarchy", level: 1 })
      .key("/hierarchy/:faculty")
      .component(Hierarchy)
      .get(
        new Get()
          .target(() => `/api/hierarchy`)
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
      ),
    new Route()
      .access({ feature: "Users", level: 1 })
      .key("/users/:faculty")
      .component(Users)
      .get(
        new Get()
          .target((cycle: Cycle) =>
            cycle._main.$user().isAdmin ? `/api/users/all` : `/api/users`
          )
          .header((cycle: Cycle) => ({
            Faculty: helpers.facultyEnums(cycle.params("faculty"), cycle._main),
          }))
          .key(`/api/users/`)
          .alter((data) =>
            data.map((r) => {
              r.expandable = r.userFaculties && r.userFaculties.length;
              return r;
            })
          )
      ),
    new Route()
      .access({ feature: "Support", level: 8 })
      .key("/support/:faculty")
      .component(Support),
    new Route()
      .access({ feature: "Sandbox", level: 8 })
      .key("/sandbox/:faculty")
      .component(Sandbox),
  ],
  drawer: (next: any, stop: any, main: Main) => {
    let section = new Section().immediate(() =>
      new Get()
        .target("/api/user")
        .header({ Faculty: "1" })
        .onThen((r: any) => {
          let select = new Select();
          let faculties = r.data?.faculties ?? [];
          let faculty =
            main.$path()._params.faculty ??
            faculties[0].name.toLowerCase() ??
            "tek";

          faculties.forEach((r: any) => {
            select.add(new Item(r.name.toLowerCase()).title(r.name));
            section._onComplete();
          });

          select
            .style({
              padding: "16px 16px 2px 16px",
              marginBottom: 0,
              borderRight: "1px solid #f0f0f0",
            })
            .default(select._defaultObject ?? { value: faculty })
            .clearable(false)
            .disabled(!faculties.length)
            .sizeString("small")
            .onChange((v) =>
              main.$route(
                main.$path()._matchedPath.replace(":faculty", v.value)
              )
            );

          section.add(select);
          section.add(
            new Sider()

              // Planlagt
              .add(
                new Button().access({ feature: "Scheduled", level: 1 }).action(
                  new Action()
                    .route(() => `/scheduled/${main.$params("faculty")}`)
                    .label("Planlagt")
                    .fontawesome(faClock)
                )
              )

              .add(
                new Button().access({ feature: "Created", level: 1 }).action(
                  new Action()
                    .route(() => `/transferred/${main.$params("faculty")}`)
                    .label("Overført")
                    .fontawesome(faExchangeAlt)
                )
              )

              // Samlekurser
              .add(
                new Button()
                  .access({ feature: "Merged", level: 1 })
                  .label("Samlekurser")
                  .fontawesome(faObjectGroup)
                  .add(
                    new Button().access({ feature: "Merged", level: 3 }).action(
                      new Action()
                        .route(() => `/merged/${main.$params("faculty")}`)
                        .label("Opret")
                        .fontawesome(faPlus)
                    )
                  )
                  .add(
                    new Button().access({ feature: "Merged", level: 1 }).action(
                      new Action()
                        .route(
                          () => `/merged/overview/${main.$params("faculty")}`
                        )
                        .label("Oversigt")
                        .fontawesome(faTable)
                    )
                  )
              )

              .add(
                new Button().access({ feature: "Excluded", level: 1 }).action(
                  new Action()
                    .route(() => `/excluded/${main.$params("faculty")}`)
                    .label("Slettet")
                    .fontawesome(faTrashAlt)
                )
              )

              // Opsplittet
              .add(
                new Button()
                  .access({ feature: "Unbundled", level: 1 })
                  .label("Opsplittet")
                  .fontawesome(faHeartBroken)
                  .add(
                    new Button()
                      .access({ feature: "Unbundled", level: 3 })
                      .action(
                        new Action()
                          .route(() => `/unbundled/${main.$params("faculty")}`)
                          .label("Opret")
                          .fontawesome(faPlus)
                      )
                  )
                  .add(
                    new Button()
                      .access({ feature: "Unbundled", level: 1 })
                      .action(
                        new Action()
                          .route(
                            () =>
                              `/unbundled/overview/${main.$params("faculty")}`
                          )
                          .label("Oversigt")
                          .fontawesome(faTable)
                      )
                  )
              )

              // Ændringer
              .add(
                new Button()
                  .access({ feature: "Override", level: 1 })
                  .label("Ændringer")
                  .fontawesome(faExchangeAlt)
                  .add(
                    new Button()
                      .access({ feature: "Override", level: 1 })
                      .action(
                        new Action()
                          .route(
                            () => `/override/title/${main.$params("faculty")}`
                          )
                          .label("Titel")
                          .fontawesome(faHeading)
                      )
                  )
                  .add(
                    new Button()
                      .access({ feature: "Override", level: 1 })
                      .action(
                        new Action()
                          .route(
                            () =>
                              `/override/scheduled/${main.$params("faculty")}`
                          )
                          .label("Oprettelse")
                          .fontawesome(faCalendarPlus)
                      )
                  )
                  .add(
                    new Button()
                      .access({ feature: "Override", level: 1 })
                      .action(
                        new Action()
                          .route(
                            () =>
                              `/override/enrollment/${main.$params("faculty")}`
                          )
                          .label("Enrollment")
                          .fontawesome(faRandom)
                      )
                  )
              )

              // Sammenkobling
              .add(
                new Button()
                  .access({ feature: "Enrollment", level: 1 })
                  .label("STADS-kobling")
                  .fontawesome(faLink)
                  .add(
                    new Button()
                      .access({ feature: "Enrollment", level: 3 })
                      .action(
                        new Action()
                          .route(() => `/enrollment/${main.$params("faculty")}`)
                          .label("Opret")
                          .fontawesome(faPlus)
                      )
                  )
                  .add(
                    new Button()
                      .access({ feature: "Enrollment", level: 1 })
                      .action(
                        new Action()
                          .route(
                            () =>
                              `/enrollment/overview/${main.$params("faculty")}`
                          )
                          .label("Oversigt")
                          .fontawesome(faTable)
                      )
                  )
              )

              // Manuele kurser
              .add(
                new Button()
                  .access({ feature: "Courses", level: 1 })
                  .label("Manuelle kurser")
                  .fontawesome(faChalkboard)
                  .add(
                    new Button()
                      .access({ feature: "Courses", level: 3 })
                      .action(
                        new Action()
                          .route(() => `/courses/${main.$params("faculty")}`)
                          .label("Opret")
                          .fontawesome(faPlus)
                      )
                  )
                  .add(
                    new Button()
                      .access({ feature: "Courses", level: 1 })
                      .action(
                        new Action()
                          .route(
                            () => `/courses/overview/${main.$params("faculty")}`
                          )
                          .label("Oversigt")
                          .fontawesome(faTable)
                      )
                  )
              )

              // Eksterne brugere
              .add(
                new Button()
                  .access({ feature: "ExternalUser", level: 1 })
                  .label("Brugere")
                  .fontawesome(faUserPlus)
                  .add(
                    new Button()
                      .access({ feature: "ExternalUser", level: 3 })
                      .action(
                        new Action()
                          .route(
                            () => `/externaluser/${main.$params("faculty")}`
                          )
                          .label("Opret")
                          .fontawesome(faPlus)
                      )
                  )
                  .add(
                    new Button()
                      .access({ feature: "ExternalUser", level: 1 })
                      .action(
                        new Action()
                          .route(
                            () =>
                              `/externaluser/overview/${main.$params(
                                "faculty"
                              )}`
                          )
                          .label("Oversigt")
                          .fontawesome(faTable)
                      )
                  )
              )

              .add(
                new Button().access({ feature: "Hierarchy", level: 1 }).action(
                  new Action()
                    .route(() => `/hierarchy/${main.$params("faculty")}`)
                    .label("Communities")
                    .fontawesome(faProjectDiagram)
                )
              )

              // Profil
              .add(
                new Button()
                  .access({ feature: "Profile", level: 1 })
                  .label("Profil")
                  .fontawesome(faAddressCard)
                  .add(
                    new Button()
                      .access({ feature: "Profile", level: 3 })
                      .action(
                        new Action()
                          .route(() => `/profile/${main.$params("faculty")}`)
                          .label("Opret")
                          .fontawesome(faPlus)
                      )
                  )
                  .add(
                    new Button()
                      .access({ feature: "Profile", level: 1 })
                      .action(
                        new Action()
                          .route(
                            () => `/profile/overview/${main.$params("faculty")}`
                          )
                          .label("Oversigt")
                          .fontawesome(faTable)
                      )
                  )
              )

              // Administratorer
              .add(
                new Button().access({ feature: "Users", level: 1 }).action(
                  new Action()
                    .route(() => `/users/${main.$params("faculty")}`)
                    .label("Administratorer")
                    .fontawesome(faUserShield)
                )
              )

              .add(
                new Button().access({ feature: "Support", level: 8 }).action(
                  new Action()
                    .route(() => `/support/${main.$params("faculty")}`)
                    .label("Support")
                    .fontawesome(faAmbulance)
                )
              )

              .add(
                new Button().access({ feature: "Sandbox", level: 9 }).action(
                  new Action()
                    .route(() => `/sandbox/${main.$params("faculty")}`)
                    .label("Sandbox")
                    .fontawesome(faUmbrellaBeach)
                )
              )
          );

          // Return the Section to the caller.
          next(section);
        })
    );
  },
};

import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./shared/components/layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./shared/components/layouts/auth-layout/auth-layout.component";
import { AuthGuard } from "./shared/services/auth/auth.guard";

export const rootRouterConfig: Routes = [
  {
    path: "",
    redirectTo: "sessions/signin",
    pathMatch: "full"
  },

  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "sessions",
        loadChildren: "./views/sessions/sessions.module#SessionsModule",
        data: { title: "Session" }
      }
    ]
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: 'dashboard',
      //   loadChildren: './views/dashboard/dashboard.module#DashboardModule',
      //   data: { title: 'Dashboard', breadcrumb: 'DASHBOARD' }
      // },

      // {
      //   path: 'material',
      //   loadChildren: './views/material/app-material.module#AppMaterialModule',
      //   data: { title: 'Material', breadcrumb: 'MATERIAL' }
      // },
      // {
      //   path: 'dialogs',
      //   loadChildren: './views/app-dialogs/app-dialogs.module#AppDialogsModule',
      //   data: { title: 'Dialogs', breadcrumb: 'DIALOGS' }
      // },

      // {
      //   path: 'others',
      //   loadChildren: './views/others/others.module#OthersModule',
      //   data: { title: 'Others', breadcrumb: 'OTHERS' }
      // },
      // {
      //   path: 'tables',
      //   loadChildren: './views/tables/tables.module#TablesModule',
      //   data: { title: 'Tables', breadcrumb: 'TABLES' }
      // },
      // {
      //   path: 'tour',
      //   loadChildren: './views/app-tour/app-tour.module#AppTourModule',
      //   data: { title: 'Tour', breadcrumb: 'TOUR' }
      // },
      // {
      //   path: 'forms',
      //   loadChildren: './views/forms/forms.module#AppFormsModule',
      //   data: { title: 'Forms', breadcrumb: 'FORMS' }
      // },
      // {
      //   path: 'charts',
      //   loadChildren: './views/charts/charts.module#AppChartsModule',
      //   data: { title: 'Charts', breadcrumb: 'CHARTS' }
      // },
      // {
      //   path: 'map',
      //   loadChildren: './views/map/map.module#AppMapModule',
      //   data: { title: 'Map', breadcrumb: 'MAP' }
      // },
      // {
      //   path: 'dragndrop',
      //   loadChildren: './views/dragndrop/dragndrop.module#DragndropModule',
      //   data: { title: 'Drag and Drop', breadcrumb: 'DND' }
      // },
      // {
      //   path: 'chat',
      //   loadChildren: './views/app-chats/app-chats.module#AppChatsModule',
      //   data: { title: 'Chat', breadcrumb: 'CHAT' }
      // },
      // {
      //   path: 'icons',
      //   loadChildren: './views/mat-icons/mat-icons.module#MatIconsModule',
      //   data: { title: 'Icons', breadcrumb: 'MATICONS' }
      // }
      // ,

      // {
      //   path: "survey-interaction",
      //   loadChildren:
      //     "./views/survey-interaction/survey-interaction.module#SurveyInteractionModule",
      //   data: { title: "Survey Interaction", breadcrumb: "Survey Demo" }
      // },

      {
        path: "profile",
        loadChildren: "./views/profile/profile.module#ProfileModule",
        data: { title: "Profile", breadcrumb: "PROFILE" }
      },
      {
        path: "inbox",
        loadChildren: "./views/app-inbox/app-inbox.module#AppInboxModule",
        data: { title: "Inbox", breadcrumb: "INBOX" }
      },
      {
        path: "calendar",
        loadChildren:
          "./views/app-calendar/app-calendar.module#AppCalendarModule",
        data: { title: "Calendar", breadcrumb: "CALENDAR" }
      },
      {
        path: "cruds",
        loadChildren: "./views/cruds/cruds.module#CrudsModule",
        data: { title: "Clients", breadcrumb: "Client" }
      },
      {
        path: "productCrud",
        loadChildren:
          "./views/product-crud/product-crud.module#ProductCrudModule",
        data: { title: "Product Catalogue", breadcrumb: "" }
      },
      {
        path: "surveys",
        loadChildren: "./views/survey/survey.module#SurveyModule",
        data: { title: "Survey Service", breadcrumb: "" }
      },
      {
        path: "future-survey",
        loadChildren:
          "./views/future-survey/future-survey.module#FutureSurveyModule",
        data: { title: "Future Survey", breadcrumb: "Future Survey" }
      },
      {
        path: "evote",
        loadChildren: "./views/evote/evote.module#EvoteModule",
        data: { title: "E - Vote", breadcrumb: "E Vote" }
      }
    ]
  },
  {
    path: "**",
    redirectTo: "sessions/404"
  }
];

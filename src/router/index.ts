import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import TabsPage from "../views/TabsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/tabs/dashboard",
  },
  {
    path: "/auth",
    component: () => import("@/views/AuthenticationPage.vue"),
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/dashboard",
      },
      {
        path: "dashboard",
        component: () => import("@/views/DashboardPage.vue"),
      },
      {
        path: "main",
        component: () => import("@/views/MainPage.vue"),
      },
      {
        path: "setting",
        component: () => import("@/views/SettingPage.vue"),
      },
      {
        path: "category-list",
        component: () => import("@/views/CategoryListPage.vue"),
      },
      {
        path: "category",
        component: () => import("@/views/CategoryPage.vue"),
      },
      {
        path: "asset-list",
        component: () => import("@/views/AssetListPage.vue"),
      },
      {
        path: "asset",
        component: () => import("@/views/AssetPage.vue"),
      },
      {
        path: "contact-list",
        component: () => import("@/views/ContactListPage.vue"),
      },
      {
        path: "contact",
        component: () => import("@/views/ContactPage.vue"),
      },
      {
        path: "note-list",
        component: () => import("@/views/NoteListPage.vue"),
      },
      {
        path: "note",
        component: () => import("@/views/NotePage.vue"),
      },
      {
        path: "password-list",
        component: () => import("@/views/PasswordListPage.vue"),
      },
      {
        path: "password",
        component: () => import("@/views/PasswordPage.vue"),
      },
      {
        path: "transaction-list",
        component: () => import("@/views/TransactionListPage.vue"),
      },
      {
        path: "transaction",
        component: () => import("@/views/TransactionPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

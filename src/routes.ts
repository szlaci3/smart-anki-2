// src/routes/routes.ts
export interface Route {
  name?: string;
  path: string;
}

export const routes: Route[] = [
  {
    name: "Review Cards",
    path: "/",
  },
  {
    name: "Card Form",
    path: "/cardForm",
  },
  {
    path: "/cardForm/:id",
  },
];

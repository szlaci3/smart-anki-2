// src/routes/routes.ts
export interface Route {
  name?: string;
  path: string;
  component: string;
}

export const routes: Route[] = [
  {
    name: 'Review Cards',
    path: '/',
    component: './Home',
  },
  {
    name: 'Add Cards',
    path: '/cardForm',
    component: './CardForm',
  },
  {
    path: '/editCard/:id',
    component: './EditCard',
  },
];

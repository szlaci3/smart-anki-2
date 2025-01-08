export default [
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
  
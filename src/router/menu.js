import IndexPage from '@/pages/Home';
import NotFound from '@/components/NotFound';
import SimpleDemo1 from '@/pages/SimpleDemo1';
import SimpleDemo2 from '@/pages/SimpleDemo2';

export default [
  {
    name: 'Home',
    path: '/',
    component: IndexPage,
  },
  {
    name: 'Simple Demo1',
    path: '/demo1',
    component: SimpleDemo1,
  },
  {
    name: 'Simple Demo2',
    path: '/demo2',
    component: SimpleDemo2,
  },
  {
    name: '404',
    path: '/404',
    hideInMenu: true,
    component: NotFound,
  },
];

import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmedPage from './pages/OrderConfirmedPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'men', Component: ProductListPage },
      { path: 'women', Component: ProductListPage },
      { path: 'product/:id', Component: ProductDetailPage },
      { path: 'cart', Component: CartPage },
      { path: 'checkout', Component: CheckoutPage },
      { path: 'order-confirmed', Component: OrderConfirmedPage },
      { path: 'about', Component: AboutPage },
      { path: 'contact', Component: ContactPage },
      { path: 'search', Component: SearchPage },
      { path: 'admin/login', Component: AdminPage },
      { path: 'admin', Component: AdminPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);

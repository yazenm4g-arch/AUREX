import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LangProvider } from './context/LangContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

export default function App() {
  return (
    <LangProvider>
      <ProductProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ProductProvider>
    </LangProvider>
  );
}

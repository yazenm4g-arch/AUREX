import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LangProvider } from './context/LangContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { StoreProvider } from './context/StoreContext';

export default function App() {
  return (
    <LangProvider>
      <ProductProvider>
        <StoreProvider>
          <CartProvider><RouterProvider router={router} /></CartProvider>
        </StoreProvider>
      </ProductProvider>
    </LangProvider>
  );
}

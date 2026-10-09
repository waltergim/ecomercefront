import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AdminRoute, GuestRoute, ProtectedRoute } from './guards'
import { HomePage } from '@/pages/HomePage'
import { SearchPage } from '@/pages/SearchPage'
import { ProductPage } from '@/pages/ProductPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CheckoutSuccessPage } from '@/pages/CheckoutSuccessPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { AccountPage } from '@/pages/AccountPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { WishlistPage } from '@/pages/WishlistPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'buscar', element: <SearchPage /> },
      { path: 'producto/:slug', element: <ProductPage /> },
      { path: 'carrito', element: <CartPage /> },
      { path: 'favoritos', element: <WishlistPage /> },

      {
        element: <GuestRoute />,
        children: [
          { path: 'ingresar', element: <LoginPage /> },
          { path: 'registro', element: <RegisterPage /> },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'checkout/exito', element: <CheckoutSuccessPage /> },
          { path: 'cuenta', element: <AccountPage /> },
          { path: 'mis-pedidos', element: <OrdersPage /> },
          { path: 'mis-pedidos/:id', element: <OrderDetailPage /> },
        ],
      },

      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="/admin/productos" replace /> },
              { path: 'productos', element: <AdminProductsPage /> },
              { path: 'productos/nuevo', element: <AdminProductFormPage /> },
              { path: 'productos/:id', element: <AdminProductFormPage /> },
              { path: 'pedidos', element: <AdminOrdersPage /> },
            ],
          },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Recipes } from './pages/Recipes.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Recipes />,
  },
  { path: '/signup', element: <Signup /> },
  {
    path: '/login',
    element: <Login />,
  },
])
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

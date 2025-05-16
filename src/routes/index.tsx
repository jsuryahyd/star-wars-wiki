import Layout from '@/components/common/Layout';
import CharactersPage from '@/pages/CharactersPage/CharactersPage';
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'

export const rootRoute = createRootRoute({
  component: () => (
    <>
      {/* <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr /> */}
			<Layout>
      	<Outlet />
			</Layout>
    </>
  ),
})

export const CharactersPageRoute = createRoute({
	getParentRoute: ()=>rootRoute,
  path: "/characters-list",
  component: CharactersPage,
});

export const routeTree = rootRoute.addChildren([CharactersPageRoute])
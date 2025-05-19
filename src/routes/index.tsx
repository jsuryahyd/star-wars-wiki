import Layout from '@/components/common/Layout';
import CharacterDetailsPage from '@/pages/CharacterDetailsPage/CharacterDetailsPage';
import CharactersPage from '@/pages/CharactersPage/CharactersPage';
import FavouritesPage from '@/pages/FavouritesPage/FavouritesPage';
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
			<Layout>
      	<Outlet />
			</Layout>
    </>
  ),

})
export const HomeRoute = createRoute({
	getParentRoute: ()=>rootRoute,
  path: "/",
  component: CharactersPage,
});

export const CharactersPageRoute = createRoute({
	getParentRoute: ()=>rootRoute,
  path: "/characters-list",
  component: CharactersPage,
});

export const CharactersDetailsRoute = createRoute({
	getParentRoute: ()=>rootRoute,
  path: "/character-details/$id",
  component: CharacterDetailsPage,
});

export const FavouritesPageRoute = createRoute({
  getParentRoute: ()=>rootRoute,
  path: "/favourites",
  component: FavouritesPage,
});

export const routeTree = rootRoute.addChildren([HomeRoute, CharactersPageRoute, FavouritesPageRoute, CharactersDetailsRoute])
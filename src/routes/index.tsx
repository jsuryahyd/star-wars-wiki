import Layout from '@/components/common/Layout';
import CharacterDetailsPage from '@/pages/CharacterDetailsPage/CharacterDetailsPage';
import CharactersPage from '@/pages/CharactersPage/CharactersPage';
import FavouritesPage from '@/pages/FavouritesPage/FavouritesPage';
import {
  Outlet,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'

const rootRoute = createRootRoute({
  component: () => (
    <>
			<Layout>
      	<Outlet />
			</Layout>
    </>
  ),

})
const HomeRoute = createRoute({
	getParentRoute: ()=>rootRoute,
  path: "/",
  component: CharactersPage,
});

const CharactersPageRoute = createRoute({
	getParentRoute: ()=>rootRoute,
  path: "/characters-list",
  component: CharactersPage,
});

const CharactersDetailsRoute = createRoute({
	getParentRoute: ()=>rootRoute,
  path: "/character-details/$id",
  component: CharacterDetailsPage,
});

const FavouritesPageRoute = createRoute({
  getParentRoute: ()=>rootRoute,
  path: "/favourites",
  component: FavouritesPage,
});

export const routeTree = rootRoute.addChildren([HomeRoute, CharactersPageRoute, FavouritesPageRoute, CharactersDetailsRoute])
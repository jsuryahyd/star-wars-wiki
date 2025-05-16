import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { RouterProvider, createRootRoute, createRouter,  createMemoryHistory, createRoute } from '@tanstack/react-router';
import { rootRouteWithContext, Route, Router } from '@tanstack/react-router';
import { Provider } from '@/components/ui/provider';


    const rootRoute = createRootRoute();

    // Create a test route
    const testRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: '/',
        component: () => <div>Test Component</div>,
    });

    const router = createRouter({
        routeTree: rootRoute.addChildren([testRoute]),
        history: createMemoryHistory(),
        defaultPendingMinMs: 0, //Prevent test slowdown
    });


const customRender = (
  ui: React.ReactElement,
  { initialRoute = '/', routes,  ...options }: { initialRoute?: string,routes?:Route[] } & Omit<Parameters<typeof rtlRender>[1], 'wrapper'> = {}
) => {
  const history = createMemoryHistory({ initialEntries: [initialRoute] });
  const router = createRouter({
    routeTree: rootRoute.addChildren([testRoute]),
    history,
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>
      {routes?.length ? <RouterProvider router={router}>{children}</RouterProvider> : children}
    </Provider>
  );

  return { ...rtlRender(ui, { wrapper: Wrapper, ...options }), router };
};

export * from '@testing-library/react';
export { customRender as render,rtlRender };

import React from "react";
import { act, render as rtlRender } from "@testing-library/react";
import {
  RouterProvider,
  createRootRoute,
  createRouter,
  createMemoryHistory,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { Provider } from "@/components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

const customRender = (
  ui: React.ReactElement,
  {
    initialRoute = "/",
    routes,
    ...options
  }: {
    initialRoute?: string;
    routes?: { path: string; component: any }[];
  } & Omit<Parameters<typeof rtlRender>[1], "wrapper"> = {}
) => {
  const rootRoute = createRootRoute({
    component: Outlet,
  });
  if (!routes?.find((r) => r.path === "/")) {
    routes?.push({
      path: "/",
      component: () => ui,
    });
  }
  const history = createMemoryHistory({
    initialEntries: initialRoute ? [initialRoute] : [],
  }); //todo: this is supposed to render the initial router immediately, avoid act(()=> router.navigate({ to: '/' }) in the test. but it doesn't work.
  const _routes = (routes || []).map((route) =>
    createRoute({ ...route, getParentRoute: () => rootRoute })
  );
  const router = createRouter({
    defaultPendingMinMs: 0,
    routeTree: rootRoute.addChildren(_routes),
    history,
  });
  // console.log(
  //   { history },
  //   { initialEntries: initialRoute ? [initialRoute] : [] },
  //   router.latestLocation
  // );
  // act(() => {
  //   // return history.push(initialRoute);
  //   router.navigate({
  //     to: "/",
  //   });
  // });
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
      },
      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>
      <QueryClientProvider client={queryClient}>
        {_routes.length ? (
          <RouterProvider
            router={router}
            defaultComponent={() => children}
          ></RouterProvider>
        ) : (
          children
        )}
        <Toaster />
      </QueryClientProvider>
    </Provider>
  );

  const renderReturn = rtlRender(ui, { wrapper: Wrapper, ...options });
  // await act(() =>
  //   router.navigate({

  //     to: '/',
  //   })
  // )
  // console.log(router)
  return { ...renderReturn, router };
};

export * from "@testing-library/react";
export { customRender as render, rtlRender };

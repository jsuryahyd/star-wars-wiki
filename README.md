# Star Wars Wiki
### Requirements:
	- A wiki website with 3 Pages - Characters List Page,  Character Details Page, Favourites Page
	- Scalable architecture, and Clean, Readable and testable code. Attention to Details.
	- React, Typescript and TDD
	- All pages should be Accessible.
	- Support light and dark themes.
### Architectural Choices
	- An SPA built with React, which can be deployed as a static site.
		- A Server Rendered site would also makes sense for SEO and faster initial page loads, as we can cache pages with common content.
	- Monorepo [x]: A monorepo would make more sense if the project is part of a suite of applications and / or a ui component library is needed across the applications
	- Micro frontends [x]: As the project size increases with large number of screens and multiple teams working on them, a micro frontend architecture would be recommended.
	- Code splitting and Lazy loading can be implemented as bundle sizes grow, for faster page load times.
### Technology choices:
	- Node v20 is required for some of the dependancies. It is stable, so using node 20.
	- React with Typescript for a SPA (setup with vite build tool)
	- Tanstack router for browser routing
	- Ark UI for components and styling. (responsive web design) - A wrapper component library is maintained
	- Tanstack Query for data fetching and caching.
	- Context API for global state management
	- MSW for caching favourites list
	- Vitest and testing library for component and integration tests
### Others
	- Tools like DataDog, Sentry can be used for monitoring and observability. (Not used currently)
	- Security
		- Proper CSP policies must be enforced.
		- TLS must be used while deploying.
		- User accounts and Login can be implemented for personalized features like favourites. (Not implemented currently)
		- dependencies must be audited with npm audit and owasp top 10 vuln.
## Development
- Layout:
	- A responsive layout that has a header(links to main page, favourites page) and main page, and a footer.
- Characters List Page:
	- Should show a list of cards with **pagination**. A card should be clickable and navigate to character page. Should have a hover animation/indication that the card is clickable.
	- implement a search input that filters by name from the server, with debouncing. Sync the search input value with url query param.
	- Character Card component - with test
	- fetch list with useQuery from tanstak query.
		- maintain keys with search query and pagination
    - 
- Character Page:
	- should show details section, movies and starships sections.
	- show a prominent "Add to Favourites/Remove favourite" button
	- the current characterId state variable will be maintained in url
- Favourites Page:
	- similar to characters list page, with a heading "Favourites"

// .lintstagedrc is already set up to lint staged files
// .husky/pre-commit and .husky/pre-push both run npx lint-staged
// No further action needed unless you want to customize the commands or file patterns
// If you want to lint only on push (not on commit), you can remove the pre-commit hook and keep only pre-push
// To do that, simply delete .husky/pre-commit
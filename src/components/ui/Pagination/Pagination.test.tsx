import { waitFor, within } from "@testing-library/react";
import PaginationComponent from "./Pagination";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils/render";

describe("Pagination", () => {

	afterEach(() => {})
  test("renders as expected", async () => {
    const onPageChange = vi.fn();
		const count = 101;
		const pageSize = 10;
    render(
      <PaginationComponent
        count={count}
        pageSize={pageSize}
        defaultPage={1}
        onPageChange={onPageChange}
				siblingCount={10} // the loop below fails, as the siblingCount is not passed to the Pagination component
      />
    );

    const pagination = screen.getByRole("navigation", {
      name: "pagination",
    });
    expect(pagination).toBeInTheDocument();
    const nextButton = within(pagination).getByRole("button", {
      name: /next page/i,
    });
    expect(nextButton).toBeInTheDocument();
    const prevButton = within(pagination).getByRole("button", {
      name: /previous page/i,
    });
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
		const max = Math.ceil(count / pageSize)
		for (let i = 1; i <= max; i++) {
			screen.getByRole("button", {
				name: i === max ? 'last page, page '+max: `page ${i}` // new RegExp(`page ${i}`,'i'),// page 1, page 11 both will match regex
		})
		if(i === 1) {
			expect(screen.getByRole("button", {
				name: `page ${i}`
			})).toHaveAttribute("aria-current", "page");
		}
	}
  });
	


  test("prev, next and number buttons work", async () => {
    const onPageChange = vi.fn();
		const count = 101;
		const pageSize = 10;
    render(
      <PaginationComponent
        count={count}
        pageSize={pageSize}
        defaultPage={1}
        onPageChange={onPageChange}
      />
    );
    const pagination = screen.getByRole("navigation", {
      name: "pagination",
    });
    render(
      <PaginationComponent
        count={101}
        pageSize={10}
        defaultPage={2}
        onPageChange={onPageChange}
      />
    );
    const nextButton = within(pagination).getByRole("button", {
      name: /next page/i,
    });
    expect(nextButton).toBeInTheDocument();
    const prevButton = within(pagination).getByRole("button", {
      name: /previous page/i,
    });
    
    await userEvent.click(nextButton);
    

    await waitFor(() => {
      expect(prevButton).not.toBeDisabled();
      // expect(nextButton).toBeDisabled();//todo: test this by clicking on last button
     
      const page2Button = within(pagination).getByRole("button", {
        name: /2/i,
      });
      expect(page2Button).toBeInTheDocument();
      expect(page2Button).toHaveAttribute("aria-current", "page");
    });
		const page11Button = within(pagination).getByRole("button", {
			name: /11/i,
		});
		await userEvent.click(page11Button);
		await waitFor(() => {
      expect(page11Button).toBeInTheDocument();
      expect(page11Button).toHaveAttribute("aria-current", "page");

			//last page is selected
      expect(nextButton).toBeDisabled();
      expect(prevButton).not.toBeDisabled();
     
    });

  });

	test('onPageChange prop works as expected',async ()=>{
		 const onPageChange = vi.fn();
		const count = 101;
		const pageSize = 10;
    render(
      <PaginationComponent
        count={count}
        pageSize={pageSize}
        defaultPage={1}
        onPageChange={onPageChange}
      />
    );

		const pagination = screen.getByRole("navigation", {
			name: "pagination",
		});
		expect(pagination).toBeInTheDocument();
		const nextButton = screen.getByRole('button', {name:/next page/i})
		expect(nextButton).toBeInTheDocument();
		await userEvent.click(nextButton)
		expect(onPageChange).toHaveBeenCalledTimes(1)
		onPageChange.mockClear()
		const prevButton = screen.getByRole('button', {name:/previous page/i})
		expect(prevButton).toBeInTheDocument();
		await userEvent.click(prevButton)
		expect(onPageChange).toHaveBeenCalledTimes(1)
		onPageChange.mockClear()
		const page5Button = screen.getByRole('button', {name:/5/i})
		expect(page5Button).toBeInTheDocument();	
		await userEvent.click(page5Button)
		expect(onPageChange).toHaveBeenCalledTimes(1)
		expect(onPageChange).toHaveBeenCalledWith( {
     "page": 5,
     "pageSize": 10,
   })
	})
});

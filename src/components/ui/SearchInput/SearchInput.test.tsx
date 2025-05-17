import {  screen,  act, waitFor, render } from "@/test-utils/render";
import SearchInput from "./SearchInput"
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

describe("SearchInput", () => {
	beforeEach(() => {
	});

	it("renders input", () => {
		render(<SearchInput onChange={() => {}} value="" />);
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});

	it("renders with placeholder", () => {
		const placeholderText = "Search...";
		render(<SearchInput onChange={() => {}} value="" placeholder={placeholderText} />);
		expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
	});

	it("calls onChange on input change", async () => {
		const onChange = vi.fn();
		render(<SearchInput onChange={onChange} value="" />);
		const input = screen.getByRole("textbox");
		await userEvent.type(input, "Luke");
		await waitFor(()=>{
			expect(onChange).toHaveBeenCalledWith("Luke");
		},{timeout:1000})
	});

	it("updates input value when prop changes", () => {
		const { rerender } = render(<SearchInput onChange={() => {}} value="Leia" />);
		const input = screen.getByRole("textbox") as HTMLInputElement;
		expect(input.value).toBe("Leia");
		rerender(<SearchInput onChange={() => {}} value="Han" />);
		expect(input.value).toBe("Han");
	});

	
	it("does not call onChange if prop value equals value", async () => {
		const onChange = vi.fn();
		const {rerender} = render(<SearchInput onChange={onChange} value="" />);

		const input = screen.getByRole("textbox") as HTMLInputElement;
		await userEvent.type(input, "Leia");
		rerender(<SearchInput onChange={onChange} value="Leia" />);
		expect(onChange).not.toHaveBeenCalled();
	});

});
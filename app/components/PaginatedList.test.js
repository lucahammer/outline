// @flow
import { shallow } from "enzyme";
import * as React from "react";
import { DEFAULT_PAGINATION_LIMIT } from "stores/BaseStore";
import { runAllPromises } from "../test/support";
import PaginatedList from "./PaginatedList";

describe("PaginatedList", () => {
  it("with no items renders nothing", () => {
    const list = shallow(<PaginatedList items={[]} />);
    expect(list).toEqual({});
  });

  it("with no items renders empty prop", () => {
    const list = shallow(
      <PaginatedList items={[]} empty={<p>Sorry, no results</p>} />
    );
    expect(list.text()).toEqual("Sorry, no results");
  });

  it("calls fetch with options + pagination on mount", () => {
    const fetch = jest.fn();
    const options = { id: "one" };

    shallow(<PaginatedList items={[]} fetch={fetch} options={options} />);
    expect(fetch).toHaveBeenCalledWith({
      ...options,
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: 0,
    });
  });

  it("calls fetch when options prop changes", async () => {
    const fetchedItems = Array(DEFAULT_PAGINATION_LIMIT).fill();
    const fetch = jest.fn().mockReturnValue(fetchedItems);

    const list = shallow(
      <PaginatedList items={[]} fetch={fetch} options={{ id: "one" }} />
    );

    await runAllPromises();

    expect(fetch).toHaveBeenCalledWith({
      id: "one",
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: 0,
    });

    fetch.mockReset();

    list.setProps({
      fetch,
      items: [],
      options: { id: "two" },
    });

    await runAllPromises();

    expect(fetch).toHaveBeenCalledWith({
      id: "two",
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: 0,
    });
  });
});

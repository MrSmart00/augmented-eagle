import { useEffect, useState } from "react";
import type { Pokemon } from "../domain/pokemon";

export function useSearch(items: Pokemon[]) {
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    if (searchText === "") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.name.includes(searchText)));
    }
  }, [searchText, items]);

  return { searchText, setSearchText, filteredItems };
}

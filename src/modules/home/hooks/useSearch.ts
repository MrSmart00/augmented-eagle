import { useEffect, useState } from "react";
import type { PokemonSummary } from "@/src/shared";

export function useSearch(items: PokemonSummary[]) {
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

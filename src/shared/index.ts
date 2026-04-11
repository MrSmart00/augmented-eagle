export { FavoritesProvider, useFavorites } from "./contexts/FavoritesContext";
export { PokemonCard } from "./components/PokemonCard";
export { PokemonDetail } from "./components/PokemonDetail";
export { FavoriteButton } from "./components/FavoriteButton";
export { typeColors } from "./domain/typeColors";
export { capitalizeName, fetchPokemonById } from "./repository/pokemonApi";
export { usePokemonById } from "./hooks/usePokemonById";
export { usePokemonByIds } from "./hooks/usePokemonByIds";
export type { Pokemon, PokemonType } from "./domain/pokemon";

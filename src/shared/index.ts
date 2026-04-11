export { i18n, initI18n, SUPPORTED_LANGUAGES, STORAGE_KEY } from "./i18n";
export type { SupportedLanguage } from "./i18n";
export { useLanguage } from "./i18n";
export { FavoritesProvider, useFavorites } from "./contexts/FavoritesContext";
export { PokemonCard } from "./components/PokemonCard";
export { FavoriteButton } from "./components/FavoriteButton";
export { typeColors } from "./domain/typeColors";
export { fetchPokemonById } from "./repository/pokemonApi";
export { fetchPokemonSpeciesInfo } from "./repository/pokemonSpeciesApi";
export type { PokemonSpeciesInfo } from "./repository/pokemonSpeciesApi";
export type {
  Pokemon,
  PokemonSummary,
  PokemonStat,
  PokemonAbility,
  PokemonType,
} from "./domain/pokemon";

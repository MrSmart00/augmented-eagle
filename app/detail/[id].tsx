import { useLocalSearchParams } from "expo-router";
import { DetailScreen } from "@/src/modules/detail";

export default function DetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DetailScreen id={id ?? ""} />;
}

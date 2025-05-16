import { CharacterCard } from "@/components/ui/CharacterCard/CharacterCard";


export default function CharactersPage() {
  return <>
  <CharacterCard
          name="Jaya Surya"
          details={[
            { label: "gender", value: "Male" },
            { label: "homePlanet", value: "Earth" },
          ]}
          id="1"
        />
  </>;
}



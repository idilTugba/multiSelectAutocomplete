export interface CharacterTypo {
  id: string;
  name: string;
  image: string;
  episode: string[];
}

export const searchCharacters = async (
  name: string
): Promise<CharacterTypo[]> => {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${name}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch characters");
  }

  const data = await response.json();
  return data.results.map((char: any) => ({
    id: char.id,
    name: char.name,
    image: char.image,
    episode: char.episode,
  }));
};

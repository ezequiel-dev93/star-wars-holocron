import rawCharactersJson from "@/data/characters.json";
import type { RawCharacterRecord } from "@modules/characters/types/character.types";

export const rawCharactersData: RawCharacterRecord[] =
  rawCharactersJson as RawCharacterRecord[];

function toCharacterDTO(character) {
  return {
    id: character.id,
    name: character.name,
    height: character.height,
    mass: character.mass,
    hairColor: character.hairColor,
    skinColor: character.skinColor,
    eyeColor: character.eyeColor,
    birthYear: character.birthYear,
    gender: character.gender,
    homeworldUrl: character.homeworld,
    // Placeholder image - se puede reemplazar con S3/CloudFront después
    imageUrl: `https://starwars-visualguide.com/assets/img/characters/${character.id}.jpg`
  };
}

class Character {
  constructor(id, name, height, mass, hairColor, skinColor, eyeColor, birthYear, gender, homeworld, films, species, vehicles, starships) {
    this.id = id;
    this.name = name;
    this.height = height;
    this.mass = mass;
    this.hairColor = hairColor;
    this.skinColor = skinColor;
    this.eyeColor = eyeColor;
    this.birthYear = birthYear;
    this.gender = gender;
    this.homeworld = homeworld;
    this.films = films;
    this.species = species;
    this.vehicles = vehicles;
    this.starships = starships;
  }
  /* Verifica si el personaje tiene una altura conocida */
  hasKnownHeight() {
    return this.height !== "unknown";
  }
  /* Obtiene la altura en centímetros como número */
  getHeightInCm() {
    if (!this.hasKnownHeight()) return null;
    return parseInt(this.height, 10);
  }
  /* Verifica si el personaje es humano */
  isHuman() {
    return this.species.length === 0;
  }
}

const SWAPI_BASE_URL = "https://swapi.dev/api";
class SwapiClient {
  baseUrl;
  constructor(baseUrl = SWAPI_BASE_URL) {
    this.baseUrl = baseUrl;
  }
  /**
   * Obtiene la lista de personajes con paginación
   */
  async getPeople(page = 1) {
    const response = await fetch(`${this.baseUrl}/people/?page=${page}`);
    if (!response.ok) {
      throw new Error(`SWAPI Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
  /**
   * Obtiene un personaje por su ID
   */
  async getPersonById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/people/${id}/`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`SWAPI Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Error fetching person ${id}:`, error);
      return null;
    }
  }
  /**
   * Busca personajes por nombre
   */
  async searchPeople(query) {
    const response = await fetch(
      `${this.baseUrl}/people/?search=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`SWAPI Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }
}
const swapiClient = new SwapiClient();

class SwapiCharacterRepository {
  client;
  constructor(client = swapiClient) {
    this.client = client;
  }
  /**
   * Extrae el ID de una URL de SWAPI
   * Ejemplo: "https://swapi.dev/api/people/1/" -> "1"
   */
  extractIdFromUrl(url) {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? matches[1] : "0";
  }
  /**
   * Mapea datos de SWAPI a la entidad Character del domain
   */
  mapToCharacter(data) {
    return new Character(
      this.extractIdFromUrl(data.url),
      data.name,
      data.height,
      data.mass,
      data.hair_color,
      data.skin_color,
      data.eye_color,
      data.birth_year,
      data.gender,
      data.homeworld,
      data.films,
      data.species,
      data.vehicles,
      data.starships
    );
  }
  async findAll(page = 1) {
    const response = await this.client.getPeople(page);
    const characters = response.results.map((person) => this.mapToCharacter(person));
    const pageSize = 10;
    const totalPages = Math.ceil(response.count / pageSize);
    return {
      data: characters,
      total: response.count,
      page,
      totalPages,
      hasNext: response.next !== null,
      hasPrevious: response.previous !== null
    };
  }
  async findById(id) {
    const person = await this.client.getPersonById(id);
    if (!person) {
      return null;
    }
    return this.mapToCharacter(person);
  }
  async search(query) {
    const response = await this.client.searchPeople(query);
    return response.results.map((person) => this.mapToCharacter(person));
  }
}
const characterRepository = new SwapiCharacterRepository();

export { characterRepository as c, toCharacterDTO as t };

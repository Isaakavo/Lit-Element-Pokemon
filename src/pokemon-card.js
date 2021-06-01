import { LitElement, html, css } from 'lit-element';

export class PokemonCard extends LitElement {
  constructor() {
    super();
    this.getColors();
    this.index = 1;
    this.getPokemon();
  }

  static styles = css`
    :host {
      display: block;
      text-transform: capitalize;
    }
    .card {
      width: 100%;
      padding: 1.2em;
      background-color: var(--background);
      /* border-radius: 6px; */
    }
    .elementContainer:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }
    .container {
      padding: 2px 8px;
    }
    .elementContainer {
      display: flex;
      flex-direction: row;
      margin-right: 5px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
    }
    .pokeImage {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
    .innerContainer {
      display: flex;
      flex-direction: row;
    }
    ul {
      list-style: none;
    }
    .types {
      margin-left: 1.3em;
      margin-right: 1.3em;
    }
    .typesList {
      margin-right: 1.1em;
    }
    button {
      background-color: var(--background);
      color: black;
      border: none;
      padding: 5px 5px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 32px;
      cursor: pointer;
    }
    .next {
      border-radius: 0 6px 6px 0;
    }
    .prev {
      border-radius: 6px 0 0 6px;
    }
  `;

  static get properties() {
    return {
      pokemon: {
        type: Object,
      },
      index: {
        type: Number,
      },
      colors: {
        type: Array,
      },
      color: {
        type: String,
      },
      background: {
        type: String,
      },
    };
  }

  async getPokemon() {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${this.index}`
    );
    if (response.ok) {
      const poke = await response.json();
      console.log(poke);
      this.pokemon = poke;
      this.colors.map((color) => {
        if (color.type === this.pokemon.types[0].type.name) {
          this.setBackgroundCardColor(color.color);
        }
      });
    } else {
      console.log('Error :v');
    }
  }

  async getColors() {
    let response = await fetch('../colors.json');
    if (response.ok) {
      this.colors = await response.json();
    }
  }

  getNextPokemon() {
    this.index++;
    this.getPokemon();
    console.log(this.index);
  }

  getPreviousPokemon() {
    if (this.index >= 1) {
      this.index--;
      this.getPokemon();
      console.log(this.index);
    }
  }

  setBackgroundCardColor(value) {
    this.style.setProperty('--background', value);
  }

  render() {
    return html`
      <div class="elementContainer">
        <button @click="${this.getPreviousPokemon}" class="prev"><</button>
        <div class="card">
          <div class="buttonContainer">
            <img
              src="${this.pokemon.sprites.front_default}"
              alt="PokeImage"
              id="pokeImage"
              class="pokeImage"
            />
          </div>
          <div class="container">
            <h2 class="pokeName">${this.pokemon.name}</h2>
            <div class="innerContainer">
              <div class="types">
                <p>Type(s):</p>
                <ul class="typesList">
                  <li>
                    ${this.pokemon.types.map((type) => {
                      return html`<li>${type.type.name}</li>`;
                    })}
                  </li>
                </ul>
              </div>
              <div class="types">
                <p>Stats:</p>
                <ul class="typesList">
                  <li>
                    Height:
                    ${this.pokemon.height >= 10
                      ? `${this.pokemon.height / 10}m`
                      : `${this.pokemon.height * 10}cm`}
                  </li>
                  <li>
                    Weight:
                    ${this.pokemon.weight > 10
                      ? `${this.pokemon.weight / 10}kg`
                      : `${this.pokemon.weight * 10}g `}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <button @click="${this.getNextPokemon}" class="next">></button>
      </div>
    `;
  }
}
customElements.define('pokemon-card', PokemonCard);

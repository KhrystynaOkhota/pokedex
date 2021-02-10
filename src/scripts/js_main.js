let front = {
    pokemonList: document.getElementById('pokemon-catalog'),
    next: '',
    colorTypes: {
        normal: 'darkseagreen',
        fire: 'orange',
        fighting: 'darkred',
        water: 'blue',
        flying: 'bisque',
        grass: 'green',
        poison: 'purple',
        electric: 'yellow',
        ground: 'darkgoldenrod',
        psychic: 'pink',
        rock: 'darkbrown',
        ice: 'ghostwhite',
        bug: 'khaki',
        dragon: 'dodgerblue',
        ghost: 'indigo',
        dark: 'saddlebrown',
        steel: 'darkgray',
        faire: 'salmon'
    },


    init: function () {

        this.events();
    },

    createElement: function (name, className, text) {
        let element = document.createElement(name);

        if (className) {
            element.className = className;
        }
        if (text) {
            element.textContent = text;
        }

        return element;
    },
    createImg: function (src) {
        const image = this.createElement('img', 'pokemon-image');
        image.setAttribute('src', src);
        return image;
    },
    makeRequest: function (url, method, json) {
        return new Promise((resolve, reject) => {


            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);

            if (method === 'GET') {
                xhr.send();
            }

            if (method === 'PUT') {
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.send(json);
            }

            if (method === 'DELETE') {
                xhr.send(null);
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }

                if (this.readyState === 4 && this.status === 200) {

                    try {
                        const response = JSON.parse(this.responseText);
                        resolve(response);
                    } catch (e) {
                        console.log(e);
                    }
                } else {

                    reject(xhr.responseText);
                    console.log(xhr.responseText);
                }
            }
        });
    },

    getId: function (url) {
        return url.substring(34, url.length - 1);
    },


    getPokemon: function () {
        fetch('https://pokeapi.co/api/v2/pokemon/?limit=12')
            .then(response => response.json())
            .then(function (listPokemon) {
                front.next = `${listPokemon.next}`;
                listPokemon.results.forEach(function (pokemon) {
                    front.getPokemonDetail(pokemon);
                })
            })
    },
    getPokemonDetail: function (pokemon) {
        let url = pokemon.url
        fetch(url)
            .then(response => response.json())
            .then(function (pokeData) {
                front.renderPokemonsList(pokeData)
            })
    },

    renderPokemonsList: function (pokeData) {

        const column = front.createElement(`div`, `column col-xl-4 col-lg-6 col-md-6 col-xs-12`, ``);
        front.pokemonList.appendChild(column);

        const item = front.createElement(`div`, `pokemon-catalog__item`, ``);
        column.appendChild(item);

        const icon = front.createElement(`div`, `pokemon-catalog__item--icon`, ``);
        item.appendChild(icon);

        const img = front.createImg(`https://pokeres.bastionbot.org/images/pokemon/${pokeData.id}.png`)
        icon.appendChild(img);


        const pokemonName = document.createElement('h4');
        pokemonName.setAttribute('class', 'pokemon-catalog__item--name');

        const pokemonNameLink = document.createElement('a');
        pokemonNameLink.setAttribute('href', '#');
        pokemonName.appendChild(pokemonNameLink);

        const pokemonNameLinkText = document.createTextNode(`${pokeData.name}`);
        pokemonNameLink.appendChild(pokemonNameLinkText);
        item.appendChild(pokemonName);

        const listType = document.createElement('ul');
        listType.setAttribute('class', 'list-type d-flex align-left');
        item.appendChild(listType);
        pokeData.types.forEach((type) => {


            listType.innerHTML += `
          
                 <li class="list-type__item" style="background:  ${front.colorTypes[type.type.name]}">
                     ${type.type.name}
                 </li>`;


        });


        pokemonNameLink.addEventListener('click', function (event) {
            front.showPokemonsDetails(pokeData);
        });

    },

    showMorePokemons: function () {
        front.makeRequest(`${front.next}`, 'GET')
            .then(responsePokemonList => {

                front.next = `${responsePokemonList.next}`;
                console.log(front.next);
                responsePokemonList.results.forEach(function (pokemon) {
                    front.getPokemonDetail(pokemon);
                })
            })

            .catch(error => console.log(error));
    },

    showPokemonsDetails: function (pokemon) {
        console.log(pokemon);
        let list = document.getElementById("pokemon-card");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }

        let stats;


        const pokemonList = document.getElementById('pokemon-card');


        stats = pokemon.stats;

        const pokemonCard = document.createElement('div');
        pokemonCard.setAttribute('class', 'pokemon-card');
        pokemonList.appendChild(pokemonCard);


        const icon = front.createElement(`div`, `pokemon-catalog__item--icon`, ``);
        pokemonCard.appendChild(icon);

        const img = front.createImg(`https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`)
        icon.appendChild(img);


        const pokemonName = document.createElement('h4');
        pokemonName.setAttribute('class', 'pokemon-card__name');

        const pokemonNameLink = document.createElement('a');
        pokemonNameLink.setAttribute('href', '#');
        pokemonName.appendChild(pokemonNameLink);

        const pokemonNameLinkText = document.createTextNode(` ${pokemon.name} # ${pokemon.id.toString()} `);
        pokemonNameLink.appendChild(pokemonNameLinkText);
        pokemonCard.appendChild(pokemonName);

        const listCharacteristics = document.createElement('div');
        listCharacteristics.setAttribute('class', 'list-characteristics');
        pokemonCard.appendChild(listCharacteristics);

        listCharacteristics.innerHTML += `


           <div class="list-characteristics__item  d-flex align-justify align-middle">
               <div class="list-characteristics__item--name">
                 Type
               </div>
               <div class="list-characteristics__item--value">
                 Fire
               </div>
           </div>
       `;

        stats.forEach((stat) => {

            listCharacteristics.innerHTML += `


           <div class="list-characteristics__item d-flex align-justify align-middle">
               <div class="list-characteristics__item--name">
              ${stat.stat.name}
               </div>
               <div class="list-characteristics__item--value">
                   ${stat.base_stat}
               </div>
           </div>
       `;

        });
        listCharacteristics.innerHTML += `


           <div class="list-characteristics__item  d-flex align-justify align-middle">
               <div class="list-characteristics__item--name">
              Weight
               </div>
               <div class="list-characteristics__item--value">
                  ${pokemon.weight}
               </div>
           </div>
           <div class="list-characteristics__item d-flex align-justify align-middle">
               <div class="list-characteristics__item--name">
              Total moves
               </div>
               <div class="list-characteristics__item--value">
                  ${pokemon.moves.length}
               </div>
           </div>
      `;


    },


    events: function () {
        front.getPokemon();
    }
};


front.init();

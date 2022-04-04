import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TYPE_COLORS = {
    bug: 'B1C12E',
    dark: '4F3A2D',
    dragon: '755EDF',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '823551',
    fire: 'E73B0C',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236',
    ground: 'D3B357',
    ice: 'A3E7FD',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    steel: 'B5B5C3',
    water: '3295F6'
};

const Pokemon = () => {
    const { pokemonIndex } = useParams();
    const [imageURL, setImageURL] = useState('');
    const [name, setName] = useState('');
    const [types, setTypes] = useState([]);
    const [description, setDescription] = useState('');
    const [stats, setStats] = useState({});
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [abilities, setAbilities] = useState([]);
    const [genderRatioFemale, setGenderRatioFemale] = useState(0);
    const [genderRatioMale, setGenderRatioMale] = useState(0);
    const [catchRate, setCatchRate] = useState(0);
    const [eggGroups, setEggGroups] = useState(0);
    const [hatchSteps, setHatchSteps] = useState(0);
    const [evs, setEvs] = useState('');
    
    useEffect(() => {
        const getInfo = async () => {
            const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
            const pokemonSpeciesURL = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;
            const pokemonRes = await axios.get(pokemonURL);

            let { hp, attack, defense, speed, specialAttack, specialDefense } = '';

            pokemonRes.data.stats.map(stat => {
                switch(stat.stat.name) {
                    case 'hp':
                        hp = stat['base_stat'];
                        break;
                    case 'attack':
                        attack = stat['base_stat'];
                        break;
                    case 'defense':
                        defense = stat['base_stat'];
                        break;
                    case 'speed':
                        speed = stat['base_stat'];
                        break;
                    case 'special-attack':
                        specialAttack = stat['base_stat'];
                        break;
                    case 'special-defense':
                        specialDefense = stat['base_stat'];
                        break;
                    default: break;
                }
                return 0;
            });

            const types = pokemonRes.data.types.map(type => type.type.name);

            const abilities = pokemonRes.data.abilities.map(ability => {
                return ability.ability.name
                    .toLowerCase().split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
            }).join(', ');

            const evs = pokemonRes.data.stats.filter(stat => {
                if(stat.effort > 0) return true;
                else return false;
            }).map(stat => {
                return `${stat.effort} ${stat.stat.name
                    .toLowerCase().split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')
                }`;
            }).join(', ');

            await axios.get(pokemonSpeciesURL).then(res => {
                let description = '';

                res.data.flavor_text_entries.some(flavor => {
                    if(flavor.language.name === 'en') {
                        description = flavor.flavor_text;
                        return 0;
                    }
                    return 0;
                });

                const femaleRate = res.data['gender_rate'];
                const genderRatioFemale = 12.5 * femaleRate;
                const genderRatioMale = 12.5 * (8 - femaleRate);

                const catchRate = Math.round((100/255) * res.data['capture_rate']);

                const eggGroups = res.data['egg_groups'].map(group => {
                    return group.name.toLowerCase().split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');
                }).join(', ');

                const hatchSteps = 255 * (res.data['hatch_counter'] + 1);

                setDescription(description);
                setGenderRatioFemale(genderRatioFemale);
                setGenderRatioMale(genderRatioMale);
                setCatchRate(catchRate);
                setEggGroups(eggGroups);
                setHatchSteps(hatchSteps);
            });
            
            setTypes(types);
            setHeight(pokemonRes.data.height / 10);
            setWeight(pokemonRes.data.weight / 10);
            setImageURL(pokemonRes.data.sprites.front_default);
            setName(pokemonRes.data.name);
            setStats({
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense,
            });
            setAbilities(abilities);
            setEvs(evs);
        }

        getInfo();
    }, [pokemonIndex]);

    return (
        <div className='col'>
            <div className='card'>
                <div className='card-header'>
                    <div className='row'>
                        <div className='col-5'>
                            <h5>{pokemonIndex}</h5>
                        </div>
                        <div className='col-7'>
                            <div style={{float: 'right'}}>
                                {types.map((type, key) => (
                                    <span
                                        key={key}
                                        className='badge badge-primary badge-pill mr-1'
                                        style={{
                                            backgroundColor: `#${TYPE_COLORS[type]}`,
                                            color: 'white'
                                        }}
                                    >
                                        {
                                            type.toLowerCase().split('-')
                                            .map(s => s.charAt(0)
                                                .toUpperCase() + s.substring(1)
                                            )
                                            .join(' ')
                                        }
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card-body'>
                    <div className='row align-items-center'>
                        <div className='col-md-3'>
                            <img
                                src={imageURL}
                                className='card-img-top rounded mx-auto mt-2'
                                alt='Pokemon'
                            />
                        </div>
                        <div className='col-md-9'>
                            <h4 className='mx-auto'>
                                {
                                    name.toLowerCase().split('-')
                                    .map(
                                        s => s.charAt(0)
                                        .toUpperCase() + s.substring(1)
                                    )
                                    .join(' ')
                                }
                            </h4>

                            <div className='row align-items-center'>
                                <div className='col-12 col-md-3'>HP</div>
                                <div className='col-12 col-md-9'>
                                    <div className='progress'>
                                        <div
                                            className='progress-bar'
                                            role='progressbar'
                                            style={{width: `${stats.hp}%`}}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            <small>{stats.hp}%</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row align-items-center'>
                                <div className='col-12 col-md-3'>Attack</div>
                                <div className='col-12 col-md-9'>
                                    <div className='progress'>
                                        <div
                                            className='progress-bar'
                                            role='progressbar'
                                            style={{width: `${stats.attack}%`}}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            <small>{stats.attack}%</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row align-items-center'>
                                <div className='col-12 col-md-3'>Defense</div>
                                <div className='col-12 col-md-9'>
                                    <div className='progress'>
                                        <div
                                            className='progress-bar'
                                            role='progressbar'
                                            style={{width: `${stats.defense}%`}}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            <small>{stats.defense}%</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row align-items-center'>
                                <div className='col-12 col-md-3'>Speed</div>
                                <div className='col-12 col-md-9'>
                                    <div className='progress'>
                                        <div
                                            className='progress-bar'
                                            role='progressbar'
                                            style={{width: `${stats.speed}%`}}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            <small>{stats.speed}%</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row align-items-center'>
                                <div className='col-12 col-md-3'>Special Attack</div>
                                <div className='col-12 col-md-9'>
                                    <div className='progress'>
                                        <div
                                            className='progress-bar'
                                            role='progressbar'
                                            style={{width: `${stats.specialAttack}%`}}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            <small>{stats.specialAttack}%</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row align-items-center'>
                                <div className='col-12 col-md-3'>Special Defense</div>
                                <div className='col-12 col-md-9'>
                                    <div className='progress'>
                                        <div
                                            className='progress-bar'
                                            role='progressbar'
                                            style={{width: `${stats.specialDefense}%`}}
                                            aria-valuenow='25'
                                            aria-valuemin='0'
                                            aria-valuemax='100'
                                        >
                                            <small>{stats.specialDefense}%</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-1'>
                                <div className='col'>
                                    <p className='p-2'>{description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='card-body'>
                        <h5 className='card-title text-center'>Profile</h5>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'right'}}>Height:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'left'}}>{height} m</h6>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'right'}}>Weight:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'left'}}>{weight} kg</h6>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'right'}}>Catch Rate:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'left'}}>{catchRate}%</h6>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'right'}}>Gender Ratio:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='progress'>
                                            <div
                                                className='progress-bar'
                                                role='progressbar'
                                                style={{
                                                    width: `${genderRatioFemale}%`,
                                                    backgroundColor: '#C2185B'
                                                }}
                                                aria-valuenow='15'
                                                aria-valuemin='0'
                                                aria-valuemax='100'
                                            >
                                                <small>{genderRatioFemale}</small>
                                            </div>

                                            <div
                                                className='progress-bar'
                                                role='progressbar'
                                                style={{
                                                    width: `${genderRatioMale}%`,
                                                    backgroundColor: '#1976D2'
                                                }}
                                                aria-valuenow='15'
                                                aria-valuemin='0'
                                                aria-valuemax='100'
                                            >
                                                <small>{genderRatioMale}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='col-md-6'>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'right'}}>Egg Groups:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'left'}}>{eggGroups}</h6>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'right'}}>Hatch Steps:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'left'}}>{hatchSteps}</h6>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'right'}}>Abilities:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'left'}}>{abilities}</h6>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'right'}}>EVs:</h6>
                                    </div>
                                    <div className='col-md-6'>
                                        <h6 style={{float: 'left'}}>{evs}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card-footer text-muted'>
                    Data From <a
                        href='https://pokeapi.co/'
                        target='_blank'
                        rel='noreferrer'
                        className='card-link'
                        >
                            PokeAPI.co
                        </a>
                </div>
            </div>
        </div>
    )
}

export default Pokemon;

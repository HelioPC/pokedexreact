type Stats = {
    base_stat: number
    effort: number
    stat: {
        name: string
    }
}

export type Species = {
    flavor_text_entries: {
        flavor_text: string
        language: {
            name: string
        }
    }[]
    gender_rate: number
    capture_rate: number
    eggg_groups: {
        name: string
    }[]
    hatch_counter: number
    color: {
        name: string
    }
    evolution_chain: {
        url: string
    }
}

export type Type = {
    name: string
    damage_relations: {
        double_damage_to: {
            name: string
        }[]
        double_damage_from: {
            name: string
        }[]
        half_damage_to: {
            name: string
        }[]
        half_damage_from: {
            name: string
        }[]
        no_damage_to: {
            name: string
        }[]
        no_damage_from: {
            name: string
        }[]
    }
    pokemon: {
        pokemon: {
            name: string
            url: string
        }
        slot: number
    }[]
}

export type Pokemon = {
    id: number
    name: string
    height: number
    weight: number
    abilities: {
        ability: {
            name: string
        }
    }[]
    types: {
        type: {
            name: string
        }
    }[]
    stats: Stats[]
    sprites: {
        back_default: string
        back_female: string
        back_shiny: string
        back_shiny_female: string
        front_default: string
        front_female: string
        front_shiny: string
        front_shiny_female: string
    }
}

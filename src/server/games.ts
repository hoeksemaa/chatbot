export interface GameConfig {
    id: string
    city: string
    year: string
    image: string
    worldDescription: string
    goal: string
    openingNarration: string
}

export const GAMES: GameConfig[] = [
    {
        id: "pompeii",
        city: "Pompeii",
        year: "79 AD",
        image: "/assets/pompeii.png",
        worldDescription: `Pompeii, morning of August 24th, 79 AD. Roman resort town, 11,000 people, Bay of Naples. Vesuvius rumbling for days — no one alive has seen it erupt. Ground shakes. Dogs uneasy. Forum fountain stopped flowing yesterday.

The city runs on routine: merchants, gladiators, politicians, bathhouses, an amphitheater show tonight. Rutted stone streets, raised crosswalks over sewage, frescoed villas beside cramped rooms above shops.

Key locations: the Forum, the Temple of Apollo, the amphitheater, the Villa of the Mysteries, the port at the Marina Gate, the necropolis outside the Herculaneum Gate, the Stabian Baths, and Vesuvius itself.

CLUE LOCATION — The Temple of Apollo: a mosaic on the floor near the inner sanctum depicts Vesuvius with fire pouring from its peak and tiny figures fleeing toward the sea. Most priests dismiss it as decorative myth. But the mosaic is ancient — far older than the temple itself. If the player examines it or asks about it, this is a major hint that the mountain is dangerous and the sea is the way out.

CLUE PERSON — Lucia, an old fisherman's widow who sells dried herbs near the Marina Gate. She remembers her grandmother's stories about "the mountain that swallowed the sky." She has been telling anyone who will listen that the tremors mean death is coming, but everyone thinks she's mad. If the player talks to her, she will urge them to leave by sea immediately and mention that her grandson Marcus has a boat at the port — but Marcus won't leave without his wife, who is at the Stabian Baths.

The eruption timeline (DM knowledge only, the player should discover urgency through the world):
- Morning: tremors, dead birds, dry fountains, sulfur smell near the mountain
- Midday: a loud boom from Vesuvius, a column of smoke rises, ash begins to fall lightly
- Afternoon: sky darkens, pumice rains down, buildings start to collapse, panic in the streets
- Evening: pyroclastic surges. Everyone still in the city dies.
As the game progresses, escalate through these stages. Once the player escapes the city gates or reaches open water, trigger the final eruption behind them.`,
        goal: "Escape the city of Pompeii before Vesuvius erupts. The player wins when they pass beyond the city walls or reach open water. When they escape, describe the eruption happening behind them as a dramatic finale.",
        openingNarration: `You wake above a thermopolium to the smell of lentil stew and a crack in the wall that wasn't there yesterday. The ground trembles. Your clay cup slides across the table. What do you do?`
    },
    {
        id: "kowloon",
        city: "Kowloon Walled City",
        year: "1987",
        image: "/assets/kwc.png",
        worldDescription: `Kowloon Walled City, Hong Kong, 1987. Six acres, 33,000 people, 350 interconnected buildings. No government, no building codes, no sunlight at ground level.

Fluorescent corridors, dripping pipes, staircases that dead-end into living rooms. Unlicensed dentists, noodle factories, opium dens. Rooftops are the only open air. Mail carriers know every corridor, triads run the gambling floors, strangers get noticed immediately.

SPATIAL LAYOUT — The Walled City is roughly rectangular. The player starts on the EAST SIDE (near the perimeter entrance off Tung Tau Tsuen Road). The old Yamen courthouse sits in the CENTER of the city, ground level. To get there, the player must navigate west through the labyrinth. Always give the player a sense of where they are relative to the Yamen: east side, mid-east corridors, central block, etc. Mention landmarks to orient them — the fish ball factory on the 3rd floor east side, the rooftop pigeon coops, the flooded stairwell near the center, the neon-lit gambling den on the 5th floor mid-block.

Key locations from east to center:
- EAST PERIMETER: the entrance from Tung Tau Tsuen Road, a bright seam of daylight. Hawker stalls, a barber, the last point where normal Hong Kong exists.
- EAST INTERIOR (floors 3-8): residential corridors, a fish ball factory that stinks of hot oil, Dr. Pang's unlicensed dental clinic (always has a queue).
- MID-BLOCK (floors 1-10): the gambling den on floor 5 (triad-run, red neon, mah-jong clatter), a Taoist shrine wedged between two stairwells on floor 2, the main water pipe junction.
- CENTRAL BLOCK (ground level): the old Yamen courthouse — a crumbling Qing Dynasty stone building, the only original structure. It's dark, partially flooded, and most residents avoid it. Madam Ng lives here.

CLUE LOCATION — The Taoist shrine on floor 2, mid-block: a faded ink painting on the wall behind the incense shows the Yamen as it looked a hundred years ago, with a woman standing at its gate. If the player examines it, the shrine keeper (a quiet man named Siu) will say "She's still there, you know. She never left." This hints that someone still lives at the Yamen.

CLUE PERSON — Fat Bo, a mail carrier who works the east corridors. He's the only person in KWC who delivers to the Yamen. He's chatty, sweaty, and carries a canvas bag full of letters. If the player asks him for directions or mentions the Yamen, he'll say he just delivered a letter there yesterday and can point the way — but warns them the route through mid-block is bad right now because of flooding on the ground floor. He suggests going up to floor 6 and cutting across the rooftops to drop down into the central block from above.

The Hong Kong government has just announced plans to demolish the Walled City. Residents are anxious. Rumors swirl that someone is buying up floors by force.`,
        goal: "Deliver the sealed message to Madam Ng at the old Yamen courthouse in the center of the Walled City. The player wins when they physically hand the message to Madam Ng. She is elderly, sharp-eyed, and will not accept the message from anyone who seems untrustworthy — the player may need to earn her trust.",
        openingNarration: `One step off Tung Tau Tsuen Road and the sun is gone. Fluorescent hum, fish ball grease, dripping pipes. You've got a red wax envelope in your jacket — deliver it to "Madam Ng at the Yamen." The corridor splits three ways: left into darkness, straight toward factory clatter, right toward a staircase marked "Dr. Pang, Dentist, 4th Floor East."`
    }
]

export function getGameById(id: string): GameConfig | undefined {
    return GAMES.find(game => game.id === id)
}

export function buildSystemPrompt(config: GameConfig): string {
    return `You are the Dungeon Master for a text-based adventure set in ${config.city}, ${config.year}. Your voice is terse, vivid, and improvisational.

## World
${config.worldDescription}

## The Goal (DM KNOWLEDGE ONLY — do NOT reveal directly)
${config.goal}

The player discovers their goal through the world. Don't state it. Most details are just world — clues are rare and earned, not in every response.

## Style

BREVITY IS THE RULE. This game is played on a phone screen. Most responses: 1-3 sentences. Never more than 2 short paragraphs, and that should almost never happen. If the player does something simple, one sentence.

- **Bold** clues and discoverable details — things the player might examine or follow up on. At most one bold per response. Most responses have zero.
- If the player is genuinely stuck, the world can nudge — but only then. Most of the time, just describe what's there.
- Reward curiosity and creativity. Unexpected choices work.
- NPCs have names and agendas. They're people, not quest dispensers.
- The world has a clock. Tension escalates whether the player acts or not. Consequences are real.
- Never break character. You are the DM, full stop.

Example exchange:
Player: "look around"
DM: "Cracked plaster, a shuttered window. Something scratches behind the **far wall**."
Player: "go downstairs"
DM: "The stairs groan under you — a man at the counter looks up, mid-sentence, and stops talking."
Player: "talk to him"
DM: "He shakes his head and leaves through the back door."

## Victory Condition
When the player fully achieves their goal, end with a dramatic conclusion. Place [VICTORY] as the very last line. Only for complete, unambiguous victory.`
}
// TODO: remmber to add attacker

module.exports.CREEPROLES = {
    harvester: [
        [CARRY, WORK, MOVE],
        [MOVE,MOVE,CARRY,CARRY,WORK,WORK],
        [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK],
    ],
    upgrader: [
        [CARRY, WORK, MOVE],
        [MOVE,MOVE,CARRY,CARRY,WORK,WORK],
        [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK],
    ],
    builder: [
        [CARRY, WORK, MOVE],
        [MOVE,MOVE,CARRY,CARRY,WORK,WORK],
        [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK],
    ],
    repairer: [
        [CARRY, WORK, MOVE],
        [MOVE,MOVE,CARRY,CARRY,WORK,WORK],
        [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK],
    ],
    defender: [
        [MOVE,ATTACK],
        [MOVE,MOVE,ATTACK,ATTACK],
        [MOVE,MOVE,ATTACK,ATTACK,MOVE,ATTACK],
        [MOVE,MOVE,ATTACK,ATTACK,MOVE,ATTACK,MOVE,MOVE,ATTACK],
        [MOVE,MOVE,ATTACK,ATTACK,MOVE,ATTACK,MOVE,MOVE,ATTACK]
    ],
    attacker: [
        [MOVE,ATTACK],
        [MOVE,MOVE,ATTACK,ATTACK],
        [MOVE,MOVE,ATTACK,ATTACK,MOVE,ATTACK],
        [MOVE,MOVE,ATTACK,ATTACK,MOVE,ATTACK,MOVE,MOVE,ATTACK],
        [MOVE,MOVE,ATTACK,ATTACK,MOVE,ATTACK,MOVE,MOVE,ATTACK]
    ],
    cleaner: [
        [MOVE,MOVE,WORK],
        [MOVE,MOVE,WORK,WORK],
        [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK],
        [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK]
    ],
    wallbreaker: [
        [MOVE,MOVE,WORK],
        [MOVE,MOVE,WORK,WORK],
        [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK],
        [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
    ],
    mover: [
        [CARRY, WORK, MOVE],
        [MOVE,MOVE,CARRY,CARRY,MOVE,MOVE,WORK],
        [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,WORK],
    ],
    scout: [
        [MOVE,MOVE,MOVE],
        [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
    ],
    rangedbuilder: [
        [CARRY, WORK, MOVE],
        [MOVE,MOVE,CARRY,CARRY,WORK,WORK],
        [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK],
    ]
}

module.exports.SIGN_TEXTS = [
    `Whether up against elves or gods,『　』never loses.`,
    `Pledge 1: All murder, war, and robbery are forbidden in this world.`,
    `Pledge 2: All conflict in this world will be resolved through games.`,
    `Pledge 3: In games, each player will bet something that they agree is of equal value.`,
    `Pledge 4:As long as it doesn't violate pledge three,anything may be bet,and any game be played`,
    `Pledge 5: The challenged party has the right to decide the rules of the game.`,
    `Pledge 6: Any bets made in accordance with the pledges must be upheld.`,
    `Pledge 7: Conflicts between groups will be conducted by representatives with absolute authority.`,
    `Pledge 8: Being caught cheating during a game is grounds for an instant loss.`,
    `Pledge 9: In the name of god, the previous rules may never be changed. `,
    `Pledge 10: Let's all have fun and play together!`,
]
    


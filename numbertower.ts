enum TowerBlockType {
    PERSON = "person",
    DRINK = "drink",
    DIVISION = "division",
    MULTIPLICATION = "multiplication",
};

type TowerBlock = {
    type: TowerBlockType,
    value: number,
};

type Tower = TowerBlock[];

var towers: Tower[] = [
    [
        {type: TowerBlockType.PERSON, value: 196},
        {type: TowerBlockType.PERSON, value: 556},
        {type: TowerBlockType.PERSON, value: 308},
    ],
    [
        {type: TowerBlockType.DIVISION, value: 3},
        {type: TowerBlockType.PERSON, value: 1221},
        {type: TowerBlockType.DIVISION, value: 2},
        {type: TowerBlockType.PERSON, value: 838},
    ],
    [
        {type: TowerBlockType.PERSON, value: 165},
        {type: TowerBlockType.DRINK, value: -777},
        {type: TowerBlockType.PERSON, value: 777},
        {type: TowerBlockType.MULTIPLICATION, value: 2},
        {type: TowerBlockType.DIVISION, value: 5},
    ],
    [
        {type: TowerBlockType.PERSON, value: 636},
    ],
];

export {}
declare global {
    interface Array<T>  {
        withoutIndex(index: number): T[];
    }
}

Object.defineProperty(Array.prototype, "withoutIndex", {
    value: function y<T>(this: T[], index: number): T[] {
        var ret = this.slice();
        ret.splice(index, 1);
        return ret;
    }
})

function calculateBlock(block: TowerBlock, value: number): number {
    switch (block.type) {
        case TowerBlockType.DIVISION:
            return Math.floor(value / block.value);
        case TowerBlockType.MULTIPLICATION:
            return value * block.value;
        case TowerBlockType.DRINK:
            return value + block.value;
        case TowerBlockType.PERSON:
            if (value > block.value) {
                return value + block.value;
            } else {
                return value - block.value;
            }
    }
}

type TowerBlockHistory = TowerBlock & {
    start: number,
    result: number,
}

function bestResultForTower(
    tower: Tower,
    value: number,
    previousBlocks: TowerBlockHistory[] = [],
    depth: number = 1,
): {
    result: number,
    workingBlocks: TowerBlockHistory[],
} {
    var blocks = previousBlocks.slice()
    var towerX = tower.slice();

    // console.group("Depth " + depth)
    // console.log({tower: towerX, value, previous: blocks})


    if (tower.length === 0) {
        // blocks.at(-1).t = depth
        // console.log("at end", value, blocks)
        // console.groupEnd()
        return {
            result: value,
            workingBlocks: blocks,
        }
    }

    var positiveTowers: {
        result: number, workingBlocks: TowerBlockHistory[]
    }[] = [];

    for (let blockIndex = 0; blockIndex < towerX.length; blockIndex++) {
        const block = towerX[blockIndex];
        const valueWithBlock = calculateBlock(block, value)
        var rest = towerX.withoutIndex(blockIndex)

        // console.log("Value is", valueWithBlock)

        if (valueWithBlock >= 0) {
            // console.log("⎿ Continue, block was", block, blocks)
            var b2 = blocks.slice()
// console.log("get rest of tower for", value, "and", block, "equaling", valueWithBlock, "and", rest)
            b2.push({start: value, ...block, result: valueWithBlock})
            const {result, workingBlocks} = bestResultForTower(rest, valueWithBlock, b2, depth + 1)
            // console.log(blockIndex, valueWithBlock)
            // console.log("wb", depth, workingBlocks, blocks)
            // if (block.type !== TowerBlockType.DIVISION) { console.log("HMMMMM") }
            positiveTowers.push({result, workingBlocks: workingBlocks.slice()})
        } else {
            // console.log(value, "with block", block, "ends at", valueWithBlock)
            // towerResults.push(valueWithBlock)

            // console.log("⎿ End of Tree, block was", block)
        }
    }

    console.groupEnd()


    if (positiveTowers.length > 0) {
        const u = positiveTowers.sort((tower1, tower2) => {
            return tower2.result - tower1.result
        })[0]
        // if (depth === 1) {
        //     console.log("POSITIVE TOWERS", depth)
        //     console.dir(positiveTowers, {depth: null})
        // }
        return u
    } else {
        // console.log({towerX, value})
        return {
            result: 0,
            workingBlocks: [],
        }
    }
}

var current: number = 236;
console.log("Start", current)

const bRFT1 = bestResultForTower(towers[0], current)
console.log("bRFT 1", bRFT1)
const bRFT2 = bestResultForTower(towers[1], bRFT1.result)
console.log("bRFT 2", bRFT2)
const bRFT3 = bestResultForTower(towers[2], bRFT2.result)
console.log("bRFT 3", bRFT3)
const bRFT4 = bestResultForTower(towers[3], bRFT3.result)
console.log("bRFT 4", bRFT4)

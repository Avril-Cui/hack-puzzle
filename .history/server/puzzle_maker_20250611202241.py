import random
import json
import uuid

CELL_SIZE = 100
COPIES_PER_ICON = 6

# exactly the same pools as in React
SCENE_RANGES = [(2, 6), (1, 6), (1, 7), (0, 7), (0, 8)]
OFFSETS      = [0, 25, -25, 50, -50]
ICON_TYPES   = [f"icons{i}" for i in range(10)]

def random_position(offset_pool, range_pair):
    offset = random.choice(offset_pool)
    row    = random.randint(range_pair[0], range_pair[1])
    col    = random.randint(range_pair[0], range_pair[1])
    return col * CELL_SIZE + offset, row * CELL_SIZE + offset

def generate_scene(level=1):
    # pick your grid‐bounds & offset pool just like React
    range_pair  = SCENE_RANGES[min(4, level - 1)]
    offset_pool = OFFSETS[: 1 + level]
    # initial icon pool: first 2*level types
    icon_pool   = ICON_TYPES[: 2 * level]

    # expand every 5 levels
    cmp_level = level
    while cmp_level > 5:
        extra = min(10, 2 * (cmp_level - 5))
        icon_pool += ICON_TYPES[:extra]
        cmp_level -= 5

    scene = []
    # for each icon in pool, create 6 tiles at random spots
    for icon in icon_pool:
        for _ in range(COPIES_PER_ICON):
            x, y = random_position(offset_pool, range_pair)
            scene.append({
                "id":       str(uuid.uuid4())[:6],
                "x":        x,
                "y":        y,
                "status":   0,
                "isCover":  False,
                "iconName": icon
            })

    # **do not** shuffle—React uses the array index itself as “z‐order”
    return scene

if __name__ == "__main__":
    level = 20
    scene = generate_scene(level)
    with open("scene.json", "w") as f:
        json.dump(scene, f, indent=2)
    print(f"Generated scene.json for level {level}")
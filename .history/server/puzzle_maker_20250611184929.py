import random
import json
import uuid

GRID_SIZE = 8
CELL_SIZE = 100
ICON_NUM = 10
ICON_TYPES = [f"icon_{i}" for i in range(ICON_NUM)]  # allow large pool
COPIES_PER_ICON = 6

OFFSETS = [0, 25, -25, 50, -50]
SCENE_RANGES = [(2,6),(1,6),(1,7),(0,7),(0,8)]

def rand_pos(offsets, row_range):
    o = random.choice(offsets)
    r = random.randint(*row_range)
    c = random.randint(*row_range)
    return c * CELL_SIZE + o, r * CELL_SIZE + o

def expand_icon_pool(level, base_pool):
    compare_level = level
    result = base_pool[:]
    while compare_level > 0:
        result += base_pool[:min(10, 2 * (compare_level - 5))]
        compare_level -= 5
    return result

def generate_scene(level=1):
    range_index = min(4, level - 1)
    row_range = SCENE_RANGES[range_index]
    offset_pool = OFFSETS[:1 + level]
    base_icon_pool = ICON_TYPES[:2 * level]
    icon_pool = expand_icon_pool(level, base_icon_pool)

    scene = []

    for icon in icon_pool:
        for _ in range(COPIES_PER_ICON):
            x, y = rand_pos(offset_pool, row_range)
            tile = {
                "id": str(uuid.uuid4())[:6],
                "x": x,
                "y": y,
                "z": 0,
                "status": 0,
                "isCover": False,
                "iconName": icon
            }
            scene.append(tile)

    random.shuffle(scene)
    return scene

if __name__ == "__main__":
    level = 20
    scene = generate_scene(level=level)
    with open("scene.json", "w") as f:
        json.dump(scene, f, indent=2)
    print("✅ Puzzle scene generated for level", level)
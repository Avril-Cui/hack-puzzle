import random
import json
import uuid

GRID_SIZE = 8
CELL_SIZE = 100
ICON_TYPES = [f"icon_{i}" for i in range(10)]
COPIES_PER_ICON = 6

OFFSETS = [0, 25, -25, 50, -50]
SCENE_RANGES = [(2,6),(1,6),(1,7),(0,7),(0,8)]

def rand_pos(offsets, row_range):
    o = random.choice(offsets)
    r = random.randint(*row_range) 
    c = random.randint(*row_range)
    return c*CELL_SIZE+o, r*CELL_SIZE+o

def generate_solvable_scene(steps=10, level=3):
    offset_pool = OFFSETS[:1+ level]
    row_range = SCENE_RANGES[min(4, level-1)]
    
    scene = []
    used = {}
    # 1. pick a sequence of icons to match
    icon_seq = [random.choice(ICON_TYPES[:2*level]) for _ in range(steps)]
    
    # 2. place each triple in sequence
    for step_index, icon in enumerate(reversed(icon_seq)):
        z = step_index  # z increases with each later step (placed first)
        for _ in range(3):
            x, y = rand_pos(offset_pool, row_range)
            tile = {
                "id": str(uuid.uuid4())[:6],
                "x": x,
                "y": y,
                "z": z,  # layering control added here ✅
                "status": 0,
                "isCover": False,
                "iconName": icon,
            }
            scene.append(tile)
        used[icon] = used.get(icon, 0) + 3

    # 3. fill remaining tiles (multiples of 3)
    total_tiles = GRID_SIZE * GRID_SIZE
    current = len(scene)
    remaining = total_tiles - (current % 3 + current)

    while remaining > 0:
        icon = random.choice(ICON_TYPES[:2 * level])
        for _ in range(3):
            x, y = rand_pos(offset_pool, row_range)
            scene.append({
                "id": str(uuid.uuid4())[:6],
                "x": x,
                "y": y,
                "z": steps + 1,  # deeper layer
                "status": 0,
                "isCover": False,
                "iconName": icon,
            })
        remaining -= 3

    scene.sort(key=lambda t: t['z'])  # lower z = rendered on top
    return scene


if __name__ == "__main__":
    scene = generate_solvable_scene(steps=20, level=20)
    with open("scene.json", "w") as f:
        json.dump(scene, f, indent=2)
    print("puzzle generated")
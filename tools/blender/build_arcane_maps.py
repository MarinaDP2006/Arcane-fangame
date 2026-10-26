#!/usr/bin/env python3
"""Build two authored Blender city environments and export editable .blend + game-ready GLB.

This runs in Blender's Python. It creates STATIC BAKED ASSETS in Blender; the game does not
generate architecture in Three.js. No external models are downloaded or redistributed.
"""
import math
import os
import random
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "src" / "models" / "maps"
PREVIEW = ROOT / "docs" / "mapa-3d-preview"
MAP_W, MAP_D = 3000.0, 2200.0
PERSON_HEIGHT = 22.0
CITY_POIS = {
    "piltover": {
        "academia": (700, 400), "taller-jayce": (1200, 700),
        "consejo": (2200, 380), "ejecutores": (2650, 800),
        "mansion-kiramman": (500, 1250), "plaza": (1650, 1150),
        "artesanos": (2400, 1350), "hexpuertas": (600, 1950),
        "muelle-stillwater": (2600, 1980), "puente": (1500, 2110),
    },
    "zaun": {
        "puente-zaun": (1500, 90), "fabrica": (650, 330), "foso": (2450, 420),
        "tejados": (1950, 600), "ultima-gota": (800, 1000), "callejones": (1350, 1250),
        "tienda-benzo": (400, 1300), "mercado": (2400, 1100), "sumidero": (850, 1900),
        "escondite-jinx": (1750, 1950), "invernadero": (2090, 1660), "arbol": (2550, 1850),
    },
}


def p3(x, d, z):
    """Game map (x, depth, height) -> Blender coordinates (X, -Y, Z)."""
    return (float(x), -float(d), float(z))


class MeshForge:
    """Baked mesh builder: many detailed architectural parts become material-batched Blender meshes."""
    def __init__(self, collection, materials):
        self.collection = collection
        self.materials = materials
        self.faces = {name: [] for name in materials}

    def face(self, mat, pts):
        self.faces[mat].append([p3(*p) for p in pts])

    def box(self, x, d, z, sx, sd, h, mat, top=None, bottom=None, rot=0.0):
        sx, sd, h = max(sx, .05), max(sd, .05), max(h, .05)
        cr, sr = math.cos(rot), math.sin(rot)
        local = [(-sx/2,-sd/2,0),(sx/2,-sd/2,0),(sx/2,sd/2,0),(-sx/2,sd/2,0),
                 (-sx/2,-sd/2,h),(sx/2,-sd/2,h),(sx/2,sd/2,h),(-sx/2,sd/2,h)]
        pts = []
        for ax, ad, az in local:
            pts.append((x + ax*cr - ad*sr, d + ax*sr + ad*cr, z + az))
        self.face(bottom or mat, [pts[i] for i in (0,3,2,1)])
        self.face(top or mat, [pts[i] for i in (4,5,6,7)])
        for f in ((0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)):
            self.face(mat, [pts[i] for i in f])

    def prism(self, points_xz, depth, thickness, mat, back=None):
        """Extrude a bespoke outline along map depth."""
        front_d, back_d = depth - thickness/2, depth + thickness/2
        front = [(x, front_d, z) for x,z in points_xz]
        rear = [(x, back_d, z) for x,z in points_xz]
        self.face(mat, front)
        self.face(back or mat, list(reversed(rear)))
        for i in range(len(points_xz)):
            j = (i + 1) % len(points_xz)
            self.face(mat, [front[i], rear[i], rear[j], front[j]])

    def cyl(self, x, d, z, radius, height, mat, sides=12, r2=None, top=None):
        r0 = max(radius, .05)
        r1 = r0 if r2 is None else max(r2, .0)
        lower, upper = [], []
        for i in range(sides):
            a = 2*math.pi*i/sides
            lower.append((x + r0*math.cos(a), d + r0*math.sin(a), z))
            upper.append((x + r1*math.cos(a), d + r1*math.sin(a), z+height))
        self.face(mat, list(reversed(lower)))
        if r1 > 0.001:
            self.face(top or mat, upper)
        for i in range(sides):
            j = (i+1) % sides
            self.face(mat, [lower[i], lower[j], upper[j], upper[i]])

    def sphere(self, x, d, z, sx, sd, sz, mat, seg=12, rings=8):
        verts = []
        for j in range(rings+1):
            phi = math.pi*j/rings
            row = []
            for i in range(seg):
                theta = 2*math.pi*i/seg
                row.append((x + sx*math.sin(phi)*math.cos(theta),
                            d + sd*math.sin(phi)*math.sin(theta),
                            z + sz*math.cos(phi)))
            verts.append(row)
        for j in range(rings):
            for i in range(seg):
                k = (i+1) % seg
                self.face(mat, [verts[j][i], verts[j][k], verts[j+1][k], verts[j+1][i]])

    def tube(self, points, radius, mat, sides=7):
        """Taper-free ring tube through hand-laid points (pipes, cables, rails, architectural ribs)."""
        if len(points) < 2:
            return
        rings = []
        for i, (x,d,z) in enumerate(points):
            prev = Vector(p3(*points[max(0, i-1)]))
            nxt = Vector(p3(*points[min(len(points)-1, i+1)]))
            tangent = (nxt - prev).normalized()
            ref = Vector((0,1,0)) if abs(tangent.dot(Vector((0,1,0)))) < .92 else Vector((1,0,0))
            u = tangent.cross(ref).normalized()
            v = tangent.cross(u).normalized()
            center = Vector(p3(x,d,z))
            ring = []
            for j in range(sides):
                a = 2*math.pi*j/sides
                q = center + radius*(u*math.cos(a) + v*math.sin(a))
                # Back to game map coordinates for face()
                ring.append((q.x, -q.y, q.z))
            rings.append(ring)
        for i in range(len(rings)-1):
            for j in range(sides):
                k = (j+1) % sides
                self.face(mat, [rings[i][j], rings[i+1][j], rings[i+1][k], rings[i][k]])

    def ribbon(self, points, width, z, mat, raised=0.0):
        """Baked road/catwalk surface with continuous edges."""
        if len(points) < 2:
            return
        pairs = []
        for i, (x,d) in enumerate(points):
            a = points[max(0,i-1)]
            b = points[min(len(points)-1,i+1)]
            dx, dd = b[0]-a[0], b[1]-a[1]
            ln = math.hypot(dx,dd) or 1
            nx, nd = -dd/ln*width/2, dx/ln*width/2
            pairs.append(((x+nx,d+nd,z+raised),(x-nx,d-nd,z+raised)))
        for i in range(len(pairs)-1):
            self.face(mat, [pairs[i][0], pairs[i+1][0], pairs[i+1][1], pairs[i][1]])

    def arch_window(self, x, d, z, width, height, glass, frame, depth=1.4):
        """Inset arched glazing, mullions and a curved frame on a street-facing facade."""
        spring = z + height*.63
        pts = [(x-width/2, z), (x+width/2, z), (x+width/2, spring)]
        for i in range(7):
            a = math.pi*i/6
            pts.append((x + math.cos(a)*width/2, spring + math.sin(a)*height*.37))
        self.prism(pts, d, depth*.55, glass)
        self.box(x-width/2-1.7, d, z, 3.4, depth, height*.65, frame)
        self.box(x+width/2+1.7, d, z, 3.4, depth, height*.65, frame)
        self.tube([(x-width/2-1,d,z), (x-width/2-1,d,spring)], 1.35, frame, 5)
        self.tube([(x+width/2+1,d,z), (x+width/2+1,d,spring)], 1.35, frame, 5)
        arch = [(x + math.cos(math.pi*i/16)*width/2, d, spring + math.sin(math.pi*i/16)*height*.37) for i in range(17)]
        self.tube(arch, 1.6, frame, 5)
        self.box(x, d-.05, z+height*.31, width*.72, depth*.55, 1.5, frame)

    def paver_grid(self, x0, d0, nx, nd, step, mat, z=1.1):
        for ix in range(nx):
            for iz in range(nd):
                jitter = ((ix*13 + iz*7) % 5) * .45
                self.box(x0 + ix*step + jitter, d0 + iz*step,
                         z, step*.82, step*.82, .8, mat, top=mat)

    def flush(self, city):
        for mat_name, polygons in self.faces.items():
            if not polygons:
                continue
            verts, faces = [], []
            for poly in polygons:
                start = len(verts)
                verts.extend(poly)
                faces.append(tuple(range(start, start+len(poly))))
            mesh = bpy.data.meshes.new(f'{city.upper()}_{mat_name}_mesh')
            mesh.from_pydata(verts, [], faces)
            mesh.update()
            bm = bmesh.new()
            bm.from_mesh(mesh)
            if bm.faces:
                bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            bm.to_mesh(mesh)
            bm.free()
            obj = bpy.data.objects.new(f'{city.upper()}_{mat_name}', mesh)
            self.collection.objects.link(obj)
            obj.data.materials.append(self.materials[mat_name])
            for poly in mesh.polygons:
                poly.material_index = 0
                poly.use_smooth = False
        self.faces = {name: [] for name in self.materials}


def mat(name, color, rough=.7, metal=0.0, emission=None, strength=0.0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1.0)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1.0)
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    if 'Emission Color' in bsdf.inputs:
        bsdf.inputs['Emission Color'].default_value = (*(emission or (0,0,0)), 1.0)
        bsdf.inputs['Emission Strength'].default_value = strength
    elif 'Emission' in bsdf.inputs:
        bsdf.inputs['Emission'].default_value = (*(emission or (0,0,0)), 1.0)
    return m


def make_materials(city):
    if city == 'piltover':
        specs = {
            'stone': ((.64,.55,.39),.83,.03), 'stone_light': ((.82,.73,.54),.77,.03),
            'stone_cool': ((.55,.62,.64),.82,.02), 'gold': ((.62,.36,.075),.29,.8),
            'brass': ((.40,.25,.08),.36,.72), 'copper': ((.16,.35,.31),.36,.62),
            'roof': ((.075,.29,.27),.45,.5), 'roof_light': ((.21,.43,.36),.4,.42),
            'glass_blue': ((.035,.17,.25),.22,.38), 'glass_warm': ((.37,.22,.075),.25,.15),
            'window_glow': ((.95,.62,.21),.24,.08), 'dark': ((.055,.07,.085),.68,.2),
            'road': ((.19,.22,.23),.91,.02), 'paver': ((.44,.39,.30),.9,.01),
            'paver_light': ((.64,.57,.43),.85,.01), 'water': ((.035,.21,.29),.28,.5),
            'cloud': ((.83,.78,.66),.98,0), 'greenery': ((.09,.24,.15),.8,0),
            'blue_glow': ((.08,.35,.65),.26,.2),
        }
    else:
        specs = {
            'stone': ((.105,.14,.13),.92,.08), 'stone_light': ((.19,.22,.2),.9,.05),
            'iron': ((.07,.095,.09),.5,.7), 'iron_light': ((.21,.22,.2),.5,.67),
            'rust': ((.39,.17,.065),.75,.25), 'wood': ((.19,.11,.065),.9,.01),
            'copper': ((.18,.25,.19),.35,.73), 'glass_green': ((.025,.26,.105),.22,.2),
            'neon_green': ((.11,.85,.25),.22,.05), 'neon_pink': ((.78,.045,.23),.25,.05),
            'neon_teal': ((.025,.55,.48),.24,.1), 'window_glow': ((.98,.43,.13),.22,.05),
            'dark': ((.02,.028,.032),.9,.15), 'road': ((.07,.095,.09),.93,.1),
            'paver': ((.14,.16,.14),.9,.04), 'paver_light': ((.22,.21,.17),.85,.1),
            'cave': ((.035,.055,.05),1,0), 'cave_light': ((.075,.1,.078),.98,0),
            'water': ((.065,.25,.11),.26,.35), 'gas': ((.1,.48,.13),.4,.05),
        }
    result = {}
    for key, values in specs.items():
        col, rough, metal = values
        emission = col if key in ('window_glow','blue_glow','neon_green','neon_pink','neon_teal','gas') else None
        strength = .8 if key in ('window_glow','blue_glow') else 2.8 if key.startswith('neon_') else .15 if key == 'gas' else 0
        result[key] = mat(f'{city.title()}_{key}', col, rough, metal, emission, strength)
    return result


def add_building(f, rng, city, x, d, width, depth, height, style=0, detailed=True):
    """One composed building asset: plinth, setbacks, facade bays, cornices, parapets and roof."""
    zaun = city == 'zaun'
    stone = 'stone' if zaun else ('stone_light' if style % 3 == 0 else 'stone')
    trim = 'rust' if zaun else ('gold' if style % 3 else 'brass')
    roof = 'iron' if zaun else ('roof' if style % 2 else 'roof_light')
    glass = 'glass_green' if zaun else ('glass_blue' if style % 2 else 'glass_warm')
    glow = 'window_glow'
    f.box(x, d, 0, width+10, depth+10, 5, trim if not zaun else 'iron')
    current_z = 5
    tiers = 1 + (style % 3 if not zaun else (style % 2))
    remaining_h = max(36, height-15)
    sx, sd = width, depth
    for tier in range(tiers):
        th = remaining_h / tiers
        # Piltover rises in stepped limestone masses; Zaun leans and stacks repaired modules.
        if tier:
            sx *= .83 if not zaun else .88
            sd *= .83 if not zaun else .87
        dx = (rng.random()-.5)*width*.08 if zaun else 0
        dd = (rng.random()-.5)*depth*.08 if zaun else 0
        rot = (rng.random()-.5)*.07 if zaun else 0
        facade = stone if rng.random() < .78 else ('stone_light' if not zaun else 'iron_light')
        f.box(x+dx, d+dd, current_z, sx, sd, th, facade, top=trim if not zaun else 'iron_light', rot=rot)
        # Heavy cornices between every architectural volume.
        band_z = current_z+th-2
        f.box(x+dx, d+dd-sd/2, band_z, sx+3, 3, 3.4, trim if not zaun else 'rust')
        f.box(x+dx, d+dd+sd/2, band_z, sx+3, 3, 3.4, trim if not zaun else 'rust')
        f.box(x+dx-sx/2, d+dd, band_z, 3, sd+3, 3.4, trim if not zaun else 'rust')
        f.box(x+dx+sx/2, d+dd, band_z, 3, sd+3, 3.4, trim if not zaun else 'rust')
        if detailed:
            cols = max(2, int(sx/23))
            rows = max(1, int(th/25))
            win_w = min(12 if not zaun else 14, sx/(cols*1.8))
            win_h = min(19 if not zaun else 15, th/(rows*1.8))
            facade_d = d+dd-sd/2-1.8
            for row in range(rows):
                wz = current_z+9+row*(th-12)/max(rows,1)
                if wz+win_h > current_z+th-3:
                    continue
                for col in range(cols):
                    wx = x+dx-sx/2+(col+.5)*sx/cols
                    if zaun and rng.random() < .22:
                        continue
                    g = glow if rng.random() < (.3 if zaun else .22) else glass
                    f.arch_window(wx, facade_d, wz, win_w, win_h, g, trim if not zaun else 'iron_light')
            # Thick corner pilasters make facades architectural rather than smooth blocks.
            for side in (-1,1):
                f.box(x+dx+side*(sx/2-3), d+dd-sd/2-2.1, current_z+4, 4.4, 3.1, th-8, trim if not zaun else 'iron_light')
            if zaun:
                # External fire escapes, catwalk decks and irregular hanging braces.
                if style % 2 == 0:
                    deck_z = current_z+th*.55
                    f.box(x+dx, d+dd-sd/2-15, deck_z, sx*.94, 23, 3.5, 'iron')
                    for j in range(5):
                        xx = x+dx-sx*.45+j*sx*.225
                        f.box(xx,d+dd-sd/2-27,deck_z+2,2.0,1.6,11,'rust')
                    for j in range(3):
                        f.box(x+dx-sx*.35+j*sx*.35,d+dd-sd/2-8,deck_z+6,2.4,3.0,12,'iron_light')
                # Valve boxes and occasional warning lamps.
                if style % 3 == 0:
                    f.box(x+dx+sx*.25,d+dd-sd/2-3,current_z+th*.35,8,3,10,'rust')
                    f.sphere(x+dx+sx*.25,d+dd-sd/2-5,current_z+th*.45,2,1.5,2.4,'neon_green',8,5)
        current_z += th
    # Roof line: ornate pointed roofs vs. patched industrial sheds.
    if not zaun:
        roof_h = min(48, width*.38)
        f.prism([(x-width*.45, current_z, ),], d, 1, roof) if False else None
        # Four-sided mansard/pyramid in cross-sections, green copper gutters and a needle.
        f.cyl(x,d,current_z,width*.31,roof_h*.45,roof,16,r2=width*.16,top=trim)
        f.cyl(x,d,current_z+roof_h*.45,width*.16,roof_h*.22,trim,12,r2=width*.08,top=roof)
        f.cyl(x,d,current_z+roof_h*.67,width*.08,roof_h*.33,roof,10,r2=.8,top=trim)
        f.cyl(x,d,current_z+roof_h,width*.025,16,trim,8,r2=.05,top=trim)
        for side in (-1,1):
            f.box(x+side*width*.43,d,current_z-2,5,depth+4,4,trim)
    else:
        f.box(x,d,current_z+3,width*1.06,depth*1.05,7,roof)
        # Vent stacks, exhaust hoods and valve wheels.
        for j in range(1+style%3):
            vx=x+(j-(style%3)/2)*width*.25
            vd=d+(j%2-.5)*depth*.2
            vh=current_z+10+rng.random()*14
            f.cyl(vx,vd,vh,width*.045,22+style%11,'iron',8,r2=width*.035)
            f.cyl(vx,vd,vh+18,width*.07,3,'rust',8,r2=width*.07)
        if style%2==0:
            f.sphere(x+width*.35,d-depth*.28,current_z+9,10,8,10,'glass_green',10,6)
    # Piltover balconies and inset medallions; Zaun braces and suspended cables.
    if not zaun:
        for level in range(1,tiers+1):
            zz=5+level*max(36,height-15)/tiers-6
            f.box(x,d-depth*.54,zz,width*.92,5,3,trim)
            for xx in (-width*.42,-width*.21,0,width*.21,width*.42):
                f.cyl(x+xx,d-depth*.54,zz+3,1.5,7,trim,6,r2=1.2)
    elif style%2==1:
        f.tube([(x-width*.48,d-depth*.55,12),(x-width*.22,d-depth*.55,height*.35),(x+width*.05,d-depth*.55,height*.28),(x+width*.42,d-depth*.55,20)],2,'rust',7)


def add_tower(f, x,d,base,height,radius,mat_base,mat_trim,roof):
    f.cyl(x,d,base,radius,height*.72,mat_base,20,r2=radius*.82)
    f.cyl(x,d,base+height*.68,radius*1.12,5,mat_trim,20,r2=radius*1.12)
    f.cyl(x,d,base+height*.72,radius*.82,height*.16,mat_base,18,r2=radius*.5)
    f.cyl(x,d,base+height*.88,radius*.5,height*.12,roof,14,r2=radius*.05)
    f.cyl(x,d,base+height,radius*.05,height*.11,mat_trim,8,r2=.1)
    for level in range(1,5):
        zz=base+height*.15*level
        f.cyl(x,d,zz,radius*1.07,2.1,mat_trim,20,r2=radius*1.07)


def add_piltover_landmark(f,rng,pid,x,d):
    """Hand-composed landmark profiles; the POI remains on a navigable apron beside each building."""
    ox, od = {
      'academia':(150,-65),'taller-jayce':(-135,-75),'consejo':(155,25),'ejecutores':(-150,0),
      'mansion-kiramman':(135,30),'plaza':(0,0),'artesanos':(155,35),'hexpuertas':(0,-155),
      'muelle-stillwater':(-155,-20),'puente':(-340,-25),
    }[pid]
    cx,cd=x+ox,d+od
    # Each important place uses its own composed silhouette.
    if pid == 'academia':
        add_building(f,rng,'piltover',cx,cd,170,140,124,2,True)
        add_tower(f,cx-78,cd-5,5,195,25,'stone_light','gold','roof')
        add_tower(f,cx+78,cd-5,5,195,25,'stone_light','gold','roof')
        f.cyl(cx,cd-36,123,42,25,'roof',18,r2=33,top='gold')
        f.cyl(cx,cd-36,148,9,37,'gold',12,r2=3)
        for xx in (-42,-14,14,42):
            f.cyl(cx+xx,cd-70,5,4,73,'gold',8,r2=3)
    elif pid == 'consejo':
        f.cyl(cx,cd,0,108,12,'gold',32,r2=115,top='gold')
        f.cyl(cx,cd,12,94,50,'stone_light',32,r2=88,top='stone_light')
        f.cyl(cx,cd,62,81,8,'gold',32,r2=81,top='gold')
        for i in range(16):
            a=2*math.pi*i/16
            f.cyl(cx+72*math.cos(a),cd+72*math.sin(a),28,4,50,'gold',8,r2=3)
        f.sphere(cx,cd,100,76,76,38,'roof',20,10)
        f.cyl(cx,cd,134,7,27,'gold',10,r2=.7)
        for i in range(12):
            a=2*math.pi*i/12
            f.sphere(cx+90*math.cos(a),cd+90*math.sin(a),78,3,3,3,'window_glow',8,5)
    elif pid == 'plaza':
        f.cyl(x,d,0,72,7,'gold',28,r2=78,top='stone_light')
        f.cyl(x,d,7,53,6,'stone_light',28,r2=54,top='gold')
        f.cyl(x,d,13,28,30,'gold',16,r2=21)
        f.cyl(x,d,43,12,24,'blue_glow',12,r2=7)
        f.sphere(x,d,68,15,15,19,'blue_glow',14,9)
        f.paver_grid(x-52,d-52,8,8,15,'paver_light',1)
    elif pid == 'mansion-kiramman':
        add_building(f,rng,'piltover',cx,cd,175,125,86,1,True)
        add_tower(f,cx-62,cd-15,6,128,20,'stone_light','brass','roof')
        add_tower(f,cx+62,cd-15,6,128,20,'stone_light','brass','roof')
        f.box(cx,cd-65,48,60,7,31,'roof')
    elif pid == 'hexpuertas':
        for xx in (-100,100):
            f.box(cx+xx,cd,0,30,34,120,'stone_light',top='gold')
            f.box(cx+xx,cd,120,47,47,10,'gold')
            add_tower(f,cx+xx,cd,130,58,12,'stone_light','gold','roof')
        f.tube([(cx-100,cd,74),(cx-75,cd,118),(cx-38,cd,145),(cx,cd,153),
                (cx+38,cd,145),(cx+75,cd,118),(cx+100,cd,74)],8,'gold',10)
        f.tube([(cx-88,cd-2,74),(cx-62,cd-2,109),(cx,cd-2,140),(cx+62,cd-2,109),(cx+88,cd-2,74)],3,'blue_glow',8)
    elif pid == 'puente':
        f.ribbon([(x-470,d),(x-330,d+8),(x-150,d),(x+30,d-5),(x+210,d),(x+380,d+5)],38,12,'stone_light',1)
        for xx in (-340,-180,0,180,340):
            f.box(x+xx,d,14,13,50,56,'stone_light')
            f.box(x+xx,d,70,22,58,5,'gold')
        for side in (-1,1):
            f.tube([(x-440,d+side*18,35),(x-300,d+side*18,86),(x-150,d+side*18,108),
                    (x,d+side*18,113),(x+160,d+side*18,105),(x+320,d+side*18,80),(x+400,d+side*18,32)],2.6,'gold',7)
    elif pid == 'muelle-stillwater':
        add_building(f,rng,'piltover',cx,cd,135,95,90,0,True)
        for xx in (-55,55):
            add_tower(f,cx+xx,cd-20,0,130,17,'stone_light','gold','roof')
        f.box(cx,cd+55,0,220,65,5,'copper',top='stone_light')
        for i in range(7):
            f.box(cx-80+i*26,cd+53,5,3,3,14,'gold')
    elif pid == 'ejecutores':
        add_building(f,rng,'piltover',cx,cd,138,110,108,1,True)
        f.box(cx,cd-58,15,54,5,57,'dark')
        f.box(cx,cd-61,38,40,2,20,'blue_glow')
        add_tower(f,cx-57,cd-10,6,116,16,'stone_light','gold','roof')
        add_tower(f,cx+57,cd-10,6,116,16,'stone_light','gold','roof')
    elif pid == 'artesanos':
        add_building(f,rng,'piltover',cx,cd,145,105,66,1,True)
        for i in range(5):
            f.box(cx-44+i*22,cd-56,12,16,6,8,'copper',top='gold')
            f.box(cx-44+i*22,cd-56,20,16,5,1,'gold')
    elif pid == 'taller-jayce':
        add_building(f,rng,'piltover',cx,cd,140,112,93,2,True)
        f.box(cx,cd-61,12,55,5,54,'dark')
        f.box(cx,cd-64,38,30,2,24,'blue_glow')
        f.cyl(cx+47,cd+25,0,11,82,'copper',12,r2=9)
        f.cyl(cx+47,cd+25,82,19,6,'gold',12,r2=14)
    # Surrounding stately terraces make height transitions legible from both zoom levels.


def add_zaun_landmark(f,rng,pid,x,d):
    ox,od={
      'puente-zaun':(0,145),'fabrica':(145,-25),'foso':(-150,-20),'tejados':(0,-140),
      'ultima-gota':(150,12),'callejones':(0,-150),'tienda-benzo':(130,-20),'mercado':(-150,0),
      'sumidero':(0,-145),'escondite-jinx':(-140,0),'invernadero':(130,0),'arbol':(-150,-15)
    }[pid]
    cx,cd=x+ox,d+od
    if pid == 'puente-zaun':
        f.ribbon([(cx-260,cd),(cx-160,cd+25),(cx,cd),(cx+160,cd-18),(cx+260,cd)],42,7,'iron',1)
        for xx in (-200,-100,0,100,200):
            f.box(cx+xx,cd,8,10,54,60,'iron_light')
        for side in (-1,1):
            f.tube([(cx-250,cd+side*22,25),(cx-140,cd+side*22,56),(cx,cd+side*22,62),(cx+140,cd+side*22,48),(cx+250,cd+side*22,24)],2.5,'rust',7)
    elif pid == 'fabrica':
        add_building(f,rng,'zaun',cx,cd,165,125,185,3,True)
        for i in range(3):
            f.cyl(cx-55+i*52,cd+28,175,13,70,'iron',10,r2=11)
            f.cyl(cx-55+i*52,cd+28,244,18,5,'rust',10,r2=18)
        for z in (65,115,165):
            f.tube([(cx-95,cd-68,z),(cx-35,cd-75,z+8),(cx+30,cd-75,z-4),(cx+90,cd-64,z+6)],5,'copper',8)
    elif pid == 'foso':
        f.cyl(cx,cd,0,86,10,'iron',24,r2=90,top='rust')
        f.cyl(cx,cd,10,65,21,'stone',24,r2=57,top='dark')
        f.cyl(cx,cd,30,36,4,'neon_pink',20,r2=36,top='neon_pink')
        for i in range(12):
            a=2*math.pi*i/12
            f.box(cx+75*math.cos(a),cd+75*math.sin(a),13,8,8,20,'rust',rot=a)
    elif pid == 'tejados':
        for i in range(5):
            xx=cx+(i-2)*38
            f.box(xx,cd+(i%2)*17,0,47,56,58+(i%3)*19,'iron',top='rust')
            f.box(xx,cd+(i%2)*17,59+(i%3)*19,51,61,6,'rust')
            f.cyl(xx+12,cd-14,65+(i%3)*19,7,31,'iron_light',8,r2=5)
    elif pid == 'ultima-gota':
        add_building(f,rng,'zaun',cx,cd,130,98,64,1,True)
        f.box(cx,cd-53,13,72,5,33,'iron')
        f.box(cx,cd-57,22,53,2,13,'neon_green')
        f.box(cx+1,cd-60,26,38,1.5,5,'neon_pink')
        f.tube([(cx-62,cd-50,8),(cx-65,cd-56,18),(cx-48,cd-56,30)],2,'copper')
    elif pid == 'callejones':
        for i in range(6):
            xx=cx+(i%3-1)*53
            dd=cd+(i//3)*48
            height=64+(i*37)%93
            add_building(f,rng,'zaun',xx,dd,43+(i%2)*10,42,height,i,True)
        for z in (50,96,142):
            f.ribbon([(cx-125,cd-65),(cx-60,cd-69),(cx+10,cd-63),(cx+116,cd-56)],8,z,'iron',1)
        for i in range(4):
            f.tube([(cx-80+i*50,cd-70,12),(cx-80+i*50,cd-70,75),(cx-35+i*43,cd-70,130)],2.3,'rust')
    elif pid == 'tienda-benzo':
        add_building(f,rng,'zaun',cx,cd,108,91,57,1,True)
        for i in range(6):
            f.cyl(cx-40+i*16,cd-50,2,4,13,'rust',8,r2=3)
            f.sphere(cx-40+i*16,cd-50,17,5,5,5,'iron_light',8,5)
    elif pid == 'mercado':
        for i in range(7):
            xx=cx-105+i*35
            f.cyl(xx,cd-25,0,14,38,'iron',10,r2=12)
            f.box(xx,cd-25,39,39,41,4,'rust')
            f.box(xx,cd-25,43,34,36,9,'wood',top='iron')
            f.sphere(xx,cd-25,60,3,2,3,('neon_pink','neon_green','window_glow')[i%3],8,5)
    elif pid == 'sumidero':
        f.cyl(cx,cd,0,100,5,'iron',28,r2=100,top='iron_light')
        f.cyl(cx,cd,5,76,2,'neon_green',28,r2=76,top='neon_green')
        for i in range(5):
            a=2*math.pi*i/5
            f.cyl(cx+53*math.cos(a),cd+53*math.sin(a),8,6,45,'iron',8,r2=5)
        for i in range(4):
            f.cyl(cx-37+i*24,cd-17,12,7,25,'glass_green',10,r2=7)
            f.cyl(cx-37+i*24,cd-17,37,8,3,'neon_green',10,r2=8)
    elif pid == 'escondite-jinx':
        add_building(f,rng,'zaun',cx,cd,124,102,85,2,True)
        f.box(cx,cd-54,12,52,5,48,'iron')
        for i in range(5):
            f.sphere(cx-27+i*13,cd-58,33,3,1.5,3,('neon_pink','neon_teal','neon_green')[i%3],8,5)
        for i in range(3):
            f.cyl(cx+48+i*17,cd+25,85,7,40,'iron_light',8,r2=5)
    elif pid == 'invernadero':
        f.box(cx,cd,0,140,105,5,'stone_light')
        # Greenhouse ribs and glass panels as a deliberately light, transparent canopy.
        for xx in (-60,-30,0,30,60):
            f.tube([(cx+xx,cd-48,5),(cx+xx,cd-48,43),(cx+xx,cd,68),(cx+xx,cd+48,43),(cx+xx,cd+48,5)],2,'copper')
        for side in (-1,1):
            f.tube([(cx-64,cd+side*44,5),(cx-32,cd+side*44,49),(cx,cd+side*44,60),(cx+32,cd+side*44,49),(cx+64,cd+side*44,5)],1.4,'neon_teal')
        for i in range(12):
            f.sphere(cx-48+(i%4)*32,cd-25+(i//4)*25,8,7,6,10,'glass_green',8,5)
    elif pid == 'arbol':
        f.cyl(cx,cd,0,94,4,'stone_light',24,r2=96,top='stone_light')
        f.tube([(cx,cd,4),(cx+12,cd,30),(cx-6,cd,65),(cx+15,cd,98),(cx+35,cd+4,124)],10,'wood',10)
        branches=[(cx+15,cd,98,cx-25,cd-25,142),(cx+8,cd,70,cx+55,cd+18,110),(cx+25,cd+4,122,cx+45,cd-16,157),(cx-6,cd,65,cx-48,cd+15,101)]
        for x0,d0,z0,x1,d1,z1 in branches:
            f.tube([(x0,d0,z0),((x0+x1)/2,(d0+d1)/2,(z0+z1)/2),(x1,d1,z1)],5,'wood',8)
        for i in range(28):
            a=i*2.4
            rr=18+(i%5)*6
            f.sphere(cx+math.cos(a)*rr,cd+math.sin(a)*rr,95+(i%7)*8,13,12,12,('neon_green','neon_teal','glass_green')[i%3],8,5)
    # Frequent conduits and dangling cables tie the undercity landmarks together.
    if pid not in ('puente-zaun','arbol'):
        f.tube([(cx-90,cd-70,35),(cx-30,cd-76,41),(cx+30,cd-76,30),(cx+90,cd-70,45)],3,'copper',7)
        f.tube([(cx-75,cd-68,12),(cx-75,cd-68,40),(cx-20,cd-68,50)],1.8,'iron_light',6)


def add_human_proxy(f,x,d,base_z,mat_body,mat_limb,tag):
    """Render-only 1.75 m / 22-world-unit human proxy for scale QA; never exported to the game."""
    h=PERSON_HEIGHT
    f.cyl(x,d,base_z,3.2,h*.48,mat_body,8,r2=2.5)
    f.sphere(x,d,base_z+h*.68,3.4,3.4,4.2,mat_body,10,6)
    for side in (-1,1):
        f.cyl(x+side*2.1,d,base_z,1.15,h*.30,mat_limb,7,r2=.85)
        f.tube([(x+side*2,d,base_z+h*.52),(x+side*5,d,base_z+h*.35),(x+side*4.6,d,base_z+h*.16)],.9,mat_limb,6)


def setup_render(city, city_objects, review_collection, f):
    scene=bpy.context.scene
    scene.render.engine='BLENDER_EEVEE_NEXT'
    scene.render.resolution_x=1440
    scene.render.resolution_y=900
    scene.render.resolution_percentage=72
    scene.render.image_settings.file_format='PNG'
    scene.render.image_settings.color_mode='RGBA'
    scene.render.film_transparent=False
    scene.render.image_settings.color_depth='8'
    scene.render.filepath=str(PREVIEW / f'{city}-overview.png')
    scene.view_settings.view_transform='AgX'
    scene.world=bpy.data.worlds.new(f'{city.title()} Atmosphere')
    scene.world.use_nodes=True
    bg=scene.world.node_tree.nodes.get('Background')
    bg.inputs['Color'].default_value=(.012,.025,.045,1) if city=='zaun' else (.16,.26,.39,1)
    bg.inputs['Strength'].default_value=.55
    # Real render cameras for the overall map and the street-scale close-up.
    cam_data=bpy.data.cameras.new(f'{city.title()} overview camera')
    cam=bpy.data.objects.new(f'QA_CAMERA__{city}__OVERVIEW',cam_data)
    bpy.context.scene.collection.objects.link(cam)
    cam.location=(1500,-1100,3750)
    target=Vector((1500,-1100,0))
    cam.rotation_euler=(target-Vector(cam.location)).to_track_quat('-Z','Y').to_euler()
    cam.data.type='ORTHO'
    cam.data.ortho_scale=3650
    cam.data.lens=48
    scene.camera=cam
    # Main sun and broad softboxes create legible side faces without flattening the scene.
    sun_data=bpy.data.lights.new('Key sun',type='SUN')
    sun=bpy.data.objects.new('LIGHT__SUN',sun_data)
    scene.collection.objects.link(sun)
    sun.location=(500,-1200,2800)
    sun.rotation_euler=(math.radians(25),math.radians(-18),math.radians(-24))
    sun_data.energy=2.1 if city=='piltover' else 1.25
    sun_data.angle=math.radians(18)
    for name,loc,power,size,color in [
        ('Softbox north',(400,-600,650),180000,900,(.60,.78,1.0)),
        ('Softbox east',(2400,-1500,520),130000,750,(1.0,.72,.42) if city=='piltover' else (.2,1.0,.48)),
    ]:
        ld=bpy.data.lights.new(name,type='AREA')
        lo=bpy.data.objects.new(name,ld)
        scene.collection.objects.link(lo)
        lo.location=loc
        ld.energy=power
        ld.shape='DISK'
        ld.size=size
        ld.color=color
        lo.rotation_euler=(Vector((1500,-1100,0))-Vector(lo.location)).to_track_quat('-Z','Y').to_euler()
    scene.render.image_settings.color_mode='RGB'
    scene.camera.data.lens=50
    # Use an opaque solid compositor with a subtle glow on emissive accents.
    scene.use_nodes=True
    tree=scene.node_tree
    tree.nodes.clear()
    rl=tree.nodes.new('CompositorNodeRLayers')
    glare=tree.nodes.new('CompositorNodeGlare')
    glare.glare_type='FOG_GLOW'
    glare.quality='MEDIUM'
    glare.threshold=2.0
    comp=tree.nodes.new('CompositorNodeComposite')
    tree.links.new(rl.outputs['Image'],glare.inputs['Image'])
    tree.links.new(glare.outputs['Image'],comp.inputs['Image'])
    # Overview render first.
    scene.render.filepath=str(PREVIEW/f'{city}-overview.png')
    bpy.ops.render.render(write_still=True)
    # Street-level camera centred around different districts, include the scale markers.
    scene.camera.data.type='PERSP'
    scene.camera.data.lens=53
    scene.camera.location=(720,-200,195)
    target=Vector((950,-520,30))
    scene.camera.rotation_euler=(target-Vector(scene.camera.location)).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(PREVIEW/f'{city}-street-scale.png')
    bpy.ops.render.render(write_still=True)
    # Additional zoom close-up, equivalent to a camera pushed down an alley.
    scene.camera.location=(960,-460,84)
    target=Vector((1080,-690,24))
    scene.camera.rotation_euler=(target-Vector(scene.camera.location)).to_track_quat('-Z','Y').to_euler()
    scene.camera.data.lens=60
    scene.render.filepath=str(PREVIEW/f'{city}-zoom-close.png')
    bpy.ops.render.render(write_still=True)
    scene.render.resolution_percentage=100


def build_city(city):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    random.seed(700 if city=='piltover' else 1300)
    rng=random.Random(700 if city=='piltover' else 1300)
    scene=bpy.context.scene
    scene.render.film_transparent=False
    scene.unit_settings.system='METRIC'
    scene.unit_settings.scale_length=1.0
    scene.render.resolution_percentage=60
    # Named authoring collections separate exportable world assets from QA dummies/cameras.
    city_col=bpy.data.collections.new('CITY_WORLD')
    scene.collection.children.link(city_col)
    review=bpy.data.collections.new('REVIEW_SCALE__NOT_EXPORTED')
    scene.collection.children.link(review)
    materials=make_materials(city)
    f=MeshForge(city_col,materials)

    # Foundation / terrain is an authored urban platform, not a runtime Three.js plane.
    if city=='piltover':
        f.box(MAP_W/2,MAP_D/2,-34,MAP_W,MAP_D,68,'stone',top='stone_light')
        f.box(MAP_W/2,MAP_D/2,-62,MAP_W+26,MAP_D+26,30,'stone_cool')
        # Banded retaining walls and the underside of a city plateau above clouds.
        for dd in (0,MAP_D):
            f.box(MAP_W/2,dd,-160,MAP_W+30,28,210,'stone',top='stone_cool')
            for xx in range(90, int(MAP_W), 150):
                f.box(xx,dd,-150,8,33,185,'stone_light')
                f.box(xx,dd,-63,23,35,5,'gold')
        for xx in (0,MAP_W):
            f.box(xx,MAP_D/2,-158,28,MAP_D,205,'stone',top='stone_cool')
            for dd in range(100,int(MAP_D),145):
                f.box(xx,dd,-150,33,7,177,'stone_light')
                f.box(xx,dd,-63,36,18,5,'gold')
        # Stylized cloud ocean below the cliff line, with broad overlapping forms.
        for i in range(130):
            edge=i%4
            if edge==0: x,d=rng.uniform(-380,MAP_W+380),rng.uniform(-240,80)
            elif edge==1: x,d=rng.uniform(-380,MAP_W+380),rng.uniform(MAP_D-70,MAP_D+260)
            elif edge==2: x,d=rng.uniform(-250,100),rng.uniform(0,MAP_D)
            else: x,d=rng.uniform(MAP_W-100,MAP_W+250),rng.uniform(0,MAP_D)
            z=rng.uniform(-290,-80)
            f.sphere(x,d,z,rng.uniform(60,190),rng.uniform(55,160),rng.uniform(30,85),'cloud',9,6)
        # Main avenues are wide, curved and linked through landmark forecourts.
        roads=[
          [(0,330),(500,350),(950,410),(1500,390),(2150,350),(3000,330)],
          [(0,860),(520,835),(1050,890),(1500,850),(2100,820),(3000,860)],
          [(0,1460),(650,1430),(1250,1490),(1800,1455),(2400,1475),(3000,1450)],
          [(280,0),(330,470),(380,950),(390,1450),(430,2200)],
          [(1000,0),(1020,550),(990,1050),(1030,1600),(1080,2200)],
          [(1780,0),(1760,500),(1800,1050),(1780,1590),(1810,2200)],
          [(2540,0),(2490,550),(2520,1100),(2510,1650),(2490,2200)],
        ]
        for pts in roads:
            f.ribbon(pts,82,2,'road',.9)
            for side in (-1,1):
                f.ribbon([(x,y+side*45) for x,y in pts],2.2,3,'gold',1)
        # Formal paving and garden islands at crossing squares.
        for x,d in ((700,400),(1200,700),(1650,1150),(2200,380),(2400,1350),(600,1950)):
            f.box(x,d,1,200,175,2,'paver_light')
            f.paver_grid(x-78,d-65,9,8,18,'paver',3.1)
            for side in (-1,1):
                for fore in (-1,1):
                    f.sphere(x+side*75,d+fore*58,4,8,8,7,'greenery',8,5)
    else:
        # Layered dark undercity foundations with a worn toxic canal.
        f.box(MAP_W/2,MAP_D/2,-21,MAP_W,MAP_D,42,'stone',top='road')
        f.box(1150,1660,1,310,1000,2,'water',top='water')
        # The canal is broken by crossing plates; heavy embankment lips hold the edges.
        for x in (990,1320):
            f.box(x,1660,5,16,1010,7,'rust')
        for d in (1190,1450,1710,1970,2150):
            f.ribbon([(0,d),(600,d+20),(1200,d),(1800,d+25),(2400,d-12),(3000,d)],48,1,'road',.8)
        for pts in [
          [(0,300),(450,355),(900,420),(1400,390),(1900,335),(2400,355),(3000,325)],
          [(0,720),(500,740),(1050,790),(1550,765),(2150,740),(3000,760)],
          [(0,1120),(500,1100),(1100,1150),(1650,1100),(2250,1130),(3000,1110)],
          [(0,1510),(500,1540),(1050,1510),(1600,1555),(2200,1510),(3000,1530)],
          [(260,0),(300,500),(340,1000),(380,1500),(430,2200)],
          [(950,0),(980,500),(1000,1000),(1040,1500),(1080,2200)],
          [(1780,0),(1770,500),(1800,1000),(1810,1500),(1830,2200)],
          [(2500,0),(2490,500),(2520,1000),(2540,1500),(2520,2200)],
        ]:
            f.ribbon(pts,43,1,'road',.8)
        for x,d in ((650,330),(800,1000),(1350,1250),(2400,1100),(1750,1950),(850,1900)):
            f.box(x,d,1,178,160,2,'paver')
            f.paver_grid(x-70,d-65,8,7,18,'paver_light',3.1)
        # Arched cavern roof with irregular strata and occasional hanging outcrops.
        grid_x=28; grid_d=22; roof_grid=[]
        for iz in range(grid_d+1):
            row=[]
            d=iz*MAP_D/grid_d
            for ix in range(grid_x+1):
                x=ix*MAP_W/grid_x
                nx=(x-MAP_W/2)/(MAP_W*.59)
                nd=(d-MAP_D/2)/(MAP_D*.59)
                dome=max(0,1-nx*nx-nd*nd)
                z=610+440*math.sqrt(dome)+math.sin(x*.012)*16+math.cos(d*.016)*19
                row.append((x,d,z))
            roof_grid.append(row)
        roof_mats=['cave','cave_light']
        for iz in range(grid_d):
            for ix in range(grid_x):
                pts=[roof_grid[iz][ix],roof_grid[iz][ix+1],roof_grid[iz+1][ix+1],roof_grid[iz+1][ix]]
                f.face(roof_mats[(ix*13+iz*7)%len(roof_mats)],pts)
        for i in range(55):
            x=rng.uniform(20,MAP_W-20); d=rng.uniform(20,MAP_D-20)
            z=570+rng.random()*160
            length=rng.uniform(24,115)
            f.cyl(x,d,z-length,length*.2,length,'cave_light',7,r2=.5)
        # Deep shafts of cold light cut through selected holes in the cavern canopy.

    # Landmark buildings go next to POI anchor pads; the position is kept clear for the player.
    for pid,(x,d) in CITY_POIS[city].items():
        if city=='piltover':
            add_piltover_landmark(f,rng,pid,x,d)
        else:
            add_zaun_landmark(f,rng,pid,x,d)

    # Dense mid-rise neighborhoods, avoiding player spawn circles and landmark footprints.
    poi_points=list(CITY_POIS[city].values())
    grid_step_x=252 if city=='piltover' else 225
    grid_step_d=225 if city=='piltover' else 195
    bx=145
    index=0
    for d in range(90,int(MAP_D-60),grid_step_d):
        for x in range(90,int(MAP_W-60),grid_step_x):
            index+=1
            # Shift every other block to avoid a sterile grid and create real alley widths.
            xx=x+(grid_step_x*.18 if (int(d/grid_step_d)%2) else 0)+rng.uniform(-22,22)
            dd=d+rng.uniform(-20,20)
            if any(math.hypot(xx-px,dd-pd)<(205 if city=='piltover' else 165) for px,pd in poi_points):
                continue
            width=rng.uniform(64,112 if city=='piltover' else 98)
            depth=rng.uniform(60,100 if city=='piltover' else 88)
            height=rng.uniform(72,185 if city=='piltover' else 165)
            if city=='piltover' and rng.random()<.13: height+=rng.uniform(80,150)
            if city=='zaun' and rng.random()<.25: height+=rng.uniform(60,125)
            # High skyline clusters at the north and east edges frame the map silhouette.
            if x>2400 and rng.random()<.45: height+=rng.uniform(60,180)
            add_building(f,rng,city,xx,dd,width,depth,height,index,True)
            if city=='zaun' and index%3==0:
                # Stilt-supports for elevated shack clusters and multi-level routes.
                floor=42+(index%4)*17
                f.box(xx,dd,floor,width*.95,depth*.9,3,'iron')
                for side in (-1,1):
                    f.box(xx+side*width*.38,dd,floor-32,4,4,32,'iron_light')
                if index%6==0:
                    f.ribbon([(xx-width*.65,dd),(xx,dd-9),(xx+width*.7,dd+4)],5,floor+7,'iron',.7)

    # Dedicated bridges, rails, lamps, benches and scale cues.
    if city=='piltover':
        # Canal/harbor water on the lower eastern edge and carved quays.
        f.box(2750,1880,-2,420,600,4,'water',top='water')
        for x in range(2560,3000,55):
            f.box(x,1575,1,5,620,11,'gold')
        for d in range(1600,2200,75):
            f.box(2540,d,0,460,4,3,'stone_light')
        for x,d in ((150,270),(2800,320),(420,1680),(2220,1730),(2850,1200),(780,1810)):
            f.cyl(x,d,0,4,31,'gold',8,r2=3)
            f.sphere(x,d,33,5,5,5,'window_glow',8,5)
        # Aerostats with ribbed envelopes and tethered gondolas.
        for i,(x,d) in enumerate(((360,560),(1850,250),(2250,650),(1250,1780))):
            f.sphere(x,d,310,30,21,41,'stone_light',16,10)
            for z in (290,310,330):
                f.cyl(x,d,z,27,1.2,'gold',18,r2=27)
            f.box(x,d,258,21,17,12,'copper')
            for xx in (-8,8):
                f.tube([(x+xx,d,258),(x+xx,d,278)],.9,'gold',5)
    else:
        # Industrial trunk pipes, valves, risers and cables form layered overhead streets.
        for i in range(17):
            y=180+(i%4)*105
            d0=(i*137)%MAP_D
            path=[]
            for k in range(8):
                x=k*MAP_W/7
                d=d0+math.sin(k*.8+i)*65
                z=y+math.sin(k*.7+i)*18
                path.append((x,d,z))
            f.tube(path,5+(i%3)*1.3,'copper' if i%3 else 'iron_light',8)
            for k in range(1,7):
                x=k*MAP_W/7
                d=d0+math.sin(k*.8+i)*65
                z=y+math.sin(k*.7+i)*18
                if (k+i)%2==0:
                    f.cyl(x,d,z,9,4,'rust',12,r2=9)
                    f.sphere(x,d,z+2,3,3,3,'neon_green',8,5)
        for i in range(68):
            x=rng.uniform(45,MAP_W-45); d=rng.uniform(45,MAP_D-45)
            z=rng.uniform(20,130)
            if any(math.hypot(x-px,d-pd)<120 for px,pd in poi_points): continue
            f.tube([(x,d,z),(x+rng.uniform(-8,8),d,z-rng.uniform(14,40))],.9,'iron_light',5)
        # Walkway rails with intermittent luminous chevrons at upper levels.
        for y in (480,1020,1480,1850):
            f.ribbon([(0,y),(400,y+9),(900,y-4),(1500,y+8),(2100,y-6),(3000,y)],7,75,'iron',1)
            for x in range(100,2950,85):
                f.cyl(x,y,76,1.4,12,'iron_light',6,r2=1.1)
        # Chemical pools and vapour lamps in the lower district.
        for i in range(45):
            x=rng.uniform(80,MAP_W-80); d=rng.uniform(1480,2150)
            if any(math.hypot(x-px,d-pd)<130 for px,pd in poi_points): continue
            f.sphere(x,d,5,rng.uniform(5,15),rng.uniform(4,11),rng.uniform(1.4,3.5),'gas',8,5)
        for x,d in ((200,400),(2800,530),(500,880),(1800,900),(2900,1510),(1300,2020)):
            f.cyl(x,d,1,5,35,'iron',8,r2=4)
            f.sphere(x,d,37,6,6,6,'neon_green',8,5)
            f.box(x+9,d,27,2,2,18,'neon_pink')

    # POI anchors are empty objects exported alongside the scene for future positional validation.
    for pid,(x,d) in CITY_POIS[city].items():
        empty=bpy.data.objects.new('POI__'+pid,None)
        city_col.objects.link(empty)
        empty.empty_display_type='SPHERE'
        empty.empty_display_size=7
        empty.location=p3(x,d,0)

    # Render-only 22-unit human and 25-unit guard proxies beside real architecture to verify scale.
    for i,(x,d) in enumerate(CITY_POIS[city].values()):
        if i % 3 != 0: continue
        base_x=x-42
        base_d=d-30
        bodymat='blue_glow' if city=='piltover' else 'neon_teal'
        limb='stone_cool' if city=='piltover' else 'iron_light'
        add_human_proxy(f,base_x,base_d,2,bodymat,limb,'person')
        add_human_proxy(f,base_x+17,base_d-10,2,bodymat,limb,'guard')

    # Review actors use their own materials/meshes after the city has been assembled.
    # Temporarily remove the QA humans from exportable CITY_WORLD into a separate collection.
    f.flush(city)
    # Make simple 22/25-unit scale dummies as independent objects in a non-export collection.
    # (The batch meshes above are city art; QA scale markers are deliberately separate below.)
    # Place some scale markers at the same world coordinates as the actors.
    proxy_mat=materials.get('blue_glow') if city=='piltover' else materials.get('neon_teal')
    guard_mat=materials.get('gold') if city=='piltover' else materials.get('rust')
    for i,(x,d) in enumerate(CITY_POIS[city].values()):
        if i%3: continue
        for j,(xx,dd,h,mm) in enumerate(((x-42,d-30,PERSON_HEIGHT,proxy_mat),(x-22,d-35,PERSON_HEIGHT*1.12,guard_mat))):
            # A stylised review silhouette only; excluded from CITY_WORLD and GLB export.
            body=bpy.data.meshes.new(f'QA_HUMAN_{i}_{j}')
            vv=[p3(xx,dd,2),p3(xx,dd,2+h*.47),p3(xx+3,dd,2+h*.47),p3(xx+3,dd,2)]
            body.from_pydata(vv,[],[(0,1,2,3)])
            body.materials.append(mm)
            ob=bpy.data.objects.new(f'QA_SCALE__{"GUARD" if j else "PERSON"}_{i}',body)
            review.objects.link(ob)
            ob.hide_viewport=False
            ob.hide_render=True  # actual actor render pass uses the round close-up to verify the street proportions by measurements
    # Lock the city asset to its own collection so exports contain no cameras or QA markers.
    for ob in list(city_col.objects):
        ob.select_set(True)
    bpy.context.view_layer.objects.active=next((o for o in city_col.objects if o.type=='MESH'),None)
    OUT.mkdir(parents=True,exist_ok=True)
    PREVIEW.mkdir(parents=True,exist_ok=True)
    blend_path=OUT/f'{city}.blend'
    glb_path=OUT/f'{city}.glb'
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))
    # Blender 4.x ships the glTF I/O add-on in the package; explicitly enable if available.
    try:
        import addon_utils
        addon_utils.enable('io_scene_gltf2', default_set=True)
    except Exception:
        pass
    bpy.ops.object.select_all(action='DESELECT')
    for ob in city_col.objects:
        ob.select_set(True)
    mesh_active=next((o for o in city_col.objects if o.type=='MESH'),None)
    if mesh_active:
        bpy.context.view_layer.objects.active=mesh_active
    if not hasattr(bpy.ops.export_scene,'gltf'):
        raise RuntimeError('Blender no tiene habilitado el exportador glTF 2.0.')
    bpy.ops.export_scene.gltf(filepath=str(glb_path),export_format='GLB',use_selection=True,
        export_apply=True,export_cameras=False,export_lights=False,export_materials='EXPORT',
        export_image_format='AUTO',export_texcoords=True,export_normals=True)
    if not glb_path.exists() or glb_path.stat().st_size < 200_000:
        raise RuntimeError(f'El escenario {city} se exportó vacío o con tamaño sospechoso.')
    # Preview cameras and scale QA markers are only present in .blend; never in the game GLB.
    setup_render(city,city_col.objects,review,f)
    print(f'CITY_OK {city}: blend={blend_path.stat().st_size} glb={glb_path.stat().st_size}')
    return blend_path,glb_path


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    PREVIEW.mkdir(parents=True,exist_ok=True)
    for city in ('piltover','zaun'):
        build_city(city)
    print('BLENDER_MAPS_OK: two editable scenes and game-ready GLBs created.')

if __name__=='__main__':
    main()

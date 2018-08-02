function changeMode(key, newMode) {
    molecules[key].setMode(newMode);
    redrawAtoms(key, newMode);
}

function changeModeAll(newMode){
    mode = newMode;
    for(const key in molecules){
        molecules[key].setMode(newMode);
        redrawAtoms(key, newMode);
    }
}

function redrawAtom(key, object, num, radius){

    const position = object.position;
    const color = object.material.color;
    const name = object.name;

    objectsGrouppedByMolecule[key].remove(object);

    const mesh = addAtom( position, radius,color, name);
    atomMeshList[key][num]= mesh;
    objectMapList.push(mesh);
    objectsGrouppedByMolecule[key].add(mesh);
}

function redrawAtoms(key, molMode) {
    const objects = Object.assign([], atomMeshList[key]);
    let name;
    if (molMode == 'sticks') {
        for (var i = 0; i < objects.length; i++) {
            redrawAtom(key, objects[i], i, 0.1)
        }
    } else if (molMode == 'balls'){
        for ( i = 0; i < objects.length; i++) {
            redrawAtom(key, objects[i], i, 0.3)
        }
    }else if (molMode == 'spheres'){
        let radius = 1;
        for ( i = 0; i < objects.length; i++) {
            name = objects[i].name;
            if (name in CPK){
                radius = parseInt(CPK[name]['size'])/100
            }
            redrawAtom(key, objects[i], i, radius)
        }
    }
    objectMapList = objectMapList.filter((({parent}) => !(parent === null)));
}

function deleteAll() {
    for (const key in objectsGrouppedByMolecule) {
        scene.remove(objectsGrouppedByMolecule[key]);
    }
    objectsGrouppedByMolecule = [];
    objectMapList = [];
    atomMeshList = [];
    molecules = [];
    clearDomContainer("moleculesSettings")
}

function deleteMolecule(key){
    scene.remove(objectsGrouppedByMolecule[key]);
    delete objectsGrouppedByMolecule[key];
    objectMapList = objectMapList.filter((({parent}) => !(parent === null)));
    delete atomMeshList[key];
    delete molecules[key];
    clearDomContainer("moleculesSettings")

}


function clearDomContainer(containerName) {
    const container = document.getElementById(containerName);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}
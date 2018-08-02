let camera, controls, renderer, scene,container,projector, plane;
var stats;
let objectMapList = [], objectsGrouppedByMolecule = [], atomMeshList = [];

function buildScene() {

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('gray', 0.002 );

    camera = new THREE.PerspectiveCamera(45, getWidth('drawDiv') / getHeight('drawDiv'), 1, 1000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(0,0,0));
    scene.add( camera );

    controls = new THREE.OrbitControls(camera);
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.maxDistance = 150;
    controls.noRotate =true;

    const light = new THREE.HemisphereLight(0xFFFFFF, 0x777777);
    scene.add( light );

    plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100, 8, 8),
        new THREE.MeshBasicMaterial({color: 0xffffff, visible: false}));
    scene.add(plane);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 'gray', 1 );
    renderer.setSize(getWidth('drawDiv'), getHeight('drawDiv')-5);

    clearDomContainer('drawDiv');
    container.appendChild( renderer.domElement );
    container.addEventListener( 'mousedown', onDocumentMouseDown, false );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container = document.getElementById('stats');
    //container.appendChild( stats.domElement );


    window.addEventListener( 'resize', onWindowResize, false );
    render();

}

function onWindowResize() {
    container = document.getElementById('drawDiv');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    renderer.setSize(getWidth('drawDiv'), getHeight('drawDiv')-5);
    container.appendChild( renderer.domElement );
    //container.appendChild( stats.domElement );
    camera.aspect = getWidth('drawDiv') / getHeight('drawDiv');
    camera.updateProjectionMatrix();

    render();
}

function render() {
    renderer.render(scene, camera);
    //stats.update();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}



function drawScene(molecules){
    for (const key in molecules)
    {
        if (!(key in objectsGrouppedByMolecule)){
            molecules[key].moveToCenter();
            drawMolecule( molecules[key]);
        }
    }
    for(let i = 0; i < objectsGrouppedByMolecule.length; i++){
        scene.add(objectsGrouppedByMolecule[i])
    }
}

function drawMolecule(molecule) {
    const atoms = molecule.getAtoms();
    const bonds = molecule.getBonds();
    const moleculeNum = molecule.getMoleculeNum();
    const molMode = molecule.getMode();

    drawBonds(moleculeNum, atoms,bonds);

    if (molMode == 'sticks'){
        drawAtoms(moleculeNum, 0.1, atoms);
    } else if (molMode == 'balls'){
        drawAtoms(moleculeNum, 0.3 ,atoms);
    } else if (molMode == 'spheres') {
        drawAtomSpheres(moleculeNum, atoms);
    }
}

function drawBonds(moleculeNum, atoms, bonds, quality) {
    for (let i = 0; i < bonds.length;i++){
        const atom1 = atoms[bonds[i].getBondFrom()];
        const atom2 = atoms[bonds[i].getBondTo()];
        const point1 = new THREE.Vector3(atom1.x, atom1.y, atom1.z);
        const point2 = new THREE.Vector3(atom2.x, atom2.y, atom2.z);
        const center = point2.clone().add(point1).multiplyScalar(0.5);

        addToObjectMap(addCylinder(point1, center, atom1.getColor(), quality), moleculeNum);
        addToObjectMap(addCylinder(point2, center, atom2.getColor(), quality), moleculeNum);
    }
}

function drawAtoms( moleculeNum,radius, atoms){
    for (let i = 0; i < atoms.length;i++){
        const atomMesh = addAtom(atoms[i], radius, atoms[i].getColor(), atoms[i].getName());
        addToObjectMap(atomMesh,moleculeNum);
        addToAtomMeshList(atomMesh,moleculeNum);
    }
}

function drawAtomSpheres( moleculeNum, atoms){
    for (let i = 0; i < atoms.length;i++){
        const atomMesh = addAtom(atoms[i], atoms[i].getRadius(), atoms[i].getColor(), atoms[i].getName());
        addToObjectMap( atomMesh,moleculeNum);
        addToAtomMeshList(atomMesh,moleculeNum);
    }
}

function addAtom({x, y, z}, radius, color, name) {

    const material = new THREE.MeshLambertMaterial({ color});
    const geometry = new THREE.SphereGeometry(radius, 23, 23);
    const atomMesh = new THREE.Mesh(geometry, material);
    atomMesh.name = name;
    atomMesh.position.set(x, y, z);
    return atomMesh;
}

function addCylinder(point1, point2, color) {
    const length = point2.clone().sub(point1).length();

    const material = new THREE.MeshLambertMaterial({'color': color});
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, length,  9);
    const cylinderMesh = new THREE.Mesh(geometry, material);

    const position = point1.clone().add(point2).multiplyScalar(0.5);
    cylinderMesh.position.copy(position);


    const direction = point1.clone().sub(point2);
    const angle = cylinderMesh.up.angleTo(direction);
    const axis = cylinderMesh.up.cross(direction);
    cylinderMesh.rotateOnAxis(axis.normalize(), angle);

    return cylinderMesh;
}

function getWidth(id) {
    container = document.getElementById(id);
    const containerStyle = window.getComputedStyle(container);
    return parseInt(containerStyle.width);
}

function getHeight(id) {
    container = document.getElementById(id);
    const containerStyle = window.getComputedStyle(container);
    return parseInt(containerStyle.height);
}


function addToObjectMap(object, moleculeNum) {
    objectMapList.push(object);
    if(!(moleculeNum in objectsGrouppedByMolecule)){
        objectsGrouppedByMolecule[moleculeNum] = new THREE.Group();
        objectsGrouppedByMolecule[moleculeNum].add(object);
        objectsGrouppedByMolecule[moleculeNum].name = moleculeNum;
    } else {
        objectsGrouppedByMolecule[moleculeNum].add(object);
    }
}

function addToAtomMeshList(object, moleculeNum){
    if(!(moleculeNum in atomMeshList)){
        atomMeshList[moleculeNum] = [];
        atomMeshList[moleculeNum].push(object);
        console.log(objectsGrouppedByMolecule[moleculeNum]);
    } else {
        atomMeshList[moleculeNum].push(object);
    }
}

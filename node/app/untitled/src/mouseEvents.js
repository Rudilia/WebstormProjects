let mouseXOnMouseDown = 0, mouseYOnMouseDown = 0;
let selectedObject = null, offset = new THREE.Vector3();

function onDocumentMouseDown( event ) {
    event.preventDefault();
    container.addEventListener( 'mouseout', onDocumentMouseOut, false );
    container.addEventListener( 'mouseup', onDocumentMouseUp, false );

    const vector = new THREE.Vector3((event.offsetX / getWidth('drawDiv')) * 2 - 1,
        -(event.offsetY / getHeight('drawDiv')) * 2 + 1, 1);
    vector.unproject(camera);

    const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    let intersects = raycaster.intersectObjects(objectMapList, true);

    if (event.button == 2) {
        container.removeEventListener('mousemove', onDocumentMouseMoveUpdatePlane, false );
        container.addEventListener( 'mousemove', onDocumentMouseMoveTranslate, false );

        if (intersects.length > 0) {
            selectedObject = intersects[0].object.parent;
            intersects = raycaster.intersectObject(plane);

            const position = new THREE.Vector3(plane.position.x, plane.position.y, 0);
            const point = new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, 0);

            offset.copy(point).sub(position);
            controls.enabled = false;
        }
    } else if (event.button == 0) {
        container.removeEventListener('mousemove', onDocumentMouseMoveUpdatePlane, false );
        container.addEventListener( 'mousemove', onDocumentMouseMoveRotate, false );


        controls.enabled = false;
        if (intersects.length > 0) {
            selectedObject = intersects[0].object.parent;
            mouseXOnMouseDown = event.clientX;
            mouseYOnMouseDown = event.clientY;
            addMoleculeSettings(parseInt(selectedObject.name));
        }
    }
}

function onDocumentMouseMoveRotate(event){
    event.preventDefault();
    if (selectedObject) {
        const deltaMouseX = event.clientX - mouseXOnMouseDown;
        const deltaMouseY = event.clientY - mouseYOnMouseDown;

        const targetRotationX = ( deltaMouseX  ) * 0.009;
        const targetRotationY = ( deltaMouseY ) * 0.009;

        mouseXOnMouseDown = event.clientX ;
        mouseYOnMouseDown = event.clientY ;

        rotateAroundWorldAxis(selectedObject, new THREE.Vector3(0, 1, 0), targetRotationX);
        rotateAroundWorldAxis(selectedObject, new THREE.Vector3(1, 0, 0), targetRotationY);
    }
}

function rotateAroundWorldAxis( object, axis, radians ) {

    const rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis( axis.normalize(), radians );
    rotationMatrix.multiply( object.matrix );                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix( object.matrix );
}

function onDocumentMouseMoveTranslate(event){
    event.preventDefault();
    const vector = new THREE.Vector3((event.offsetX / getWidth('drawDiv')) * 2 - 1,
        - (event.offsetY / getHeight('drawDiv')) * 2 + 1, 1);
    vector.unproject( camera);

    const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    if (selectedObject){
        const intersects = raycaster.intersectObject(plane);

        selectedObject.position.copy(intersects[0].point.sub(offset));
    }
}
function onDocumentMouseMoveUpdatePlane(event) {
    event.preventDefault();
    const vector = new THREE.Vector3((event.offsetX / getWidth('drawDiv')) * 2 - 1,
        - (event.offsetY / getHeight('drawDiv')) * 2 + 1, 1);
    vector.unproject( camera);

    const raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    const intersects = raycaster.intersectObjects(objectMapList);
    if (intersects.length > 0) {
        plane.position.copy(intersects[0].object.parent.position);
    }
}

function onDocumentMouseOut( event ) {
    event.preventDefault();
    selectedObject = null;
    controls.enabled = true;
    container.removeEventListener( 'mousemove', onDocumentMouseMoveRotate, false );
    container.removeEventListener( 'mousemove', onDocumentMouseMoveTranslate, false );
    container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}
function onDocumentMouseUp(event){
    event.preventDefault();
    selectedObject = null;
    controls.enabled = true;
    container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    container.removeEventListener('mousemove', onDocumentMouseMoveRotate, false );
    container.removeEventListener('mousemove', onDocumentMouseMoveTranslate, false );
    container.addEventListener('mousemove', onDocumentMouseMoveUpdatePlane, false );
}
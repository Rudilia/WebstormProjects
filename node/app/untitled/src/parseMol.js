function readFile(data) {
    const r = new FileReader();
    r.onload = ({target}) => {
        const file = target.result;
        parseMol(file)
    };
    r.readAsText(data);
    const button = document.getElementById('newFile');
    button.value = '';
}


function parseMol(file) {

    const lines = file.split('\n').map(s => s.replace(/\s+/g,' '))
.map(s => s.replace(/^\s*|\s*$/g, ""))
.filter(x => x && !(x.startsWith('#')));


    console.log(lines);

    let currLineNum = 0;
    while (currLineNum < lines.length-1){
        const currLine = lines[currLineNum];
        if (currLine == "@<TRIPOS>MOLECULE") {

            var molecule = new Molecule(moleculeCount, mode);
            molecules[moleculeCount] = molecule;
            ++moleculeCount;

            ++currLineNum;
            currLineNum = parseMolecule(molecule, lines, currLineNum);

        }  else if (currLine == "@<TRIPOS>ATOM"){
            console.log("here");
            var molecule =  molecules[moleculeCount-1];
            ++currLineNum;
            currLineNum = parseAtom(molecule, lines, currLineNum);
        } else if (currLine == "@<TRIPOS>BOND"){
            console.log("here2");
            var molecule =  molecules[moleculeCount-1];
            ++currLineNum;
            currLineNum = parseBond(molecule, lines, currLineNum);
        } else if (currLine[0] == "@"){
            ++currLineNum;
            currLineNum = skipLines(lines, currLineNum);
        } else {
            alert("Ошибка в файле");
            break;
        }
    }

    console.log(molecule);
    drawMolecules();
}

function skipLines(lines, currLineNum){
    console.log(lines);
    console.log(currLineNum);
    let currLine = lines[currLineNum];
    while (currLineNum < lines.length && currLine[0] != '@'){
        ++currLineNum;
        currLine = lines[currLineNum];
    }
    return currLineNum;
}

function parseMolecule(molecule, lines, currLineNum){
    molecule.setName(lines[currLineNum]);
    molecule.setType(lines[currLineNum+2]);
    currLineNum += 4;
    let currLine = lines[currLineNum];
    while (currLineNum < lines.length && currLine[0] != '@'){
        ++currLineNum;
        currLine = lines[currLineNum];
    }
    return currLineNum;
}

function parseAtom(molecule, lines, currLineNum ){
    let currLine = lines[currLineNum];
    while (currLineNum < lines.length && currLine[0] != '@'){
        const lineSplitted = currLine.split(' ');
        let id, x, y, z, element;
        id = lineSplitted[0];
        x = parseFloat(lineSplitted[2]);
        y = parseFloat(lineSplitted[3]);
        z = parseFloat(lineSplitted[4]);
        element = lineSplitted[5];
        const atom = new Atom(element, x, y, z);
        molecule.addAtom(id, atom);
        ++currLineNum;
        currLine = lines[currLineNum];
    }
    return currLineNum;
}

function parseBond(molecule, lines, currLineNum ){
    let currLine = lines[currLineNum];
    while ( currLineNum < lines.length && currLine[0] != '@'){
        const lineSplitted = currLine.split(' ');
        let bondFrom, bondTo, typeOfBond;
        bondFrom = molecule.getAtomNumById(lineSplitted[1]);
        bondTo = molecule.getAtomNumById(lineSplitted[2]);
        typeOfBond = lineSplitted[3];
        const bond = new Bond(bondFrom, bondTo, typeOfBond);
        molecule.addBond(bond);
        ++currLineNum;
        currLine = lines[currLineNum];
    }

    return currLineNum;
}
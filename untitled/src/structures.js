"use strict";


function Atom(elem, x, y, z) {
    this.elem = elem;
    this.x = x;
    this.y = y;
    this.z = z;
    this.name = elem.split(".")[0];

    this.getName = function () {
        return this.name;
    };

    this.getColor = function(){
        if (this.name.toUpperCase() in CPK){
            return parseInt(CPK[this.name.toUpperCase()]['color'], 16);
        } else {
            console.log('unrecognized atom: ' + this.name);
            return 0x000000;
        }
    };
    this.getRadius = function(){
        if (this.name in CPK){
            return parseInt(CPK[this.name]['size'], 10)/100;
        } else {
            console.log('unrecognized atom: ' + this.name);
            return 1;
        }
    }

}

function Bond(bondFrom, bondTo, typeOfBond) {
    this.bondFrom = bondFrom;
    this.bondTo = bondTo;
    this.typeOfBond = typeOfBond;

    this.getBondFrom = function () {
        return this.bondFrom;
    };

    this.getBondTo = function () {
        return this.bondTo;
    };
}

function Molecule(moleculeNum, mode){
    this.name = "";
    this.type = "";
    this.atomsID = {};
    this.atoms = [];
    this.bonds = [];
    this.moleculeNum = moleculeNum;
    this.mode = mode;


    this.setMode = function (mode) {
        this.mode = mode;
    };
    this.getMode = function () {
       return this.mode;
    };

    this.setName = function(name) {
        this.name = name;
    };
    this.getName = function() {
        return this.name;
    };
    this.setType = function (type){
        this.type = type;
    };
    this.getType = function (){
       return this.type;
    };
    this.addAtom = function(id, atom){
        this.atoms.push(atom);
        this.atomsID[id] = this.atoms.length - 1;
    };

    this.addBond = function(bond){
        this.bonds.push(bond);
    };

    this.getAtomNumById = function(id){
        return this.atomsID[id];
    };

    this.getAtoms = function () {
        return this.atoms;
    };
    this.getBonds = function () {
        return this.bonds;
    };

    this.getMoleculeNum = function(){
      return this.moleculeNum;
    };


    this.getCenter = function() {
        let x = 0, y = 0, z = 0;
        for (let i in this.atoms) {
            x += this.atoms[i].x;
            y += this.atoms[i].y;
            z += this.atoms[i].z;
        }
        const len = this.atoms.length;
        return new THREE.Vector3(x/len, y/len, z/len);
    };

    this.moveToCenter = function() {
        const center = this.getCenter();
        for (let i in this.atoms) {
            this.atoms[i].x -= center.x;
            this.atoms[i].y -= center.y;
            this.atoms[i].z -= center.z;
        }
    };

}
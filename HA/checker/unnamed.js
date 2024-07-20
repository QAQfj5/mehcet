"use strict";
const console = require('console');
const { readFileSync, writeFileSync } = require('fs');
var cations   = JSON.parse(readFileSync('./cations.json').toString());
var anions    = JSON.parse(readFileSync('./anions.json').toString());
var substance = JSON.parse(readFileSync('./substance.json').toString());
substance.forEach(x => {
    if(x.mfG == 28930) x.mfG = undefined;
    if(x.mfH == 28930) x.mfH = undefined;
    if(x.mfS == 28930) x.mfS = undefined;
});
cations.forEach(x => {
    if(x.mfG == 28930) x.mfG = undefined;
    if(x.mfH == 28930) x.mfH = undefined;
    if(x.mfS == 28930) x.mfS = undefined;
});
anions.forEach(x => {
    if(x.mfG == 28930) x.mfG = undefined;
    if(x.mfH == 28930) x.mfH = undefined;
    if(x.mfS == 28930) x.mfS = undefined;
});



// console.log(substance);
// console.log(cations);
// console.log(anions);

function get_pos(name, Array) { // get substance/anions/cations/simple's position in <array>(substance)
    var l = 0, r = Array.length;
    while(l + 1 < r) {
        var mid = (l + r) >> 1;
        if(Array[mid][0].name <= name) l = mid;
        else r = mid;
    }
    if(Array[l][0].name != name) return undefined;
    return l;
}

// console.log(substance[get_pos("Na2SO4", substance)]);
var mixture = [
    ["Ba", +2, "cations"], ["SO4", -2, "anions"], ["NaCl", 0, "substance"]
];
function check_react(mixture) {
    var Anion = [], Cation = [], Substance = [], Simple = [], Candidate = [], Element = [];
    mixture.forEach(x => {
        if(x[2] == "anions") {
            Anion.push(x);
            var p = get_pos(x[0], anions)
            anions[p].forEach(ion => { // find true ion
                if(ion.charge == x[1]) { // true ion
                    ion.element.forEach(Ele => { Element.push(Ele); }); // decompose element
                }
            });
        } else if(x[2] == "cations") {
            var p = get_pos(x[0], cations);
            Cation.push(x);
            cations[p].forEach(ion => {
                if(ion.charge == x[1]) {
                    ion.element.forEach(Ele => { Element.push(Ele); });
                }
            });
        } else if(x[2] == "substance") {
            var ps = get_pos(x[0], substance);
            substance[ps][0].cation.forEach(ion => {
                var p = get_pos(ion[0], cations);
                cations[p][0].element.forEach(Ele => { Element.push(Ele); });
            });
            substance[ps][0].anion.forEach(ion => {
                var p = get_pos(ion[0], anions);
                anions[p][0].element.forEach(Ele => { Element.push(Ele); });
            });
        } 
        // else if(x[2] == "simple"){
        //     var p = get_pos(x[0], cations);
        //     Simple.push(x);
        //     Simple[p].forEach(sub => {
        //     
        //             ion.element.forEach(Ele => { Element.push(Ele); });
        //         }
        //     });
        // }
    });
    Element.sort();
    substance.forEach(x => { // substance -> cation / anion -> element
        var record = [];
        x[0].cation.forEach(ion => {
            var p = get_pos(ion[0], cations);
            cations[p][0].element.forEach(Ele => { record.push(Ele); });
        });
        x[0].anion.forEach(ion => {
            var p = get_pos(ion[0], anions);
            anions[p][0].element.forEach(Ele => { record.push(Ele); });
        });
        // console.log(x[0].name);
        // console.log(record);
        record.sort();

        // console.log(record);
        var first1 = 0, last1 = Element.length, first2 = 0, last2 = record.length, flg = 1;
        for (; first2 != last2; ++first1) {
            if (first1 == last1 || record[first2] < Element[first1]) {
                flg = 0;
                break;
            }
            if (!(Element[first1] < record[first2])) ++first2;
        }
        if(flg == 1) Candidate.push(x[0]); 
    });
    console.log(Element);
    console.log(Candidate);
}
check_react(mixture);
var equation = {
    from: [["H2SO4", 1, "substance"], ["NaOH", 2, "substance"]],
    to: [["Na2SO4", 1, "substance"], ["H2O", 2, "simple"]]
};
function calc_gibbs(equation) {  // calculate an equation's gibbs free energe, but it's can't work now.
    var gibbs = 0;
    equation.from.forEach(x => {
        if(x[2] == "substance") gibbs = gibbs - substance[x[0]].mfG * x[1];
        if(x[2] == "simple") gibbs = gibbs - simple[x[0]].mfG * x[1];
        if(x[2] == "cations") gibbs = gibbs - cations[x[0]].mfG * x[1];
        if(x[2] == "anions") gibbs = gibbs - anions[x[0]].mfG * x[1];
    });
    equation.to.forEach(x => {
        if(x[2] == "substance") gibbs = gibbs + substance[x[0]].mfG * x[1];
        if(x[2] == "simple") gibbs = gibbs + simple[x[0]].mfG * x[1];
        if(x[2] == "cations") gibbs = gibbs + cations[x[0]].mfG * x[1];
        if(x[2] == "anions") gibbs = gibbs + anions[x[0]].mfG * x[1];
        // gibbs = gibbs + substance[x[0]].mfG * x[1];
    });
    console.log(gibbs);
}

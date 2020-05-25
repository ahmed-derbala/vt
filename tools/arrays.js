//extract ids from an object and pusht them into an array
exports.getIdsOnArray = (idsString) => {
    if (!idsString) throw new Error('The array input cant be null')
    idsString = idsString.toString()
    let id, ids = []
    if (idsString[0] == '[') {
        idsString = idsString.slice(1, idsString.length - 1)
    }
    if (idsString[idsString.length - 1] == ']') {
        idsString = idsString.slice(0, idsString.length - 1)
    }

    while (idsString.length != 0) {
        if (idsString.includes(',')) {
            id = idsString.slice(0, idsString.indexOf(','))
        } else {
            id = idsString.slice(0, idsString.length)
        }
        if (parseInt(id) || id == 0) {
            ids.push(parseInt(id))
        }
        idsString = idsString.slice(id.length + 1, idsString.length)
    }
    return ids
}

//remove from array
exports.arrayRemove = (arr, value) => {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

//check if 2 matrixs are equals or not
exports.compare2Matrixs = (m1, m2, matrixHeight, matrixWidth) => {
    for (var h = 0; h < matrixHeight; h++) {
        for (var w = 0; w < matrixWidth; w++) {
            if (m1[h][w] != m2[h][w]) {
                return false
            }
        }
    }
    return true
}
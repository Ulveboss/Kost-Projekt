let test = []
document.getElementById('submit').addEventListener('click', () => {
    console.log(document.getElementById('searchBar').value)
    let object = {
        type: document.getElementById('searchBar').value,
        amount: document.getElementById('mængde').value + ' g'
    }
    test.push(object)
    console.log(test)

    document.getElementById('seachBar').value = ""
    document.getElementById('mængde').innerHTML = ""
})
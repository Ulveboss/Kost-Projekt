let test = {
    mad: []
}
document.getElementById('submit').addEventListener('click', () => {
    console.log(document.getElementById('searchBar').value)
    let object = {
        type: document.getElementById('searchBar').value,
        amount: document.getElementById('mængde').value + ' g'
    }
    test.mad.push(object)
    //test.push(object)
    console.log(test)

    document.getElementById('searchBar').value = ""
    document.getElementById('mængde').value = ""
})  
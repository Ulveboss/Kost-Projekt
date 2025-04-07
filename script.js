// icl ts pmo
let lookUpData = []
let database = []
let userData = {
  food: []
}
let saveState = true;


import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";



fetch('lookUp.json')

    .then(response => response.json())

    .then(data => {

        lookUpData = data;

        autocomplete(document.getElementById("myInput"), lookUpData);
    })

fetch('database.json')
    .then(response => response.json())
    .then(data => {

      database = data
      pageOpen()
    } )

document.getElementById('clear').addEventListener('click', e => {
  localStorage.clear();
  saveState = false;
  window.location.reload()  
})

    document.getElementById('submit').addEventListener('click', e => {
      let currentFødevare = document.getElementById('myInput').value
      let index = lookUpData.indexOf(currentFødevare)

      let fødevare = {
        foodID: index,
        amount: document.getElementById('amount').value
      }
  
      

      userData.food.push(fødevare)

      displayFoodList()

      
      document.getElementById('myInput').value = ""
      document.getElementById('amount').value = ""

      showData()
      
      formUpdate()

    })


function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      
      for (i = 0; i < arr.length; i++) {
        
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          
          b = document.createElement("DIV");
          
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          
              b.addEventListener("click", function(e) {
              
              inp.value = this.getElementsByTagName("input")[0].value;
          
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        
        currentFocus++;
        
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
       
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
   
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
   
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
   
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
   
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

function convert(type) {
  let sum = 0;
  for(let i = 0; i < userData.food.length; i++){
   let fødevare = database[userData.food[i].foodID][type]
    sum +=  fødevare * userData.food[i].amount/100
  }
  return sum
}

function showData(...types) {
  let arcGenerator = d3.arc()
    .innerRadius(30)
    .outerRadius(100)
    .padAngle(.02)
    .padRadius(100)
    .cornerRadius(4);

  const pie = d3.pie();

  let data = []
for(let i = 0; i < types.length; i++){
  if(types[i]){
    data.push(convert(types[i].name))
  }
}
  let arcData = pie(data);



  
  let g = d3.select('g')
    .selectAll('path')
    .data(arcData)
    .join('path')
    .attr('d', arcGenerator)
    .style('fill', (d, i) => types[i].color);


  d3.select('g')
    .selectAll('text')
    .data(arcData)
    .join('text')
    .attr('transform', d => `translate(${arcGenerator.centroid(d)})`) 
    .attr('text-anchor', 'middle') 
    .attr('dy', '0.35em') 
    .style('fill', 'black') 
    .style('font-size', '14px') 
    .text((d, i) => types[i].name);
}



function displayFoodList() {
  const foodList = document.getElementById('foodContainer')
  while (foodList.firstChild){
    foodList.removeChild(foodList.firstChild)
  }
  
  for(let i = 0; i < userData.food.length; i++){
    let fødevare = document.createElement('p')
    fødevare.innerHTML = database[userData.food[i].foodID].FødvareNavn + ": " + userData.food[i].amount + " g"
    foodList.appendChild(fødevare)
  }
 

 
}

function showFoodStats(...types) {
  const div = document.getElementById("foodStats");
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  for(let i = 0; i < types.length; i++){
    if(types[i]){
      let paragraph = document.createElement('p')
      let number = convert(types[i])
      paragraph.innerHTML = `${types[i]}` + ": " + `${Math.round(number,2)}` + ` g `
      div.appendChild(paragraph)
    }
   
  }

}
function pageOpen() {
  if(userData.food.length > 0){
    displayFoodList()
    showData({name: "Protein", color: "yellow"},{name: "Fedt", color: 'red'}, {name: "Tilgængelig kulhydrat", color: 'green'})
    showFoodStats("Protein", "Tilgængelig kulhydrat", 'Fedt')
  }
}
window.addEventListener('beforeunload', (event) => {
  if(saveState) localStorage.setItem('foodItems', JSON.stringify(userData))
})

window.addEventListener("load", (event) => {
  if(JSON.parse(localStorage.getItem('foodItems'))){
    userData = JSON.parse(localStorage.getItem('foodItems'))  
  }

});
document.getElementById('checkBoxes').addEventListener('click', (e) => {
  formUpdate()
})

function formUpdate() {
  let checkboxeslength = document.getElementById('checkBoxes').length
  let form = document.getElementById('checkBoxes')
  let test = form.elements
  let arr = []
  for(let i = 0; i < checkboxeslength; i++){
    if(document.getElementById(test[i].id).checked){
      let checkbox = document.getElementById(test[i].id)
      let colorvalue = checkbox.getAttribute('data-color')
      let obj = {name: checkbox.id, color: colorvalue}
      arr.push(obj)
    }
  }
  showData(...arr)
  showFoodStats(...arr.map(arr => arr.name))

}
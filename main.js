// most used variales:
let addEx = document.querySelector(`.addEx`);
let deleteEx = document.getElementsByClassName(`deleteEx`)[0];
let displayEx = document.querySelector(`.displayEx`);
let exNameInput = document.getElementById(`exNameInput`);
let exWeightInput = document.getElementById(`exWeightInput`);
let exercises = document.querySelector(`.exercises`);
let weightUnit = document.getElementById(`weightUnit`);
let aboutContent = document.querySelector(`.aboutContent`);
let darkModeDiv = document.querySelector(`.darkMode`);
let body = document.querySelector(`body`);
let hr = document.querySelector(`.hr`);
let infoBtn = document.querySelector(`.infoBtn`);
let infoAbout = document.querySelector(`.infoAbout`);
let displayName = document.querySelector(`.displayName`);
let displayExBtn = document.querySelector(`.displayExBtn`);
let addWeightBtn = document.querySelector(`.addWeightBtn`);
let selectIcon = document.getElementsByClassName(`selectIcon`);
let chevron = document.getElementsByClassName(`chevron`);

let date = new Date();
let weekDays = [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`];
let dateNow = date.toLocaleString(`en-US`, {weekday: `short`});

// get inputs valuse
function getInputs(){
     displayEx.style.display = `block`;
     displayName.style.display = `block`;
     weightUnit.style.display = `block`;
     displayExBtn.style.display = `inline-block`;
     exWeightInput.style.width = `120px`;
     addWeightBtn.style.display = `none`;
     exNameInput.focus();
}

// save the mode
let isDay;
if (localStorage.isDay) {
     isDay = JSON.parse(localStorage.isDay);
     isDay == true ? dayMode(): darkMode();
}
else{
     isDay = true;
}

// calling Exercises data
let dataEx;
if (localStorage.exercises) {
     dataEx = JSON.parse(localStorage.exercises);
     dataEx.length == 0 ? aboutContent.style.display = `block`: aboutContent.style.display = `none`;
     dataEx.length == 0 ? deleteEx.style.display = `none`: deleteEx.style.display = `block`;
     getExercises();
     checkHistorySpots();
}
else{
     dataEx = [];
     deleteEx.style.display = `none`;
     aboutContent.style.display = `block`;
}


// creating an exercise
function addExercise(){
     // check if there's value in the inputs or not
     if (!exNameInput.value){
          exNameInput.style.border = `1px solid red`;
     }
     if (!exWeightInput.value){
          exWeightInput.style.border = `1px solid red`;
     }
     
     if (exNameInput.value && exWeightInput.value) {
          exWeightInput.value > 200 ? exWeightInput.value = 200: exWeightInput.value;
          exWeightInput.value < 2.5 ? exWeightInput.value = 2.5: exWeightInput.value;
          exNameInput.style.border = `none`;
          exWeightInput.style.border = `none`;
          aboutContent.style.display = `none`;
          deleteEx.style.display = `block`;
          // create new object that contain exercise details
          let newEx = {
               name: exNameInput.value,
               weight: exWeightInput.value,
               unit: weightUnit.value,
               // exercise date:
               dayName: date.toLocaleString(`en-US`, {weekday: `short`}),
               monthName: date.toLocaleString(`en-US`, {month: `short`}),
               dayNum: date.getDate(),
               isSameDay: false,
               isSelect: false,
               weightHistory: []
          };
          // add the object to the array and save it in localStorge
          dataEx.push(newEx);
          localStorage.exercises = JSON.stringify(dataEx);
          getExercises();
          checkHistorySpots();
          

          // reset the inputs
          exNameInput.value = ``;
          exWeightInput.value = ``;
          displayEx.style.display = `none`;
     }
}

// check the inPuts Values
function checkValue(value){
     inputValue = document.getElementById(value);

     if (inputValue.value == ``) {
          inputValue.style.border = `1px solid red`;
     }
     else{
          inputValue.style.border = `none`;
     }
}

// loop on the exercises array and create html elements for every exercise
function getExercises(){
     // reset the parent element 
     exercises.innerHTML = ``;

     for (let i = 0; i < dataEx.length; i++) {

          let weightVar = dataEx[i].weight;
          let exUnit = dataEx[i].unit;
          exercises.innerHTML += `
               <div class="exercise">

                         <div class="exName">${dataEx[i].name}</div>
                         <div class="lastWeight">last weight: ${dataEx[i].weight}${exUnit}</div>
                         <div class="chevron" id="${i}" onclick="rotateAnime(this.id)">
                              <i class="fa-solid fa-chevron-up"></i>
                         </div>
                         <div class="selectIcon" onclick="selectDelete(this.id)" id="${i}">
                              <div class="unSelected">
                                   <i class="selectDelete fa-regular fa-circle"></i>
                              </div>
                              <div class="selected">
                                   <i class="fa-solid fa-circle-xmark"></i>
                              </div>
                         </div>
                         <hr class="exHr">

                         <section class="details">
                              <div class="exDate">
                                <!--   <i class="fa-solid fa-chevron-up" id="left"></i> -->
                                   <h3 class="exWeight">${weightVar}${exUnit}</h3>
                                   <h3 class="date">${dataEx[i].dayName}, ${dataEx[i].monthName} ${dataEx[i].dayNum}</h3>
                                <!--   <i class="fa-solid fa-chevron-up" id="right"></i> -->
                              </div>

                              <i class="fa-solid fa-plus addIcon" onclick="displayWeight()" ></i>

                              <div class="exHistory">
                                   <div class="sun"><p class="parSun"></p>sun</div>
                                   <div class="mon"><p class="parMon"></p>mon</div>
                                   <div class="tue"><p class="parTue"></p>tue</div>
                                   <div class="wed"><p class="parWed"></p>wed</div>
                                   <div class="thu"><p class="parThu"></p>thu</div>
                                   <div class="fri"><p class="parFri"></p>fri</div>
                                   <div class="sat"><p class="parSat"></p>sat</div>
                              </div>

                         </section>
     
                    </div>
          `;
          getWeights(i);

          if (dataEx[i].weight !== 0) {
               let dayWeight = document.getElementsByClassName(`par${dataEx[i].dayName}`)[i];
               dayWeight.innerText = dataEx[i].weight + dataEx[i].unit;
          }
     }

}

// loop on weights history and set the values
function getWeights(index){
     let curWeight = dataEx[index].weightHistory;
     for (let i = 0; i < curWeight.length; i++) {
          if (dataEx[index].weightHistory[0]) {
               let currentDate = dataEx[index].weightHistory[i];
               let exIndex = document.getElementsByClassName(`par${currentDate.weightDate}`)[index];
               exIndex.innerText = currentDate.weightValue + dataEx[index].unit;
          }
     }
     
}



/*<------------------------------------------------>*/



// make rotate animation and display exercise details
let exWeightId;
function rotateAnime(index){
     checkHistorySpots();

     let chevron = document.getElementsByClassName(`chevron`)[index];
     let exercise = document.getElementsByClassName(`exercise`)[index];

     chevron.classList.toggle(`rotateAnimate`);
     exercise.classList.toggle(`exHeightAnimate`);
     exWeightId = index;

     if (dataEx[index].weightHistory.length > 0) {
          setDeteils(index);
     }

     setColumns(index);

     setLastSpot(index);
     

}

// set the details for last exercise
function setDeteils(index){
     let lastIndex = dataEx[index].weightHistory.length - 1;
     let exWeight = document.getElementsByClassName(`exWeight`)[index];
     let dateDiv = document.getElementsByClassName(`date`)[index];
     let lastWeight = dataEx[index].weightHistory[lastIndex];

     exWeight.innerText = lastWeight.weightValue + dataEx[index].unit;
     dateDiv.innerText = `${lastWeight.weightDate}, ${lastWeight.weightMonth} ${lastWeight.weightDay}`;
}

function setLastSpot(index){
     let lastIndex = dataEx[index].weightHistory.length - 1;
     let lastWeight = dataEx[index].weightHistory[lastIndex];
     if (dataEx[index].weightHistory.length > 0) {
          let exIndex = document.getElementsByClassName(lastWeight.weightDate.toLowerCase())[index];
               if (isDay) {
                    exIndex.style.backgroundColor = `#504C4C`;
               }
               else{
                    exIndex.style.backgroundColor = `#F2EDED`;
               }
     }
     else{
          let exIndex = document.getElementsByClassName(dataEx[index].dayName.toLowerCase())[index];

          if (isDay) {
               exIndex.style.backgroundColor = `#504C4C`;
          }
          else{
               exIndex.style.backgroundColor = `#F2EDED`;
          }
     }

}

// rate the columns height by weights
function setColumns(index){
     let weights = [];
     let dates = [];
     for (let i = 0; i < weekDays.length; i++) {
          let pIndex = document.getElementsByClassName(`par${weekDays[i]}`)[index];
          if (pIndex.innerText) {
               weights.push(filterNums(pIndex.innerText));
               dates.push(weekDays[i].toLowerCase());
          }
     }

     let maxHeight = 90;
     let maxWeight = Math.max(...weights);
     weights.forEach((weight, i) => {
          let divIndex = document.getElementsByClassName(dates[i])[index];
          let height = (weight / maxWeight) * maxHeight;

          divIndex.style.height = `${height + 75}px`;
     });
}

// filter the numbers inside a string
function filterNums(num){
     let result = ``;
     for (let i = 0; i < num.length; i++) {
          if (Number(num[i]) || num[i] == `0`) {
               result += num[i];
          }          
     }
     return Number(result);
}


function cancel(){
     displayEx.style.display = `none`;
     exWeightInput.value = ``;
     exNameInput.value = ``;
}



/*<------------------------------------------------>*/




// display a screen to add weight
function displayWeight(weightId){
     displayEx.style.display = `block`;
     addWeightBtn.style.display = `inline-block`;
     displayName.style.display = `none`;
     displayExBtn.style.display = `none`;
     weightUnit.style.display = `none`;
     exWeightInput.style.width = `fit-content`;
     exWeightInput.focus();
}

// add new weight and its details
function addWeight(){
     let exDates;
     if (dataEx[exWeightId].weightHistory) {
          exDates = dataEx[exWeightId].weightHistory;
     }
     else{
          exDates = [];
     }
     
     let exDate = {};

     let currentDay;
     currentDay = document.getElementsByClassName(`par${dateNow}`)[exWeightId];
     // check if the input value there and not added more than weight in the same day and the spot is empty
     if (exWeightInput.value && !dataEx[exWeightId].isSameDay && !currentDay.innerText) {
          exWeightInput.value > 200 ? exWeightInput.value = 200: exWeightInput.value;
          exWeightInput.value < 2.5 ? exWeightInput.value = 2.5: exWeightInput.value;
          currentDay.innerText = exWeightInput.value + dataEx[exWeightId].unit;
          exDate.weightValue = exWeightInput.value;
          exDate.weightDate = date.toLocaleString(`en-US`, {weekday: `short`});
          exDate.weightMonth = date.toLocaleString(`en-US`, {month: `short`});
          exDate.weightDay = date.getDate();
          exDates.push(exDate);
          dataEx[exWeightId].weightHistory = exDates;
          dataEx[exWeightId].isSameDay = true;
          localStorage.exercises = JSON.stringify(dataEx);
          setColumns(exWeightId);
          checkHistorySpots();            
     }
     else{
          warningMsg(`you can't add more than one weight per day`);
     }
     displayEx.style.display = `none`;
     addWeightBtn.style.display = `none`;
     exWeightInput.value = ``;
     
}

// loop on history and check if there's value or not
function checkHistorySpots(){
     // check if there's empty spot
     let exHistory = document.querySelectorAll(`.exHistory div`);
     for (let i = 0; i < exHistory.length; i++) {
          let exIndex = document.querySelectorAll(`.exHistory div`)[i];
          let pIndex = document.querySelectorAll(`.exHistory div p`)[i];

          if (isDay) {
               
               if (!pIndex.innerText) {
                    exIndex.style.backgroundColor = `transparent`;
                    exIndex.style.color = `black`;
               }
               else{
                    exIndex.style.backgroundColor = `#716A6A`;
                    exIndex.style.color = `white`;
               }
          }
          else {

               if (!pIndex.innerText) {
                    exIndex.style.backgroundColor = `transparent`;
                    exIndex.style.color = `#F2EDED`;
               }
               else{
                    exIndex.style.backgroundColor = `#AEAAAA`;
                    exIndex.style.color = `#041D38`;
               }
          }
     }

     // coloring add weight button and last weight text
     for (let i = 0; i < dataEx.length; i++) {
          let addIcon = document.querySelectorAll(`.addIcon`)[i];
          let lastWeight = document.querySelectorAll(`.lastWeight`)[i];
          setLastSpot(i);
          if (isDay) {
               addIcon.style.backgroundColor = `black`;
               addIcon.style.color = `white`;
               lastWeight.style.color = `#504c4c`;
          }
          else{
               addIcon.style.backgroundColor = `#F2EDED`;
               addIcon.style.color = `#041D38`;
               lastWeight.style.color = `#DDDDDD`;
          }

     }
}

// show an error message if an error happend
function warningMsg(msg) {
     let warningNav = document.querySelector(`.warning`);
     let warning = document.querySelector(`.warning h3`);

     warning.innerText = msg;
     warningNav.classList.toggle(`warningAnimate`);
     setTimeout(()=> {
          warningNav.classList.toggle(`warningAnimate`);
     }, 4000)
}


/*<------------------------------------------------>*/



// calculate the time spent out the site
let exitTime;
let timeAway;
let weekAway;
// get the time when user close the site
window.addEventListener(`beforeunload`, () =>{
     exitTime = {
          timeInHour: date.getHours(),
          timeInMilli: Date.now()
     };
     localStorage.exitTimeValum = JSON.stringify(exitTime);
});

window.addEventListener(`load`, () =>{
     if (localStorage.exitTimeValum) {
          exitTime = JSON.parse(localStorage.exitTimeValum);
     }
     else{
          exitTime = {
               timeInHour: date.getHours(),
               timeInMilli: Date.now()
          };
     }
     timeAway = 24 - exitTime.timeInHour;
     timeAway *= 3600000;
     setTimeout(()=> {
          for (let i = 0; i < dataEx.length; i++) {
               dataEx[i].isSameDay = false;
          }
          localStorage.exercises = JSON.stringify(dataEx);
     }, timeAway);
     if (localStorage.exercises) {
          let currentDate = Date.now();
          weekAway = currentDate - exitTime.timeInMilli;
          let weekInMilli = 604800000;
          timeLeft = weekInMilli - weekAway;
          if (timeLeft < weekInMilli) {
               daysLeft = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
               console.log(timeLeft, daysLeft);
          }
          else{
               for (let i = 0; i < dataEx.length; i++) {
                    dataEx[i].weight = 0;
                    if (dataEx[i].weightHistory.length > 0) {
                         dataEx[i].weightHistory.splice(0);
                    }
               }
          }
     }
});



/*<------------------------------------------------>*/



// turn to delete mode when click
let isFirstClick = false;
function deleteExercises(){
     // if it's the first click turn to delete mode
     if (!isFirstClick) {
          deleteEx.style.animationPlayState = `running`;
          for (let i = 0; i < dataEx.length; i++) {
               chevron[i].style.display = `none`;
               selectIcon[i].style.display = `block`;

               unSelected[i].style.display = `block`;
               selected[i].style.display = `none`;
          }
          isFirstClick = true;
     }
     // if it's not the first click turn back
     else{
          deleteEx.style.animationPlayState = `paused`;
          for (let i = 0; i < dataEx.length; i++) {
               chevron[i].style.display = `block`;
               selectIcon[i].style.display = `none`;
          }
          dataEx = dataEx.filter(data => data.isSelect == false);
          localStorage.exercises = JSON.stringify(dataEx);
          isFirstClick = false;
          getExercises();
          checkHistorySpots();
          // check if there's no exercise show thats no exercise (aboutContent string)
          // and hide the delete button
          if (dataEx.length == 0) {
               aboutContent.style.display = `block`;
               deleteEx.style.display = `none`;
          }
          else{
               aboutContent.style.display = `none`;
               deleteEx.style.display = `block`;
          }
     }
}

// know the selected exercises
let unSelected = document.getElementsByClassName(`unSelected`);
let selected = document.getElementsByClassName(`selected`);
function selectDelete(index){
     if (unSelected[index].style.display == `block`) {
          unSelected[index].style.display = `none`;
          selected[index].style.display = `block`;
          dataEx[index].isSelect = true;
     }
     else {
          unSelected[index].style.display = `block`;
          selected[index].style.display = `none`;
          dataEx[index].isSelect = false;
     }
}



/*<------------------------------------------------>*/



// change the mode to day or dark
let changeModeDiv = document.querySelector(`.changeModeDiv`);
let isInfo = false;

function changeMode(event){
     const x = event.clientX;
     const y = event.clientY;
     const theBtn = event.target.id;
     let elDisplay;
     let zIndexBtn;
     let infoInner;
     if (theBtn == `info`) {
          if (isInfo) {
               infoInner = `<i class="fa-solid fa-question" id="info"></i>`;
               elDisplay = `none`;
               zIndexBtn = 0;
               isInfo = false;
          }
          else{
               infoInner = `<i class="fa-solid fa-circle-xmark" id="info"></i>`;
               elDisplay = `block`;
               zIndexBtn = 125;
               isInfo = true;
          }
          changeModeDiv.style.backgroundColor = `black`;
          changeModeDiv.style.top = `${y - 18}px`; 
          changeModeDiv.style.left = `${x - 18}px`; 
          changeModeDiv.style.animationName = `cover`;
          setTimeout(() => {
               infoAbout.style.display = elDisplay;
               infoBtn.innerHTML = infoInner;
               infoBtn.style.zIndex = zIndexBtn;
          }, 1000);
          setTimeout(() => {
               changeModeDiv.style.top = `0`;
               changeModeDiv.style.animationName = `none`;
          }, 2000);
     }
     else {
          if (isDay) {
               changeModeDiv.style.backgroundColor = `#041D38`;
               isDay = false;
               localStorage.isDay = JSON.stringify(isDay);
               setTimeout(() => {
                    darkMode();
                    checkHistorySpots();
               }, 1000);
          }
          else {
               changeModeDiv.style.backgroundColor = `white`;
               isDay = true;
               localStorage.isDay = JSON.stringify(isDay);
               setTimeout(() => {
                    dayMode();
                    checkHistorySpots();
               }, 1000);
          }
          changeModeDiv.style.top = `${y - 18}px`; 
          changeModeDiv.style.left = `${x - 18}px`; 
          changeModeDiv.style.animationName = `cover`;
          setTimeout(() => {
               changeModeDiv.style.top = `0`;
               changeModeDiv.style.animationName = `none`;
          }, 2000);

     }

}

// change every element to dark mode color :{
function darkMode(){
     body.style.backgroundColor = `#041D38`;
     infoAbout.style.backgroundColor = `#041D38`;
     displayExBtn.style.backgroundColor = `#041D38`;
     addWeightBtn.style.backgroundColor = `#041D38`;
     infoBtn.style.color = `#041D38`;
     displayEx.style.color = `#041D38`;
     addEx.style.color = `#041D38`;
     body.style.color = `#F2EDED`;
     displayExBtn.style.color = `#F2EDED`;
     addWeightBtn.style.color = `#F2EDED`;
     infoAbout.style.color = `#F2EDED`;
     darkModeDiv.style.color = `#F2EDED`;
     addEx.style.backgroundColor = `#F2EDED`;
     infoBtn.style.backgroundColor = `#F2EDED`;
     weightUnit.style.backgroundColor = `#AAA7A7`;
     aboutContent.style.color = `#837F6A`;
     weightUnit.style.color = `#717171`;
     hr.style.border = `1px solid #A9A300`;
}

// change every element to day mode color
function dayMode(){
     body.style.backgroundColor = `white`;
     infoAbout.style.backgroundColor = `white`;
     addEx.style.color = `white`;
     infoBtn.style.color = `white`;
     displayExBtn.style.color = `white`;
     addWeightBtn.style.color = `white`;
     displayExBtn.style.color = `white`;
     displayEx.style.color = `black`;
     infoAbout.style.color = `black`;
     body.style.color = `black`;
     darkModeDiv.style.color = `black`;
     displayExBtn.style.backgroundColor = `black`;
     addWeightBtn.style.backgroundColor = `black`;
     addEx.style.backgroundColor = `black`;
     infoBtn.style.backgroundColor = `black`;
     displayExBtn.style.backgroundColor = `black`;
     weightUnit.style.backgroundColor = `white`;
     aboutContent.style.color = `#716A6A`;
     weightUnit.style.color = `black`;
     hr.style.border = `1px solid black`;
}
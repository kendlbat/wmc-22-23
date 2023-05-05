const HOMEPAGE = 'logTour';
const initFncs = {};

function attachEventHandler() {
    attach(document.querySelector("#logTourForm"), 'submit', sendTourData);
    attach(document.querySelector("#logTourGenerateRandom"), 'click', generateRandomTourData);
}

function attach(element, event, handler) {
    if (typeof (element) === 'string')
        element = document.getElementById(element);

    if (element && element.addEventListener) {
        element.addEventListener(event, handler);
        console.log(`eventhandler attatched: ${element.id} ${event} ${typeof (handler)}`);
    }
}

function registerInitFunction() {
    initFncs['tours'] = populateTours;
    initFncs['logTour'] = initLogTourForm;
    initFncs['tourStats'] = generateToursStatisticsTable;
}

/* **************** Application specific funtions ********************** */


function sendTourData(event) {
    event.preventDefault();
    let tourData = collectFormData();

    createToast(toastTypes.success, 'Tour data sent to backend');
    console.log('sending tour data to backend: ' + JSON.stringify(tourData));

    /* fetch('/api/tours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tourData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      }); */

    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tours', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 201) {
            console.log('success');
        } else {
            console.log('error');
        }
        navigate('#logTour');
    };
    xhr.send(JSON.stringify(tourData));
}

function initLogTourForm() {
    let classSelect = document.querySelector('#logTourClass');

    fetch('/api/classes')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                let option = document.createElement('option');
                option.value = element;
                option.text = element;
                classSelect.appendChild(option);
            });
        });

    fetch('/api/schools')
        .then(response => response.json())
        .then(data => {
            let schoolSelect = document.querySelector('#logTourCurrSchool');
            data.forEach(element => {
                let option = document.createElement('option');
                option.value = element.id;
                option.text = element.title;
                schoolSelect.appendChild(option);
            });
            createToast(toastTypes.success, 'Schulen geladen');
        });
}

function generateRandomTourData() {
    function generateRandomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    console.log('generating random tour data');

    let guideName = document.querySelector('#logTourGuide');
    let guideClass = document.querySelector('#logTourClass');
    let startTime = document.querySelector('#logTourStartTime');
    let endTime = document.querySelector('#logTourEndTime');
    let personCount = document.querySelector('#logTourPersonCount');
    let currSchool = document.querySelector('#logTourCurrSchool');

    const firstNamePool = ['Max', 'Moritz', 'Hans', 'Peter', 'Paul', 'Karl', 'Klaus'];
    const lastNamePool = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Schulz'];

    let randomFirstName = firstNamePool[generateRandomBetween(0, firstNamePool.length - 1)];
    let randomLastName = lastNamePool[generateRandomBetween(0, lastNamePool.length - 1)];
    let randomStartTimeH = generateRandomBetween(8, 18).toString().padStart(2, '0');
    let randomStartTimeM = generateRandomBetween(0, 59).toString().padStart(2, '0');
    let randomEndTimeH = generateRandomBetween(randomStartTimeH, 20).toString().padStart(2, '0');
    let randomEndTimeM = generateRandomBetween(0, 59).toString().padStart(2, '0');
    let randomPersonCount = generateRandomBetween(1, 10);

    guideName.value = `${randomFirstName} ${randomLastName}`;
    guideClass.selectedIndex = generateRandomBetween(1, guideClass.length - 1);
    startTime.value = `${randomStartTimeH}:${randomStartTimeM}`;
    endTime.value = `${randomEndTimeH}:${randomEndTimeM}`;
    personCount.value = randomPersonCount;
    currSchool.selectedIndex = generateRandomBetween(1, currSchool.length - 1);
}

function goBack() {
    history.back();
}

function collectFormData() {
    // Get array of formfields
    let fields = document.querySelectorAll('input, select, textarea');

    // Create json object
    let data = {};

    // Iterate over fields and save data
    fields.forEach(field => {
        // Check if the element is a checkbox
        if (field.type === 'checkbox') {
            // Set the value of the object with the checkbox name to true or false
            data[field.name] = field.checked;

        } else {
            field.name && (data[field.name] = field.value);
        }
    });

    return data;
}


function populateTours() {
    getTours().then((data) => {
        let toursTable = generateToursTable(data);

        let container = document.getElementById('toursTableContainer');
        container.appendChild(toursTable);
        console.log('populated tours');
    });
}

function getTours() {
    return new Promise(async (resolve, reject) => {
        data = await fetch('/api/tours');
        data = await data.json();
        console.log(data);
        resolve(data);
    });
}

function getToursStatistics() {
    return new Promise(async (resolve, reject) => {
        data = await fetch('/api/toursByStartTime');
        data = await data.json();
        console.log(data);
        resolve(data);
    });
}

function generateToursTable(tours) {
    let table = document.createElement("table");
    table.id = "toursTable";
    table.className = "table";
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let row = document.createElement("tr");
    let th = document.createElement("th");
    let td;

    th = document.createElement("th");
    td = document.createElement("td");


    th.appendChild(document.createTextNode("#"));
    th.scope = "col";
    row.appendChild(td);

    th = document.createElement("th");
    th.appendChild(document.createTextNode("Guide"));
    th.scope = "col";
    row.appendChild(th);

    th = document.createElement("th");
    th.scope = "col";
    th.appendChild(document.createTextNode("Klasse"));
    row.appendChild(th);

    th = document.createElement("th");
    th.scope = "col";
    th.appendChild(document.createTextNode("Schulnummer"));
    row.appendChild(th);

    th = document.createElement("th");
    th.scope = "col";
    th.appendChild(document.createTextNode("Startzeit"));
    row.appendChild(th);

    th = document.createElement("th");
    th.scope = "col";
    th.appendChild(document.createTextNode("# Personen"));

    row.appendChild(th);

    thead.appendChild(row);
    table.appendChild(thead);

    for (let i = 0; i < tours.length; i++) {
        row = document.createElement("tr");

        td = document.createElement("th");
        td.scope = "row";
        td.appendChild(document.createTextNode(i + 1));
        row.appendChild(td);

        td = document.createElement("td");
        td.appendChild(document.createTextNode(tours[i].guideName));
        row.appendChild(td);

        td = document.createElement("td");
        td.appendChild(document.createTextNode(tours[i].guideClass));
        row.appendChild(td);

        td = document.createElement("td");
        td.appendChild(document.createTextNode(tours[i].currSchool));
        row.appendChild(td);

        td = document.createElement("td");
        td.appendChild(document.createTextNode(tours[i].startTime));
        row.appendChild(td);

        td = document.createElement("td");
        td.appendChild(document.createTextNode(tours[i].numPersons));
        row.appendChild(td);
        
        tbody.appendChild(row);
    }

    table.appendChild(tbody);

    return table;
}

function generateToursStatisticsTable() {
    let container = document.querySelector('#tourStatsTableContainer');

    let table = document.createElement('table');
    table.id = 'tourStatsTable';
    table.className = 'table';

    let thead = document.createElement('thead');
    
    let th = document.createElement('th');
    th.scope = 'col';
    th.appendChild(document.createTextNode('Startzeit'));
    thead.appendChild(th);

    th = document.createElement('th');
    th.scope = 'col';
    th.appendChild(document.createTextNode('Anzahl'));
    thead.appendChild(th);

    table.appendChild(thead);

    let everyPossibleStartTime = [];
    for (let i = 14; i < 18; i++) {
        ["00", "15", "30", "45"].forEach((minute) => {
            everyPossibleStartTime.push(`${i.toString().padStart(2, '0')}:${minute}`);
        });
    }
    everyPossibleStartTime.push('18:00');

    let tbody = document.createElement('tbody');

    /**
     * @type {{[time: string]: {valueElement: HTMLTableCellElement, value: number}}}
     */
    let tablerows = {};

    everyPossibleStartTime.forEach((time) => {
        let row = document.createElement('tr');
        
        let td = document.createElement('td');
        td.appendChild(document.createTextNode(time));
        row.appendChild(td);
        
        td = document.createElement('td');
        td.appendChild(document.createTextNode('0'));
        row.appendChild(td);

        tablerows[time] = {
            valueElement: td,
            value: 0
        };
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);

    getToursStatistics().then((data) => {
        for (let key in data) {
            if (tablerows[key]) {
                tablerows[key].value = data[key];
                tablerows[key].valueElement.textContent = data[key];
            }
        }
    });
    
}
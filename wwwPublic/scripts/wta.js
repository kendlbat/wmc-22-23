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
    initFncs['tourStats'] = generateToursStatisticsTableAndChart;
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

function generateToursStatisticsTableAndChart() {
    let tablecontainer = document.querySelector('#tourStatsTableContainer');

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

    /**
     * @type {{[time: string]: SVGElement}}}
     */
    let chart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chart.id = 'tourStatsChart';
    chart.setAttribute('width', '100%');
    chart.setAttribute('height', '100%');
    chart.setAttribute('viewBox', '0 0 1100 1100');
    chart.setAttribute('preserveAspectRatio', 'none');
    chart.setAttribute('class', 'chart col-12 col-lg-6');

    let xGrid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    xGrid.id = 'xGrid';
    xGrid.setAttribute('transform', 'translate(150, 130)');

    let xLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    xLabels.id = 'xLabels';
    xLabels.setAttribute('transform', 'translate(170, 1030)');
    xLabels.setAttribute('text-anchor', 'middle');

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

        let xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xLabel.setAttribute('x', '0');
        xLabel.setAttribute('y', '0');
        // xLabel.setAttribute('transform', `translate(${everyPossibleStartTime.indexOf(time) * 50}, 0)`);
        // do the above AND rotate by 45°
        xLabel.setAttribute('transform', `translate(${everyPossibleStartTime.indexOf(time) * 50}, 10) rotate(-45)`);
        xLabel.setAttribute('font-size', '24');
        xLabel.setAttribute('text-anchor', 'middle');
        xLabel.appendChild(document.createTextNode(time));
        xLabels.appendChild(xLabel);

        // let xGridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        // xGridLine.setAttribute('x1', '0');
        // xGridLine.setAttribute('y1', '0');
        // xGridLine.setAttribute('x2', '0');
        // xGridLine.setAttribute('y2', '800');
        // xGridLine.setAttribute('transform', `translate(${everyPossibleStartTime.indexOf(time) * 50}, 0)`);
        // xGridLine.setAttribute('stroke', 'gray');
        // xGrid.appendChild(xGridLine);

        // Create x labels

        tbody.appendChild(row);
    });

    let xGridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xGridLine.setAttribute('x1', '0');
    xGridLine.setAttribute('y1', '0');
    xGridLine.setAttribute('x2', '0');
    xGridLine.setAttribute('y2', '870');
    xGridLine.setAttribute('stroke', 'gray');
    xGrid.appendChild(xGridLine);

    chart.appendChild(xGrid);
    chart.appendChild(xLabels);

    table.appendChild(tbody);
    tablecontainer.appendChild(table);

    let bars = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bars.id = 'bars';
    bars.setAttribute('transform', 'translate(150, 200)');


    getToursStatistics().then((data) => {
        let biggestValue = Object.values(data).reduce((prev, curr) => {
            return Math.max(prev, curr);
        }, 0);

        // Create y labels
        let yGrid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        yGrid.classList.add('grid');
        yGrid.setAttribute('transform', 'translate(110, 0)');

        let yLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        yLabels.id = 'yLabels';
        yLabels.setAttribute('transform', 'translate(140, -10)');

        // Height per unit of value
        let perUnit = 200;

        if (biggestValue < 5) {
            // If less than 5, generate n labels

            biggestValue = 5;
        }
        // Else generate 5 labels linearly distributed
        let unit = Math.floor(biggestValue / 4);
        perUnit = 800 / biggestValue;
        for (let i = 0; i < 5; i++) {
            let label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', '0');
            label.setAttribute('y', `${1000 - (i * 200)}`);
            label.setAttribute('text-anchor', 'end');
            label.setAttribute('alignment-baseline', 'middle');
            label.setAttribute('font-size', '40');
            label.textContent = (biggestValue / 4) * i;
            yLabels.appendChild(label);

            let gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            gridLine.setAttribute('x1', '0');
            gridLine.setAttribute('y1', `${1000 - (i * 200)}`);
            gridLine.setAttribute('x2', '890');
            gridLine.setAttribute('y2', `${1000 - (i * 200)}`);
            gridLine.setAttribute('stroke', 'gray');
            gridLine.setAttribute('stroke-width', '2');
            yGrid.appendChild(gridLine);
        }


        // Create bar


        chart.appendChild(yLabels);
        chart.appendChild(yGrid);

        let bars = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        bars.id = 'bars';
        bars.setAttribute('transform', 'translate(160, 0)');

        console.log(perUnit);

        for (let key in data) {
            if (tablerows[key]) {
                tablerows[key].value = data[key];
                tablerows[key].valueElement.textContent = data[key];

                let bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar.setAttribute('x', `${everyPossibleStartTime.indexOf(key) * 50}`);
                bar.setAttribute('y', `${1000 - (data[key] * perUnit)}`);
                bar.setAttribute('width', '30');
                bar.setAttribute('height', `${data[key] * perUnit}`);
                bar.setAttribute('fill', '#ffa500');
                bar.setAttribute('stroke', 'black');
                bar.setAttribute('stroke-width', '1');
                bars.appendChild(bar);

                let barlabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                barlabel.setAttribute('x', `${everyPossibleStartTime.indexOf(key) * 50}`);
                barlabel.setAttribute('y', `${1000 - (data[key] * perUnit)}`);
                barlabel.setAttribute('text-anchor', 'middle');
                barlabel.setAttribute('alignment-baseline', 'middle');
                barlabel.setAttribute('font-size', '40');
                barlabel.setAttribute('transform', `translate(15, -10)`);
                barlabel.textContent = data[key];
                bars.appendChild(barlabel);
            }
        }

        chart.appendChild(bars);
        document.querySelector('#tourStatsChartContainer').appendChild(chart);
    });

}
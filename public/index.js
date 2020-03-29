let usersArray = [];

function getSearchValuefromURL() {
    return new URL(location.href).searchParams.get('search') || ''
}
window.addEventListener('load', function () {
    let searchQuery = getSearchValuefromURL();
    document.getElementById('search').value = searchQuery;

    fetchUsers().then(users => {
        usersArray = users;
        fetchRequests(searchQuery);
    });
})

function fetchRequests(searchQuery) {
    fetch('http://localhost:3000/Requests?q=' + searchQuery)
        .then(response => response.json())
        .then(jsonData => {
            createRequestsList(jsonData);
        })
}

function fetchUsers() {
    return fetch('http://localhost:3000/Users')
        .then(response => response.json())
}

function createRequestsList(requests) {
    let table = document.getElementById('req-table');
    table.innerHTML = '';

    let headerRow = table.insertRow();
    headerRow.className = 'header';
    headerRow.insertCell(0).innerHTML = 'Request Name';
    headerRow.insertCell(1).innerHTML = 'Requestor';
    headerRow.insertCell(2).innerHTML = 'Good Ending';
    headerRow.insertCell(3).innerHTML = 'Description';
    headerRow.insertCell(4).innerHTML = 'Need Storyteller';
    headerRow.insertCell(5).innerHTML = 'Storyteller';
    headerRow.insertCell(6).innerHTML = 'Wanted Characters';
    headerRow.insertCell(7).innerHTML = 'Deadline';
    headerRow.insertCell(8).innerHTML = 'Budget';
    headerRow.insertCell(9).innerHTML = 'Status';
    headerRow.insertCell(10).innerHTML = 'Id';


    requests.forEach(function (req) {
        let row = table.insertRow(-1); // -1 oznacza, dołóż row na końcu tabeli
        let requestor = usersArray.find(o => Number(req.Requestor) === o.Id) || {};
        let storyTeller = usersArray.find(o => Number(req.Storyteller) === o.Id) || {};

        row.insertCell(0).innerHTML = "<a href='/req_form.html?id=" + req.Id + "'>" + req.RequestName + "</a>";
        row.insertCell(1).innerHTML = requestor.DisplayName || '';
        row.insertCell(2).innerHTML = req.GoodEnding;
        let cellDescription = row.insertCell(3);
        cellDescription.innerHTML = truncate(50, req.Description);
        cellDescription.title = truncate(500, req.Description);

        row.insertCell(4).innerHTML = isStoryTellerNeeded(req.NeedStoryteller);
        row.insertCell(5).innerHTML = storyTeller.DisplayName || '';
        row.insertCell(6).innerHTML = wantedCharToList(req.WantedCharacters);
        row.insertCell(7).innerHTML = setDatepattern(req.Deadline);
        row.insertCell(8).innerHTML = req.Budget;
        row.insertCell(9).innerHTML = req.Status;
        row.insertCell(10).innerHTML = req.Id;
    });
}

function truncate(maxCharacters, txt) {
    if (txt) {
        if (txt.length > maxCharacters) {
            return txt.substring(0, maxCharacters) + "...";
        }
        return txt
    } else {
        return ""
    }
}
function isStoryTellerNeeded(STNvalue) {
    if (STNvalue === true) {
        return 'yes'
    }
    return 'no'
    //return STNvalue === true ? 'yes': 'no';
}

function wantedCharToList(wantedCharString) {
    return wantedCharString.split(';').join('<br/>')
}

function setDatepattern(dateValue) {
    if (dateValue) {
        return new Date(dateValue).toISOString().split("T")[0];
    }
    return '';
}


//const showStoryTellerValue = (STvalue) => STvalue ? STvalue : ''
//const truncate = (maxCharacters, txt) => (txt && txt.length > maxCharacters) ? txt.substring(0, maxCharacters) + "..." : txt || ''

let usersArray = [];

window.addEventListener('load', function () {
    fetchUsers().then(users => {
        usersArray = users;
        fetchRequestById(getIdValuefromURL());

    });
})

function getIdValuefromURL() {
    return new URL(location.href).searchParams.get('id')
}

function fetchRequestById(id) {
    fetch('http://localhost:3000/Requests?Id=' + id)
        .then(response => response.json())
        .then(jsonData => {
            usersArray.forEach(user => {
                addOptionToRequestor('requestor', user.DisplayName, user.Id);
            })
            populateRequestform(jsonData[0]);
            // addOptions('characters', 100);
        })
}

function fetchUsers() {
    return fetch('http://localhost:3000/Users')
        .then(response => response.json())
}

function addOptionToRequestor(mySelectId, txt, value) {
    let x = document.getElementById(mySelectId);
    let option = document.createElement("option");
    option.text = txt;
    option.value = value;
    x.add(option);
}

function populateRequestform(reqData) {
    if (reqData) {
        document.getElementById('reqId').value = reqData.Id;
        document.getElementById('req_name').value = reqData.RequestName;
        //Requestor
        document.getElementById('requestor').value = reqData.Requestor; // id requestora
        
        //Good ending
        // document.getElementById('ending').value 
        document.getElementById('desc').value = reqData.Description;

        //Wanted Characters
        reqData.WantedCharacters === "" ? addOptions('characters', 100) : addOptionsToCharacters('characters', reqData.WantedCharacters.split(';'))
        console.log(reqData.WantedCharacters.split(';'))
        //Deadline
        document.getElementById('deadline').value = reqData.Deadline ? new Date(reqData.Deadline).toISOString().split('T')[0] : '';
        document.getElementById('budget').value = reqData.Budget;
        document.getElementById('status').value = reqData.Status;

        if (reqData.GoodEnding) {
            let radioEl = document.getElementById(reqData.GoodEnding.toLowerCase());
            if (radioEl) {
                radioEl.checked = true;
            }
        }

        if (reqData.NeedStoryteller === true) {
            let checkEl = document.getElementById('need_storyteller');
            if (checkEl) {
                checkEl.checked = true;
                showStoryteller();
                let storyTeller = usersArray.find(o => Number(reqData.Storyteller) === o.Id) || {};
                document.getElementById('storyteller').value = storyTeller.DisplayName;
            }
        }

        document.getElementById('deleteButton').classList.remove('disabled');
        document.getElementById('deleteButton').addEventListener('click', function () {
            if (confirm('Are you sure to delete request?')) {
                fetch('http://localhost:3000/Requests/' + reqData.Id, {
                    method: 'DELETE'
                }).then(response => {
                    if (response.ok) {
                        location.href = '/index.html';
                    }
                })
            }
        })
    }
    else {
        document.getElementById('deleteButton').classList.add('disabled');
        document.getElementById('deleteButton').disabled = true;
    }
}

function minCharacters(minCharacters, txtEl) {
    let txt = txtEl.value
    if (txt) {
        if (txt.length > minCharacters) {
            return txt
        } else {
            alert("Minimum " + minCharacters + " characters in Description field");
        }

    } else {
        return ""
    }
}

function minBudget(minValue, txtEl) {
    let txt = txtEl.value
    if (txt) {
        if (txt > minValue) {
            return txt
        } else {
            alert("Minimum budget is " + minValue + " FBD");
            txtEl.value = "";//?? budget value does not clear
        }

    } else {
        return ""
    }
}
function showStoryteller() {
    let checkBox = document.getElementById("need_storyteller");
    let text = document.getElementById("storytellerDiv");
    if (checkBox.checked == true) {
        text.style.display = "block";
    } else {
        text.style.display = "none";
    }
}

function createNoOfRandomStrings(stringsNo) {
    let stringList = [];
    for (i = 0; i < stringsNo; i++) {
        stringList.push(Math.random().toString(36).slice(2))
    }
    return stringList
}

function addOptions(mySelectId, stringsNo) {
    let x = document.getElementById(mySelectId);
    //let stringArray = createNoOfRandomStrings(stringsNo);
    for (i = 1; i <= stringsNo; i++) {
        let option = document.createElement("option");
        option.text = 'Character ' + i;
        option.value = 'Character' + i;
        x.add(option);
    }
}
function addOptionsToCharacters(mySelectId, array) {
    let x = document.getElementById(mySelectId);
    //let stringArray = createNoOfRandomStrings(stringsNo);
    for (i = 0; i < array.length; i++) {
        let option = document.createElement("option");
        option.text = array[i];
        option.value = array[i];
        x.add(option);
    }
}
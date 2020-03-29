window.addEventListener('load', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // nie wysyła formularza z domyślnym mechanizmem przeglądarki

        const jsonObj = mapFormToJsonObj();
        let invalidFields = validateFormData(jsonObj);


        if (invalidFields.length === 0) {
            sendJsonToBackend(jsonObj);
        }
        else {
            alert('Your data is invalid:\n' + invalidFields.join('\n'));
        }
    });
});

function validateFormData(obj) {
    let emptyFields = [];

    if (!obj.RequestName || obj.RequestName === "") {
        emptyFields.push('Request Name')
    }

    if (!obj.GoodEnding || obj.GoodEnding === "") {
        emptyFields.push('Good Ending')
    }

    if (!obj.Description || obj.Description === "") {
        emptyFields.push('Description')
    }

    if (obj.NeedStoryteller) {
        if (!obj.Storyteller || obj.Storyteller === "") {
            emptyFields.push('Storyteller')
        }
    }
    if (!obj.Budget || obj.Budget === "" || obj.Budget < 250000) {
        emptyFields.push('Budget')
    }

    return emptyFields
}

/**
* Mapuje dane formularza na json obj
**/
function mapFormToJsonObj() {
    // let formData = new FormData(form);
    // let obj = Object.fromEntries(formData);
    let obj = {};

    obj.Id = Number(document.getElementById('reqId').value);
    obj.RequestName = document.getElementById('req_name').value;
    obj.Requestor = Number(document.getElementById('requestor').value);

    if (document.getElementById('yes').checked) {
        obj.GoodEnding = 'Yes';
    }
    else if (document.getElementById('no').checked) {
        obj.GoodEnding = 'No';
    }
    else if (document.getElementById('depends').checked) {
        obj.GoodEnding = 'Depends';
    }
    obj.Description = document.getElementById('desc').value;
    obj.NeedStoryteller = document.getElementById('need_storyteller').checked;
    obj.Storyteller = document.getElementById('storyteller').value;
    //characters

    obj.WantedCharacters = Array.from(document.getElementById('characters').selectedOptions).map(o => o.value).join(';');

    if (document.getElementById('deadline').value !== '') {
        obj.Deadline = new Date(document.getElementById('deadline').value).getTime();
    }
    obj.Budget = Number(document.getElementById('budget').value);
    obj.Status = 'New';
    return obj;
}

function sendJsonToBackend(jsonObj) {
    let url = 'http://localhost:3000/Requests';
    let method = 'POST';

    if (jsonObj.Id > 0) {
        url += '/' + jsonObj.Id;
        method = 'PATCH';
    }

    fetch(url, {
        method: method,
        body: JSON.stringify(jsonObj),
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response => {
        if (response.ok) {
            switch (response.status) {
                case 201:
                    alert('Reqeust successfuly created');
                    break;
                default:
                    alert('Reqeust successfuly updated');
                    break;
            }
        }
        else {
            alert('Failed to send data to backend')
        }
        return response.json()
    })
    .then(responseJson => {
        document.getElementById("reqId").value = responseJson.Id;
    })
}
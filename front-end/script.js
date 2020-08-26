/*
* @author: Kate (Quyen) Vu Thi Tu
* @SID: 
* handle script for client
* */
let errorMessage = "";
let message = "";


//#############PROCESSING
/**
 * query list of items with sold quatity <> 0
 */
let API_QUERY_ENDPOINT_URL_STR = "https://d9xcfgalm0.execute-api.us-east-1.amazonaws.com/Prod";
let API_INSERT_ENDPOINT_URL_STR = "https://glrfcqq8dj.execute-api.us-east-1.amazonaws.com/Prod";

let bucket_image_name = "cos80011-bucket-katevu-studentcard-images";

function listProcess() {
    hideErrorDiv('errorRegister');
    hideResult('resultReq');

    let url = API_QUERY_ENDPOINT_URL_STR;

    $.ajax(url, {
        type: 'POST',  // GET or POST
        dataType: 'json', // xml, json, text
        data: JSON.stringify({
            bucket_name: bucket_image_name
        }),
        success: function (data, status, xhr) {
            getList(data);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log('load items error: ', errorMessage);
        }
    });

}

/**
 * display list of item with sold quatity <> 0 on the page
 * @param data
 */
function getList(data) {
    let elCardsList = document.getElementById('cards');
    if (elCardsList) {
        elCardsList.innerHTML = '';
        if (data && data.allCards && data.allCards.length > 0) {
            for (let index = 0; index < data.allCards.length; index++) {
                let cardData = data.allCards[index];

                let newCard = document.createElement('img');
                if (index < 2) {
                    newCard.classList.add('studentCard' + index);
                }
                newCard.src = cardData.imageUrl;
                elCardsList.appendChild(newCard);
            }
        } else {
            elCardsList.innerHTML = '<h2>No student card found.</h2>';
        }
    }

}


//#############REGISTER PAGE
/**
 * validate registertration
 * @returns {boolean}
 */
function validateFormRegister() {
    hideErrorDiv('errorRegister');
    hideResult('resultReq');
    errorMessage = "";
    let regForm = document.getElementById('regForm');
    let name = regForm.Name.value.trim();
    let dob = regForm.dob.value.trim();
    if (regForm) {
        if (!validateText(name)) {
            errorMessage = "Please enter student name!"
            displayErrorMess(errorMessage, 'errorRegister');
            return false;
        }
        if (!validateDob(dob)) {
            errorMessage = "Please enter date of birth as format dd/mm/yyyy";
            displayErrorMess(errorMessage, 'errorRegister');
            return false;
        }
        register(name, dob);
        return true;

    } else {
        errorMessage = "Something wrong, please try again";
        displayErrorMess(errorMessage, 'errorRegister');
        return false;
    }

}

/**
 * create new customer records, display customer id received from backend
 * @param email
 * @param firstName
 * @param lastName
 * @param password
 * @param phone
 */
function register(name, dob) {
    let params = "";
    params = `{student_name: ${name},
                student_dob: ${dob}}`;

    let url = API_INSERT_ENDPOINT_URL_STR;

    $.ajax(url, {
        type: 'POST',  // GET or POST
        dataType: 'json', // xml, json, text
        data: JSON.stringify({
            student_name: name,
            student_dob: dob
        }),
        success: function (data, status, xhr) {
            console.log('register successful: ', data);
            display(data);
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log('have error when registering: ', errorMessage);
        }
    });

    // xHttpRequest.open("POST", "backend/register.php?v=" + (new Date()).getTime(), true);
    // xHttpRequest.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    // xHttpRequest.onreadystatechange = () => {
    //     if ((xHttpRequest.readyState == 4) && (xHttpRequest.status == 200)) {
    //         let customerId = xHttpRequest.responseText;
    //         message = `Thank you, you have registered susccessful. Your user Id is ${customerId}`;
    //         displayResultReg(message);
    //     }
    // }
    // xHttpRequest.send(params);
}

function display(data) {
    let customerId = data.student_id;
    message = `Registered susccessful. \n Student Id is ${customerId}`;
    displayResultReg(message);
}

//################UTILITY
/**
 * validate phone
 * @param phone
 * @returns {boolean}
 */
function validatePhone(phone) {
    return /(^(\(0\d\)|0\d\s)\d{8}$)/.test(phone);
}

function validateDob(dob) {
    return /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(dob);
}

/**
 * validate number for quantity
 * @param number
 * @returns {boolean}
 */
function validateNumber(number) {
    return /^\d+$/.test(number);
}


/**
 * validate text field, return false if empty
 */
function validateText(text) {
    return (text == "") ? false : true
}


/**
 * Check to make sure password and confirm passwor must be the same
 * @param password
 * @param confirmPassword
 * @returns {true} if they are the same
 */
function validatePassword(password, confirmPassword) {
    if (password == confirmPassword) {
        return true;
    } else {
        return false
    }
}

/**
 * display error message for register form
 * @param errorMessage content of error message
 */
function displayErrorMess(errorMessage, tagID) {
    let elError = document.getElementById(tagID);
    elError.innerText = errorMessage;
    if (elError && elError.classList.contains('hide')) {
        elError.classList.remove('hide');
    }
}

/**
 * hide div for displaying error message for register form
 */
function hideErrorDiv(tagID) {
    let elError = document.getElementById(tagID);
    if (elError && !elError.classList.contains('hide')) {
        elError.classList.add('hide');
    }
}

/**
 * hide div for displaying result message for register form
 */
function hideResult(tagID) {
    let elResult = document.getElementById(tagID);
    if (elResult && !elResult.classList.contains('hide')) {
        elResult.classList.add('hide');
    }
}

/**
 * display result message for register form
 * @param message content of error message
 */
function displayResultReg(message) {
    let elResult = document.getElementById('resultReq');
    let elResultMessage = document.getElementById("resultReqMessage");
    elResultMessage.innerText = message;
    if (elResult && elResult.classList.contains('hide')) {
        elResult.classList.remove('hide');
    }
}

function displayResult(message, tagID) {
    let elResult = document.getElementById(tagID);
    elResult.innerText = message;
    if (elResult && elResult.classList.contains('hide')) {
        elResult.classList.remove('hide');
    }
}

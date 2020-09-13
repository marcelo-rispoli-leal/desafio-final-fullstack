import { db } from '../services/db.js';

function msgError(error, status = 400) {
  throw new Error(JSON.stringify({ status, error }));
}

function bodyRequiredError(reqBody) {
  if (!reqBody) {
    msgError(`The request body must have fields informed.`);
  }
}

function dateError(date, isFull = false) {
  const fieldName = !isFull ? 'period' : 'yearMonthDay';
  const fieldType = !isFull ? 'parameter' : 'field';
  const format = !isFull ? 'yyyy-mm' : 'yyyy-mm-dd';

  //check date filling
  if (!date) {
    msgError(
      `It's necessary to inform the ${fieldType} '${fieldName}', whose value must be in the format '${format}'.`
    );
  }

  //check separators and length
  const condition = !isFull
    ? date.length !== 7 || date.substr(4, 1) !== '-'
    : date.length !== 10 ||
      date.substr(4, 1) !== '-' ||
      date.substr(7, 1) !== '-';

  if (condition) {
    msgError(
      `The value '${date}' in the '${fieldName}' ${fieldType} is invalid, use the format '${format}'.`
    );
  }

  //test date
  const testDate = !isFull
    ? new Date(date + '-01T00:00:00')
    : new Date(date + 'T00:00:00');

  if (isNaN(testDate)) {
    msgError(
      `The '${fieldName}' ${fieldType} with value '${date}' is not valid, use the format '${format}'.`
    );
  }
}

function idRequiredError(id) {
  if (!id) {
    msgError(`The 'id' field is required to perform this request.`);
  }
}

function idInvalidError(id) {
  if (!db.mongoose.isValidObjectId(id)) {
    msgError(
      `The 'id' field with the value '${id}' is not a valid MongoDB ObjectId.`
    );
  }
}

function notFoundError(result) {
  if (result === undefined || result === {}) {
    msgError(`No data was found in response to your request.`, 404);
  }
}

function requiredFieldsError(obj) {
  let required = '';
  let ommited = '';
  let chk = false;

  //records the name of all required objects and lists the undefined ones
  Object.getOwnPropertyNames(obj).forEach((val) => {
    if (!obj[val]) {
      chk = true;
      ommited += ommited === '' ? `'${val}'` : `, '${val}'`;
    }
    required += required === '' ? `'${val}'` : `, '${val}'`;
  });

  //triggers error message if one required object are undefined
  if (chk) {
    msgError(
      `The fields ${required} are mandatory in this request, ` +
        `but the fields ${ommited} are undefined.`
    );
  }
}

function lackFieldsError(obj) {
  let names = '';
  let chk = false;

  //records the name of objects while they are undefined
  Object.getOwnPropertyNames(obj).some((val) => {
    if (obj[val]) {
      chk = true;
      return chk;
    } else {
      names += names === '' ? `'${val}'` : `, '${val}'`;
    }
  });

  //triggers error message if all objects are undefined
  if (!chk) {
    msgError(`In your request, one of these fields must be added: ${names}.`);
  }
}

export {
  requiredFieldsError,
  bodyRequiredError,
  lackFieldsError,
  idRequiredError,
  idInvalidError,
  notFoundError,
  dateError,
};

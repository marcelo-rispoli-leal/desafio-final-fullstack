import { db } from '../services/db.js';
import { setDateFields } from '../helpers/setters.js';
import {
  requiredFieldsError,
  bodyRequiredError,
  lackFieldsError,
  idRequiredError,
  idInvalidError,
  notFoundError,
  dateError,
} from '../helpers/errors.js';

const Transaction = db.transactionModel;

//post transaction
const create = async (req, res, next) => {
  try {
    //check body and load fields
    bodyRequiredError(req.body);
    const { description, value, category, yearMonthDay, type } = req.body;

    //check required fields
    requiredFieldsError({ description, value, category, yearMonthDay, type });

    //check for errors in date, if ok set another date fields
    dateError(yearMonthDay, true);
    const dateFields = setDateFields(yearMonthDay);

    //load fields to save in a record
    const record = new Transaction({
      description,
      value,
      category,
      ...dateFields,
      yearMonthDay,
      type,
    });

    //save and send result
    const result = await record.save();
    res.send(result);
  } catch (err) {
    next(err);
  }
};

//get transactions in a period
const retrievePeriod = async (req, res, next) => {
  try {
    //load query paramaters
    const { period, description } = req.query;

    //check period
    dateError(period, false);

    //start condition with period
    let condition = { yearMonth: period };

    //if informed, add description to condition
    if (description) {
      condition = {
        ...condition,
        description: { $regex: new RegExp(description), $options: 'i' },
      };
    }

    //find transactions
    const result = await Transaction.find(condition).sort({ day: 1 });

    //returns error if no data is found to retrieve
    notFoundError(result);

    //return result
    return res.send(result);
  } catch (err) {
    next(err);
  }
};

//uptate transaction
const updateOne = async (req, res, next) => {
  try {
    //check body and load fields
    bodyRequiredError(req.body);
    const { id, description, value, category, yearMonthDay } = req.body;

    //check id
    idRequiredError(id);
    idInvalidError(id);

    //check if another fields informed
    lackFieldsError({ description, category, value, yearMonthDay });

    //check errors in fulldate if informed
    if (yearMonthDay) {
      dateError(yearMonthDay, true);
    }

    //set another date fields
    const dateFields = setDateFields(yearMonthDay);

    //load fields to update
    const record = {
      description,
      value,
      category,
      ...dateFields,
      yearMonthDay,
    };

    //perform update
    const result = await Transaction.findByIdAndUpdate(id, record, {
      new: true,
      omitUndefined: true,
    });

    //returns error if no data is found to update
    notFoundError(result);

    res.send(result);
  } catch (err) {
    next(err);
  }
};

//delete transaction
const deleteOne = async (req, res, next) => {
  try {
    //check body and load fields
    bodyRequiredError(req.body);
    const { id } = req.body;

    //check id
    idRequiredError(id);
    idInvalidError(id);

    //perform delete
    const result = await Transaction.findByIdAndDelete(id);

    //returns error if no data is found to delete
    notFoundError(result);

    //send deleted document
    res.send(result);
  } catch (err) {
    next(err);
  }
};

export default { create, retrievePeriod, updateOne, deleteOne };

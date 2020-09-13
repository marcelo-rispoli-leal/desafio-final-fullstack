export default (mongoose) => {
  const schema = mongoose.Schema({
    description: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      enum: [2019, 2020, 2021],
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
    },
    yearMonth: {
      type: String,
      required: true,
    },
    yearMonthDay: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['+', '-'],
      immutable: true,
    },
  });

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();

    object.id = _id;
    object.lowerDescription = object.description.toLowerCase();

    return object;
  });

  const transactionModel = mongoose.model('transaction', schema);

  return transactionModel;
};

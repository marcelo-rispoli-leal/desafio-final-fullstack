import React from 'react';
import { formatMoney } from '../helpers/formatters';

export default function Transaction({
  id,
  category,
  description,
  value,
  type,
  yearMonthDay,
  onClickDelete,
  onClickEdit,
}) {
  const handleClickDelete = () => {
    onClickDelete(id);
  };

  const handleClickEdit = () => {
    const oldTransaction = {
      id,
      category,
      description,
      value,
      type,
      yearMonthDay,
    };
    onClickEdit(oldTransaction);
  };

  return (
    <div
      className="row col s12"
      style={{
        ...styles.divRow,
        backgroundColor: type === '-' ? '#e57373' : 'lightseagreen',
      }}
    >
      <div className="col s8" style={styles.flexRow}>
        <div style={styles.divDay}>{yearMonthDay.substr(-2)}</div>
        <div>
          <div style={styles.fontBold}>{category}</div>
          <div>{description}</div>
        </div>
      </div>
      <div className="col s4" style={styles.flexRowBetween}>
        <div className="col s8" style={styles.fontBig}>
          {formatMoney(value)}
        </div>
        <div styles={styles.flexRow}>
          <i
            className="material-icons"
            style={{ cursor: 'pointer' }}
            onClick={handleClickEdit}
          >
            edit
          </i>
          <i
            className="material-icons"
            style={{ cursor: 'pointer' }}
            onClick={handleClickDelete}
          >
            delete
          </i>
        </div>
      </div>
    </div>
  );
}

const justifyBetween = {
  justifyContent: 'space-between',
};

const flexRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const flexRowBetween = {
  ...flexRow,
  ...justifyBetween,
};

const divRow = {
  ...flexRowBetween,
  border: 'solid 1px lightgray',
  borderRadius: '10px',
  margin: '10px 0',
  padding: '10px 0',
};

const fontBig = {
  fontSize: '1.5rem',
};

const fontBold = {
  fontWeight: 'bold',
};

const divDay = {
  marginRight: '10px',
  ...fontBig,
  ...fontBold,
};

const styles = {
  flexRow,
  flexRowBetween,
  divRow,
  divDay,
  fontBold,
  fontBig,
};

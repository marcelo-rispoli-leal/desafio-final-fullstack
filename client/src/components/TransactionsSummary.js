import React from 'react';
import { formatMoney } from '../helpers/formatters';

export default function TransactionsSummary({
  count,
  revenues,
  expenses,
  balance,
  status,
}) {
  return (
    <div style={styles.summary}>
      <div style={styles.flexRow}>
        <span style={styles.textSpan}>Lançamentos:</span>
        <span style={styles.textSpan}>{count}</span>
      </div>

      <div style={styles.flexRow}>
        <span style={styles.textSpan}>Receitas:</span>
        <span style={styles.greenSpan}>{formatMoney(revenues)}</span>
      </div>

      <div style={styles.flexRow}>
        <span style={styles.textSpan}>Despesas:</span>
        <span style={styles.redSpan}>{formatMoney(expenses)}</span>
      </div>

      <div style={styles.flexRow}>
        <span style={styles.textSpan}>Saldo:</span>
        <span style={status === '-' ? styles.redSpan : styles.greenSpan}>
          {formatMoney(balance)}
        </span>
      </div>
    </div>
  );
}

//#region styles
const flexRow = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const summary = {
  ...flexRow,
  alignItems: 'center',
  flexWrap: 'wrap',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  border: 'solid 2px lightgray',
  borderRadius: '10px',
  margin: '25px 10px',
  padding: '10px 0',
};

const textSpan = {
  margin: '0 5px',
  padding: '0 5px',
};

const redSpan = {
  ...textSpan,
  color: '#e57373',
};

const greenSpan = {
  ...textSpan,
  color: 'lightseagreen',
};

const styles = {
  flexRow,
  summary,
  textSpan,
  redSpan,
  greenSpan,
};
//#endregion

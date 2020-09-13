import React from 'react';

export default function PeriodSelector({
  minPeriod,
  maxPeriod,
  allPeriods,
  selectedPeriod,
  onChangePeriod,
}) {
  const handleChangeSelect = (event) => {
    onChangePeriod(event.target.value);
  };

  const handleClickButton = (event) => {
    const click = +event.target.getAttribute('data-click');
    const select = document.querySelector('#periodSelect');
    select.selectedIndex = click + select.selectedIndex;

    onChangePeriod(select.value);
  };

  return (
    <div className="center">
      <h3>Controle Financeiro Pessoal</h3>
      <div style={styles.divSelector}>
        <button
          className="waves-effect waves-light btn"
          onClick={handleClickButton}
          data-click="-1"
          disabled={minPeriod === selectedPeriod}
        >
          <i className="material-icons" data-click="-1">
            arrow_back
          </i>
        </button>
        <select
          className="browser-default"
          style={styles.selectPeriod}
          id="periodSelect"
          value={selectedPeriod}
          onChange={handleChangeSelect}
        >
          {allPeriods.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <button
          className="waves-effect waves-light btn"
          onClick={handleClickButton}
          data-click="1"
          disabled={maxPeriod === selectedPeriod}
        >
          <i className="material-icons" data-click="1">
            arrow_forward
          </i>
        </button>
      </div>
    </div>
  );
}

const styles = {
  divSelector: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectPeriod: {
    width: '150px',
    textAlignLast: 'center',
  },
};

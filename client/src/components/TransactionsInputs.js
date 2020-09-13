import React from 'react';

export default function TransactionsInputs({
  userFilter,
  onChangeFilter,
  onClickInsert,
}) {
  const handleChangeInput = (event) => {
    onChangeFilter(event.target.value);
  };

  const handleClickInsert = () => {
    onClickInsert();
  };

  return (
    <div className="row" style={{ paddingLeft: '10px' }}>
      <button
        className="waves-effect waves-light btn-large col s3"
        style={{ marginTop: '5px' }}
        onClick={handleClickInsert}
      >
        Inserir Lançamento
      </button>
      <div className="input-field col s9">
        <input
          id="filter"
          type="text"
          value={userFilter}
          onChange={handleChangeInput}
        />
        <label className="active" htmlFor="filter">
          Filtro
        </label>
      </div>
    </div>
  );
}

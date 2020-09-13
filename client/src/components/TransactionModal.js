import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function TransactionModal({
  onSave,
  onClose,
  transaction,
  minPeriod,
  maxPeriod,
}) {
  //initial constants and use states
  const { id, category, description, type, value, yearMonthDay } = transaction;
  const [modalType, setType] = useState(type);
  const [modalCategory, setCategory] = useState(category);
  const [modalDescription, setDescription] = useState(description);
  const [modalValue, setValue] = useState(value);
  const [modalYearMonthDay, setYearMonthDay] = useState(yearMonthDay);
  const [errorMessage, setErrorMessage] = useState('');

  //fields validation effect
  useEffect(() => {
    //input text validation
    let data = {
      category: modalCategory.trim(),
      description: modalDescription.trim(),
    };

    let message = '';
    let ommited = '';
    let field = '';
    let verb = '';
    let chk = false;

    Object.getOwnPropertyNames(data).forEach((val) => {
      if (data[val] === '') {
        chk = true;
        ommited += ommited === '' ? `'${val}'` : `, '${val}'`;
        field = field === '' ? `field` : `fields`;
        verb = verb === '' ? `is` : `are`;
      }
    });

    if (chk) {
      message = `The ${field} ${ommited} ${verb} required. `;
    }

    //input value validation
    if (modalValue < 0.01) {
      message += `Value less than '0.01' is invalid. `;
    }

    //input date validation
    if (modalYearMonthDay < `${minPeriod}-01`) {
      message += `Date must be between '${minPeriod}-01' and '${maxPeriod}-31'. `;
    }

    if (message !== '') {
      setErrorMessage(message.trim());
    } else {
      setErrorMessage('');
    }
  }, [
    modalCategory,
    modalDescription,
    modalValue,
    modalYearMonthDay,
    minPeriod,
    maxPeriod,
  ]);

  //escape keydown effect
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  //escape keydown handler
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose(null);
    }
  };

  //change category handler
  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  //change description handler
  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  //change type handler
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  //change value handler
  const handleChangeValue = (event) => {
    setValue(+event.target.value);
  };

  //change year month day handler
  const handleChangeYearMonthDay = (event) => {
    setYearMonthDay(event.target.value);
  };

  //form submit handler
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = {
      id,
      category: modalCategory,
      description: modalDescription,
      type: modalType,
      value: modalValue,
      yearMonthDay: modalYearMonthDay,
    };

    onSave(formData);
  };

  //close modal handler
  const handleModalClose = () => {
    onClose(null);
  };

  return (
    <Modal isOpen={true} style={styles.modalStyle}>
      {/* header - title and close buttom */}
      <div style={styles.flexDivRow}>
        <span style={styles.title}>
          {(id !== undefined ? 'Edição' : 'Inclusão') + ' de Lançamento'}
        </span>
        <button
          className="waves-effect waves-lights btn red dark-4"
          onClick={handleModalClose}
        >
          X
        </button>
      </div>

      {/* form content */}
      <form onSubmit={handleFormSubmit} style={styles.formBlock}>
        {/* input type */}
        <div style={styles.radioInputs}>
          <label>
            <input
              type="radio"
              name="transacionType"
              value="-"
              checked={modalType === '-'}
              disabled={id !== undefined}
              onChange={handleChangeType}
            />
            <span>Despesa</span>
          </label>
          <label>
            <input
              type="radio"
              name="transacionType"
              value="+"
              checked={modalType === '+'}
              disabled={id !== undefined}
              onChange={handleChangeType}
            />
            <span>Receita</span>
          </label>
        </div>

        {/* input category */}
        <div className="input-field" style={styles.sideMargins}>
          <input
            id="inputCategory"
            type="text"
            value={modalCategory}
            onChange={handleChangeCategory}
          />
          <label className="active" htmlFor="inputCategory">
            Categoria:
          </label>
        </div>

        {/* input description */}
        <div className="input-field" style={styles.sideMargins}>
          <input
            id="inputDescription"
            type="text"
            value={modalDescription}
            onChange={handleChangeDescription}
          />
          <label className="active" htmlFor="inputSubject">
            Descrição:
          </label>
        </div>

        {/* input value and date */}
        <div className="row">
          <div className="input-field col s6">
            <input
              id="inputValue"
              type="number"
              min="0.01"
              step="10"
              value={modalValue}
              onChange={handleChangeValue}
            />
            <label className="active" htmlFor="inputValue">
              Valor do Lançamento:
            </label>
          </div>
          <div className="input-field col s6">
            <input
              id="inputDate"
              type="date"
              value={modalYearMonthDay}
              onChange={handleChangeYearMonthDay}
            />
            <label className="active" htmlFor="inputDate">
              Data de Lançamento:
            </label>
          </div>
        </div>
      </form>

      {/* footer - submit and errors message */}
      <div className="row">
        <button
          className="waves-effect waves-light btn col s2"
          disabled={errorMessage.trim() !== ''}
          onClick={handleFormSubmit}
        >
          Salvar
        </button>
        <span className="col s10" style={styles.errorMessage}>
          {errorMessage}
        </span>
      </div>
    </Modal>
  );
}

//#region  styles
const justifyBetween = {
  justifyContent: 'space-between',
};

const justifyAround = {
  justifyContent: 'space-around',
};

const fontBold = {
  fontWeight: 'bold',
};

const flexRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const modalStyle = {
  content: {
    position: 'absolute',
    top: '7%',
    left: '28%',
    right: '28%',
    bottom: '7%',
  },
  overlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9999',
  },
};

const flexDivRow = {
  ...flexRow,
  ...justifyBetween,
  marginBottom: '20px',
};

const title = {
  ...fontBold,
  fontSize: '1.3rem',
};

const formBlock = {
  border: 'solid 1px lightgray',
  borderRadius: '10px',
  marginBottom: '20px',
};

const radioInputs = {
  ...flexRow,
  ...justifyAround,
  margin: '20px 0',
  fontSize: '1.5rem',
};

const sideMargins = {
  marginLeft: '12px',
  marginRight: '12px',
};

const errorMessage = {
  ...fontBold,
  color: 'red',
};

const styles = {
  modalStyle,
  flexDivRow,
  title,
  formBlock,
  radioInputs,
  sideMargins,
  errorMessage,
};
//#endregion

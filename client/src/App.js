import React, { useState, useEffect } from 'react';
import PeriodSelector from './components/PeriodSelector';
import TransactionsSummary from './components/TransactionsSummary';
import TransactionsInputs from './components/TransactionsInputs';
import TransactionModal from './components/TransactionModal';
import Transaction from './components/Transaction';
import api from './api/service';

export default function App() {
  const [allPeriods, setAllPeriods] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [periodTransactions, setPeriodTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [revenues, setRevenues] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [userFilter, setUserFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTransaction, setModalTransaction] = useState({});

  // sets all periods, initial selected period,
  // period transactions and filtered transactions
  useEffect(() => {
    //get all periods and sets the current as selected
    const getPeriods = async () => {
      //gets the current year and month
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();

      //load of periods from the first month of
      //last year to the last month of next year
      const periods = [];
      for (let y = year - 1; y <= year + 1; y++) {
        for (let m = 0; m <= 11; m++) {
          const period = y + '-' + String(m + 1).padStart(2, '0');

          //sets current period as selected
          if (y === year && m === month) {
            setSelectedPeriod(period);
            let data = await getPeriodTransactions(period);
            getFilteredTransactions(data, '');
          }

          periods.push(period);
        }
      }
      setAllPeriods(periods);
    };

    getPeriods();
  }, []);

  //sets all period transactions
  async function getPeriodTransactions(period) {
    const response = await api.retrieve(period);
    const data = response.data;
    setPeriodTransactions(data);
    return data;
  }

  //sets filtered transactions, expenses and revenues
  async function getFilteredTransactions(data, filter = '') {
    //filters period transactions
    if (filter !== '') {
      //const lowerFilter = userFilter.toLowerCase();
      data = await data.filter((item) => {
        return item.lowerDescription.includes(filter);
      });
    }
    //sets filtered transactions
    setFilteredTransactions(data);

    //gets expenses and revenues from filtered transactions
    let sumExpenses = 0;
    let sumRevenues = 0;
    await data.forEach(({ value, type }) => {
      type === '-' ? (sumExpenses += value) : (sumRevenues += value);
    });
    //sets expenses and revenues
    setExpenses(sumExpenses);
    setRevenues(sumRevenues);
  }

  const handleChangePeriod = async (newPeriod) => {
    setSelectedPeriod(newPeriod);
    const data = await getPeriodTransactions(newPeriod);
    getFilteredTransactions(data, userFilter.toLowerCase());
  };

  const handleChangeFilter = (newText) => {
    setUserFilter(newText);
    getFilteredTransactions(periodTransactions, newText.toLowerCase());
  };

  const handleInsert = () => {
    setModalTransaction({
      category: '',
      description: '',
      type: '-',
      value: 0,
      yearMonthDay: selectedPeriod + '-01',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (oldTransaction) => {
    setModalTransaction(oldTransaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    let message = '';

    await api
      .destroy({ id })
      .then(async (res) => {
        //sets period transactions after delete
        const data = periodTransactions.filter((item) => {
          return item.id !== id;
        });
        setPeriodTransactions(data);

        //sets filtered transactions after delete
        await getFilteredTransactions(data, userFilter);

        //sucess message
        message = res.status + ':  Sucess on ' + res.config.method + '.';
      })
      .catch((e) => {
        //error message
        message = e.response.status + ': ' + e.response.data.error;
      });

    //send message
    alert(message);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (formData) => {
    const { id = undefined } = formData;
    let message = '';

    if (id !== undefined) {
      await api
        .update(formData)
        .then(async (res) => {
          message = res.status + ':  Sucess on ' + res.config.method + '.';
          let data = await getPeriodTransactions(selectedPeriod);
          getFilteredTransactions(data, userFilter);
        })
        .catch((err) => {
          //error message
          message = err.response.status + ': ' + err.response.data.error;
        });
    } else {
      await api
        .create(formData)
        .then(async (res) => {
          message = res.status + ':  Sucess on ' + res.config.method + '.';
          let data = await getPeriodTransactions(selectedPeriod);
          getFilteredTransactions(data, userFilter);
        })
        .catch((err) => {
          //error message
          message = err.response.status + ': ' + err.response.data.error;
        });
    }

    setIsModalOpen(false);
    alert(message);
  };

  return (
    <div>
      <h1 className="center">Desafio Final do Bootcamp Full Stack</h1>);
      {allPeriods.length > 0 && (
        <div className="container">
          <PeriodSelector
            minPeriod={allPeriods[0]}
            maxPeriod={allPeriods[allPeriods.length - 1]}
            allPeriods={allPeriods}
            selectedPeriod={selectedPeriod}
            onChangePeriod={handleChangePeriod}
          />
          <TransactionsSummary
            count={filteredTransactions.length}
            expenses={expenses}
            revenues={revenues}
            balance={revenues - expenses}
            status={expenses > revenues ? '-' : '+'}
          />
          <TransactionsInputs
            filterText={userFilter}
            onChangeFilter={handleChangeFilter}
            onClickInsert={handleInsert}
          />
          <div style={{ margin: '0px 10px' }}>
            {filteredTransactions.map(
              ({ id, category, description, value, type, yearMonthDay }) => {
                return (
                  <Transaction
                    key={id}
                    id={id}
                    category={category}
                    description={description}
                    value={value}
                    type={type}
                    yearMonthDay={yearMonthDay}
                    onClickEdit={handleEdit}
                    onClickDelete={handleDelete}
                  />
                );
              }
            )}
          </div>
          {isModalOpen && (
            <TransactionModal
              onSave={handleSave}
              onClose={handleClose}
              transaction={modalTransaction}
              minPeriod={allPeriods[0]}
              maxPeriod={allPeriods[allPeriods.length - 1]}
            />
          )}
        </div>
      )}
    </div>
  );
}

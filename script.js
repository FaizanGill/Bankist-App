'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Faizan Muhammad',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-02-18T21:31:17.178Z',
    '2023-02-23T07:42:02.383Z',
    '2023-02-12T09:15:04.904Z',
    '2023-02-01T10:17:24.185Z',
    '2023-02-08T14:11:59.604Z',
    '2023-02-21T17:01:17.194Z',
    '2023-02-18T23:36:17.929Z',
    '2023-02-11T10:51:36.790Z',
  ],
  currency: 'PKR',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Usman Muhammad ',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//SetInterval

const timeInterval = function () {
  let totalmins = 120;
  const tick = function () {
    let hours = String(Math.floor(totalmins / 60)).padStart(2, 0);
    let minutes = String(totalmins % 60).padStart(2, 0);
    labelTimer.textContent = `${hours}:${minutes}`;

    if (totalmins === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }
    totalmins--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//FormatDate
const formatDate = function (date, locale) {
  const days = function (date1, date2) {
    const totaldays = Math.round((date1 - date2) / (1000 * 24 * 60 * 60));
    return totaldays;
  };

  const dayspassed = days(new Date(), date);

  if (dayspassed === 0) return 'Today';
  if (dayspassed === 1) return 'Yesterday';
  if (dayspassed <= 7) return `${dayspassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};
//Formate currency
const currencyformat = function (locale, number) {
  const formatcur = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currentacc.currency,
  }).format(number);
  return formatcur;
};

//compute usernames   2
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(ele => ele[0])
      .join('');
  });
};

//UPDATE UI
const updateUI = function (account) {
  displayMovements(account); //DisplayMovements
  calcDisplayBalance(account); //DisplayBalance
  displaySummary(account); //DisplaySummary
};

//DisplayMovements   1
const currentDate = new Date();

const displayMovements = function (account, sort = false) {
  //Sorting
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  //clear html movements
  containerMovements.textContent = '';
  // display movs
  movs.forEach(function (mov, i) {
    const date = new Date(account.movementsDates[i]);

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const dateshow = formatDate(date, account.locale);

    // const formatcur = new Intl.NumberFormat(account.locale, {
    //   style: 'currency',
    //   currency: account.currency,
    // }).format(mov);
    const formated = currencyformat(account.locale, mov);

    const html = `
       <div class="movements__row">
       <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       <div class="movements__date">${dateshow}</div>
      <div class="movements__value">${formated}</div>
     </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//DisplayBalance   3

const calcDisplayBalance = function (account) {
  account.balance = Math.floor(
    account.movements.reduce((acc, mov) => (acc += mov), 0)
  );
  const formatedbalance = currencyformat(account.locale, account.balance);
  labelBalance.textContent = `${formatedbalance}`;
  labelWelcome.textContent = `Welcome back ${account.owner.split(' ')[0]}`; //welcome message
};

//DisplaySummary   4

const displaySummary = function (account) {
  //InBalance
  const inbalance = Math.floor(
    account.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => (acc += mov), 0)
  );
  const formatedInBalance = currencyformat(account.locale, inbalance);
  labelSumIn.textContent = formatedInBalance;

  //OutBalance
  const outbalance = Math.floor(
    Math.abs(
      account.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => (acc += mov), 0)
    )
  );
  const formatedOutBalance = currencyformat(account.locale, outbalance);
  labelSumOut.textContent = formatedOutBalance;
  //Interest
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, mov) => (acc += mov), 0);
  const formatedInterest = currencyformat(account.locale, interest);
  labelSumInterest.textContent = formatedInterest;
};

createUsernames(accounts); //compute usernames
//LOGIN     5
let currentacc, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentacc = accounts.find(acc => acc.username === inputLoginUsername.value);
  if (currentacc?.pin === +inputLoginPin.value) {
    //DisplayUI
    if (timer) clearInterval(timer);
    timer = timeInterval();
    containerApp.style.opacity = 100;
    //Display dates
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      // weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentacc.locale,
      options
    ).format(currentDate);

    //   labelDate.textContent = `${currentDate.getDate()}/${
    //     currentDate.getMonth() + 1
    //   }/${currentDate.getFullYear()}, ${currentDate.getHours()}:${currentDate.getMinutes()}`;
    //
    // }
    updateUI(currentacc);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});
// TRANSFERS    6
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let receiveraccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  let amount = +inputTransferAmount.value;
  if (
    amount > 0 &&
    currentacc.balance >= amount &&
    receiveraccount &&
    receiveraccount?.username !== currentacc.username
  ) {
    currentacc.movements.push(-amount);
    receiveraccount?.movements.push(amount);

    currentacc.movementsDates.push(new Date().toISOString());
    receiveraccount?.movementsDates.push(new Date().toISOString());
    updateUI(currentacc);

    //Reset Timer
    clearInterval(timer);
    timer = timeInterval();
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});
//Fake Login
// currentacc = account1;
// updateUI(currentacc);
// containerApp.style.opacity = 100;

//CLOSEACCOUNT   7

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentacc.username &&
    +inputClosePin.value === currentacc.pin
  ) {
    let accountToCloseIndex = accounts.findIndex(
      ele => ele.username === inputCloseUsername.value
    );
    console.log(accountToCloseIndex);
    // Delete account
    accounts.splice(accountToCloseIndex, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//LOAN 8
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentacc.movements.some(function (ele) {
      return ele >= amount * 0.1;
    })
  ) {
    //Reset timer
    clearInterval(timer);
    timer = timeInterval();

    setTimeout(function () {
      currentacc.movements.push(amount);
      currentacc.movementsDates.push(currentDate);
      updateUI(currentacc);
    }, 2000);
  }
  inputLoanAmount.value = '';
});

//Sorting Button   9
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentacc, !sorted);
  sorted = !sorted;
});

const formEl = document.querySelector('form');
const liNodeList = document.querySelectorAll('li');

formEl.addEventListener('submit', (e) => {
  console.dir(e.target);
  console.log('form submitted');
  console.log(location.href);
});

Array.from(liNodeList).map((el) => el.addEventListener('click', mark));

function mark(e) {
  // cross out => a normal item
  if (e.target.id.includes('completed--js')) {
    e.target.id = '';
    e.target.classList.toggle('completed');
  }
  //a normal item => cross out
  else {
    e.target.id = 'completed--js';
    e.target.classList.toggle('completed');
  }
}

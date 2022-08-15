const formEl = document.querySelector('form');
const liNodeList = document.querySelectorAll('li');

formEl.addEventListener('submit', (e) => {
  console.dir(e.target);
  console.log('form submitted');
  console.log(location.href);
});

Array.from(liNodeList).map((el) => el.addEventListener('click', mark));

function mark(e) {
  const todoRegex = new RegExp('[\\n]{2}', 'g');
  const todoString = e.target.textContent.replaceAll(todoRegex, ' ').trim();

  // cross out => a normal item
  if (e.target.id.includes('completed--js')) {
    e.target.id = '';
    e.target.classList.toggle('completed');

    updateDB({
      todoItem: todoString,
      completed: false,
    });
  }
  //a normal item => cross out
  else {
    e.target.id = 'completed--js';
    e.target.classList.toggle('completed');
    updateDB({
      todoItem: todoString,
      completed: true,
    });
  }
}

async function updateDB(newObj) {
  const jsonObj = JSON.stringify(newObj);

  const rawResponse = await fetch('/update', {
    method: 'PUT',
    body: jsonObj,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
    },
  });

  const content = await rawResponse.json();

  console.log(content);
}

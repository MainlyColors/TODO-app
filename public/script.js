const formEl = document.querySelector('form');
const spanNodeList = document.querySelectorAll('#item--js');
const allDeleteBtns = document.querySelectorAll('#delete--js');

formEl.addEventListener('submit', (e) => {
  console.dir(e.target);
  console.log('form submitted');
  console.log(location.href);
});

Array.from(spanNodeList).map((el) => el.addEventListener('click', handleMark));
Array.from(allDeleteBtns).map((el) =>
  el.addEventListener('click', handleDelete)
);

function handleMark(e) {
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

async function handleDelete(e) {
  // if img in button is clicked
  if (e.target.parentNode.id === 'delete--js') {
    // img > button > li
    const grandParentEl = e.target.parentNode.parentNode;
    const itemName = Array.from(grandParentEl.children).find(
      (el) => el.id === 'item--js'
    ).textContent;

    const result = await deleteItem(itemName.trim());
    if (result) location.reload();
  }

  // if outer button edges are clicked
  else if (e.target.id === 'delete--js') {
    // button > li
    const parentEl = e.target.parentNode;
    const itemName = Array.from(parentEl.children).find(
      (el) => el.id === 'item--js'
    ).textContent;

    deleteItem(itemName.trim());
  }
  return false;
  // if (e.target.id !== 'delete--js') return false;

  // deleteItem()
}

// ****************************
// talk to backend functions
// ****************************

async function updateDB(newObj) {
  const jsonObj = JSON.stringify(newObj);

  try {
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
  } catch (err) {
    console.log('💣💣💣 BANG BANG ERROR 💣💣💣');
    console.error(err);
  }
}

async function deleteItem(ItemName) {
  const obj = {
    todoItem: ItemName,
  };
  const jsonObj = JSON.stringify(obj);

  try {
    const rawResponse = await fetch('/delete', {
      method: 'DELETE',
      body: jsonObj,
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    });

    const content = await rawResponse.json();

    console.log('item deleted');
    return content;
  } catch (err) {
    console.log('💣💣💣 BANG BANG ERROR 💣💣💣');
    console.error(err);
  }
}

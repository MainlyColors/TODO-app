const formEl = document.querySelector('form');

formEl.addEventListener('submit', (e) => {
  console.dir(e.target);
  console.log('form submitted');
  console.log(location.href);
});

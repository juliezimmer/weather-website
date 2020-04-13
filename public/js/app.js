// this selects the form attribute from index.hbs
const weatherForm = document.querySelector('form');

// gets the string the user entered in the search bar
// const search holds the value the user put in the search bar.
const search = document.querySelector('input');

const messageOne = document.querySelector('#message-one');
const messageTwo = document.querySelector('#message-two');

// Adds event listener to the form element
// requires the event to listen for and a cb function that runs every single time that event occurs.
// the browser default behavior is to refresh and we want to prevent that from happening. 
weatherForm.addEventListener('submit', (e) => {
   e.preventDefault();

   // created to get the location variable
   // search extracts the input value in the search bar
   const location = search.value;

   messageOne.textContent = 'Loading...';
   messageTwo.textContent = ''; // clears previous search content

      fetch('/weather?address=' + location)
      .then((response) => {
         response.json().then((data) => {
         // checking for errors first
         if(data.error){
            messageOne.textContent = data.error;
         } else {
            messageOne.textContent = data.location;
            messageTwo.textContent = data.forecast;
         }
      })
   });
});  


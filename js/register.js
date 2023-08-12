const generateUserURL = "https://randomuser.me/api/?inc=name,location,email";
const userForm = document.getElementById("userForm");
const userName = document.getElementById("userName");
const userLastName = document.getElementById("userLastName");
const userEmail = document.getElementById("userEmail");
const userCountry = document.getElementById("userCountry");
const termsCheckbox = document.getElementById("termsCheckbox");
const btnGenerateUser = document.getElementById("btnGenerateUser");
const btnSubmitUser = document.getElementById("btnSubmitUser");
let nameUser, lastNameUser, emailUser, countryUser, termsCheck;

btnGenerateUser.addEventListener("pointerdown", async () => {
  const response = await fetch(generateUserURL);
  const data = await response.json();

  userName.value = data.results[0].name.first;
  userLastName.value = data.results[0].name.last;
  userEmail.value = data.results[0].email;
  userCountry.value = data.results[0].location.country;
});

userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  nameUser = userName.value;
  lastNameUser = userLastName.value;
  emailUser = userEmail.value;
  countryUser = userCountry.value;
  termsCheck = termsCheckbox.checked;
});

btnSubmitUser.addEventListener("pointerdown", () => {
    window.location.href = "index.html";
});

export default nameUser;

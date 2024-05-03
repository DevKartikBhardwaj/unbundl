//making sure that active bundle slide is open after reload
const bundle = document.getElementById("bundle");
bundle.style.right = `${-1 * bundle.offsetWidth}px`;
const handleOpen = () => {
  bundle.style.display = "block";
  bundle.style.right = 0;
  bundle.style.display = `block`;
  localStorage.setItem("bundleSlideStatus", "open");
};
const handleClose = () => {
  bundle.style.right = `${-1 * bundle.offsetWidth}px`;
  bundle.style.display = `none`;

  localStorage.setItem("bundleSlideStatus", "close");
};
if (localStorage.getItem("bundleSlideStatus") == "open") {
  handleOpen();
}
//handling toast
const toastify = (msg) => {
  let toast = document.getElementById("toastid");
  toast.innerHTML = msg;
  toast.style.top = "10px";
  setTimeout(() => {
    toast.style.top = "-200px";
  }, 2000);
};
function load(time = 2500) {
  setTimeout(() => {
    window.location.reload();
  }, time);
}
fetch("db.json")
  .then((res) => res.json())
  .then((data) => {
    let carousel = document.getElementById("carousel");
    let html = "";
    data.forEach((elem) => {
      html += `<div class="productCard" >
      <img
        src=${elem.img}
        alt=${elem.name}
        width="150px"
      />
      <h3>${elem.name}</h3>
      <p><span>Category</span> - ${elem.category}</p>
      <p style="color: green"><span>MRP</span> - $${elem.mrp}</p>
      <button class="btn" onclick='handleAddBundle(${JSON.stringify(
        elem
      )})'>Add to Bundle</button>
    </div>`;
    });
    carousel.innerHTML = html;
  });

//logic for carousel

let productCards = document.getElementsByClassName("productCard");
let count = 0;
function func(manip = 0) {
  if (count == productCards.length - 3) count = 0;
  else if (manip == -1) count > 0 ? count-- : (count = 0);
  else count++;
  for (var i = 0; i < productCards.length; i++) {
    productCards[i].style.transform = `translate(${-220 * count}px)`;
  }
}
function next() {
  func(1);
}
function prev() {
  func(-1);
}
// function pe
setInterval(() => {
  func();
}, 2500);

//logic for bundle

const handleAddBundle = (elem) => {
  let flg = 0;
  if (localStorage.getItem("myBundle") == null)
    localStorage.setItem("myBundle", "[]");

  let elemsArray = JSON.parse(localStorage.getItem("myBundle"));

  for (let i = 0; i < elemsArray.length; i++) {
    if (elemsArray[i].name == elem.name) {
      elemsArray[i].qty += 1;
      localStorage.setItem("myBundle", JSON.stringify(elemsArray));
      flg = 1;
      toastify("Product Added to Bundle!");
      load();
      break;
    }
  }
  if (!flg && elemsArray.length >= 8) {
    toastify(
      "Bundle's maximum limit exceeded<br/>&nbsp;&nbsp;&nbsp;&nbsp;Remove some elements"
    );
    load();
    flg = 1;
  }
  if (flg) return;
  elemsArray.push(elem);
  localStorage.setItem("myBundle", JSON.stringify(elemsArray));
  toastify("Product Added to Bundle!");
  load();
};

//loading elements in bundle section
let elemsArray = JSON.parse(localStorage.getItem("myBundle"));
let bundleCardWrapper = document.getElementById("bundleCardWrapper");
let html = "";
elemsArray.forEach((elem) => {
  html += `
  <div class="bundleCard">
    <img src="${elem.img}" alt="${elem.name}" />
    <div class="bundleCardContent">
      <h3>
        <span class="minPart">Product - </span>${elem.name}
      </h3>
      <p>
        <span class="minPart">Description - </span>${elem.description}
      </p>
      <p><span class="minPart">Category - </span>${elem.category}</p>
      <p style="color: green; font-weight: bold">
        <span class="minPart" style="color: white">MRP - </span>$${elem.mrp}
      </p>
      <p>
        <span class="minPart">qty </span><span>- </span><span class="material-symbols-outlined iconQty" onCLick='manageQty("${elem.name}","add")'>
        add
        </span>&nbsp;&nbsp;${elem.qty}&nbsp;&nbsp;<span class="material-symbols-outlined iconQty" onCLick='manageQty("${elem.name}","sub")'>
        remove
        </span>
      </p>
      <button class="btn" style="background-color: white; color: black" onClick='handleRemove(
        "${elem.name}"
      )'>
        Remove Product
      </button>
    </div>
  </div>`;
});
bundleCardWrapper.innerHTML = html;

//remove from bundle
const handleRemove = (chocName) => {
  let elemsArray = JSON.parse(localStorage.getItem("myBundle"));
  for (let i = 0; i < elemsArray.length; i++) {
    if (elemsArray[i].name == chocName) {
      elemsArray.splice(i, 1);
      localStorage.setItem("myBundle", JSON.stringify(elemsArray));
      toastify("Product removed!");
      load();
      break;
    }
  }
};

//addQty
const manageQty = (chocName, what) => {
  let elemsArray = JSON.parse(localStorage.getItem("myBundle"));
  for (let i = 0; i < elemsArray.length; i++) {
    if (elemsArray[i].name == chocName) {
      if (what == "add") elemsArray[i].qty += 1;
      else elemsArray[i].qty -= 1;
      localStorage.setItem("myBundle", JSON.stringify(elemsArray));

      if (elemsArray[i].qty <= 0) handleRemove(chocName);
      load(100);
      break;
    }
  }
};

//calclate total mrp
let totalMRP = 0;
elemsArray.forEach(({ mrp, qty }) => {
  totalMRP += mrp * qty;
});
let totalAmountelem = document.getElementById("totalAmount");
totalAmountelem.innerText = totalMRP.toFixed(2);

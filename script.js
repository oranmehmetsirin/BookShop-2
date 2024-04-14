let bookList = [];
basketList = [];
const toggleModal = () => {
  const basketModal = document.querySelector(".basket_modal");
  basketModal.classList.toggle("active");
};
const getBooks = async () => {
  try {
    const response = await fetch("./product.json");
    const data = await response.json();
    bookList = data;
  } catch (error) {
    console.log(error);
  }
};
getBooks();

const createBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += `<i class="bi bi-star-fill active"></i>`;
    } else starRateHtml += `<i class="bi bi-star-fill"></i>`;
  }
  return starRateHtml;
};

const createBookItemsHTML = () => {
  const bookListEl = document.querySelector(".book_list");
  let bookListHtml = "";

  bookList.forEach((book, index) => {
    bookListHtml += `

        <div class="col-5 my-2 ${index % 2 == 0 && "offset-2"}">
        <div class="row book_card">
          <div class="col-6">
            <img
              src="${book.imgSource}"
              class="shadow img-fluid"
              width="275px"
              height="412.5px"
            />
          </div>
          <div class="col-6 d-flex flex-column justify-content-center gap-4">
            <div class="book_detail">
              <p class="fs-5 gray">${book.author}</p>
              <p class="fs-4 fw-bold">${book.name}</p>
              <span class="book_star-rate">
                ${createBookStars(book.starRate)}
                <span>${book.reviewCount} Visit</span>
              </span>
            </div>
            <p class="book_description gray">
            ${book.description}
            </p>
            <div>
              <span class="black fw-bold fs-4 me-2">${book.price}.-Eur</span>
              ${
                book.oldPrice
                  ? `<span class="fs-4 fw-bold old_price">${book.oldPrice} .-Eur</span>`
                  : ""
              } 
            </div>
            <button class="btn_purple onClick"addBookToBasket(${
              book.id
            })">Add to Basket</button>
          </div>
        </div>
        </div>
        `;
  });
  bookListEl.innerHTML = bookListHtml;
};

const BOOK_TYPES = {
  ALL: "All",
  NOVEL: "Novel",
  CHILDREN: "Child",
  HISTORY: "History",
  SELFIMPROVEMENT: "Self-Improvement",
  FINANCE: "Finance",
  SCIENCE: "Science",
};

const createBookTypesHtml = () => {
  const filterEle = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter == book.type) == -1) {
      filterTypes.push(book.type);
    }
  });
  filterTypes.forEach((type, index) => {
    filterHtml += `<li onClick="filterBooks(this)" data-types=${type} class=${
      index == 0 ? "active" : null
    }>${BOOK_TYPES[type] || type}</li>`;
  });
  filterEle.innerHTML = filterHtml;
};

const filterBooks = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.types;
  getBooks();
  if (bookType !== "ALL") {
    bookList = bookList.filter((book) => book.type == bookType);
    createBookItemsHTML();
  }
};

const decreaseItemToBasket = (bookId) => {
  const findIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  console.log(findIndex);
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1;
    }
    listBasketItems();
  }
};

const increaseItemToBasket = (bookId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );

  if (findedIndex != -1) {
    if (
      basketList[findedIndex].quantity != basketList[findedIndex].product.stock
    ) {
      basketList[findedIndex].quantity += 1;
    } else {
      alert("Yeterince stok yok");
    }
    listBasketItems();
  }
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket_list");
  const basketCountEl = document.querySelector(".basket_count");

  basketCountEl.innerHTML = basketList.length > 0 ? basketList.length : null;
  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    basketListHtml += `
        <li class="basket__item">
    <img
      src="${item.product.imgSource}"
      width="100"
      height="100"
      alt=""
    />
    <div class="basket__item-info ms-2">
      <h2 class="book__name">${item.product.name}]</h2>
      <span>${item.product.price} ₺</span>
      <p class="book__remove">remove</p>
    </div>
    <div class="book__count">
      <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
      <span class="">${item.quantity}</span>
      <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
    </div>
  </li>
        `;
  });
  basketListEl.innerHTML = basketListHtml;
};
const addBookToBasket = (bookId) => {
  console.log(bookId);
  let findedBook = bookList.find((book) => book.id == bookId);
  if (findedBook) {
    const basketAlreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    if (basketAlreadyIndex == -1) {
      let addItem = { quantity: 1, product: findedBook };
      basketList.push(addItem);
      console.log(basketList);
    } else {
      basketList[basketAlreadyIndex].quantity += 1;
      console.log(basketList);
    }
    listBasketItems();
  }
};

setTimeout(() => {
  createBookItemsHTML();
  createBookTypesHtml();
}, 200);

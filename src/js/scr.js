let BaseURL = "http://localhost:5500";

const cardsContainer = document.querySelector(".cards__container");

const getApiDataWithCallBack = async (endPoint, cb) => {
  let response = await fetch(`${BaseURL}/${endPoint}`).then((res) =>
    res.json()
  );
  cb(response);
};

const PostApiData = async (endPoint, data) => {
  let response = fetch(`${BaseURL}/${endPoint}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

const DeleteApiDataById = async (endPoint, id) => {
  let response = await fetch(`${BaseURL}/${endPoint}/${id}`, {
    method: "DELETE",
  });
  return response;
};

getApiDataWithCallBack("data", (data) => {
  data.map((item, index) => {
    const statusClass =
      item.status === "online" ? "status-online" : "status-offline";

    cardsContainer.innerHTML += `
           <div class="cards__card">
            <div class="cards__card--img">
              <img src="${item.image}" alt="" />
              <p class=${statusClass}>${item.status}</p>
            </div>
            <div class="cards__card--content">
              <h2 class="">${item.name}</h2>
              <p class="">${item.profession}</p>
              <button data-id=${item.id} class="cards__card--content__delete">Delete</button>
            </div>
          </div>`;

    const REMOVE_BTN = document.querySelectorAll(
      ".cards__card--content__delete"
    );

    REMOVE_BTN &&
      REMOVE_BTN.forEach((btn) =>
        btn.addEventListener("click", async (e) => {
          e.preventDefault();

          let AttrId = e.target.getAttribute("data-id");

          DeleteApiDataById("data", AttrId);
        })
      );
  });
});

const imgUrl = document.querySelector("#img__url");
const usrName = document.querySelector("#usr__name");
const prof = document.querySelector("#profession");
const userStatus = document.querySelector("#status");

const CREATE__USER = document.querySelector("#create__user");

CREATE__USER &&
  CREATE__USER.addEventListener("click", async (event) => {
    event.preventDefault();

    const userData = {
      image: imgUrl.value,
      name: usrName.value,
      profession: prof.value,
      status: userStatus.value,
    };

    try {
      const response = await PostApiData("data", userData);
      console.log("User created successfully:", response);
      //   window.location.href = "index.html";
    } catch (error) {
      console.error("Error creating user:", error);
    }
  });

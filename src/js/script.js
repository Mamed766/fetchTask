let BaseURL = "http://localhost:3001";
let LoadingImg = document.querySelector("#loading");
let IsEditing = false;
var EditId = null;

const getApiDataWithCallBack = async (endPoint, cb) => {
  let response = await fetch(`${BaseURL}/${endPoint}`).then((res) =>
    res.json()
  );
  cb(response);
};

const GetAPiDataById = async (endPoint, id) => {
  let response = await fetch(`${BaseURL}/${endPoint}/${id}`).then((res) =>
    res.json()
  );
  return response;
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

const PutApiDataById = async (endPoint, id, data) => {
  let response = await fetch(`${BaseURL}/${endPoint}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
};

const Table = document.querySelector("#table_data");
getApiDataWithCallBack("data", (data) => {
  data.map((item, index) => {
    Table.innerHTML += `  <tr>
                      <td>${++index}</td>
                      <td>${item.name}</td>
                      <td>
                        <img
                          src=${item.image}
                        />
                      </td>
                      <td>${item.email}</td>
                      <td>${item.phone}</td>
                      <td>${item.city}</td>
                      <td>
                      ${
                        item.status === "active"
                          ? `<button class="success">Active</button>`
                          : `<button class="error">DeAktive</button>`
                      }
                      </td>
                      <td>
                        <div class="item">
                          <button data-id=${item.id} class="edit">Edit</button>
                          <button data-id=${
                            item.id
                          } class="delete">Delete</button></div>
                      </td>
                    </tr>`;
    const REMOVE_BTN = document.querySelectorAll(".delete");
    REMOVE_BTN &&
      REMOVE_BTN.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          let AttrId = e.target.getAttribute("data-id");

          DeleteApiDataById("data", AttrId);
        });
      });
    const EDIT_BTN = document.querySelectorAll(".edit");

    EDIT_BTN &&
      EDIT_BTN.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          IsEditing = true;
          EditId = e.target.getAttribute("data-id");

          e.preventDefault();
          let AttrId = e.target.getAttribute("data-id");
          GetAPiDataById("data", AttrId).then((res) => {
            UserName.value = res.name;
            UserImage.value = res.image;
            UserEmail.value = res.email;
            UserPhone.value = res.phone;
            UserCity.value = res.city;
            UserStatus.value = res.status;
          });
        });
      });
  });
})
  .then((res) => {})
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    LoadingImg.style.display = "none";
  });

const UserName = document.querySelector("#name");
const UserImage = document.querySelector("#image");
const UserEmail = document.querySelector("#email");
const UserPhone = document.querySelector("#phone");
const UserCity = document.querySelector("#city");
const UserStatus = document.querySelector("#status");
const ADD_USER_BTN = document.querySelector("#create_user");

ADD_USER_BTN &&
  ADD_USER_BTN.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!IsEditing) {
      const AddUserObj = {
        id: self.crypto.randomUUID(),
        name: UserName.value,
        image: UserImage.value,
        email: UserEmail.value,
        phone: UserPhone.value,
        city: UserCity.value,
        status: UserStatus.value,
      };
      await PostApiData("data", AddUserObj)
        .then((res) => {
          if (res.status === 201) {
            ToasAlert("User Added Successfully", "success");
          }
        })
        .catch((err) => {
          ToasAlert("User Added Failed", "error");
        })
        .finally(() => {
          Object.keys(AddUserObj).map((key) => {
            ADD_USER_BTN[key].value = "";
          });
        });
    } else {
      const EDIT_UserObj = {
        id: self.crypto.randomUUID(),
        name: UserName.value,
        image: UserImage.value,
        email: UserEmail.value,
        phone: UserPhone.value,
        city: UserCity.value,
        status: UserStatus.value,
      };
      await PutApiDataById("data", EditId, EDIT_UserObj).then((res) => {
        if (res.status === 200) {
          ToasAlert("User Updated Successfully", "success");
        } else {
          ToasAlert("User Updated Failed", "error");
        }
      });
    }
  });

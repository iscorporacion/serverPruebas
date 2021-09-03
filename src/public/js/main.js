const formUpload = document.getElementById("formUpload");
const fileList = document.getElementById("lista_archivos");
const deleteButtons = document.querySelectorAll(".btnDelete");
const loader = document.querySelector(".loader");

formUpload.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    loader.classList.remove("hide");
    axios({
        method: 'POST',
        url: "/createFile",
        data: formData
    }).then(function (response) {
        if (response.data.file) {
            let itemLi = document.createElement("li");
            let btnDelete = document.createElement("button");
            btnDelete.classList.add('btn','btn-danger');
            btnDelete.innerText = 'Eliminar';
            btnDelete.dataset.id = response.data.file;
            addEvent(btnDelete);
            itemLi.classList.add('list-group-item','d-flex','justify-content-between','align-items-center');
            itemLi.innerHTML = /*html*/`
                <a target="_blank" href="/viewFile/${ response.data.file}">${response.data.file }</a>
            `;
            itemLi.appendChild(btnDelete);
            fileList.appendChild(itemLi);
            fileList.scrollTop = fileList.scrollHeight - fileList.clientHeight;
            loader.classList.add("hide");
            Swal.fire({
                title: response.data.title,
                text: response.data.message,
                confirmButtonText: `Aceptar`,
            });
        }
    }).catch(function (error) {
        Swal.fire({
            title: error.response.data.title,
            text: error.response.data.message,
            confirmButtonText: `Aceptar`,
        });
    });
});

let addEvent = (elemento) => {
    elemento.addEventListener('click', (e) => {
        e.preventDefault();
        let id = elemento.dataset.id;
        deleteFile(id, elemento);
    })
}
deleteButtons.forEach(element => addEvent(element));
let deleteFile = (file,elemento) => {
    const formData = new FormData();
    formData.append("file", file);
    loader.classList.remove("hide");
    axios({
        method: 'DELETE',
        url: "/deleteFile",
        data: formData
    }).then(function (response) {
        Swal.fire({
            title: response.data.title,
            text: response.data.message,
            confirmButtonText: `Aceptar`,
        });
        fileList.removeChild(elemento.parentNode);
        loader.classList.add("hide");
    }).catch(function (error) {
        Swal.fire({
            title: error.response.data.title,
            text: error.response.data.message,
            confirmButtonText: `Aceptar`,
        });
    });
}
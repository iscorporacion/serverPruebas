const formUpload = document.getElementById("formUpload");

formUpload.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    axios({
        method: 'POST',
        url: "/createFile",
        data: formData
    }).then(function (response) {
        console.log(error)
    }).catch(function (error) {
        console.log(error)
    });
});
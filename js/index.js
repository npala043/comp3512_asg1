document.addEventListener("DOMContentLoaded", function () {

    // Change to Single Painting view
    const button = document.querySelector("#singleView");
    button.addEventListener("click", function () {
        const divs = document.querySelectorAll(".listView");
        for (let d of divs) {
            d.style.display = "none";
        }
        document.querySelector("#single").style.display = "grid";
    });

    // Fetch info from API
    const url = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";
    const response = fetch(url)
        .then(response => response.json())
        .then(data => popGalleries(data))
        .catch(err => console.error(err));
    // For the above (and below), Nahuel used:
    // https://css-tricks.com/using-fetch/
    // https://www.youtube.com/watch?v=QO4NXhWo_NM
    // https://stackoverflow.com/questions/38380462/syntaxerror-unexpected-token-o-in-json-at-position-1
    // to understand what to do


    // Display List of Galleries
    function popGalleries(data) {
        let list = ``;
        for (let g of data) {
            list += `<p>${g.GalleryName}</p><br>`;
        }
        document.querySelector("#galleries").innerHTML = list;
    }

    // Populate Sections 3, 4 and 5
    const paras = document.querySelectorAll("#galleries p");
    for (let p of paras) {
        p.addEventListener("click", function (e) {
            let gallery = "";
            for (let g of galleries) {
                if (e.target.textContent === g.GalleryName) {
                    gallery = g;
                    break;
                }
            }
            // Populate Gallery Info
            const g = document.querySelector("#info");
            //need to implement: grab painting from corresponding API
            const info = document.querySelectorAll(".galleryInfo");
            for (let i of info) {

            }


            // Populate Map


            // Populate Paintings

        });
    }

});
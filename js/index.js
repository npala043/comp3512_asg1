document.addEventListener("DOMContentLoaded", function () {

    const galleriesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";
    const infoURL = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery='; // append galleryID here
    // Image url https://res.cloudinary.com/funwebdev/image/upload/SIZE/art/paintings/FILENAME

    const galleries = document.querySelector("#galleries");
    const info = document.querySelector("#info");
    const mapDiv = document.querySelector("#map");
    const paintings = document.querySelector("#paintings");
    const single = document.querySelector("#single");
    const load1 = document.querySelector("#loader1");
    const load2 = document.querySelector("#loader2");
    const load3 = document.querySelector("#loader3");
    const load4 = document.querySelector("#loader4");
    const pTable = document.querySelector("#paintingTable");

    // Fetch Galleries
    fetch(galleriesURL)
        .then(response => response.json())
        .then(data => {
            displayGalleryList(data)
            load1.style.display = "none";
            load2.style.display = "none";
            load3.style.display = "none";
            load4.style.display = "none";

            //Event listener for each gallery
            document.querySelectorAll(".galleryNames").forEach(g => {
                g.addEventListener("click", function (e) {
                    // display all loading gifs
                    load2.style.display = "block";
                    load3.style.display = "block";
                    load4.style.display = "block";

                    // Gallery Info
                    displayGalleryInfo(data, e.target.id);
                    load2.style.display = "none";

                    // Map
                    displayMap(data, e.target.id);
                    load3.style.display = "none";

                    // Paintings
                    displayPaintings(e.target.id);
                    load4.style.display = "none";
                    pTable.style.display = "";
                });
            });
        })
        .catch(err => console.error(err));

    // ------------------------- Helper Functions ------------------------- //

    // function displayMap(data, id) {

    // }

    function displayPaintings(id) {
        fetch(infoURL + id)
            .then(response => response.json())
            .then(data => displayPaintingTable(data))
            .catch(err => console.error(err));
    }

    function displayPaintingTable(paintings) {
        pTable.innerHTML = "";
        addTableHeaders();
        paintings.forEach(p => {
            const tr = document.createElement("tr");

            // Small painting img
            const tdImg = document.createElement("td");
            const img = document.createElement("img");
            img.src = `https://res.cloudinary.com/funwebdev/image/upload/w_75/art/paintings/${p.ImageFileName}`;
            tdImg.appendChild(img);

            // Artist (last) name
            const tdName = document.createElement("td");
            tdName.appendChild(document.createTextNode(`${p.LastName}`));

            // Painting title
            const tdTitle = document.createElement("td");
            tdTitle.setAttribute("style", "cursor:pointer; color:blue; text-decoration:underline;");
            tdTitle.classList.add("paintingTitle");
            const title = document.createTextNode(`${p.Title}`);
            tdTitle.appendChild(title);

            // Painting year
            const tdYear = document.createElement("td");
            tdYear.appendChild(document.createTextNode(`${p.YearOfWork}`));

            tr.appendChild(tdImg);
            tr.appendChild(tdName);
            tr.appendChild(tdTitle);
            tr.appendChild(tdYear);
            pTable.appendChild(tr);
        });
        applyPaintingEventHandlers(paintings);
    }

    function addTableHeaders() {
        const tr = document.createElement("tr");

        // Artist Header
        const thArtist = document.createElement("th");
        thArtist.appendChild(document.createTextNode("Artist"));

        // Title Header
        const thTitle = document.createElement("th");
        thTitle.appendChild(document.createTextNode("Title"));

        // Year Header
        const thYear = document.createElement("th");
        thYear.appendChild(document.createTextNode("Year"));

        tr.appendChild(document.createElement("th"));
        tr.appendChild(thArtist);
        tr.appendChild(thTitle);
        tr.appendChild(thYear);
        paintingTable.appendChild(tr);
    }

    function applyPaintingEventHandlers(data) {
        const titles = document.querySelectorAll(".paintingTitle");
        titles.forEach(t => {
            t.addEventListener("click", function (e) {
                const divs = document.querySelectorAll(".listView");
                divs.forEach(d => d.style.display = "none");
                document.querySelector("#single").style.display = "grid";
                displaySinglePainting(data.find(d => d.Title == e.target.innerHTML).ImageFileName);
            });
        });
    }

    function displaySinglePainting(fileName) {
        const img = document.createElement("img");
        img.src = `https://res.cloudinary.com/funwebdev/image/upload/w_500/art/paintings/${fileName}`;
        single.appendChild(img);
    }

    function displayGalleryList(data) {
        data.forEach(g => {
            let p = document.createElement("p");
            p.textContent = g.GalleryName;
            p.classList.add("galleryNames");
            p.id = g.GalleryID;
            galleries.appendChild(p);
        });
    }

    function displayGalleryInfo(data, id) {
        //Find
        const gallery = data.find(d => d.GalleryID == id);

        //Resets Gallery Information
        info.innerHTML = "";

        //Creates Title
        const h2 = document.createElement("h2");
        h2.appendChild(document.createTextNode("Gallery Information:"));
        info.appendChild(h2);

        //Creates Gallery Name *Only display native name if diff than English name*
        const pName = document.createElement("p");
        const name = (gallery.GalleryName == gallery.GalleryNativeName) ?
            document.createTextNode(`${gallery.GalleryName}`) :
            document.createTextNode(`${gallery.GalleryName} (${gallery.GalleryNativeName})`);
        pName.appendChild(name);
        info.appendChild(pName);

        //Creates Gallery Address
        const pAddress = document.createElement("p");
        pAddress.appendChild(document.createTextNode(`${gallery.GalleryAddress}`));
        info.appendChild(pAddress);

        //Creates Gallery Country
        const pCountry = document.createElement("p");
        pCountry.appendChild(document.createTextNode(`${gallery.GalleryCity}, ${gallery.GalleryCountry}`));
        info.appendChild(pCountry);

        //Creates Gallery Website
        const pWebsite = document.createElement("a");
        pWebsite.href = `${gallery.GalleryWebSite}`;
        pWebsite.textContent = `${gallery.GalleryWebSite}`;
        info.appendChild(pWebsite);
    }

});

// let map;
// function initMap() {
//     map = new google.maps.Map(document.querySelector('#gMap'), {
//         center: { lat: 41.89474, lng: 12.4839 },
//         zoom: 6
//     });
// }
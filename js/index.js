let map;
function initMap() {
    map = new google.maps.Map(document.querySelector("#map"), {
        center: { lat: 41.89474, lng: 12.4839 },
        zoom: 18,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        MapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER,
        },
        zoomControl: false,
        scaleControl: true,
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP,
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
        },
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const galleriesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";
    const infoURL = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery='; // append galleryID here

    const galleries = document.querySelector("#galleries");
    const info = document.querySelector("#info");
    const mapDiv = document.querySelector("#map");
    const paintings = document.querySelector("#paintings");
    const single = document.querySelector("#single");
    const load1 = document.querySelector("#loader1");
    const load2 = document.querySelector("#loader2");
    const load3 = document.querySelector("#loader3");
    const load4 = document.querySelector("#loader4");
    const load5 = document.querySelector("#loader5");
    const pTable = document.querySelector("#paintingTable");
    const container = document.querySelector(".container");

    // Fetch Galleries
    fetch(galleriesURL)
        .then(response => response.json())
        .then(data => {
            displayToggleButton();
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

    function displayToggleButton() {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Toggle";
        button.style.alignContent = "center";
        button.id = "toggle";
        container.appendChild(button);
        let t = -1;
        document.querySelector("#toggle").addEventListener("click", function () {
            galleries.classList.toggle('hidden');
            t = t * -1;
            if (t == 1) {
                info.style.gridColumn = "1";
                info.style.gridRow = "1/ span 2";
                mapDiv.style.gridRow = "1/ span 2";
            } else {
                galleries.style.gridColumn = "1, 2";
                galleries.style.gridRow = "1/ span 2";
                info.style.gridColumn = "2/ span 2";
                mapDiv.style.gridColumn = "2/ span 2";
                mapDiv.style.gridRow = "2/ span 1";
            }

        });
    }

    function displayMap(data, id) {
        let gal = data.find(g => g.GalleryID == id);
        map.setCenter({ lat: gal.Latitude, lng: gal.Longitude });
    }

    function displayPaintings(id) {
        fetch(infoURL + id)
            .then(response => response.json())
            .then(data => displayPaintingTable(data, 0))
            .catch(err => console.error(err));
    }

    //  1 = descending
    // -1 = ascending
    let sortName = 1;
    let sortTitle = 1;
    let sortYear = 1;

    function displayPaintingTable(paintings, mode) {
        pTable.innerHTML = "";
        addTableHeaders(paintings);
        switch (mode) {
            case 0:
                if (sortName > 0) {
                    paintings.sort((a, b) => a.LastName.localeCompare(b.LastName));
                } else {
                    paintings.sort((a, b) => b.LastName.localeCompare(a.LastName));
                }
                sortName *= -1;
                break;
            case 1:
                if (sortTitle > 0) {
                    paintings.sort((a, b) => a.Title.localeCompare(b.Title));
                } else {
                    paintings.sort((a, b) => b.Title.localeCompare(a.Title));
                }
                sortTitle *= -1;
                break;
            case 2:
                if (sortYear > 0) {
                    paintings.sort((a, b) => a.YearOfWork - b.YearOfWork);
                } else {
                    paintings.sort((a, b) => b.YearOfWork - a.YearOfWork);
                }
                sortYear *= -1;
                break;
        }
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
            tdTitle.setAttribute("style", "cursor:pointer; color:blue; font-weight:bold;");
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

    function addTableHeaders(paintings) {
        const tr = document.createElement("tr");

        const headers = [];

        const thArtist = document.createElement("th");
        thArtist.appendChild(document.createTextNode("Artist"));
        headers.push(thArtist);

        const thTitle = document.createElement("th");
        thTitle.appendChild(document.createTextNode("Title"));
        headers.push(thTitle);

        const thYear = document.createElement("th");
        thYear.appendChild(document.createTextNode("Year"));
        headers.push(thYear);

        tr.appendChild(document.createElement("th"));

        headers.forEach(h => {
            h.addEventListener("click", function (e) {
                if (e.target.textContent === "Artist") {
                    displayPaintingTable(paintings, 0);
                } else if (e.target.textContent === "Title") {
                    displayPaintingTable(paintings, 1);
                } else {
                    displayPaintingTable(paintings, 2);
                }
            });
            tr.appendChild(h);
        });

        paintingTable.appendChild(tr);
    }

    function applyPaintingEventHandlers(data) {
        const titles = document.querySelectorAll(".paintingTitle");
        titles.forEach(t => {
            t.addEventListener("click", function (e) {
                const divs = document.querySelectorAll(".listView");
                divs.forEach(d => d.style.display = "none");
                document.querySelector("#toggle").style.display = "none";
                document.querySelector("#single").style.display = "grid";
                displaySinglePainting(data.find(d => d.Title == e.target.innerHTML));
            });
        });
    }

    function displaySinglePainting(painting) {
        document.querySelector("#painting").innerHTML = "";
        document.querySelector("#painting_info").innerHTML = "";

        const img = document.createElement("img");
        img.src = `https://res.cloudinary.com/funwebdev/image/upload/art/paintings/${painting.ImageFileName}`;
        img.alt = `${painting.Title}`;
        document.querySelector("#painting").appendChild(img);

        const info = document.querySelector("#painting_info");

        const h2 = document.createElement("h2");
        h2.textContent = painting.Title;
        info.appendChild(h2);
        let artist = `${painting.FirstName} ${painting.LastName}`;
        let yearOfWork = painting.YearOfWork;
        let medium = painting.Medium;
        let width = painting.Width;
        let height = painting.Height;
        let copyright = painting.CopyrightText;
        let name = painting.GalleryName;
        let city = painting.GalleryCity;

        const p = document.createElement("p");
        let paintingInformation = `${artist}, ${yearOfWork}, ${medium}, ${width}x${height}cm, ${copyright}, ${name}, ${city}`;
        p.textContent = paintingInformation;

        // Creates working link
        let link = painting.MuseumLink;
        const a = document.createElement("a");
        a.href = link;
        a.textContent = link;

        // Description
        let description = painting.Description;
        const pDescription = document.createElement("p");
        pDescription.textContent = description;
        pDescription.style.fontStyle = "italic";

        // Creates Dominant Colors
        const p2 = document.createElement("p");
        p2.textContent = "Colors";

        const section = document.createElement("section");
        const containerDiv = document.createElement("span");
        containerDiv.setAttribute("style", `display:grid; grid-template-columns: repeat(${painting.JsonAnnotations.dominantColors.length}, 100px);`);
        for (let d of painting.JsonAnnotations.dominantColors) {
            const div = document.createElement("div");
            div.style.backgroundColor = `rgb(${d.color.red}, ${d.color.green}, ${d.color.blue})`;
            div.style.height = "50px";
            div.title = `${d.name} ${d.web}`;
            containerDiv.appendChild(div);
        }
        section.appendChild(containerDiv);

        // Creates Close Window Button
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Close";
        button.id = "close";


        const br = document.createElement("br");
        info.appendChild(p);
        info.appendChild(a);
        info.appendChild(pDescription);
        info.appendChild(p2);
        info.appendChild(section);
        info.appendChild(br);
        info.appendChild(button);

        document.querySelector("#close").addEventListener("click", function () {
            const divs = document.querySelectorAll(".listView");
            divs.forEach(d => d.style.display = "grid");
            document.querySelector("#toggle").style.display = "grid";
            const single = document.querySelector("#single");
            single.style.display = "none";
        });
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
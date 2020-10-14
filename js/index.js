document.addEventListener("DOMContentLoaded", function () {

    const galleriesURL = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php";
    const infoURL = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery='; // append galleryID here
    //const imagesURL = 'https://res.cloudinary.com/funwebdev/image/upload/SIZE/art/paintings/FILENAME';

    // Fetch Galleries
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
                    load2.style.display = "";
                    load3.style.display = "";
                    load4.style.display = "";

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
            })
        })
        .catch(err => console.error(err));

    function displayMap(data, id) {

    }



    function displayPaintings(id) {
        fetch(infoURL + id)
            .then(response => response.json())
            .then(data => {
                displayPaintingTable(data);
            })
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
            const name = document.createTextNode(`${p.LastName}`);
            tdName.appendChild(name);

            // Painting title
            const tdTitle = document.createElement("td");
            const title = document.createTextNode(`${p.Title}`);
            tdTitle.appendChild(title);

            // Painting year
            const tdYear = document.createElement("td");
            const year = document.createTextNode(`${p.YearOfWork}`);
            tdYear.appendChild(year);

            tr.appendChild(tdImg);
            tr.appendChild(tdName);
            tr.appendChild(tdTitle);
            tr.appendChild(tdYear);
            pTable.appendChild(tr);
        });
    }

    function addTableHeaders() {
        const tr = document.createElement("tr");
        
        // Image header
        const thImg = document.createElement("th");

        // Artist Header
        const thArtist = document.createElement("th");
        const artist = document.createTextNode("Artist")
        thArtist.appendChild(artist);

        // Title Header
        const thTitle = document.createElement("th");
        const title = document.createTextNode("Title");
        thTitle.appendChild(title);

        // Year Header
        const thYear = document.createElement("th");
        const year = document.createTextNode("Year");
        thYear.appendChild(year);

        tr.appendChild(thImg);
        tr.appendChild(thArtist);
        tr.appendChild(thTitle);
        tr.appendChild(thYear);
        paintingTable.appendChild(tr);
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
        const h2Title = document.createTextNode("Gallery Information:");
        h2.appendChild(h2Title);
        info.appendChild(h2);

        //Creates Gallery Name (Native Name)
        const pName = document.createElement("p");
        const name = document.createTextNode(`${gallery.GalleryName} (${gallery.GalleryNativeName})`);
        pName.appendChild(name);
        info.appendChild(pName);


        //Creates Gallery Address
        const pAddress = document.createElement("p");
        const address = document.createTextNode(`${gallery.GalleryAddress}`);
        pAddress.appendChild(address);
        info.appendChild(pAddress);

        //Creates Gallery Country
        const pCountry = document.createElement("p");
        const country = document.createTextNode(`${gallery.GalleryCity}, ${gallery.GalleryCountry}`);
        pCountry.appendChild(country);
        info.appendChild(pCountry);

        //Creates Gallery Website
        const pWebsite = document.createElement("a");
        pWebsite.href = `${gallery.GalleryWebSite}`;
        pWebsite.textContent = `${gallery.GalleryWebSite}`;
        info.appendChild(pWebsite);
    }

    // Change to Single Painting view
    // const button = document.querySelector("#singleView");
    // button.addEventListener("click", function () {
    //     const divs = document.querySelectorAll(".listView");
    //     divs.forEach(d => d.style.display = "none");
    //     document.querySelector("#single").style.display = "grid";
    // });

   
});

let map;
function initMap() {
    map = new google.maps.Map(document.querySelector('#gMap'), {
        center: { lat: 41.89474, lng: 12.4839 },
        zoom: 6
    });
}
let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("id");
if (window.location.pathname.includes("subpage.html")) {
    let subpage = document.querySelector("#subpage section")
    let subTemplate = document.querySelector("#subpage template").content
    let endpoints = ['music_events', 'movies'];
    endpoints.forEach(endp => {
        let endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/" + endp + "/" + id
        fetch(endpoint)
            .then(e => e.json())
            .then(showSinglePost)
    })
    /*console.log("i want to get article: " + id);
    fetch("http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/music_events/"+id)
    fetch("http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/movies/"+id)
  .then(e=>e.json())
  .then(showSinglePost)*/

    function showSinglePost(aPost) {
        let date = aPost.acf.date
        let match = date.match(/(\d{4})(\d{2})(\d{2})/);
        let formattedDate = match[1] + '.' + match[2] + '.' + match[3];
        let clone = subTemplate.cloneNode(true);
        console.log(aPost)
        clone.querySelector("#poster").src = aPost.acf.image.sizes.medium_large
        clone.querySelector("#title").textContent = aPost.title.rendered
        clone.querySelector("#date").textContent = formattedDate
        clone.querySelector("#genre").textContent = aPost.acf.genre
        clone.querySelector("#description").innerHTML = aPost.content.rendered

        subpage.appendChild(clone)
    }


} else {
    let template = document.querySelector("#eventTemp").content;
    let eventList = document.querySelector("#events");
    let plusButton = document.querySelector(".pagePlus");

    let catid = urlParams.get("category");
    let page = 1;
    let page2 = 1;
    let musicPages = 0;
    let moviePages = 0;
    //let endpoints = ['music_events', 'movies'];
    //let totalPages = 0;
    /*function fetchData(){
        endpoints.forEach(endp =>{
            let endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/"+endp+"?_embed&order=asc&per_page=2&page=" + page
            if (catid) {
                endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/"+endp+"?_embed&order=asc&per_page=2&page=" + page + "&categories=" + catid
            }
            fetch(endpoint)
                .then(e => {
                      totalPages+=+e.headers.get("X-WP-TotalPages")
                    return e.json()
                })
                .then(showEvents);
            })
    }*/

    function fetchMusicEvt() {
        let endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/music_events?_embed&order=asc&per_page=1&page=" + page
        if (catid) {
            endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/music_events?_embed&order=asc&per_page=1&page=" + page + "&categories=" + catid
        }
        fetch(endpoint)
            .then(e => {
                musicPages = e.headers.get("X-WP-TotalPages")
                return e.json()
            })
            .then(showEvents)
    }

    function fetchEvents() {
        let endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/movies?_embed&order=asc&per_page=1&page=" + page2

        if (catid) {
            endpoint = "http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/movies?_embed&order=asc&per_page=1&page=" + page2 + "&categories=" + catid
        }
        fetch(endpoint)
            .then(e => {
                moviePages = e.headers.get("X-WP-TotalPages")
                return e.json()
            })
            .then(showEvents)
    }

    function showEvents(data) {
        data.forEach(showSingleEvent)

        if (page < musicPages || page2 < moviePages) {
            plusButton.classList.remove("dontDisplay");
            plusButton.addEventListener('click', function () {
                if (page < musicPages) {
                    page++;
                    fetchMusicEvt();
                    //fetchData();
                } else if (page2 < moviePages) {
                    page2++;
                    fetchEvents();
                } else {
                    plusButton.classList.add("dontDisplay");
                }
            })
        }

    }



    function showSingleEvent(anEvent) {

        let clone = template.cloneNode(true);
        clone.querySelector(".title").textContent = anEvent.title.rendered;
        //FORMAT THE DATE
        let date = anEvent.acf.date
        let match = date.match(/(\d{4})(\d{2})(\d{2})/);
        let formattedDate = match[1] + '.' + match[2] + '.' + match[3];
        ///////////////////
        clone.querySelector(".date").textContent = formattedDate;
        clone.querySelector(".imgPlace").style.backgroundImage = "url(" + anEvent.acf.image.sizes.medium + ")"
        clone.querySelector(".genre").textContent = anEvent.acf.genre
        let category = clone.querySelector(".cat")
        category.textContent = anEvent.type;
        if (anEvent.type.includes("_")) {
            category.textContent = category.textContent.replace("_", " ")
        }
        clone.querySelector(".singleEvent").addEventListener('click', showSubpage)

        function showSubpage() {
            window.location.href = "subpage.html?id=" + anEvent.id;
        }
        eventList.appendChild(clone);

    }
    fetchEvents();
    fetchMusicEvt();
    //fetchData();


    //BUILD MENU
    fetch("http://soperfect.dk/kea/07-cms/wp00/wp-json/wp/v2/categories?_embed&per_page=25")
        .then(e => e.json())
        .then(buildMenu)

    function buildMenu(data) {
        let parentElement = document.querySelector(".slideMenu ul")
        let burger = document.querySelector(".burgerMenu")
        burger.addEventListener('click', function slideMenu() {
            burger.classList.add("burgerTransform");
            let menu = document.querySelector(".slideMenu").classList.toggle("hidden");
            burger.addEventListener('click', function () {
                burger.classList.remove("burgerTransform");
                burger.style.animation = "moveArrow 1s reverse forwards";
                /*burger.classList.replace("burgerTransform", "burgerTransformBack");*/
                //burger.style.animationDirection="reverse";
            })
        });
        data.forEach(item => {
            if (item.count > 0 && item.parent === 41 || item.parent === 7) {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.textContent = item.name;
                a.href = "index.html?category=" + item.id;
                li.appendChild(a);
                parentElement.appendChild(li);
            }
        })
    }
}

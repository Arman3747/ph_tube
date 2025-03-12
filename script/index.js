console.log("hello index!");

const showLoader=()=>{
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('video-container').classList.add('hidden');
}

const hideLoader=()=>{
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('video-container').classList.remove('hidden');
}

function removeActiveClass(){
    const activeButton = document.getElementsByClassName("active");

    for(let bbtn of activeButton)
    {
        bbtn.classList.remove("active");
    }
}

function loadCategories(){
    // console.log("category is loaded");
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res)=>res.json())
    .then((data) => displayCategories(data.categories));
}

function loadVideos(searchText =""){

    showLoader();
    // console.log("category is loaded");
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res)=>res.json())
    .then((data) =>{
        removeActiveClass();
        document.getElementById("btn-all").classList.add("active");
        displayVideos(data.videos)
    });
}

const loadCategoryVideos=(id)=>{

    showLoader();

    const url=`https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {

        removeActiveClass();
        const clickedButton = document.getElementById(`btn-${id}`)
        // console.log(clickedButton);
        clickedButton.classList.add("active");
        displayVideos(data.category);
    });
};

const loadVideoDetails = (videoId)=>{
    // console.log(videoId);

    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    fetch(url)
    .then(res => res.json())
    .then(data => displayVideoDetails(data.video));
};

const displayVideoDetails = (video) => {
    // console.log(video);
    document.getElementById("video_details").showModal();
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `

    <div class="card bg-base-100 image-full shadow-sm">
        <figure>
            <img
            src="${video.thumbnail}"
            alt="" />
        </figure>
        <div class="card-body">
            <h2 class="card-title">${video.title}</h2>
            <p>By => ${video.authors[0].profile_name}</p>
            <p class="text-justify text-base font-medium">${video.description}</p>
        </div>
    </div>
    `;
};

function displayCategories(ccategories)
{
    const categoryContainer = document.getElementById('category-container');

    for(let cat of ccategories)
    {
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = `
        
            <button id="btn-${cat.category_id}" onclick="loadCategoryVideos(${cat.category_id})" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
        `;
        categoryContainer.append(categoryDiv);
    }
}

// {
//     "category_id": "1001",
//     "video_id": "aaaa",
//     "thumbnail": "https://i.ibb.co/L1b6xSq/shape.jpg",
//     "title": "Shape of You",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/D9wWRM6/olivia.jpg",
//             "profile_name": "Olivia Mitchell",
//             "verified": ""
//         }
//     ],
//     "others": {
//         "views": "100K",
//         "posted_date": "16278"
//     },
//     "description": "Dive into the rhythm of 'Shape of You,' a captivating track that blends pop sensibilities with vibrant beats. Created by Olivia Mitchell, this song has already gained 100K views since its release. With its infectious melody and heartfelt lyrics, 'Shape of You' is perfect for fans looking for an uplifting musical experience. Let the music take over as Olivia's vocal prowess and unique style create a memorable listening journey."
// }

const displayVideos=(videos)=>{
    // console.log(videos);
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML="";

    if(videos.length == 0)
    {
        videoContainer.innerHTML=`

        <div class=" py-20 col-span-full text-center flex flex-col justify-center items-center">
            <img class="w-[120px]" src="assets/images/Icon.png" alt="">
            <h2 class="text-2xl font-bold text-[#FF1F3D]">Oops!!! Sorry, There is no content here.</h2>
        </div>
        
        `;
        hideLoader();
        return;
    }

    videos.forEach(video=>{
        // console.log(video);
        const videoCard = document.createElement("div");

        videoCard.innerHTML=`

        <div class="card bg-base-100">
            <figure class="relative">
                <img class="w-full h-[150px] object-cover"
                src="${video.thumbnail}"
                alt="Shoes" />
                <span class="absolute bottom-2 right-2 text-sm rounded text-white bg-black px-2">3hrs 56 min ago</span>
            </figure>
            <div class="flex gap-3 px-0">
                <div class="profile">
                    <div class="avatar">
                        <div class="ring-primary ring-offset-base-100 w-6 rounded-full ring ring-offset-2">
                          <img src="${video.authors[0].profile_picture}" />
                        </div>
                      </div>
                </div>
                <div class="intro">
                    <h2 class="text-sm font-semibold">${video.title}</h2>
                    <p class="text-sm text-gray-400 flex gap-1">${video.authors[0].profile_name}
                    ${video.authors[0].verified == true ? `<img class="w-5 h-5" src="https://img.icons8.com/?size=100&id=98A4yZTt9abw&format=png&color=000000" alt="">` : ` ` }
                    
                    </p>
                    <p class="text-sm text-gray-400">${video.others.views}</p>
                </div>
            </div>
            <button onclick=loadVideoDetails('${video.video_id}') class="btn btn-dash btn-block btn-info">Show Details</button>
        </div>
        `;

        videoContainer.append(videoCard);
    })
    hideLoader();
}

document.getElementById('search-input').addEventListener("keyup",(e) => {
    const input = e.target.value;
    loadVideos(input);
});
loadCategories();
loadVideos();
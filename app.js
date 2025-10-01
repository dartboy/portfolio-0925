document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll(".bgVid");
    console.log(videos);
    let current = 0;
    
    videos[current].play();

    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
        video.classList.remove("active");
    });
    
    videos[current].classList.add("active");   
    videos[current].play();

    videos.forEach((video, i) => {
       
        video.addEventListener("ended", () => {
            console.log("HELLO");

            videos[i].pause();
            videos[i].currentTime = 0;
            videos[i].classList.remove("active");
            
       
            current = (i + 1) % videos.length;

            videos[current].classList.add("active");
            videos[current].play();
    });
   });

});


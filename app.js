document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll(".bgVid");
    const projectTitles = document.querySelectorAll(".projectTitle");

    let current = 0;

    function highlightTitle(video) {
        const classes = Array.from(video.classList);
        const projectClass = classes.find(cls => cls !== "bgVid" && cls !== "active");

        projectTitles.forEach(item => {
            item.classList.toggle("highlight", item.classList.contains(projectClass));
        });
    }


    videos[current].play();
    highlightTitle(videos[current]);

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
            highlightTitle(videos[current]);
    });
   });

});


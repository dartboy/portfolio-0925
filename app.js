document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll(".bgVid");
    const projectTitles = document.querySelectorAll(".projectTitle");

    let current = 0;
    let hoverActive = false;

    function highlightTitle(video) {
        const classes = Array.from(video.classList);
        const projectClass = classes.find(cls => cls !== "bgVid" && cls !== "active");

        projectTitles.forEach(item => {
            item.classList.toggle("highlight", item.classList.contains(projectClass));
        });
    }

    function playVideoAt(index) {
        videos.forEach(v => {
            v.pause();
            v.currentTime = 0;
            v.classList.remove("active");
        });
        videos[index].classList.add("active");
        videos[index].play();
        highlightTitle(videos[index]);
        current = index;
    }

    videos[current].play();
    highlightTitle(videos[current]);

    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
        video.classList.remove("active");
    });

    videos[current].classList.add("active");   
    playVideoAt(current);


    // -- LOOP THROUGH VIDEOS ON END --

    videos.forEach((video, i) => {
        video.addEventListener("ended", () => {
            console.log("HELLO");
            if (hoverActive) {
                playVideoAt(current);
                return;
            };
            videos[i].pause();
            videos[i].currentTime = 0;
            videos[i].classList.remove("active");
            current = (i + 1) % videos.length;
            playVideoAt(current);
    });
   });

   projectTitles.forEach(title => {
        title.addEventListener("mouseenter", () => {
            hoverActive = true;
            console.log("SSSADAS");
              const titleClasses = Array.from(title.classList);
        const matchClass = titleClasses.find(
            cls => cls !== "projectTitle" && cls !== "highlight"
        );

        if (!matchClass) return; // avoid undefined errors

        // Find the video with that class
        const newIndex = Array.from(videos).findIndex(v =>
            v.classList.contains(matchClass)
        );
            if (newIndex !== -1) playVideoAt(newIndex);
        });
        title.addEventListener("mouseleave", () => {
            hoverActive = false;
        });
   });

});


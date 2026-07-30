document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll(".bgVid");
    const projectTitles = document.querySelectorAll(".projectTitle");
    const menuListWrapper = document.querySelector(".menuList-wrapper");

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

    // Shared by desktop hover + mobile swipe: given a .projectTitle element,
    // find and play its matching background video. Returns true if a match was found.
    function selectProjectTitle(title) {
        const titleClasses = Array.from(title.classList);
        const matchClass = titleClasses.find(
            cls => cls !== "projectTitle" && cls !== "highlight"
        );
        if (!matchClass) return false;

        const newIndex = Array.from(videos).findIndex(v => v.classList.contains(matchClass));
        if (newIndex === -1) return false;

        playVideoAt(newIndex);
        return true;
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

   // -- DESKTOP: HOVER TO SELECT --

   projectTitles.forEach(title => {
        title.addEventListener("mouseenter", () => {
            hoverActive = true;
            selectProjectTitle(title);
        });
        title.addEventListener("mouseleave", () => {
            hoverActive = false;
        });
   });

   // -- MOBILE / TOUCH: SWIPE TO SELECT, ONE ITEM AT A TIME --
   // Coarse-pointer, no-hover devices get a captured-scroll "picker wheel" instead
   // of relying on hover. Matches the CSS media query in styles.css.

   const isTouchPrimary = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

   if (isTouchPrimary && menuListWrapper && projectTitles.length) {
        const items = Array.from(projectTitles);
        const startIndex = items.findIndex(item => item.classList.contains("highlight"));
        let activeIndex = startIndex === -1 ? 0 : startIndex;

        const SWIPE_THRESHOLD = 45;  // px (touch) / wheel-delta needed to advance one item
        const STEP_LOCK_MS = 450;    // blocks re-triggering mid-transition (one item per snap)

        let locked = false;
        let touchStartY = null;

        function goToIndex(nextIndex) {
            nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex));
            if (nextIndex === activeIndex) return;

            activeIndex = nextIndex;
            hoverActive = true; // keep looping the selected clip instead of ambient auto-advance
            selectProjectTitle(items[activeIndex]);
            items[activeIndex].scrollIntoView({ behavior: "smooth", block: "center" });

            locked = true;
            setTimeout(() => { locked = false; }, STEP_LOCK_MS);
        }

        // Returns true if the gesture should be captured (page stays put).
        // Returns false at the first/last item once the gesture points further
        // outward, releasing control back to normal page scrolling.
        function handleDelta(deltaY) {
            const direction = deltaY > 0 ? 1 : -1; // "forward" = toward the next item
            const atOuterEdge =
                (direction === -1 && activeIndex === 0) ||
                (direction === 1 && activeIndex === items.length - 1);

            if (atOuterEdge) return false;

            if (!locked && Math.abs(deltaY) >= SWIPE_THRESHOLD) {
                goToIndex(activeIndex + direction);
            }
            return true;
        }

        menuListWrapper.addEventListener("touchstart", (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        menuListWrapper.addEventListener("touchmove", (e) => {
            if (touchStartY === null) return;

            const currentY = e.touches[0].clientY;
            const deltaY = touchStartY - currentY; // finger moving up = advance forward

            const consumed = handleDelta(deltaY);

            if (consumed) {
                e.preventDefault();
                if (Math.abs(deltaY) >= SWIPE_THRESHOLD) {
                    touchStartY = currentY; // let one continuous drag step through several items
                }
            } else {
                touchStartY = null; // hand the rest of this gesture to native scrolling
            }
        }, { passive: false });

        menuListWrapper.addEventListener("touchend", () => {
            touchStartY = null;
        }, { passive: true });

        // Wheel/trackpad support for hybrid touch-primary devices
        let wheelAccum = 0;
        let wheelResetTimer = null;

        menuListWrapper.addEventListener("wheel", (e) => {
            wheelAccum += e.deltaY;
            const consumed = handleDelta(wheelAccum);

            if (consumed) {
                e.preventDefault();
                if (Math.abs(wheelAccum) >= SWIPE_THRESHOLD) {
                    wheelAccum = 0;
                }
            } else {
                wheelAccum = 0;
            }

            clearTimeout(wheelResetTimer);
            wheelResetTimer = setTimeout(() => { wheelAccum = 0; }, 200);
        }, { passive: false });
   }

});


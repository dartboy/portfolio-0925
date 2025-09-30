document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.vimeoContainer');
    const iframe = container.querySelector('.vimeoVideo');
    const bgClass = document.querySelector('.bgPoster');
    bgClass.classList.add('is-ready');
    iframe.addEventListener('load', () => {
        container.classList.add('is-ready');
        
    });
});


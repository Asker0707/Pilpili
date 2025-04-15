"use strict"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

const body = document.body
const lang = document.documentElement.lang.substring(0, 2)

var albums
let tlSwipeHint
let firstSwipe = false

let windowWidth = window.innerWidth

// const toggleOverflow = (timeline) => {
//     document.body.style.overflow = timeline.reversed() ? "auto" : "hidden"
// }

let smoother = ScrollSmoother.create({
    smooth: 1.5,
    smoothTouch: 0,
    normalizeScroll: true,
    ignoreMobileResize: true,
    effects: ScrollTrigger.isTouch === 1 ? false : true
})

function updateViewportWidth() {
    windowWidth = window.innerWidth
    document.getElementById("viewport-width").textContent = `${windowWidth}px`
}

// Inizializza la larghezza del viewport
updateViewportWidth()

// Aggiungi un listener per l'evento resize
window.addEventListener("resize", updateViewportWidth)

let mm = gsap.matchMedia(),
    breakPoint = 1024

document.addEventListener("DOMContentLoaded", () => {
    const buttonMenu = document.getElementById("menu_button")

    const tlNavigazione = gsap.timeline({
        paused: true,
        onStart: () => {
            smoother.paused(!smoother.paused())
        },
        onReverseComplete: () => {
            smoother.paused(!smoother.paused())
        }
    })

    tlNavigazione.from("#navigazione", {
        duration: 0.3,
        autoAlpha: 0
    })
    tlNavigazione.reverse()

    buttonMenu.addEventListener("click", function () {
        tlNavigazione.reversed(!tlNavigazione.reversed())
    })

    mm.add(
        {
            isDesktop: `(min-width: ${breakPoint}px)`,
            isMobile: `(max-width: ${breakPoint - 1}px)`
        },
        (context) => {
            let { isDesktop, isMobile } = context.conditions

            function initSplit() {
                const splitTexts = gsap.utils.toArray(".split-lines")
                splitTexts.forEach((item) => {
                    let split = new SplitText(item, {
                        type: "lines"
                    })

                    let tl_splitText = gsap.timeline({
                        paused: true
                        //onComplete: () => split.revert()
                    })
                    gsap.set(item, { autoAlpha: 1 })
                    tl_splitText.from(split.lines, {
                        duration: 1,
                        y: isDesktop ? 80 : 20,
                        skewY: isDesktop ? 0 : 0,
                        autoAlpha: 0,
                        ease: "power3",
                        stagger: 0.07
                    })

                    ScrollTrigger.create({
                        trigger: item,
                        start: "top 85%",
                        //markers: true,
                        animation: tl_splitText,
                        toggleActions: "restart none none reverse"
                    })
                })
            }

            ScrollTrigger.normalizeScroll(true)

            document.fonts.ready.then(() => {
                initSplit()
            })

            const homeAmbienti = document.getElementById("home_ambienti")

            const ambientiTitoli = document.querySelectorAll(".ambiente_titolo")
            const swiperAmbienti = new Swiper(".swiper_ambienti", {
                centeredSlides: true,
                speed: 1000,
                slidesPerView: 1.65,
                slidesPerGroup: 1,
                init: false,
                initialSlide: 1,
                grabCursor: true,
                effect: "creative",
                navigation: {
                    nextEl: ".ambienti_next",
                    prevEl: ".ambienti_prev"
                },
                breakpoints: {
                    768: {
                        slidesPerView: 1.2,
                        creativeEffect: {
                            prev: {
                                translate: ["-111%", 0, 0],
                                scale: 1.14,
                                origin: "top"
                            },
                            next: {
                                translate: ["111%", 0, 0],
                                scale: 1.14,
                                origin: "top"
                            }
                        }
                    },
                    1024: {
                        slidesPerView: 1.44,
                        creativeEffect: {
                            prev: {
                                translate: ["-111%", 0, 0],
                                scale: 1.14,
                                origin: "top"
                            },
                            next: {
                                translate: ["111%", 0, 0],
                                scale: 1.14,
                                origin: "top"
                            }
                        }
                    },
                    1280: {
                        slidesPerView: 1.66,
                        creativeEffect: {
                            prev: {
                                translate: ["-121%", 0, 0],
                                scale: 1.14,
                                origin: "top"
                            },
                            next: {
                                translate: ["121%", 0, 0],
                                scale: 1.14,
                                origin: "top"
                            }
                        }
                    }
                }
            })

            let ambientePrevTitle, ambienteNextTitle

            swiperAmbienti.on("init slideChange", () => {
                //updateTitoliColor(swiperAmbienti.realIndex, "#896345")
                updateAmbientiTitles()
            })

            if (windowWidth >= 768) {
                swiperAmbienti.init()
            }

            // if (ambientiTitoli.length !== 0) {
            //     const tlAmbientiTitolo = gsap.timeline()
            //     tlAmbientiTitolo.from(ambientiTitoli, {
            //         autoAlpha: 0,
            //         y: 40,
            //         stagger: {
            //             each: 0.1,
            //             from: "center"
            //         }
            //     })
            //     ScrollTrigger.create({
            //         trigger: ".ambienti_titoli",
            //         start: "top 80%",
            //         //markers: true,
            //         animation: tlAmbientiTitolo
            //     })
            // }

            // function updateTitoliColor(index, color) {
            //     gsap.to(ambientiTitoli, {
            //         duration: 0.3,
            //         color: "#D2C09F"
            //     })
            //     gsap.to(ambientiTitoli[index], {
            //         duration: 0.3,
            //         color: color
            //     })
            // }

            function updateAmbientiTitles() {
                ambientePrevTitle =
                    swiperAmbienti.realIndex > 0
                        ? swiperAmbienti.slides[swiperAmbienti.realIndex - 1]
                              .dataset.ambiente
                        : ""
                ambienteNextTitle =
                    swiperAmbienti.realIndex < swiperAmbienti.slides.length - 1
                        ? swiperAmbienti.slides[swiperAmbienti.realIndex + 1]
                              .dataset.ambiente
                        : ""
                document.querySelector(".ambienti_prev").dataset.title =
                    ambientePrevTitle
                document.querySelector(".ambienti_next").dataset.title =
                    ambienteNextTitle
            }

            const ambienti = document.querySelectorAll(".slide_ambiente")
            const timelinesExecuted = []

            function createTimeline(slide) {
                let tl = gsap.timeline({
                    paused: true
                })
                tl.to(slide.querySelector(".ambiente_velo"), {
                    autoAlpha: 0.4
                })
                    .from(
                        slide.querySelector(".ambiente_scheda"),
                        {
                            duration: 1.2,
                            scaleX: 0,
                            transformOrigin: "right",
                            ease: "power2.inOut"
                        },
                        "<75%"
                    )
                    .to(
                        slide.querySelector(".ambiente_foto"),
                        {
                            duration: 1.2,
                            clipPath: "inset(0% 0% 0% 0%)",
                            ease: "power2.inOut"
                        },
                        "<50%"
                    )
                    .from(
                        slide.querySelectorAll(
                            ".ambiente_scheda h3, .ambiente_scheda p"
                        ),
                        {
                            duration: 0.8,
                            autoAlpha: 0,
                            x: 60,
                            ease: "power2.out",
                            stagger: 0.1
                        },
                        "<75%"
                    )
                return tl
            }

            if (windowWidth < 768) {
                const ambientiMobile =
                    document.querySelectorAll(".ambiente_scheda")
                ambientiMobile.forEach((scheda) => {
                    let tl = gsap.timeline({
                        paused: true
                    })
                    tl.from(scheda.querySelectorAll("h3, p"), {
                        duration: 0.8,
                        autoAlpha: 0,
                        y: 40,
                        ease: "power2.out",
                        stagger: 0.1
                    })
                    ScrollTrigger.create({
                        trigger: scheda,
                        start: "top 80%",
                        animation: tl
                    })
                })
            }

            if (windowWidth >= 768) {
                ambienti.forEach((slide, index) => {
                    let tl = createTimeline(slide)
                    slide.timeline = tl

                    if (index === 1) {
                        ScrollTrigger.create({
                            trigger: "#home_ambienti",
                            start: "bottom bottom",
                            end: "+=20%",
                            pin: isDesktop ? true : false,
                            pinSpacing: isDesktop ? true : false,
                            //markers: true,
                            onEnter: () => {
                                if (!timelinesExecuted[index]) {
                                    tl.play()
                                    timelinesExecuted[index] = true
                                }
                            }
                        })
                    } else {
                        timelinesExecuted[index] = false
                    }
                })
            }

            swiperAmbienti.on("transitionEnd", () => {
                const atStartOrEnd =
                    swiperAmbienti.realIndex === 0 ||
                    swiperAmbienti.realIndex ===
                        swiperAmbienti.slides.length - 1

                if (atStartOrEnd) {
                    gsap.to(tracker.children, {
                        duration: 0.2,
                        autoAlpha: 0
                    })
                    if (swiperAmbienti.realIndex === 0) {
                        document
                            .querySelector(".ambienti_prev")
                            .setAttribute("data-active", "false")
                    }
                    if (
                        swiperAmbienti.realIndex ===
                        swiperAmbienti.slides.length - 1
                    ) {
                        document
                            .querySelector(".ambienti_next")
                            .setAttribute("data-active", "false")
                    }
                } else {
                    gsap.to([".ambienti_prev, .ambienti_next"], {
                        duration: 0.2,
                        autoAlpha: 1
                    })
                    document
                        .querySelector(".ambienti_prev")
                        .setAttribute("data-active", "true")
                    document
                        .querySelector(".ambienti_next")
                        .setAttribute("data-active", "true")
                    document.querySelector(
                        ".ambienti_cursor > div"
                    ).textContent = ambienteNextTitle
                }

                if (!timelinesExecuted[swiperAmbienti.realIndex]) {
                    ambienti[swiperAmbienti.realIndex].timeline.play()
                    timelinesExecuted[swiperAmbienti.realIndex] = true
                }
            })
        }
    )

    /**
     * AUDIO PLAYER
     */
    const leparole = document.getElementById("leparole")

    if (leparole) {
        const leparoleItems = leparole.querySelectorAll(".audio_button")
        const audioButtonFirst = leparole.querySelector(".audio_button_first")
        const textScrollerInner = document.querySelector(".text_scroller_inner")
        const audioPlayer = new Plyr("#audio_player", {
            controls: ["play", "progress", "current-time", "mute", "volume"]
        })
        let parolePlay = false

        const tlScrollText = gsap.timeline({
            paused: true
        })

        const tlParoleInit = initParoleTimeline()
        const swiperParole = initSwiperParole()

        function initParoleTimeline() {
            const tlParole = gsap.timeline({
                paused: true,
                defaults: {
                    ease: "power2.inOut"
                },
                onComplete: () => {
                    leparoleItems[0].parentElement.classList.add("hidden")
                }
            })

            if (leparoleItems.length > 1) {
                tlParole.from(
                    ".leparole1_bg",
                    {
                        duration: 1,
                        scaleX: 0,
                        transformOrigin: "right"
                    },
                    0
                )
                tlParole.from(
                    document.querySelector(".argomento_img_placeholder"),
                    {
                        duration: 0.5,
                        x: 150,
                        autoAlpha: 0
                    },
                    "<40%"
                )
                tlParole.to(
                    ".leparole2_bg",
                    {
                        duration: 1,
                        scaleX: 0,
                        transformOrigin: "left"
                    },
                    0
                )
                tlParole.to(
                    ".leparole2_bg_pattern",
                    {
                        duration: 0.2,
                        autoAlpha: 0
                    },
                    0
                )
                tlParole.to(
                    leparoleItems[0],
                    {
                        duration: 0.5,
                        autoAlpha: 0,
                        x: -150
                    },
                    0
                )
                tlParole.from(".player_holder", {
                    duration: 0.5,
                    autoAlpha: 0,
                    yPercent: 100
                })
                tlParole.to(
                    ".swiper_parole .audio_button > p",
                    {
                        duration: 1,
                        color: "#896345",
                        stagger: 0.1
                    },
                    0
                )
            }

            if (leparoleItems.length === 1) {
                tlParole.from("#leparole_overlay", { autoAlpha: 0 })
                tlParole.from(".player_holder", {
                    duration: 0.5,
                    autoAlpha: 0,
                    yPercent: 100
                })
                tlParole.from(
                    document.querySelector(".argomento_img_placeholder"),
                    {
                        duration: 0.5,
                        x: 150,
                        autoAlpha: 0
                    },
                    "<40%"
                )
                tlParole.eventCallback("onStart", () => {
                    //smoother.paused(!smoother.paused())
                    document
                        .getElementById("leparole_overlay")
                        .classList.remove("invisible")
                })
                tlParole.eventCallback("onComplete", null)
                tlParole.eventCallback("onReverseComplete", () => {
                    audioPlayer.currentSrc = ""
                    tlScrollText.progress(0)
                    parolePlay = false
                    //smoother.paused(!smoother.paused())
                })
                document
                    .getElementById("close_leparole_overlay")
                    .addEventListener("click", () => {
                        tlParole.reverse()
                        audioPlayer.pause()
                    })
            }

            return tlParole
        }

        function initSwiperParole() {
            return new Swiper(".swiper_parole", {
                speed: 600,
                slidesPerGroup: 4,
                slidesPerView: 4,
                spaceBetween: 40,
                breakpoints: {
                    320: {
                        slidesPerGroup: 2,
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerGroup: 3,
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerGroup: 2,
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    1280: {
                        slidesPerGroup: 3,
                        slidesPerView: 3,
                        spaceBetween: 20
                    },
                    1536: {
                        slidesPerGroup: 4,
                        slidesPerView: 4,
                        spaceBetween: 40
                    }
                },
                pagination: {
                    el: ".leparole_pagination",
                    type: "bullets",
                    bulletClass: "size-1.5 bg-stark-white-200 rounded-full",
                    bulletActiveClass: "bg-stark-white-700",
                    renderBullet: function (index, className) {
                        return '<span class="' + className + '"></span>'
                    }
                },

                navigation: {
                    nextEl: ".parole_next",
                    prevEl: ".parole_prev"
                }
            })
        }

        setupAudioPlayerEvents(audioPlayer)

        function setupAudioPlayerEvents(player) {
            player.on("loadeddata", () => {
                //console.log('Evento loadeddata attivato'); // Debug
                const audioDuration = player.duration
                const textScrollerHeight =
                    document.querySelector(".text_scroller").offsetHeight
                tlScrollText.clear()
                tlScrollText.set(textScrollerInner, {
                    //autoAlpha: 0,
                    y: textScrollerHeight
                })
                tlScrollText.set(textScrollerInner, {
                    autoAlpha: 1
                })
                tlScrollText.to(textScrollerInner, {
                    duration: audioDuration,
                    y: "-100%",
                    ease: "linear"
                })
            })

            player.on("play", () => {
                tlScrollText.resume()
                tlScrollText.set(textScrollerInner, {
                    autoAlpha: 1
                })
            })
            player.on("pause", () => tlScrollText.pause())
            player.on("ended", () => {
                console.log("Audio finito")
                tlScrollText.set(textScrollerInner, {
                    //autoAlpha: 0,
                    y: document.querySelector(".text_scroller").offsetHeight
                })
                player.currentTime = 0
            })
            player.on("timeupdate", () => {
                const progress = player.currentTime / player.duration
                tlScrollText.progress(progress)
            })
        }

        let audioSrc, audioText, audioButtonImg
        function handleAudioButtonClick(item, player) {
            audioSrc = item.getAttribute("data-parole-audio")
            audioText = item.getAttribute("data-parole-txt")
            audioButtonImg = item.querySelector("img")

            if (leparoleItems.length > 1 && !parolePlay) {
                tlParoleInit.play()
                swiperParole.appendSlide(
                    document.querySelector(".audio_button_first")
                )
                swiperParole.update()
                document.querySelector(".delete_after_appending").remove()
                document.querySelector(
                    ".swiper_parole .audio_button:last-child > p"
                ).style.color = "#896345"
                parolePlay = true
            } else if (leparoleItems.length === 1 && !parolePlay) {
                tlParoleInit.play()
                parolePlay = true
            }
            updatePlayerSource(
                player,
                audioSrc,
                audioButtonImg.outerHTML,
                audioText
            )
        }

        function updatePlayerSource(player, src, imgHTML, text) {
            if (player.currentSrc !== src) {
                player.source = {
                    type: "audio",
                    sources: [
                        {
                            src,
                            type: "audio/mp3"
                        }
                    ]
                }
                document.querySelector(".argomento_img_placeholder").innerHTML =
                    imgHTML
                textScrollerInner.innerHTML = text
            }
            player.currentSrc = src
            player.play()
        }

        leparoleItems.forEach((item) => {
            item.addEventListener("click", () =>
                handleAudioButtonClick(item, audioPlayer)
            )
        })
    }

    /**
     *  FUNZIONI PER LA GESTIONE DEL CURSORE
     */
    const tracker = document.getElementById("tracker")

    gsap.set(tracker.children, {
        scale: 0,
        autoAlpha: 0
    })

    window.addEventListener("mousemove", (e) => {
        tracker.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })

    const areeSensibili = document.querySelectorAll("[data-active-area]")
    //console.log(areeSensibili)
    areeSensibili.forEach((area) => {
        area.addEventListener("mouseenter", () => {
            if (area.dataset.active == "true") {
                //console.log(area.dataset.cursor)
                gsap.to("." + area.dataset.cursor, {
                    duration: 0.3,
                    scale: 1,
                    autoAlpha: 1
                })
                if (area.dataset.title != "") {
                    document.querySelector(
                        "." + area.dataset.cursor + " > div"
                    ).textContent = area.dataset.title
                }
                if (area.dataset.cursor == "play_cursor_small") {
                    gsap.to("[data-playsmall-inner]", {
                        duration: 0.2,
                        autoAlpha: 1,
                        ease: "power2.out"
                    })
                }
            }
        })
        area.addEventListener("mouseleave", () => {
            if (area.dataset.active == "true") {
                gsap.to(tracker.children, {
                    duration: 0.3,
                    scale: 0,
                    autoAlpha: 0
                })
            }
            if (area.dataset.cursor == "play_cursor_small") {
                gsap.to("[data-playsmall-inner]", {
                    duration: 0.2,
                    autoAlpha: 0,
                    ease: "power2.out"
                })
            }
        })
    })

    if (document.querySelector(".swiper_album_1")) {
        console.log("Mouse enter")
        document
            .querySelectorAll(".album_next, .album_prev")
            .forEach((item) => {
                item.addEventListener("mouseenter", () => {
                    document
                        .querySelector("[cursor-next-placeholder]")
                        .classList.add("opacity-0")
                })
            })
    }

    const pageTop = document.getElementById("page_top")

    if (pageTop) {
        const tlPageTop = gsap.timeline({
            defaults: {
                ease: "none"
            }
        })
        tlPageTop
            .to(".page_top_title", {
                yPercent: -300
            })
            .to(".page_top_img", { scale: 0.8 }, 0)
            .to(".page_top_img > img", { scale: 1 }, 0)

        ScrollTrigger.create({
            trigger: pageTop,
            start: "1% top",
            pin: true,
            end: "bottom 45%",
            scrub: 0.5,
            animation: tlPageTop
            // markers: true
        })
    }

    /** ALBUMS IN PAGINA */
    if (document.querySelector(".active .swiper_album_1")) {
        function initAlbum() {
            albums = new Swiper(
                ".active .swiper_album_1, .active .swiper_album_2",
                {
                    speed: 1400,
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 0,
                    direction: "horizontal",
                    centeredSlides: true,
                    navigation: {
                        nextEl: ".album_next",
                        prevEl: ".album_prev"
                    },
                    pagination: {
                        el: ".active .swiper-pagination",
                        type: "progressbar",
                        progressbarFillClass:
                            "swiper-pagination-progressbar-fill !bg-disco-900"
                    },
                    effect: "creative",
                    creativeEffect: {
                        prev: {
                            translate: ["-20%", 0, -1]
                        },
                        next: {
                            translate: ["100%", 0, 0]
                        }
                    },
                    breakpoints: {
                        320: {
                            speed: 500
                        },
                        1280: {
                            speed: 1400
                        }
                    }
                }
            )
            if (document.querySelector(".album_title")) {
                setAlbumTitle()
            }
        }

        initAlbum()

        const firstAlbum = document.querySelector(
            ".active .swiper_album_1"
        ).swiper

        firstAlbum.on("sliderFirstMove", () => {
            if (!firstSwipe) {
                document
                    .querySelector(".swipe_hint")
                    .parentElement.classList.add("opacity-0")
                tlSwipeHint.pause()
                firstSwipe = true
                console.log(firstSwipe)
            }
        })

        function setAlbumTitle() {
            document.querySelector(".album_title").textContent =
                document.querySelector(".active .swiper_album_1").dataset.title
        }

        const albumSelectors = document.querySelectorAll(".album_selector")
        albumSelectors.forEach((selector) => {
            selector.addEventListener("click", albumSwitch)
        })

        function albumSwitch() {
            const tl_albumSwitch = gsap.timeline({
                onComplete: () => {
                    albums.forEach((album) => {
                        album.destroy()
                    })
                    document
                        .querySelectorAll(".album_container")
                        .forEach((album) => {
                            album.classList.remove("active")
                        })
                    document
                        .querySelector(
                            ".album_container:nth-child(" +
                                (parseInt(this.dataset.index) + 1) +
                                ")"
                        )
                        .classList.add("active")
                    initAlbum()
                    document.querySelector(".album_title").textContent =
                        this.dataset.title

                    gsap.to(
                        ".active .swiper_album_1, .active .swiper_album_2, .album_title",
                        {
                            duration: 0.3,
                            autoAlpha: 1,
                            stagger: 0.1
                        }
                    )
                }
            })
            tl_albumSwitch.to(
                ".active .swiper_album_1, .active .swiper_album_2, .album_title",
                {
                    duration: 0.3,
                    autoAlpha: 0,
                    stagger: {
                        each: 0.1,
                        from: "center"
                    }
                }
            )
        }
    }

    if (document.querySelector("[page-stop1]")) {
        mm.add("(min-width: 1024px)", () => {
            ScrollTrigger.create({
                trigger: "[page-stop1]",
                start: "50% 50%",
                endTrigger: "[page-stop2]",
                end: "bottom bottom",
                pin: true,
                id: "page-stop1"
                //markers: true
            })
            ScrollTrigger.create({
                trigger: "[page-stop2]",
                start: "bottom bottom",
                endTrigger: "[page-scroll1]",
                end: "bottom bottom",
                pin: true,
                id: "page-stop2"
                //markers: true
            })
        })
    }
    if (document.querySelector("[page-stop3]")) {
        mm.add("(min-width: 1024px)", () => {
            ScrollTrigger.create({
                trigger: "[page-stop3]",
                start: "top top",
                endTrigger: "[page-scroll2]",
                end: "bottom bottom",
                pin: true,
                pinSpacing: false,
                id: "page-stop3"
                // markers: true
            })
        })
    }
    if (document.querySelector("[stop-scroll-triple]")) {
        let slideElements = document.querySelector(
            "[stop-scroll-triple]"
        ).children

        const tlScrollTriple = gsap.timeline()

        mm.add("(max-width: 1024px)", () => {
            tlScrollTriple.to("[stop-scroll-triple]", {
                xPercent: -(slideElements.length - 1) * 100
            })
            ScrollTrigger.create({
                trigger: "[stop-scroll-triple]",
                start: "50% 50%",
                end: "+=" + (slideElements.length - 1) * 100 + "%",
                animation: tlScrollTriple,
                pin: true,
                scrub: true,
                id: "stop-scroll-triple"
                //markers: true
            })
        })
    }
    if (document.querySelector("[stop-breve]")) {
        mm.add("(min-width: 1024px)", () => {
            ScrollTrigger.create({
                trigger: "[stop-breve]",
                start: "top top",
                end: "+=20%",
                pin: true,
                id: "stop-breve"
                //markers: true
            })
        })
    }
    if (document.querySelector("[regala-blocca-faq]")) {
        mm.add("(min-width: 1024px)", () => {
            ScrollTrigger.create({
                trigger: "[regala-blocca-faq]",
                start: "top 15%",
                endTrigger: "[regala-sblocca-faq]",
                end: "bottom bottom",
                pin: true,
                id: "regala-blocca-faq"
                //markers: true
            })
        })
    }

    if (document.querySelector(".cta_foto")) {
        const tlCtaFoto = gsap.timeline()
        tlCtaFoto.from(".cta_foto", {
            duration: 1,
            clipPath: "inset(0% 50% 0% 50%)",
            willChange: "clip-path",
            ease: "power2.inOut"
        })
        ScrollTrigger.create({
            trigger: ".cta_foto",
            start: "top 75%",
            animation: tlCtaFoto
            //markers: true
        })
    }

    const showFromTop = document.querySelectorAll(".show_from_top")

    showFromTop.forEach((item) => {
        const tlShowFromTop = gsap.timeline()
        tlShowFromTop.to(item, {
            duration: 1.2,
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.inOut"
        })
        ScrollTrigger.create({
            trigger: item,
            start: "top 90%",
            animation: tlShowFromTop
            //markers: true
        })
    })

    /** SWIPE HINT */

    const swipeHint = document.querySelector(".swipe_hint")
    if (swipeHint) {
        tlSwipeHint = gsap.timeline({
            repeat: -1,
            repeatDelay: 1,
            paused: true
        })

        tlSwipeHint.from(swipeHint, {
            autoAlpha: 0
        })
        tlSwipeHint.to(
            swipeHint,
            {
                duration: 0.8,
                width: 120,
                left: 0,
                ease: "power2.inOut"
            },
            "<50%"
        )
        tlSwipeHint.to(
            swipeHint,
            {
                duration: 0.3,
                autoAlpha: 0
            },
            "<95%"
        )

        if (document.querySelector("[stop-breve]")) {
            mm.add("(max-width: 1024px)", () => {
                ScrollTrigger.create({
                    trigger: ".swiper_album_1",
                    start: "top 80%",
                    animation: tlSwipeHint
                    //markers: true
                })
            })
        }
    }

    // document.querySelectorAll(".wpforms-datepicker").forEach((timepicker) => {
    //     // timepicker on focus smoother.paused(!smoother.paused()) on blur smoother.paused(!smoother.paused())
    //     timepicker.addEventListener("focus", () => {
    //         smoother.paused(!smoother.paused())
    //     })
    //     timepicker.addEventListener("blur", () => {
    //         smoother.paused(!smoother.paused())
    //     })
    // })

    jQuery(".wpforms-datepicker-wrap").each(function () {
        var calendar = this._flatpickr

        if ("object" === typeof calendar) {
            calendar.set("locale", "it")
        }
    })

    let loading_content
    if (lang == "en") {
        loading_content = "Loading..."
    } else {
        loading_content = "Caricamento..."
    }

    jQuery(".riserva_tavolo").modaal({
        content_source: "#riserva_tavolo_panel",
        fullscreen: true,
        hide_close: true,
        custom_class: "riserva_panel_fullscreen",
        before_open: function () {
            smoother.paused(!smoother.paused())
        },
        after_close: function () {
            smoother.paused(false)
        }
    })
    document
        .querySelector(".close_riserva_panel")
        .addEventListener("click", () => {
            jQuery(".riserva_tavolo").modaal("close")
            //smoother.paused(!smoother.paused())
        })

    if (document.getElementById("dialog")) {
        setTimeout(() => {
            jQuery("#dialog").modaal({
                content_source: "#dialog",
                start_open: true,
                hide_close: true,
                custom_class: "dialog_panel_fullscreen",
                width: 420,
                overlay_opacity: 0.5,
                before_open: function () {
                    smoother.paused(!smoother.paused())
                },
                after_open: function () {
                    document
                        .querySelector(".dialog_close")
                        .addEventListener("click", () => {
                            jQuery("#dialog").modaal("close")
                            //smoother.paused(!smoother.paused())
                        })
                },
                after_close: function () {
                    smoother.paused(!smoother.paused())
                }
            })
        }, 6000)
    }

    setTimeout(() => {
        jQuery(".cmplz-link").modaal({
            type: "ajax",
            hide_close: true,
            custom_class: "service_page",
            loading_content: loading_content,
            content_source: jQuery(this).attr("href"),
            before_open: function () {
                smoother.paused(!smoother.paused())
            },
            after_open: function () {
                document
                    .querySelector(".service_close")
                    .addEventListener("click", () => {
                        jQuery(".cmplz-link").modaal("close")
                        //smoother.paused(!smoother.paused())
                    })
            },
            after_close: function () {
                smoother.paused(!smoother.paused())
            }
        })
    }, 1500)
})

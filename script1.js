let api = 'http://api.napster.com/v2.1/tracks/top?apikey=Nzg3NmJlYzgtNTY3Ny00YWM0LTg2MTItNWY5ZmJlNDlhOTM5';
//fetch function call
fetchTopTracks()
// let cnt = 0;
const wrapper = document.querySelector(".wrapper"),

musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = document.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),

progressArea = wrapper.querySelector(".progress-area"),

progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

const trackContainer = document.getElementById("track-container");
const playListContainer = document.getElementById("play-list")

async function fetchTopTracks() {
    try {
        let cnt = 0;
        let response = await fetch(api)
        response = await response.json()
        cnt = response.tracks.length;           
        let track = response.tracks;

        // console.log(response);
        // console.log(track);
        let   plyLst = track.map(function (i) { return i});
        // console.log(plyLst);
        cnt = plyLst.length
        //    console.log(cnt);
        for(let i=0;i<cnt;i++){
            // console.log(plyLst[i])
        }

        // to display playlist
        response.tracks.forEach((track) => {            
            const trackBox = document.createElement("div");//create div
            trackBox.innerHTML = track.name;//fill with track song
            trackBox.addEventListener('click', ()=>{
                addToPlayList(track)
                setPlaylist()
            })

            trackContainer.appendChild(trackBox);//put it in track container
        });
               
        let musicIndex = Math.floor((Math.random() * cnt) + 1);
        // console.log(musicIndex)
        // musicIndex = 1;        
        isMusicPaused = true;
        loadMusic(plyLst, musicIndex);
        
        //load track function
        function loadMusic(plyLst, musicIndex){
            musicName.innerText = plyLst[musicIndex-1].name;
            console.log(plyLst[musicIndex-1].name);
            musicArtist.innerText = plyLst[musicIndex-1].artistName;    
            mainAudio.src = plyLst[musicIndex-1].previewURL;
            console.log(plyLst[musicIndex-1].previewURL);
            musicImg.src = 'https://openai.com/content/images/2020/04/2x-no-mark-1.jpg'
        }     

        //play music function
        function playMusic(){
            musicImg.src = 'https://i.pinimg.com/originals/88/4a/40/884a408310b28171aa1018f77dee2602.gif'
            wrapper.classList.add("paused");
            playPauseBtn.querySelector("i").innerText = "pause";
            mainAudio.play();
        }
        //pause music function
        function pauseMusic(){
            wrapper.classList.remove("paused");
            musicImg.src = 'https://openai.com/content/images/2020/04/2x-no-mark-1.jpg'
            playPauseBtn.querySelector("i").innerText = "play_arrow";
            mainAudio.pause();
        }
        //prev music function
        function prevMusic(){
            musicIndex--; //decrement of musicIndex by 1
            //if musicIndex is less than 1 then musicIndex will be the array length so the last music play
            musicIndex < 1 ? musicIndex = cnt : musicIndex = musicIndex;
            loadMusic(plyLst, musicIndex);
            playMusic();
            playingSong(); 
        }
        //next music function
        function nextMusic(){
            musicIndex++; //increment of musicIndex by 1
            //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
            musicIndex > cnt ? musicIndex = 1 : musicIndex = musicIndex;
            loadMusic(plyLst, musicIndex);
            playMusic();
            playingSong(); 
        }
        // play || pause button event
        playPauseBtn.addEventListener("click", ()=>{                    
            const isMusicPlay = wrapper.classList.contains("paused");
            musicImg.src = 'https://i.pinimg.com/originals/88/4a/40/884a408310b28171aa1018f77dee2602.gif'
            //checking isPlayMusic is true then call pauseMusic else call playMusic
            isMusicPlay ? pauseMusic() : playMusic();                
            playingSong();
        });
        //event button for prev music
        prevBtn.addEventListener("click", ()=>{
            prevMusic();
        });
        //next music button event
        nextBtn.addEventListener("click", ()=>{
            nextMusic();
        });
        //to update progress bar width according to music current time
        mainAudio.addEventListener("timeupdate", (e)=>{
            const currentTime = e.target.currentTime; //getting playing song currentTime
            const duration = e.target.duration; //getting playing song total duration
            let progressWidth = (currentTime / duration) * 100;
            progressBar.style.width = `${progressWidth}%`;
            let musicCurrentTime = wrapper.querySelector(".current-time"),
            musicDuartion = wrapper.querySelector(".max-duration");
            mainAudio.addEventListener("loadeddata", ()=>{
            // update song total duration
            let mainAdDuration = mainAudio.duration;
            // console.log(plyLst[i]);
            // let mainAdDuration = plyLst[i].playbackSeconds;
            let totalMin = Math.floor(mainAdDuration / 60);
            let totalSec = Math.floor(mainAdDuration % 60);
            if(totalSec < 10){ //if sec is less than 10 then add 0 before it
            totalSec = `0${totalSec}`;
            }
            musicDuartion.innerText = `${totalMin}:${totalSec}`;
            });
            // update playing song current time
            let currentMin = Math.floor(currentTime / 60);
            let currentSec = Math.floor(currentTime % 60);
            if(currentSec < 10){ //if sec is less than 10 then add 0 before it
            currentSec = `0${currentSec}`;
            }
            musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
        });
        // update playing song currentTime on according to the progress bar width
        progressArea.addEventListener("click", (e)=>{
            let progressWidth = progressArea.clientWidth; //getting width of progress bar
            let clickedOffsetX = e.offsetX; //getting offset x value
            let songDuration = mainAudio.duration; //getting song total duration
            mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
            playMusic(); //calling playMusic function
            playingSong();
        });
        //change loop, shuffle, repeat icon onclick
            const repeatBtn = wrapper.querySelector("#repeat-plist");
        repeatBtn.addEventListener("click", ()=>{
            let getText = repeatBtn.innerText; //getting this tag innerText
            switch(getText){
                case "repeat":                        
                    repeatBtn.innerText = "repeat_one";
                    repeatBtn.setAttribute("title", "Song looped");
                break;                    
                case "repeat_one":
                    repeatBtn.innerText = "shuffle";
                    repeatBtn.setAttribute("title", "Playback shuffled");
                break;
                case "shuffle":
                    repeatBtn.innerText = "repeat";
                    repeatBtn.setAttribute("title", "Playlist looped");
                break;
            }
        });
        //code for what to do after song ended
        mainAudio.addEventListener("ended", ()=>{
            // we'll do according to the icon means if user has set icon to
            // loop song then we'll repeat the current song and will do accordingly
            let getText = repeatBtn.innerText; //getting this tag innerText
            switch(getText){
                case "repeat":
                    nextMusic(); //calling nextMusic function
                break;
                case "repeat_one":
                    mainAudio.currentTime = 0; //setting audio current time to 0
                // loadMusic(musicIndex); 
                    loadMusic(plyLst, musicIndex);//calling loadMusic function with arguments
                    playMusic(); //calling playMusic function
                break;
                case "shuffle":
                    let randIndex = Math.floor((Math.random() * cnt) + 1); //genereting random index/numb with max range of array length
                    do{
                        randIndex = Math.floor((Math.random() * cnt) + 1);
                    }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
                    musicIndex = randIndex; //passing randomIndex to musicIndex
                    loadMusic(plyLst, musicIndex);
                    playMusic();
                    playingSong();
                break;
            }
        });
        //show music list onclick of music icon
        moreMusicBtn.addEventListener("click", ()=>{
            musicList.classList.toggle("show");
        });
        closemoreMusic.addEventListener("click", ()=>{
            moreMusicBtn.click();
        });

        const ulTag = wrapper.querySelector("ul");
        // to create li tags according to array length for list
        for (let i = 0; i < cnt; i++) {                
            let liTag = `<li li-index="${i + 1}">
            <div class="row">
            <span>${plyLst[i].name}</span>
            <p>${plyLst[i].artistName}</p>
            </div>
            <span id="${plyLst[i].previewURL}" class="audio-duration"></span>
            <audio class="${plyLst[i].previewURL}" src="${plyLst[i].previewURL}"></audio>
            </li>`;   
            ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
            let liAudioDuartionTag = ulTag.querySelector('plyLst[i].previewURL');
            let liAudioTag = ulTag.querySelector('plyLst[i].previewURL');
            liAudioTag.addEventListener("loadeddata", ()=>{
                let duration = liAudioTag.duration;
                let totalMin = Math.floor(duration / 60);
                let totalSec = Math.floor(duration % 60);
                if(totalSec < 10){ //if sec is less than 10 then add 0 before it                
                    totalSec = '0'+totalSec;
                };
                if(totalMin < 10){ //if min is less than 10 then add 0 before it                
                    totalMin = '0'+totalMin;
                };
                liAudioDuartionTag.innerText = "totalMin:totalSec"; //passing total duation of song    
                liAudioDuartionTag.setAttribute("t-duration", `totalMin:totalSec`); //adding t-duration attribute with total duration value
            });
        }
        //play particular song from the list onclick of li tag
        function playingSong(){
            const allLiTag = ulTag.querySelectorAll("li");                     
            for (let j = 0; j < allLiTag.length; j++) {
                let audioTag = allLiTag[j].querySelector(".audio-duration");
                if(allLiTag[j].classList.contains("playing")){
                    allLiTag[j].classList.remove("playing");
                    let adDuration = audioTag.getAttribute("t-duration");
                    audioTag.innerText = adDuration;
                }
                //if the li tag index is equal to the musicIndex then add playing class in it
                if(allLiTag[j].getAttribute("li-index") == musicIndex){
                    allLiTag[j].classList.add("playing");
                    audioTag.innerText = "Playing";
                }
                allLiTag[j].setAttribute("onclick", "clicked(this)");
            }
        }
        // clicked() to be updated
        //particular li clicked function
        function clicked(element){
            let getLiIndex = element.getAttribute("li-index");
            console.log(getLiIndex);
            musicIndex = getLiIndex; //updating current song index with clicked li index
            loadMusic(plyLst, musicIndex);
            playMusic();
            playingSong();
        }    
                               
        } catch (error) {
            console.log(error);
    }
}

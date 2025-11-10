// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show Alert

// Song Duration Loader
const durationNodes = document.querySelectorAll(".song-duration[data-audio]");
if (durationNodes.length > 0) {
  durationNodes.forEach((node) => {
    const audioSrc = node.getAttribute("data-audio");
    if (!audioSrc) return;
    const audioEl = new Audio();
    audioEl.preload = "metadata";
    audioEl.src = audioSrc;

    const formatTime = (seconds) => {
      if (!isFinite(seconds)) return "--:--";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    audioEl.addEventListener("loadedmetadata", () => {
      node.textContent = formatTime(audioEl.duration);
    });

    audioEl.addEventListener("error", () => {
      node.textContent = "--:--";
    });
  });
}
// End Song Duration Loader

// APlayer
const aplayer = document.querySelector("#aplayer");
if (aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);
  let dataSinger = aplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);

  const ap = new APlayer({
    container: aplayer,
    lrcType: 1,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrc: dataSong.lyrics
      },
    ],
    autoplay: true,
    volumn: 0.8,
  });

  const avatar = document.querySelector(".music-detail .inner-avatar");

  ap.on("play", function () {
    avatar.style.animationPlayState = "running";
  });

  ap.on("pause", function () {
    avatar.style.animationPlayState = "paused";
  });

  ap.on("ended", function () {
    const link = `/songs/listen/${dataSong._id}`;

    const option = {
      method: "PATCH",
    };

    fetch(link, option)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          const elementListenSpan = document.querySelector(".music-detail .inner-listen span");
          elementListenSpan.innerHTML = `${data.listen} lượt nghe`;
        }
      });
  });
}
// End APlayer

// Button Like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  buttonLike.addEventListener("click", () => {
    const idSong = buttonLike.getAttribute("button-like");
    const isActive = buttonLike.classList.contains("active");

    const typeLike = isActive ? "dislike" : "like";

    const link = `/songs/like/${typeLike}/${idSong}`;

    const option = {
      method: "PATCH",
    };

    fetch(link, option)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          const span = buttonLike.querySelector("span");
          span.innerHTML = `${data.like} like`;
          buttonLike.classList.toggle("active");
        }
      });
  });
}
// End Button Like

// Button Favorite
const listButtonFavorite = document.querySelectorAll("[button-favorite]");
if (listButtonFavorite.length > 0) {
  listButtonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const isActive = buttonFavorite.classList.contains("active");

      const typeFavorite = isActive ? "unfavorite" : "favorite";

      const link = `/songs/favorite/${typeFavorite}/${idSong}`;

      const option = {
        method: "PATCH",
      };

      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            buttonFavorite.classList.toggle("active");
          }
        });
    });
  });
}
// End Button Favorite

// Search Suggest
const boxSearch = document.querySelector(".box-search");
if(boxSearch) {
  const input = boxSearch.querySelector("input[name='keyword']");
  const boxSuggest = boxSearch.querySelector(".inner-suggest");

  input.addEventListener("keyup", () => {
    const keyword = input.value;

    const link = `/search/suggest?keyword=${keyword}`;

    fetch(link)
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          const songs = data.songs;

          if(songs.length > 0) {
            boxSuggest.classList.add("show");

            const htmls = songs.map(song => {
              return `
                <a href="songs/detail/${song.slug}" class="inner-item">
                  <div class="inner-image">
                    <img src="${song.avatar}" alt="${song.title}" />
                  </div>
                  <div class="inner-info">
                    <div class="inner-title">${song.title}</div>
                    <div class="inner-singer"><i class="fa-solid fa-microphone-lines"></i> ${song.infoSinger.fullName}</div>
                  </div>
                </a>
              `;
            });

            const boxList = boxSuggest.querySelector(".inner-list");
            boxList.innerHTML = htmls.join("");

          } else {
            boxSuggest.classList.remove("show");
          }
        }
      });
  });
}
// End Search Suggest

// Audio Player
window.addEventListener('load', () => {
  const dataContainer = document.getElementById('songs-data');
  if (dataContainer) {
    try {
      window.topSongsForPlayer = JSON.parse(dataContainer.getAttribute('data-songs'));
      if (!Array.isArray(window.topSongsForPlayer)) {
        window.topSongsForPlayer = window.topSongsForPlayer ? [window.topSongsForPlayer] : [];
      }
    } catch(e) {
      console.error('Error parse JSON songs:', e);
      window.topSongsForPlayer = [];
    }
    try {
      window.globalSingers = JSON.parse(dataContainer.getAttribute('data-singers')) || [];
      if (!Array.isArray(window.globalSingers)) {
        window.globalSingers = window.globalSingers ? [window.globalSingers] : [];
      }
    } catch(e) {
      console.error('Error parse JSON singers:', e);
      window.globalSingers = [];
    }
  } else {
    window.topSongsForPlayer = window.topSongsForPlayer || [];
    window.globalSingers = window.globalSingers || [];
  }

  // Helper function to update compact UI (global trong scope này)
  const updateCompactUI = (index) => {
    if (!window.apGlobal) return;
    try {
      const list = window.apGlobal.list.audios;
      const current = (typeof index === 'number') ? list[index] : list[window.apGlobal.list.index];
      if (!current) return;
      const $wrap = document.querySelector('.aplayer-custom');
      if (!$wrap) return;
      const titleNode = $wrap.querySelector('.ap-title');
      const artistNode = $wrap.querySelector('.ap-artist');
      const coverNode = $wrap.querySelector('.ap-cover');
      if (titleNode) titleNode.textContent = current.name || '';
      if (artistNode) artistNode.textContent = current.artist || '';
      if (coverNode) coverNode.setAttribute('src', current.cover || '/images/logo.png');
      const btnNode = $wrap.querySelector('.aplayer-play-pause i');
      if (btnNode) {
        if (window.apGlobal.audio && window.apGlobal.audio.paused) {
          btnNode.classList.remove('fa-pause');
          btnNode.classList.add('fa-play');
        } else {
          btnNode.classList.remove('fa-play');
          btnNode.classList.add('fa-pause');
        }
      }
    } catch(e) { console.error(e); }
  };

  // Helper function để cập nhật UI của play_btn (global trong scope này)
  const updatePlayBtnUI = (isPlaying) => {
    const playBtn = document.querySelector('.play_btn');
    if (!playBtn) return;
    
    const playAllSpan = playBtn.querySelector('.play_all');
    const pauseAllSpan = playBtn.querySelector('.pause_all');
    
    if (isPlaying) {
      // Đang phát -> hiện pause, ẩn play
      if (playAllSpan) playAllSpan.style.display = 'none';
      if (pauseAllSpan) pauseAllSpan.style.display = '';
    } else {
      // Đang dừng -> hiện play, ẩn pause
      if (playAllSpan) playAllSpan.style.display = '';
      if (pauseAllSpan) pauseAllSpan.style.display = 'none';
    }
  };

  // Khởi tạo APlayer global nếu có container và danh sách bài hát
  const apContainer = document.getElementById('aplayer-global');
  if (apContainer && window.topSongsForPlayer && window.topSongsForPlayer.length > 0) {
    // Tạo map singerId => tên ca sĩ từ globalSingers
    const singerNameById = {};
    try {
      window.globalSingers.forEach(s => {
        if (s && s._id) singerNameById[String(s._id)] = s.fullName || '';
      });
    } catch(_e) {}

    const apAudioList = window.topSongsForPlayer.map(song => {
      const artistName = singerNameById[String(song.singerId)] || (song.infoSinger && song.infoSinger.fullName) || '';
      return {
        name: song.title,
        artist: artistName,
        url: song.audio,
        cover: song.avatar
      };
    });

    window.apGlobal = new APlayer({
      container: apContainer,
      lrcType: 0,
      audio: apAudioList,
      autoplay: false,
      volume: 0.8,
      listFolded: true
    });

    // Helper: event delegation
    const on = (event, selector, handler) => {
      document.addEventListener(event, e => {
        const targetElement = e.target.closest(selector);
        if (targetElement) handler(e, targetElement);
      });
    };

    // Wire prev button
    on('click', '.aplayer-prev', (e, el) => {
      e.preventDefault();
      if (window.apGlobal && typeof window.apGlobal.skipBack === 'function') {
        window.apGlobal.skipBack();
      }
    });
    // Wire next button
    on('click', '.aplayer-next', (e, el) => {
      e.preventDefault();
      if (window.apGlobal && typeof window.apGlobal.skipForward === 'function') {
        window.apGlobal.skipForward();
      }
    });

    // Play/Pause button
    on('click', '.aplayer-play-pause', (e, el) => {
      e.preventDefault();
      if (!window.apGlobal) return;
      try {
        if (window.apGlobal.audio && window.apGlobal.audio.paused) {
          window.apGlobal.play();
        } else {
          window.apGlobal.pause();
        }
      } catch(err) { console.error(err); }
    });

    // Volume control
    on('input', '.aplayer-volume', (e, el) => {
      const v = parseFloat(el.value);
      if (!isNaN(v) && window.apGlobal && typeof window.apGlobal.volume === 'function') {
        window.apGlobal.volume(v);
      }
    });
    on('change', '.aplayer-volume', (e, el) => {
      const v = parseFloat(el.value);
      if (!isNaN(v) && window.apGlobal && typeof window.apGlobal.volume === 'function') {
        window.apGlobal.volume(v);
      }
    });

    // Progress control
    const formatTime = sec => {
      if(!isFinite(sec)) return '00:00';
      const m = Math.floor(sec/60); const s = Math.floor(sec%60);
      return (m<10?'0'+m:m)+':' + (s<10?'0'+s:s);
    };

    on('input', '.aplayer-progress', (e, el) => {
      if(!window.apGlobal || !window.apGlobal.audio) return;
      const percent = parseFloat(el.value) || 0;
      const dur = window.apGlobal.audio.duration || 0;
      const seekTo = dur * (percent/100);
      try { window.apGlobal.seek(seekTo); } catch(err) {}
    });
    on('change', '.aplayer-progress', (e, el) => {
      if(!window.apGlobal || !window.apGlobal.audio) return;
      const percent = parseFloat(el.value) || 0;
      const dur = window.apGlobal.audio.duration || 0;
      const seekTo = dur * (percent/100);
      try { window.apGlobal.seek(seekTo); } catch(err) {}
    });

    // Initial UI
    updateCompactUI(0);

    // Sync on events
    window.apGlobal.on('play', () => updateCompactUI());
    window.apGlobal.on('pause', () => updateCompactUI());
    window.apGlobal.on('listswitch', obj => updateCompactUI(obj.index));
    window.apGlobal.on('loadeddata', () => {
      const dur = window.apGlobal.audio ? window.apGlobal.audio.duration : 0;
      document.querySelectorAll('.ap-time-duration').forEach(node => node.textContent = formatTime(dur));
      document.querySelectorAll('.aplayer-progress').forEach(node => node.value = 0);
      document.querySelectorAll('.ap-time-current').forEach(node => node.textContent = '00:00');
    });
    window.apGlobal.on('timeupdate', () => {
      if(!window.apGlobal || !window.apGlobal.audio) return;
      const cur = window.apGlobal.audio.currentTime || 0;
      const dur = window.apGlobal.audio.duration || 0;
      const percent = dur>0 ? (cur/dur*100) : 0;
      document.querySelectorAll('.aplayer-progress').forEach(node => node.value = percent);
      document.querySelectorAll('.ap-time-current').forEach(node => node.textContent = formatTime(cur));
      document.querySelectorAll('.ap-time-duration').forEach(node => node.textContent = formatTime(dur));
    });

    // Replay toggle and behavior
    window.__apReplay = false;
    on('click', '.aplayer-replay', (e, el) => {
      e.preventDefault();
      window.__apReplay = !window.__apReplay;
      if (window.__apReplay) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    window.apGlobal.on('ended', () => {
      if(window.__apReplay){
        try { window.apGlobal.play(); } catch(e) {}
      }
    });

    // Đồng bộ UI ban đầu cho play_btn
    const isPlaying = window.apGlobal.audio && !window.apGlobal.audio.paused;
    updatePlayBtnUI(isPlaying);
    
    // Lắng nghe sự kiện play/pause để cập nhật UI
    window.apGlobal.on('play', () => updatePlayBtnUI(true));
    window.apGlobal.on('pause', () => updatePlayBtnUI(false));
  }

  // Event listener play từ danh sách top 8
  document.addEventListener('click', (e) => {
    const el = e.target.closest('.play-song-item');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();

    const index = parseInt(el.getAttribute('data-index'));
    if (typeof window.apGlobal !== 'undefined' && window.apGlobal.list && !isNaN(index)) {
      try {
        window.apGlobal.list.switch(index);
        window.apGlobal.play();

        // UI: clear previous active and restore icons
        document.querySelectorAll('.ms_weekly_box').forEach(b => b.classList.remove('ms_active_play'));
        document.querySelectorAll('.ms_weekly_box .ms_play_icon').forEach($ic => {
          $ic.innerHTML = '<img src="/images/svg/play.svg" alt=""/>';
        });

        // Set active for current and swap icon to bars
        const box = el.closest('.ms_weekly_box');
        if (box) {
          box.classList.add('ms_active_play');
          const icon = box.querySelector('.ms_play_icon');
          if (icon) {
            icon.innerHTML = `
              <div class="ms_bars">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
            `;
          }
        }
      } catch(err) {
        console.error(err);
      }
    }
  });

  document.addEventListener('click', (e) => {
    const el = e.target.closest('.play-song-audio');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();

    const index = parseInt(el.getAttribute('data-index'), 10);
    if (typeof window.apGlobal === 'undefined' || !window.apGlobal.list || isNaN(index)) {
      return;
    }

    try {
      window.apGlobal.list.switch(index);
      window.apGlobal.play();
      updateCompactUI(index);

      // Tìm ul cha bằng cách đi lên từ element được click
      let parentUl = null;
      let current = el;
      
      // Đi lên từ element để tìm ul cha (bỏ qua header)
      while (current && current !== document.body) {
        if (current.tagName === 'UL' && !current.classList.contains('album_list_name')) {
          parentUl = current;
          break;
        }
        current = current.parentElement;
      }
      
      // Xóa class khỏi tất cả các ul trong album_list_wrapper (trừ header)
      const albumListWrapper = document.querySelector('.album_list_wrapper');
      if (albumListWrapper) {
        albumListWrapper.querySelectorAll('ul:not(.album_list_name)').forEach(ul => {
          ul.classList.remove('play_active_song');
        });
        
        // Thêm class vào ul cha nếu tìm thấy
        if (parentUl) {
          parentUl.classList.add('play_active_song');
        }
      }
    } catch(err) {
      console.error(err);
    }
  });
});
// End Audio Player
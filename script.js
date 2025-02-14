document.addEventListener('click', function(e) {
    // Số lượng sao sẽ tạo ra khi click
    const starCount = 8;
    
    for(let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'click-star';
        
        // Random kích thước cho sao
        const size = Math.random() * 15 + 5;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // Đặt vị trí ban đầu tại điểm click
        star.style.left = e.clientX + 'px';
        star.style.top = e.clientY + 'px';
        
        // Random hướng và khoảng cách rơi
        const angle = (Math.PI * 2 * i) / starCount;
        const velocity = 5 + Math.random() * 10;
        const endX = Math.cos(angle) * velocity * 20;
        const endY = Math.sin(angle) * velocity * 20;
        
        star.style.setProperty('--end-x', endX + 'px');
        star.style.setProperty('--end-y', endY + 'px');
        
        document.body.appendChild(star);
        
        // Xóa sao sau khi animation kết thúc
        setTimeout(() => {
            star.remove();
        }, 1000);
    }
});

// Constants
const DOM = {
    loader: document.getElementById('loader'),
    content: document.querySelector('.content'),
    audio: document.getElementById('bgMusic'),
    musicToggle: document.querySelector('.music-toggle'),
    musicBars: document.querySelector('.music-bars'),
    pingValue: document.querySelector('.ping-value'),
    pingIndicator: document.querySelector('.ping-indicator')
};

// Audio Controller
const AudioController = {
    isPlaying: false,
    currentAudio: null,
    currentItem: null,
    playlistPanel: null,
    musicToggle: null,

    init() {
        // Cache DOM elements một lần duy nhất
        this.playlistPanel = document.querySelector('.playlist-panel');
        this.musicToggle = document.querySelector('.music-toggle');
        this.playlistItems = document.querySelectorAll('.playlist-item');
        
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Toggle playlist
        this.musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playlistPanel.classList.toggle('show');
        });

        // Close playlist when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.playlistPanel.contains(e.target) && 
                !this.musicToggle.contains(e.target)) {
                this.playlistPanel.classList.remove('show');
            }
        });

        // Handle song selection
        this.playlistItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const songSrc = item.dataset.src;
                
                if (this.currentItem === item && this.isPlaying) {
                    this.pauseSong();
                } else {
                    this.playSong(songSrc, item);
                }
            });
        });
    },

    async playSong(src, item) {
        try {
            // Nếu đang phát nhạc, pause trước
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.updateUI(this.currentItem, false);
            }

            // Tạo audio mới nếu cần
            if (!this.currentAudio || this.currentItem !== item) {
                this.currentAudio = new Audio(src);
                this.currentAudio.addEventListener('ended', () => this.pauseSong());
            }

            // Play audio
            await this.currentAudio.play();
            
            // Update state và UI
            this.currentItem = item;
            this.isPlaying = true;
            this.updateUI(item, true);

        } catch (error) {
            console.error('Error playing audio:', error);
        }
    },

    pauseSong() {
        if (!this.currentAudio || !this.isPlaying) return;
        
        this.currentAudio.pause();
        this.isPlaying = false;
        this.updateUI(this.currentItem, false);
    },

    updateUI(item, isPlaying) {
        if (!item) return;

        // Update playlist item UI
        const playBtn = item.querySelector('.play-btn');
        const pauseBtn = item.querySelector('.pause-btn');
        
        if (isPlaying) {
            item.classList.add('playing');
            this.musicToggle.classList.add('playing');
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
        } else {
            item.classList.remove('playing');
            this.musicToggle.classList.remove('playing');
            playBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
        }
    }
};

// Ping Measurement
const PingMeasurement = {
    updatePing() {
        const startTime = performance.now();
        
        fetch(window.location.href + '?' + Date.now())
            .then(() => {
                const pingTime = Math.round(performance.now() - startTime);
                const pingColor = pingTime < 100 ? '#2ecc71' : 
                                pingTime < 200 ? '#f1c40f' : '#e74c3c';
                
                DOM.pingValue.textContent = `${pingTime}ms`;
                DOM.pingIndicator.style.color = pingColor;
            })
            .catch(() => {
                DOM.pingValue.textContent = 'offline';
                DOM.pingIndicator.style.color = '#e74c3c';
            });
    },

    init() {
        this.updatePing();
        setInterval(() => this.updatePing(), 5000);
    }
};

// Security Features
const Security = {
    init() {
        this.preventDevTools();
        this.preventInspect();
        this.preventSourceView();
        this.addSecurityHeaders();
    },

    preventDevTools() {
        // Chặn F12
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 123) {
                e.preventDefault();
                this.redirectToFacebook();
                return false;
            }
        });

        // Chặn Ctrl+Shift+I/J/C
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) {
                e.preventDefault();
                this.redirectToFacebook();
                return false;
            }
        });
    },

    preventInspect() {
        // Chặn chuột phải
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.redirectToFacebook();
            return false;
        });

        // Chặn Ctrl+U
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.redirectToFacebook();
                return false;
            }
        });
    },

    preventSourceView() {
        // Chặn Ctrl+S
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.redirectToFacebook();
                return false;
            }
        });
    },

    redirectToFacebook() {
        window.location.href = 'https://www.facebook.com/huydzs1tg257';
    },

    addSecurityHeaders() {
        // Thêm CSP header
        const meta = document.createElement('meta');
        meta.httpEquiv = "Content-Security-Policy";
        meta.content = "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;";
        document.head.appendChild(meta);

        // Thêm X-Frame-Options
        const xframe = document.createElement('meta');
        xframe.httpEquiv = "X-Frame-Options";
        xframe.content = "DENY";
        document.head.appendChild(xframe);
    }
};

const WelcomeVoice = {
    audio: new Audio('https://files.catbox.moe/d338lp.mp3'),
    hasPlayed: false,
    volume: 1.0,

    init() {
        this.audio.volume = this.volume;
        
        this.audio.addEventListener('ended', () => {
            AudioController.fadeToVolume(0.7);
        });
        
        setTimeout(() => {
            if (!this.hasPlayed) {
                this.playVoice().catch(() => {
                    document.addEventListener('click', () => {
                        if (!this.hasPlayed) {
                            this.playVoice();
                        }
                    }, { once: true });
                });
            }
        }, 1000);
    },

    async playVoice() {
        try {
            await AudioController.fadeToVolume(0.05);
            await this.audio.play();
            this.hasPlayed = true;
            return true;
        } catch(err) {
            console.log('Voice autoplay prevented:', err);
            return false;
        }
    }
};

const LoadingScreen = {
    init() {
        const loader = document.getElementById('loader');
        const progress = document.querySelector('.progress');
        const progressText = document.querySelector('.progress-text');
        
        // Thêm hiệu ứng tuyết rơi trong khi loading
        this.createLoadingSnow(loader);
        
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 500);
            } else {
                width += Math.random() * 15;
                if (width > 100) width = 100;
                progress.style.width = width + '%';
                progressText.textContent = Math.round(width) + '%';
            }
        }, 200);
    },

    createLoadingSnow(loader) {
        for (let i = 0; i < 20; i++) {
            const snow = document.createElement('div');
            snow.className = 'loading-snow';
            snow.style.left = Math.random() * 100 + 'vw';
            snow.style.animationDuration = (Math.random() * 3 + 2) + 's';
            snow.style.opacity = Math.random();
            loader.appendChild(snow);
        }
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    LoadingScreen.init();
    AudioController.init();
    PingMeasurement.init();
    Security.init();
    WelcomeVoice.init();
});
// Error handling
window.onerror = function(msg, url, line) {
    console.error(`Error: ${msg} at ${url}:${line}`);
    return false;
};

// Prevent iframe embedding
if (window.top !== window.self) {
    window.top.location.href = window.self.location.href;
}

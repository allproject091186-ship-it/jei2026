// JavaScript Logic for Jantung Emas Indonesia - Dynamic Prices, Outlets & 3-Slide Hero Slider Engine

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATA DEFINITION FROM IMAGE 1 (20 KARATS DEFAULT) ---
    const DEFAULT_KARAT_DATA = [
        { name: '24K+', percent: 1.04 },
        { name: '24K',  percent: 1.000 },
        { name: '23K',  percent: 0.931 },
        { name: '22K',  percent: 0.865 },
        { name: '21K',  percent: 0.826 },
        { name: '20K',  percent: 0.789 },
        { name: '19K',  percent: 0.745 },
        { name: '18K',  percent: 0.707 },
        { name: '17K',  percent: 0.690 },
        { name: '16K',  percent: 0.640 },
        { name: '15K',  percent: 0.589 },
        { name: '14K',  percent: 0.549 },
        { name: '13K',  percent: 0.510 },
        { name: '12K',  percent: 0.471 },
        { name: '11K',  percent: 0.432 },
        { name: '10K',  percent: 0.392 },
        { name: '9K',   percent: 0.370 },
        { name: '8K',   percent: 0.340 },
        { name: '7K',   percent: 0.279 },
        { name: '6K',   percent: 0.250 }
    ];

    function getKaratData() {
        const saved = localStorage.getItem('jantung_emas_karat_data');
        return saved ? JSON.parse(saved) : DEFAULT_KARAT_DATA;
    }

    // DEFAULT 3 HERO SLIDES WITH GRADIENT SEPARATOR (|)
    const DEFAULT_SLIDES = [
        {
            id: 1,
            badge: 'Pusat Terima Jual Emas Terpercaya di Indonesia',
            title: 'TERIMA JUAL EMAS | DENGAN HARGA TERBAIK',
            subtitle: 'Jantung Emas Indonesia menerima jual emas perhiasan, emas batangan, hingga emas tanpa surat dengan penimbangan presisi dan daftar harga transparan yang selalu ter-update!',
            image: 'logo.png'
        },
        {
            id: 2,
            badge: 'Pengecekan Kadar Spektrometer XRF',
            title: 'PROSES CEPAT & TRANSPARAN | CAIR DETIK INI',
            subtitle: 'Tim penaksir profesional kami siap melayani Anda di outlet terdekat. Penimbangan digital terbuka & pengujian kadar ilmiah canggih tanpa merusak perhiasan Anda.',
            image: 'logo.png'
        },
        {
            id: 3,
            badge: 'Solusi Emas Patah, Rusak & Tanpa Surat',
            title: 'TERIMA EMAS TANPA NOTA | ATAU SURAT HILANG',
            subtitle: 'Surat kwitansi hilang atau perhiasan patah/rusak? Kami tetap membeli dengan penawaran harga pasaran murni murni berdasarkan pengujian kadar ilmiah.',
            image: 'logo.png'
        }
    ];

    // DEFAULT OUTLETS DATA
    const DEFAULT_OUTLETS = [
        {
            id: 1,
            name: 'Outlet Jakarta (Pusat & Selatan)',
            tagline: 'Store Utama Jantung Emas',
            address: 'Jl. Gajah Mada No. 88 / Mall Ambassador Area, Jakarta Pusat',
            mapUrl: 'https://maps.google.com/?q=Jakarta',
            whatsapp: '6281234567890',
            hours: '08.00 - 21.00 WIB'
        },
        {
            id: 2,
            name: 'Outlet Tangerang & BSD',
            tagline: 'Outlet Resmi Tangerang & BSD',
            address: 'Ruko BSD City & Gading Serpong, Tangerang Selatan',
            mapUrl: 'https://maps.google.com/?q=BSD+City',
            whatsapp: '6281234567890',
            hours: '08.00 - 21.00 WIB'
        },
        {
            id: 3,
            name: 'Outlet Bekasi & Depok',
            tagline: 'Outlet Resmi Bekasi & Depok',
            address: 'Ruko Summarecon Bekasi & Margonda Raya, Depok',
            mapUrl: 'https://maps.google.com/?q=Bekasi',
            whatsapp: '6281234567890',
            hours: '08.00 - 21.00 WIB'
        }
    ];

    // Default 24K base price (Internal Admin Acuan) = Rp 2.280.000
    const DEFAULT_BASE_PRICE = 2280000;

    // Load from LocalStorage or default
    let basePrice24K = parseInt(localStorage.getItem('jantung_emas_base_24k')) || DEFAULT_BASE_PRICE;
    let lastUpdatedTime = localStorage.getItem('jantung_emas_last_update') || new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });

    // Formula: floor to thousands (Gambar 1 match)
    function calcPricePerGram(base24k, percent) {
        return Math.floor((base24k * percent) / 1000) * 1000;
    }

    // Format Rupiah
    function formatIDR(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount).replace('Rp', 'Rp ');
    }

    // Smart Formatter for Headline (Line 1 = White, Line 2 = Gold Gradient like Gambar 1)
    function formatSlideTitle(titleText) {
        if (!titleText) return '';
        
        let line1 = titleText;
        let line2 = '';

        if (titleText.includes('<br>')) {
            const parts = titleText.split('<br>');
            line1 = parts[0];
            line2 = parts.slice(1).join(' ');
        } else if (titleText.includes('|')) {
            const parts = titleText.split('|');
            line1 = parts[0];
            line2 = parts.slice(1).join(' ');
        } else {
            const words = titleText.trim().split(' ');
            if (words.length >= 4) {
                const mid = Math.ceil(words.length / 2);
                line1 = words.slice(0, mid).join(' ');
                line2 = words.slice(mid).join(' ');
            } else {
                line1 = titleText;
                line2 = '';
            }
        }

        if (line2) {
            return `<span class="text-white block">${line1}</span><span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-amber-500 block">${line2}</span>`;
        } else {
            return `<span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-amber-500 block">${line1}</span>`;
        }
    }

    // --- 2. MOBILE MENU & HEADER ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.className = mobileMenu.classList.contains('hidden') ? 'fa-solid fa-bars text-xl' : 'fa-solid fa-xmark text-xl';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.className = 'fa-solid fa-bars text-xl';
            });
        });
    }

    const mainHeader = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            mainHeader.classList.add('bg-darkbg-900/95', 'shadow-lg', 'shadow-slate-950/50');
        } else {
            mainHeader.classList.remove('bg-darkbg-900/95', 'shadow-lg', 'shadow-slate-950/50');
        }
    });

    // FAQ Accordion
    const faqButtons = document.querySelectorAll('.faq-btn');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');

            faqButtons.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.nextElementSibling.classList.add('hidden');
                    otherBtn.querySelector('i').style.transform = 'rotate(0deg)';
                }
            });

            content.classList.toggle('hidden');
            icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });

    // --- 3. DYNAMIC 3-SLIDE HERO CAROUSEL ENGINE ---
    const heroSliderContainer = document.getElementById('heroSliderContainer');
    const sliderDots = document.getElementById('sliderDots');
    const sliderPrevBtn = document.getElementById('sliderPrevBtn');
    const sliderNextBtn = document.getElementById('sliderNextBtn');

    let currentSlideIndex = 0;
    let autoSlideInterval = null;

    function renderHeroSlides() {
        if (!heroSliderContainer) return;
        const savedSlides = localStorage.getItem('jantung_emas_slides');
        const slides = savedSlides ? JSON.parse(savedSlides) : DEFAULT_SLIDES;

        heroSliderContainer.innerHTML = '';
        if (sliderDots) sliderDots.innerHTML = '';

        slides.forEach((slide, idx) => {
            // Slide Item
            const slideEl = document.createElement('div');
            slideEl.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
            slideEl.setAttribute('data-slide', idx);

            const formattedTitle = formatSlideTitle(slide.title);

            slideEl.innerHTML = `
                ${slide.badge ? `
                <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs sm:text-sm font-bold tracking-wide mb-6 mx-auto">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>${slide.badge}</span>
                </div>` : ''}

                <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 uppercase">
                    ${formattedTitle}
                </h1>

                <p class="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                    ${slide.subtitle}
                </p>
            `;

            heroSliderContainer.appendChild(slideEl);

            // Dot Indicator
            if (sliderDots) {
                const dot = document.createElement('div');
                dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
                dot.setAttribute('data-index', idx);
                dot.addEventListener('click', () => {
                    goToSlide(idx);
                    resetAutoSlide();
                });
                sliderDots.appendChild(dot);
            }
        });

        startAutoSlide();
    }

    function goToSlide(index) {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-dot');

        if (!slides.length) return;

        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        currentSlideIndex = index;

        slides.forEach((slide, idx) => {
            if (idx === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        dots.forEach((dot, idx) => {
            if (idx === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            goToSlide(currentSlideIndex + 1);
        }, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    if (sliderPrevBtn) {
        sliderPrevBtn.addEventListener('click', () => {
            goToSlide(currentSlideIndex - 1);
            resetAutoSlide();
        });
    }

    if (sliderNextBtn) {
        sliderNextBtn.addEventListener('click', () => {
            goToSlide(currentSlideIndex + 1);
            resetAutoSlide();
        });
    }

    // --- 4. RENDER ALL TABLES & UI UPDATES ---
    const priceTableBody = document.getElementById('priceTableBody');
    const lastUpdatedTicker = document.getElementById('lastUpdatedTicker');
    const lastUpdatedDate = document.getElementById('lastUpdatedDate');
    const karatSelect = document.getElementById('karatSelect');

    function renderPriceData() {
        if (lastUpdatedTicker) lastUpdatedTicker.textContent = lastUpdatedTime;
        if (lastUpdatedDate) lastUpdatedDate.textContent = lastUpdatedTime;

        const karatList = getKaratData();

        // Update Top Banner Ticker with 24K+ Price
        const topTicker24kPrice = document.getElementById('topTicker24kPrice');
        const item24kPlus = karatList.find(k => k.name === '24K+') || karatList[0];
        if (topTicker24kPrice && item24kPlus) {
            const price24kPlus = calcPricePerGram(basePrice24K, item24kPlus.percent);
            topTicker24kPrice.textContent = `${formatIDR(price24kPlus)} / Gram`;
        }

        // Render main price table (2 Columns: Kadar & Harga / Gram)
        if (priceTableBody) {
            priceTableBody.innerHTML = '';
            karatList.forEach(item => {
                const price = calcPricePerGram(basePrice24K, item.percent);
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-800/40 transition duration-150';

                tr.innerHTML = `
                    <td class="py-3.5 px-6 font-bold text-white text-sm">
                        ${item.name}
                    </td>
                    <td class="py-3.5 px-6 text-right font-extrabold text-base text-gold-300">
                        ${formatIDR(price)}
                    </td>
                `;
                priceTableBody.appendChild(tr);
            });
        }

        // Render Karat Dropdown options in Calculator
        if (karatSelect) {
            const currentSelected = karatSelect.value || '24K';
            karatSelect.innerHTML = '';
            karatList.forEach(item => {
                const price = calcPricePerGram(basePrice24K, item.percent);
                const option = document.createElement('option');
                option.value = item.name;
                option.textContent = `${item.name} — ${formatIDR(price)} / gram`;
                if (item.name === currentSelected) option.selected = true;
                karatSelect.appendChild(option);
            });
        }

        runCalculator();
    }

    // --- 5. RENDER OUTLETS / CABANG ---
    const outletsContainer = document.getElementById('outletsContainer');

    function renderOutlets() {
        if (!outletsContainer) return;
        const savedOutlets = localStorage.getItem('jantung_emas_outlets');
        const outlets = savedOutlets ? JSON.parse(savedOutlets) : DEFAULT_OUTLETS;

        outletsContainer.innerHTML = '';
        outlets.forEach(outlet => {
            const cleanWa = (outlet.whatsapp || '').replace(/[^0-9]/g, '');
            const waMsg = encodeURIComponent(`Halo Jantung Emas Indonesia, saya mau jual emas di ${outlet.name}`);
            const mapLink = outlet.mapUrl || 'https://maps.google.com';

            const card = document.createElement('div');
            card.className = 'bg-darkbg-900 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-gold-500/40 transition flex flex-col justify-between';

            card.innerHTML = `
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-lg shrink-0">
                            <i class="fa-solid fa-building-user"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-bold text-white">${outlet.name}</h3>
                            ${outlet.tagline ? `<p class="text-xs text-gold-400 font-semibold">${outlet.tagline}</p>` : ''}
                        </div>
                    </div>
                    
                    <p class="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                        <i class="fa-solid fa-location-dot text-gold-400 mt-0.5 shrink-0"></i>
                        <span>${outlet.address}</span>
                    </p>

                    ${outlet.hours ? `
                    <p class="text-xs text-slate-400 flex items-center gap-2">
                        <i class="fa-regular fa-clock text-gold-400 shrink-0"></i>
                        <span>Jam Buka: ${outlet.hours}</span>
                    </p>` : ''}
                </div>

                <div class="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <a href="${mapLink}" target="_blank" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold flex items-center gap-1.5 transition">
                        <i class="fa-solid fa-map-location-dot text-amber-400"></i>
                        <span>Lihat Maps</span>
                    </a>

                    <a href="https://wa.me/${cleanWa}?text=${waMsg}" target="_blank" class="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5 border border-emerald-500/30 transition">
                        <i class="fa-brands fa-whatsapp text-sm"></i>
                        <span>Hubungi WA</span>
                    </a>
                </div>
            `;

            outletsContainer.appendChild(card);
        });

        populateCalcOutlets();
    }

    // --- 6. SEARCH FILTER IN PRICE TABLE ---
    const searchKaratInput = document.getElementById('searchKaratInput');
    if (searchKaratInput) {
        searchKaratInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const rows = priceTableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    // --- 7. CALCULATOR ENGINE ---
    const jenisEmasSelect = document.getElementById('jenisEmasSelect');
    const bentukEmasSelect = document.getElementById('bentukEmasSelect');
    const calcOutletSelect = document.getElementById('calcOutletSelect');
    const weightInput = document.getElementById('weightInput');
    const quickGramBtns = document.querySelectorAll('.quick-gram');
    const totalResultPrice = document.getElementById('totalResultPrice');
    const calcDetailText = document.getElementById('calcDetailText');
    const calcWaBtn = document.getElementById('calcWaBtn');

    const BENTUK_MAP = {
        'Logam Mulia': ['Antam', 'UBS', 'Galeri24', 'Lotus', 'Lainnya'],
        'Perhiasan': ['Kalung', 'Cincin', 'Gelang', 'Anting', 'Liontin', 'Lainnya']
    };

    let currentWeight = parseFloat(weightInput?.value) || 10;

    function getOutletsList() {
        const savedOutlets = localStorage.getItem('jantung_emas_outlets');
        return savedOutlets ? JSON.parse(savedOutlets) : DEFAULT_OUTLETS;
    }

    function populateCalcOutlets() {
        if (!calcOutletSelect) return;
        const outlets = getOutletsList();
        const currentVal = calcOutletSelect.value;
        calcOutletSelect.innerHTML = '';
        
        outlets.forEach(outlet => {
            const option = document.createElement('option');
            option.value = outlet.id;
            option.textContent = `${outlet.name} (${outlet.address.split(',')[0]})`;
            if (String(outlet.id) === String(currentVal)) option.selected = true;
            calcOutletSelect.appendChild(option);
        });
    }

    function populateBentukOptions() {
        if (!jenisEmasSelect || !bentukEmasSelect) return;
        const selectedJenis = jenisEmasSelect.value || 'Logam Mulia';
        const shapes = BENTUK_MAP[selectedJenis] || BENTUK_MAP['Logam Mulia'];
        
        const previousSelection = bentukEmasSelect.value;
        bentukEmasSelect.innerHTML = '';

        shapes.forEach(shape => {
            const opt = document.createElement('option');
            opt.value = shape;
            opt.textContent = shape;
            if (shape === previousSelection) opt.selected = true;
            bentukEmasSelect.appendChild(opt);
        });
    }

    if (jenisEmasSelect) {
        jenisEmasSelect.addEventListener('change', () => {
            populateBentukOptions();
            runCalculator();
        });
    }

    if (bentukEmasSelect) {
        bentukEmasSelect.addEventListener('change', runCalculator);
    }

    if (calcOutletSelect) {
        calcOutletSelect.addEventListener('change', runCalculator);
    }

    if (karatSelect) {
        karatSelect.addEventListener('change', runCalculator);
    }

    if (weightInput) {
        weightInput.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            currentWeight = isNaN(val) || val <= 0 ? 0 : val;
            runCalculator();
        });
    }

    quickGramBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gramVal = parseFloat(btn.getAttribute('data-gram'));
            if (weightInput) weightInput.value = gramVal;
            currentWeight = gramVal;
            runCalculator();
        });
    });

    function runCalculator() {
        const selectedJenis = jenisEmasSelect?.value || 'Logam Mulia';
        const selectedBentuk = bentukEmasSelect?.value || 'Antam';
        const selectedKaratName = karatSelect?.value || '24K';
        
        const karatList = getKaratData();
        const item = karatList.find(k => k.name === selectedKaratName) || karatList[1];
        
        let ratePerGram = calcPricePerGram(basePrice24K, item.percent);
        let totalPrice = Math.round(ratePerGram * currentWeight);

        // Fetch selected outlet WhatsApp details
        const outlets = getOutletsList();
        const selectedOutletId = calcOutletSelect?.value;
        const targetOutlet = outlets.find(o => String(o.id) === String(selectedOutletId)) || outlets[0] || { name: 'Outlet Utama', whatsapp: '6281234567890' };

        let cleanWa = (targetOutlet.whatsapp || '6281234567890').replace(/[^0-9]/g, '');
        if (cleanWa.startsWith('0')) {
            cleanWa = '62' + cleanWa.slice(1);
        }

        if (totalResultPrice) {
            totalResultPrice.textContent = formatIDR(totalPrice);
        }

        if (calcDetailText) {
            calcDetailText.textContent = `Estimasi ${currentWeight} gram ${item.name} (${selectedJenis} - ${selectedBentuk}) @ ${formatIDR(ratePerGram)} / gram — Cabang: ${targetOutlet.name}`;
        }

        if (calcWaBtn) {
            const msg = `Halo Jantung Emas Indonesia (${targetOutlet.name}), saya mau jual emas:\n\n- Jenis Emas: ${selectedJenis}\n- Bentuk: ${selectedBentuk}\n- Kadar: ${item.name}\n- Berat: ${currentWeight} Gram\n- Estimasi Total: ${formatIDR(totalPrice)}\n\nMohon info jadwal & tempat transaksi untuk cabang ${targetOutlet.name}. Terima kasih!`;
            const encoded = encodeURIComponent(msg);
            calcWaBtn.onclick = () => {
                window.open(`https://wa.me/${cleanWa}?text=${encoded}`, '_blank');
            };
        }
    }

    // Initial setup for calculator dropdowns
    populateBentukOptions();
    populateCalcOutlets();

    // Boot execution
    renderHeroSlides();
    renderPriceData();
    renderOutlets();

});

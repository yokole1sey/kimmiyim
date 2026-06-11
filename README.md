# KİM MİYİM? 🔍

Doğum tarihini gir, hayatının istatistiklerini gör. Kalbinin kaç kez attığını, kaç nefes aldığını, Dünya'nın Güneş etrafında senin için kaç km döndüğünü öğren.

🌐 **[kimmiyim.com](https://kimmiyim.com)**

![KİM MİYİM? Ekran Görüntüsü](https://img.shields.io/badge/Dil-Türkçe-blue) ![Lisans](https://img.shields.io/badge/Lisans-MIT-green)

---

## Özellikler

### 📅 Doğum Tarihi Modu
- Apple tarzı drum picker ile tarih seçimi
- **15+ yaşam istatistiği**: kalp atışı, nefes, göz kırpma, uyku, adım, kan pompası, yıldırım...
- NASA verilerine dayalı güneş ve ay tutulması sayısı
- Gelecek tahmini: yaşam beklentisine göre kalan istatistikler

### 📱 Ekran Süresi Modu
- Günlük ekran süresi + kaç yıldır kullandığını seç
- Şaşırtıcı karşılaştırmalar: kaç film izleyebilirdin, kaç kez Everest'e tırmanabilirdin, kaç dil öğrenebilirdin...

### 🪐 Gezegen Yaşı Modu
- 7 gezegenden birini seç (Merkür → Neptün)
- O gezegendeki yaşını, kilonu, gün uzunluğunu öğren

### 📸 Instagram Hikaye Çıktısı
- 1080×1920 PNG olarak indir
- İsim girişi (isteğe bağlı)
- Sosyal medyada paylaşıma hazır tasarım

---

## Teknoloji

- **Saf HTML / CSS / JavaScript** — framework yok, bağımlılık yok
- Veritabanı yok — tüm hesaplamalar tarayıcıda yapılır
- Canvas 2D API ile görsel oluşturma
- Mobil öncelikli tasarım (responsive)

## Dosya Yapısı

```
├── index.html          # Ana sayfa
├── css/
│   └── style.css       # Tüm stiller
├── js/
│   ├── eclipses.js     # NASA tutulma verileri (1900-2100)
│   ├── picker.js       # Apple drum wheel bileşeni
│   ├── calculator.js   # İstatistik hesap motoru
│   ├── share.js        # Instagram hikaye görseli (Canvas)
│   └── app.js          # Ekran geçişleri ve orkestrasyon
└── favicon.ico
```

## Kurulum

```bash
# Projeyi klonla
git clone https://github.com/yokole1sey/kimmiyim.git

# Herhangi bir web sunucusuyla aç
# Örnek: VS Code Live Server, XAMPP, veya Python
cd kimmiyim
python -m http.server 8000
```

Tarayıcıda `http://localhost:8000` adresini aç.

## Lisans

MIT

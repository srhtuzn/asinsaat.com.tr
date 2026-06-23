# AS Yapı Projesi Yapay Zeka Geliştirici Kuralları (AGENTS.md)

Bu dosya, bu projede çalışacak yapay zeka agent'larının (AI Coding Assistants) uyması gereken kodlama, mimari, tasarım ve sürüm kontrolü (Git) kurallarını içerir. Projenin bütünlüğünü ve kalitesini korumak adına tüm kurallara titizlikle uyulmalıdır.

---

## 1. Sürüm Kontrolü ve Git İş Akışı (Git Workflow)

Projedeki her başarılı değişiklik sonrasında sürüm kontrolü kurallarına uyulmalı ve değişiklikler anında uzak depoya gönderilmelidir.

- **Her Değişiklik Sonrası Commit ve Push**: Yapılan her mantıksal düzeltme veya yeni özellik sonrasında değişiklikler bekletilmeden commit'lenmeli ve uzak depoya (`git push origin main`) push'lanmalıdır.
- **Anlamlı Commit Mesajları**: Commit mesajları [Conventional Commits](https://www.conventionalcommits.org/) standardına uygun olmalıdır:
  - `feat: ...` (Yeni bir özellik eklendiğinde)
  - `fix: ...` (Bir hata veya yanlış bilgi düzeltildiğinde)
  - `style: ...` (Logo, renk, padding, responsive ayarlar veya tasarım değişikliklerinde)
  - `refactor: ...` (Kod yapısı iyileştirildiğinde, işlevsellik değişmediğinde)
- **Git Doğrulama**: Değişiklikleri commit etmeden önce mutlaka `git diff` ve `git status` çıktıları incelenmeli, gereksiz veya geçici dosyaların repoya eklenmesi engellenmelidir.

---

## 2. Çoklu Dil Desteği Standartları (TR/EN Localization)

Proje hem Türkçe hem İngilizce olarak yayınlanmaktadır. Bu nedenle yapılan her içerik güncellemesi iki dilde de geçerli olmalıdır.

- **Senkronize Güncelleme**: Türkçe sayfalarda (`index.html`, `about.html`, `projects.html`, `contact.html`) yapılan her metin, adres veya yapısal değişiklik, aynı anda İngilizce karşılıklarına da (`index-en.html`, `about-en.html`, `projects-en.html`, `contact-en.html`) birebir çevrilerek uygulanmalıdır.
- **Proje Veritabanı (`projects.js`)**: Yeni bir proje eklendiğinde veya mevcut bir proje düzenlendiğinde hem Türkçe alanlar (`title`, `description`, `location`, `features`) hem de İngilizce alanlar (`titleEn`, `descriptionEn`, `locationEn`, `featuresEn`) doldurulmalıdır.

---

## 3. Kodlama ve Mimari Kuralları

- **Mevcut Yapıyı Koruma**: Kod düzenlenirken ilgisiz yorum satırları, lisans bilgileri veya yazar etiketleri silinmemelidir.
- **Tıklanabilir Bağlantılar (Active Links)**: İletişim alanlarında yer alan telefon numaraları her zaman `tel:` protokolüyle, e-posta adresleri ise `mailto:` protokolüyle aktif birer `<a>` linki olarak yazılmalıdır.
- **Stil Bütünlüğü**: İletişim linkleri ve diğer interaktif elemanlar hover durumunda marka rengi olan altın sarısına (`var(--gold)`) pürüzsüzce geçiş yapacak şekilde tasarlanmalı, ilgili CSS kuralları `style.css` dosyasında ortak tanımlanmalıdır.

---

## 4. Tasarım ve Animasyon Bütünlüğü (UI & UX)

- **Premium Estetik**: Uygulamada kullanılan tüm renkler OKLCH formatında kalmalıdır (Örn: Altın sarısı `oklch(75% 0.155 81)`).
- **Animasyon Çakışmalarını Önleme**: GSAP / Lenis tarafından kontrol edilen (scroll-linked) elemanlara düz CSS transition özellikleri verilmemelidir. Bu durum kaydırma sırasında titremelere (stuttering) neden olur.
- **Görsel Optimizasyonu**: Sisteme eklenecek logolar ve ikonlar şeffaf arka plana sahip olmalı (PNG formatında), görselin etrafında görünmez piksel boşlukları (transparent margins) bulunmamalıdır (Gerektiğinde PIL/Python ile kırpma yapılmalıdır).
- **Mobil Uyumluluk (Responsive)**: Yapılan tüm UI değişiklikleri mobil cihazlardaki ekran genişlikleri (320px - 768px) göz önünde bulundurularak test edilmeli, header ve menüler mobil uyumlu kalmalıdır.

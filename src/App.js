import React, { useState } from "react";
import "./App.css";

function App() {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [nonFollowers, setNonFollowers] = useState([]);
  const [followersFileName, setFollowersFileName] = useState("");
  const [followingFileName, setFollowingFileName] = useState("");
  const [showGuide, setShowGuide] = useState(false);

  const exportToExcel = () => {
  if (nonFollowers.length === 0) {
    alert("Henüz sonuç yok, export edilecek veri bulunmuyor!");
    return;
  }

  // CSV başlığı
  const header = "Kullanici Adi";

  // CSV satırları (tek sütun)
  const rows = nonFollowers.map(user => `"${user}"`);

  // CSV oluştur
  let csvContent = header + "\r\n" + rows.join("\r\n");

  // Blob ile indirme
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "non_followers.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    parseFile(file, type);

    if (type === "followers") setFollowersFileName(file.name);
    else setFollowingFileName(file.name);
  };

  const parseFile = (file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(e.target.result, "text/html");
      const names = Array.from(doc.querySelectorAll("a")).map((a) =>
        a.textContent.trim()
      );

      if (type === "followers") setFollowers(names);
      else setFollowing(names);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      parseFile(file, type);
      if (type === "followers") setFollowersFileName(file.name);
      else setFollowingFileName(file.name);
    }
  };

  const compareLists = () => {
    const notFollowingBack = following.filter(
      (user) => !followers.includes(user)
    );
    setNonFollowers(notFollowingBack);
  };

  const clearAll = () => {
    setFollowers([]);
    setFollowing([]);
    setNonFollowers([]);
    setFollowersFileName("");
    setFollowingFileName("");
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">TakipKontrol</h1>
        <p className="subtitle">
          Followers ve Following HTML dosyalarını yükle, seni takip etmeyenleri gör!
        </p>
        <button
          className="guide-btn"
          onClick={() => setShowGuide(!showGuide)}
        >
          Instagram’dan Veri Alma Rehberi
        </button>

  {showGuide && (
  <div className="modal-overlay" onClick={() => setShowGuide(false)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <h2>Instagram’dan Takipçi/Following Verilerini Alma</h2>
      <ol>
        <li>Instagram hesabına web veya mobil uygulama üzerinden giriş yap.</li>
        <li>Ayarlar ve Hareketler → Hesaplar Merkezi → Bilgilerin ve İzinlerin → Bilgilerini dışa aktar sekmesine git.</li>
        <li>“İndirme Talep Et” butonuna tıkla.</li>
        <li>Instagram sana bir e-posta ile veri dosyalarını (HTML) gönderecek.</li>
        <li>Bu dosyadan Followers.html ve Following.html dosyalarını indirdikten sonra TakipKontrol uygulamasına yükleyerek analiz yapabilirsin.</li>
      </ol>
      <p className="note">📌 Not: HTML dosyaları yükleyebilirsin.</p>
      <button className="close-modal-btn" onClick={() => setShowGuide(false)}>
        Kapat
      </button>
    </div>
  </div>
)}



        <div className="upload-container">
          {/* Followers upload */}
          <div
            className="upload-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "followers")}
          >
            <p>Followers.html yükle</p>
            <label className="custom-file-upload">
              <input
                type="file"
                accept=".html"
                onChange={(e) => handleFileUpload(e, "followers")}
              />
              Dosya Seç
            </label>
            {followersFileName && (
              <p className="file-info">📂 {followersFileName} yüklendi</p>
            )}
          </div>

          {/* Following upload */}
          <div
            className="upload-box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, "following")}
          >
            <p>Following.html yükle</p>
            <label className="custom-file-upload">
              <input
                type="file"
                accept=".html"
                onChange={(e) => handleFileUpload(e, "following")}
              />
              Dosya Seç
            </label>
            {followingFileName && (
              <p className="file-info">📂 {followingFileName} yüklendi</p>
            )}
          </div>
        </div>

        <div className="button-group">
          <button className="compare-btn" onClick={compareLists}>
            Karşılaştır
          </button>
          <button className="clear-btn" onClick={clearAll}>
            Temizle
          </button>
        </div>

        <div className="result-box">
        <div className="result-header">
          <h2>Seni Takip Etmeyenler - {nonFollowers.length} adet kullanıcı bulundu.</h2>
          <button className="export-btn" onClick={exportToExcel}>
            Listeyi İndir
          </button>
        </div>

{nonFollowers.length === 0 ? (
  <p className="empty-text">Henüz sonuç yok</p>
) : (
  <ul className="user-list">
    {nonFollowers.map((user, index) => (
      <li key={index} className="user-item">
        <span className="user-index">{index + 1}.</span>
        <span className="username">{user}</span>
        <a
          href={`https://www.instagram.com/${user}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="insta-link-btn"
        >
          Instagram'a Git
        </a>
      </li>
    ))}
  </ul>
)}

        </div>
      </div>
    </div>
  );
}

export default App;

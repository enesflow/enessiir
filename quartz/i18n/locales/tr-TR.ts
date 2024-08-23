import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "Başlıksız",
    description: "Açıklama yok",
  },
  components: {
    callout: {
      note: "Not",
      abstract: "Özet",
      info: "Bilgi",
      todo: "Yapılacak",
      tip: "İpucu",
      success: "Başarı",
      question: "Soru",
      warning: "Uyarı",
      failure: "Başarısızlık",
      danger: "Tehlike",
      bug: "Hata",
      example: "Örnek",
      quote: "Alıntı",
    },
    backlinks: {
      title: "Bu sahifeye bağlantı verenler",
      noBacklinksFound: "Bağlantı mevcut değil",
    },
    themeToggle: {
      lightMode: "Gündüz modu",
      darkMode: "Gece modu",
    },
    explorer: {
      title: "Sahifeler",
    },
    footer: {
      createdWith: "Şükrânlarımı sunarım: ",
    },
    graph: {
      title: "Bağlantı Görünümü",
    },
    recentNotes: {
      title: "Son Notlar",
      seeRemainingMore: ({ remaining }) => `${remaining} tane daha gör →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `${targetSlug} adlı sahifedan alıntı`,
      linkToOriginal: "Orijinal sahifeya git",
    },
    search: {
      title: "Ara",
      searchBarPlaceholder: "Arama yap",
    },
    tableOfContents: {
      title: "İçindekiler",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} dakikalık okuma`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Son Notlar",
      lastFewNotes: ({ count }) => `Son ${count} not`,
    },
    error: {
      title: "Sayfa Bulunamadı",
      notFound: "Aradığınız sayfa ya gizli ya da silinmiş olabilir.",
      home: "Ana Sayfaya Dön",
    },
    folderContent: {
      folder: "Klasör",
      itemsUnderFolder: ({ count }) => `Klasörün içinde ${count} sahife mevcut`,
    },
    tagContent: {
      tag: "Etiket",
      tagIndex: "Etiketler",
      itemsUnderTag: ({ count }) =>`Bu etikete sahip ${count} sahife`,
      showingFirst: ({ count }) => `İlk ${count} etiket`,
      totalTags: ({ count }) => `Toplam ${count} etiket`,
    },
  },
} as const satisfies Translation

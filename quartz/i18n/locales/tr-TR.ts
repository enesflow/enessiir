import { Translation } from "./definition"

export const LAST_MODIFIED_TR = "Cedîden tecdîd"
export const LAST_MODIFIED_TR_SHORT = "C.t."
export const BEFORE_TR = "evvel"

export default {
  propertyDefaults: {
    title: "Nâm-ı Meçhûl",
    description: "İzâh verilmemiş",
  },
  components: {
    callout: {
      note: "Tezkire",
      abstract: "Hulâsa",
      info: "Ma'lûmât",
      todo: "İcrâya",
      tip: "İrşâd",
      success: "Muvaffakiyet",
      question: "Suâl",
      warning: "İhtâr",
      failure: "Husrân",
      danger: "Hatar",
      bug: "Hata",
      example: "Misâl",
      quote: "İktibâs",
    },
    backlinks: {
      title: "Bu sahifeye rabt edenler",
      noBacklinksFound: "Rabt mevcûd değil",
    },
    themeToggle: {
      lightMode: "Nehârî hâl",
      darkMode: "Leylî hâl",
    },
    explorer: {
      title: "Sahifeler",
    },
    footer: {
      text: "Hüsn-i niyet ile yapıldı",
    },
    graph: {
      title: "Rabt Manzarası",
    },
    recentNotes: {
      title: "Cedîden ta’dîl olunan sahifeler",
      seeRemainingMore: ({ remaining }) => `${remaining} aded dahi gör →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `${targetSlug} nâmındaki sahifeden iktibâs`,
      linkToOriginal: "Asıl sahifeye rücû' et",
    },
    search: {
      title: "Tetebbû'",
      searchBarPlaceholder: "Tetebbû' eyle",
    },
    tableOfContents: {
      title: "Münderecât",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} dakîka kadar mütâlaa`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Cedîden ta’dîl olunan sahifeler",
      lastFewNotes: ({ count }) => `Cedîd ${count} sahife`,
    },
    error: {
      title: "Sahife Bulunamadı",
      notFound: "Aradığınız sahife ya mestûr yahut mahv olmuş olabilir.",
      home: "Esâs Sahifeye Rücû' Et",
    },
    folderContent: {
      folder: "Mahfaza",
      itemsUnderFolder: ({ count }) => `Mahfaza dâhilinde ${count} sahife mevcûddur`,
    },
    tagContent: {
      tag: "Alâmet",
      tagIndex: "Alâmetler",
      itemsUnderTag: ({ count }) => `Bu alâmeti hâiz ${count} sahife`,
      showingFirst: ({ count }) => `Evvelâ ${count} alâmet`,
      totalTags: ({ count }) => `Cem'an ${count} alâmet`,
    },
  },
} as const satisfies Translation

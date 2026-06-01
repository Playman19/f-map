export const mapConfig = {
  // Видимость и диапазон зумов для слоёв
  layers: {
    panoramas: {
      visible: true,
      zoomFrom: 8,
      zoomTo: 22,
    },
    sectionThreads: {
      visible: true,
      zoomFrom: 7,
      zoomTo: 22,
    },
    paymentThreads: {
      visible: true,
      zoomFrom: 7,
      zoomTo: 22,
    }
  },

  parts: {
    panorama: [
      {
        zoomFrom: 8,
        zoomTo: 12,
        label: false,
        likes: false,
      },
      {
        zoomFrom: 13,
        zoomTo: 22,
        label: true,
        likes: true,
      }
    ],
    sectionThreads: [
      {
        zoomFrom: 7,
        zoomTo: 9,
        icon: false,
      },
      {
        zoomFrom: 10,
        zoomTo: 11,
        icon: true,
      },
      {
        zoomFrom: 12,
        zoomTo: 22,
        icon: true,
      }
    ],
    paymentThreads: [
      {
        zoomFrom: 7,
        zoomTo: 9,
        icon: false,
        label: false,
        likes: false,
      },
      {
        zoomFrom: 10,
        zoomTo: 12,
        icon: true,
        label: false,
        likes: false,
      },
      {
        zoomFrom: 13,
        zoomTo: 22,
        icon: true,
        label: true,
        likes: true,
      }
    ]
  },

  // Размеры по диапазонам зума
  sizes: {
    panorama: {
      ranges: [
        {
          zoomFrom: 8,
          zoomTo: 9,

          outerRadius: 10,
          innerRadius: 7,
          iconSize: 16,
          iconScale: 1,

          labelFontSize: 13,
          labelOffsetX: 30,
          labelOffsetY: -4,

          likesFontSize: 11,
          likesOffsetX: 50,
          likesOffsetY: 12,
          likesIconSize: 1,
          likesAnchor: [-1.8, -0.22]
        },
        {
          zoomFrom: 10,
          zoomTo: 14,

          outerRadius: 17,
          innerRadius: 14,
          iconSize: 27,
          iconScale: 1,

          labelFontSize: 13,
          labelOffsetX: 30,
          labelOffsetY: -4,

          likesFontSize: 11,
          likesOffsetX: 50,
          likesOffsetY: 12,
          likesIconSize: 1,
          likesAnchor: [-1.8, -0.22]
        },
        {
          zoomFrom: 15,
          zoomTo: 17,

          outerRadius: 28,
          innerRadius: 22,
          iconSize: 36,
          iconScale: 1,

          labelFontSize: 14,
          labelOffsetX: 34,
          labelOffsetY: -4,

          likesFontSize: 10,
          likesOffsetX: 53,
          likesOffsetY: 15,
          likesIconSize: 1.1,
          likesAnchor: [-1.8, -0.22]
        },
        {
          zoomFrom: 18,
          zoomTo: 22,

          outerRadius: 32,
          innerRadius: 28,
          iconSize: 42,
          iconScale: 1.15,

          labelFontSize: 16,
          labelOffsetX: 40,
          labelOffsetY: -2,

          likesFontSize: 12,
          likesOffsetX: 60,
          likesOffsetY: 20,
          likesIconSize: 1.3,
          likesAnchor: [-1.8, -0.4]
        }
      ]
    },
    sectionThreads: {
      ranges: [
        {
          zoomFrom: 7,
          zoomTo: 9,
          outerRadius: 8,
          innerRadius: 6,
          iconScale: 0.3,
          tooltipFontSize: 10,
          tooltipPadding: [3, 6]
        },
        {
          zoomFrom: 10,
          zoomTo: 14,
          outerRadius: 12,
          innerRadius: 10,
          iconScale: 0.4,
          tooltipFontSize: 13,
          tooltipPadding: [8, 12]
        },
        {
          zoomFrom: 15,
          zoomTo: 17,
          outerRadius: 18,
          innerRadius: 15,
          iconScale: 0.6,
          tooltipFontSize: 14,
          tooltipPadding: [9, 13]
        },
        {
          zoomFrom: 18,
          zoomTo: 22,
          outerRadius: 20,
          innerRadius: 17,
          iconScale: 0.7,
          tooltipFontSize: 15,
          tooltipPadding: [10, 14]
        }
      ]
    },
    paymentThreads: {
      ranges: [
        {
          zoomFrom: 7,
          zoomTo: 9,
          outerRadius: 8,
          innerRadius: 6,
          iconScale: 0.45,
          labelFontSize: 9.5,
          labelOffsetX: 0,
          labelOffsetY: 16,
          likesIconSize: 0.7,        // scale
          likesAnchor: [1, -2.3],
          likesOffsetX: 4,
          likesOffsetY: 32,
          likesFontSize: 8
        },
        {
          zoomFrom: 10,
          zoomTo: 14,
          outerRadius: 12,
          innerRadius: 10,
          iconScale: 0.4,
          labelFontSize: 10,
          labelOffsetX: 0,
          labelOffsetY: 19,
          likesIconSize: 0.8,
          likesAnchor: [1, -2.5],
          likesOffsetX: 5,
          likesOffsetY: 39,
          likesFontSize: 9
        },
        {
          zoomFrom: 15,
          zoomTo: 17,
          outerRadius: 19,
          innerRadius: 16,
          iconScale: 0.65,
          labelFontSize: 12,
          labelOffsetX: 0,
          labelOffsetY: 23,
          likesIconSize: 1,
          likesAnchor: [1, -2.3],
          likesOffsetX: 6,
          likesOffsetY: 46,
          likesFontSize: 10
        },
        {
          zoomFrom: 18,
          zoomTo: 22,
          outerRadius: 22,
          innerRadius: 18.5,
          iconScale: 0.75,
          labelFontSize: 14,
          labelOffsetX: 0,
          labelOffsetY: 27,
          likesIconSize: 1.2,
          likesAnchor: [1, -2.3],
          likesOffsetX: 7,
          likesOffsetY: 55,
          likesFontSize: 11
        }
      ]
    }
  }
}
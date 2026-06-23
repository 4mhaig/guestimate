// AUTO-GENERADO por data-tools/scripts/build-catalog.js — no editar a mano.
// Catálogo de productos reales de Mercadona agrupados por necesidad.
// Regenerar tras un scrape:  cd data-tools && node scripts/build-catalog.js

export type ProductOption = {
  id: string;
  name: string;
  price: number;        // €/kg, €/L o €/ud (precio de referencia)
  unit: string;         // "kg" | "L" | "ud"
  packPrice: number | null;
  image: string | null;
};
export type CatalogSlot = {
  id: string;
  label: string;
  share: number;        // parte de la cantidad de la categoría
  cat?: string;         // categoría destino si difiere de la del item (p.ej. queso → embutido)
  options: ProductOption[];
};
export type BasicProduct = { name: string; price: number; image: string | null };

export const CATALOG: Record<string, CatalogSlot[]> = {
  "carne": [
    {
      "id": "pollo",
      "label": "Pollo",
      "share": 0.35,
      "options": [
        {
          "id": "25183",
          "name": "Jamoncitos de pollo congelados",
          "price": 3.1,
          "unit": "kg",
          "packPrice": 3.1,
          "image": "https://prod-mercadona.imgix.net/images/bebaada78c49c64b7dda4cf6b5726cf0.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2778",
          "name": "Jamoncitos de pollo",
          "price": 3.5,
          "unit": "kg",
          "packPrice": 3.22,
          "image": "https://prod-mercadona.imgix.net/images/bdb83c7c681de567327ae97747a5d2bf.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2781",
          "name": "Pollo entero",
          "price": 3.5,
          "unit": "kg",
          "packPrice": 6.65,
          "image": "https://prod-mercadona.imgix.net/images/cb8d3cd457f1c0c8bce835505ad77695.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2777",
          "name": "Contramuslos de pollo sin piel",
          "price": 4.2,
          "unit": "kg",
          "packPrice": 3.4,
          "image": "https://prod-mercadona.imgix.net/images/696ce36da90626d3a36ae59f056f32dc.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "25461",
          "name": "Jamoncitos de pollo certificado alimentado con un 50% de maíz",
          "price": 5.1,
          "unit": "kg",
          "packPrice": 4.33,
          "image": "https://prod-mercadona.imgix.net/images/82291d60737bff323929ac574270d112.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2788",
          "name": "Muslos de pollo deshuesados con piel",
          "price": 5.55,
          "unit": "kg",
          "packPrice": 2.78,
          "image": "https://prod-mercadona.imgix.net/images/8cfc723d78c28867e24d49022d5e0441.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "cerdo",
      "label": "Cerdo",
      "share": 0.35,
      "options": [
        {
          "id": "4590",
          "name": "Lomo de cerdo trozo",
          "price": 4.7,
          "unit": "kg",
          "packPrice": 4.56,
          "image": "https://prod-mercadona.imgix.net/images/ab6772608c4b8e26802aa494293ea5eb.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3554",
          "name": "Pieza cabeza lomo de cerdo",
          "price": 4.9,
          "unit": "kg",
          "packPrice": 5.63,
          "image": "https://prod-mercadona.imgix.net/images/c39c00367e195a300e334f9de7cff9b3.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "4900",
          "name": "Chuletas aguja de cerdo",
          "price": 5.15,
          "unit": "kg",
          "packPrice": 3.86,
          "image": "https://prod-mercadona.imgix.net/images/de21659e8cf73b2e5f49153bedcd394d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "6040",
          "name": "Longaniza magro fresca",
          "price": 6,
          "unit": "kg",
          "packPrice": 3.21,
          "image": "https://prod-mercadona.imgix.net/images/435b9b2aa7b8fcafab0c64763e5a5fe9.jpeg?fit=crop&h=300&w=300"
        },
        {
          "id": "13046",
          "name": "Secreto de cerdo",
          "price": 6.2,
          "unit": "kg",
          "packPrice": 4.28,
          "image": "https://prod-mercadona.imgix.net/images/3736924e8b6a3e6dd24a596cc3a0ece5.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3395",
          "name": "Filetes lomo de cerdo familiar",
          "price": 6.3,
          "unit": "kg",
          "packPrice": 5.67,
          "image": "https://prod-mercadona.imgix.net/images/7865223a99982e513a1e44182bf0edd4.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "ternera_pavo",
      "label": "Ternera / pavo",
      "share": 0.3,
      "options": [
        {
          "id": "4109",
          "name": "Filetes de pavo contramuslo",
          "price": 8.2,
          "unit": "kg",
          "packPrice": 4.92,
          "image": "https://prod-mercadona.imgix.net/images/88779ef73116788f4ae1cf681ffeeb04.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "14031",
          "name": "Filetes pechuga de pavo marinados extra tiernos",
          "price": 8.5,
          "unit": "kg",
          "packPrice": 5.1,
          "image": "https://prod-mercadona.imgix.net/images/318df4e871788930aa2ab0a668a236e9.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2794",
          "name": "Filetes pechuga de pavo",
          "price": 8.75,
          "unit": "kg",
          "packPrice": 5.16,
          "image": "https://prod-mercadona.imgix.net/images/c91b2f7aa5a6c53a62e40318e876dc06.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2861",
          "name": "Filetes hígado de vacuno",
          "price": 10.4,
          "unit": "kg",
          "packPrice": 4.58,
          "image": "https://prod-mercadona.imgix.net/images/24156fe6b0306feb2fce8d37151c4951.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2873",
          "name": "Burger de vacuno",
          "price": 10.93,
          "unit": "kg",
          "packPrice": 5.9,
          "image": "https://prod-mercadona.imgix.net/images/09de086f011cef23ee2910e3aa6e983d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2868",
          "name": "Preparado de carne picada vacuno",
          "price": 11,
          "unit": "kg",
          "packPrice": 5.5,
          "image": "https://prod-mercadona.imgix.net/images/9b98483e96624180d8a01e2f7e085f87.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "carne:familiar": [
    {
      "id": "pollo",
      "label": "Pollo",
      "share": 0.35,
      "options": [
        {
          "id": "25183",
          "name": "Jamoncitos de pollo congelados",
          "price": 3.1,
          "unit": "kg",
          "packPrice": 3.1,
          "image": "https://prod-mercadona.imgix.net/images/bebaada78c49c64b7dda4cf6b5726cf0.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2778",
          "name": "Jamoncitos de pollo",
          "price": 3.5,
          "unit": "kg",
          "packPrice": 3.22,
          "image": "https://prod-mercadona.imgix.net/images/bdb83c7c681de567327ae97747a5d2bf.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2781",
          "name": "Pollo entero",
          "price": 3.5,
          "unit": "kg",
          "packPrice": 6.65,
          "image": "https://prod-mercadona.imgix.net/images/cb8d3cd457f1c0c8bce835505ad77695.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2777",
          "name": "Contramuslos de pollo sin piel",
          "price": 4.2,
          "unit": "kg",
          "packPrice": 3.4,
          "image": "https://prod-mercadona.imgix.net/images/696ce36da90626d3a36ae59f056f32dc.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "25461",
          "name": "Jamoncitos de pollo certificado alimentado con un 50% de maíz",
          "price": 5.1,
          "unit": "kg",
          "packPrice": 4.33,
          "image": "https://prod-mercadona.imgix.net/images/82291d60737bff323929ac574270d112.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2788",
          "name": "Muslos de pollo deshuesados con piel",
          "price": 5.55,
          "unit": "kg",
          "packPrice": 2.78,
          "image": "https://prod-mercadona.imgix.net/images/8cfc723d78c28867e24d49022d5e0441.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "cerdo",
      "label": "Cerdo",
      "share": 0.35,
      "options": [
        {
          "id": "4590",
          "name": "Lomo de cerdo trozo",
          "price": 4.7,
          "unit": "kg",
          "packPrice": 4.56,
          "image": "https://prod-mercadona.imgix.net/images/ab6772608c4b8e26802aa494293ea5eb.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3554",
          "name": "Pieza cabeza lomo de cerdo",
          "price": 4.9,
          "unit": "kg",
          "packPrice": 5.63,
          "image": "https://prod-mercadona.imgix.net/images/c39c00367e195a300e334f9de7cff9b3.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "4900",
          "name": "Chuletas aguja de cerdo",
          "price": 5.15,
          "unit": "kg",
          "packPrice": 3.86,
          "image": "https://prod-mercadona.imgix.net/images/de21659e8cf73b2e5f49153bedcd394d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "6040",
          "name": "Longaniza magro fresca",
          "price": 6,
          "unit": "kg",
          "packPrice": 3.21,
          "image": "https://prod-mercadona.imgix.net/images/435b9b2aa7b8fcafab0c64763e5a5fe9.jpeg?fit=crop&h=300&w=300"
        },
        {
          "id": "13046",
          "name": "Secreto de cerdo",
          "price": 6.2,
          "unit": "kg",
          "packPrice": 4.28,
          "image": "https://prod-mercadona.imgix.net/images/3736924e8b6a3e6dd24a596cc3a0ece5.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3395",
          "name": "Filetes lomo de cerdo familiar",
          "price": 6.3,
          "unit": "kg",
          "packPrice": 5.67,
          "image": "https://prod-mercadona.imgix.net/images/7865223a99982e513a1e44182bf0edd4.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "ternera_pavo",
      "label": "Ternera / pavo",
      "share": 0.3,
      "options": [
        {
          "id": "4109",
          "name": "Filetes de pavo contramuslo",
          "price": 8.2,
          "unit": "kg",
          "packPrice": 4.92,
          "image": "https://prod-mercadona.imgix.net/images/88779ef73116788f4ae1cf681ffeeb04.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "14031",
          "name": "Filetes pechuga de pavo marinados extra tiernos",
          "price": 8.5,
          "unit": "kg",
          "packPrice": 5.1,
          "image": "https://prod-mercadona.imgix.net/images/318df4e871788930aa2ab0a668a236e9.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2794",
          "name": "Filetes pechuga de pavo",
          "price": 8.75,
          "unit": "kg",
          "packPrice": 5.16,
          "image": "https://prod-mercadona.imgix.net/images/c91b2f7aa5a6c53a62e40318e876dc06.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2861",
          "name": "Filetes hígado de vacuno",
          "price": 10.4,
          "unit": "kg",
          "packPrice": 4.58,
          "image": "https://prod-mercadona.imgix.net/images/24156fe6b0306feb2fce8d37151c4951.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2873",
          "name": "Burger de vacuno",
          "price": 10.93,
          "unit": "kg",
          "packPrice": 5.9,
          "image": "https://prod-mercadona.imgix.net/images/09de086f011cef23ee2910e3aa6e983d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2868",
          "name": "Preparado de carne picada vacuno",
          "price": 11,
          "unit": "kg",
          "packPrice": 5.5,
          "image": "https://prod-mercadona.imgix.net/images/9b98483e96624180d8a01e2f7e085f87.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "carne:cumple": [
    {
      "id": "empanados",
      "label": "Empanados y para picar",
      "share": 0.4,
      "options": [
        {
          "id": "63323",
          "name": "Nuggets de pollo Hacendado ultracongelados",
          "price": 5,
          "unit": "kg",
          "packPrice": 2.5,
          "image": "https://prod-mercadona.imgix.net/images/a83470c87a6d3342c96dd0a449237604.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "14298",
          "name": "San Jacobos de cerdo sin gluten",
          "price": 6.6,
          "unit": "kg",
          "packPrice": 2.64,
          "image": "https://prod-mercadona.imgix.net/images/496d5a9a9de7faa2cf2b14354963a567.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21235",
          "name": "Lagrimitas de pollo al limón empanadas sin gluten",
          "price": 8.4,
          "unit": "kg",
          "packPrice": 3.44,
          "image": "https://prod-mercadona.imgix.net/images/f9c43f2bec935f80a1bd2adb3b62216c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "17575",
          "name": "Tiras de pollo marinado empanadas chicken fries",
          "price": 8.4,
          "unit": "kg",
          "packPrice": 2.52,
          "image": "https://prod-mercadona.imgix.net/images/7fafe2d936735af1aeb576e10e31aa3e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "63007",
          "name": "Nuggets de pavo Hacendado ultracongelados",
          "price": 8.5,
          "unit": "kg",
          "packPrice": 3.4,
          "image": "https://prod-mercadona.imgix.net/images/2fdc9b83394eee29e89c2779fa919b6b.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "11687",
          "name": "Empanados de pollo picantes sin gluten",
          "price": 8.61,
          "unit": "kg",
          "packPrice": 3.1,
          "image": "https://prod-mercadona.imgix.net/images/dda158759a1d705e4090839daf4db91b.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "hamburguesas",
      "label": "Hamburguesas y salchichas",
      "share": 0.3,
      "options": [
        {
          "id": "35884",
          "name": "Hamburguesa de lomo de vacuno",
          "price": 16.67,
          "unit": "kg",
          "packPrice": 4,
          "image": "https://prod-mercadona.imgix.net/images/fb42955265ec4782f2e54200235d54ba.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "alitas",
      "label": "Alitas y jamoncitos",
      "share": 0.3,
      "options": [
        {
          "id": "25183",
          "name": "Jamoncitos de pollo congelados",
          "price": 3.1,
          "unit": "kg",
          "packPrice": 3.1,
          "image": "https://prod-mercadona.imgix.net/images/bebaada78c49c64b7dda4cf6b5726cf0.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "25184",
          "name": "Alas de pollo congeladas",
          "price": 3.2,
          "unit": "kg",
          "packPrice": 3.2,
          "image": "https://prod-mercadona.imgix.net/images/c57822e42dafc3bcab953b8755a6a40f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2778",
          "name": "Jamoncitos de pollo",
          "price": 3.5,
          "unit": "kg",
          "packPrice": 3.22,
          "image": "https://prod-mercadona.imgix.net/images/bdb83c7c681de567327ae97747a5d2bf.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2784",
          "name": "Alas de pollo",
          "price": 4.15,
          "unit": "kg",
          "packPrice": 3.78,
          "image": "https://prod-mercadona.imgix.net/images/9de7c0c7e523b36a96341a167d63aaf7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "52426",
          "name": "Alas de pollo barbacoa congeladas",
          "price": 4.93,
          "unit": "kg",
          "packPrice": 3.7,
          "image": "https://prod-mercadona.imgix.net/images/778aff71ecab4df9feea58e5b571d1c4.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2785",
          "name": "Alas partidas de pollo",
          "price": 5,
          "unit": "kg",
          "packPrice": 3,
          "image": "https://prod-mercadona.imgix.net/images/dc49d9d7c2badc6e75fc0efd12b078e0.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "carne:amigos": [
    {
      "id": "iberico",
      "label": "Ibéricos y embutido",
      "share": 0.5,
      "options": [
        {
          "id": "1564",
          "name": "Costilla de cerdo ibérico adobada",
          "price": 7.55,
          "unit": "kg",
          "packPrice": 3.78,
          "image": "https://prod-mercadona.imgix.net/images/af452ee749d0981858f5bfd393dccf15.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "59085",
          "name": "Salchichón extra Hacendado lonchas",
          "price": 8.13,
          "unit": "kg",
          "packPrice": 1.95,
          "image": "https://prod-mercadona.imgix.net/images/15e558ca440ad3f1a7f40d1f92c0d6da.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "58293",
          "name": "Jamón serrano Incarlopsa",
          "price": 9.56,
          "unit": "kg",
          "packPrice": 65,
          "image": "https://prod-mercadona.imgix.net/images/7d4f3e6af6728a424824294cc851940a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "58220",
          "name": "Panceta salada ibérica La Hacienda del ibérico",
          "price": 10,
          "unit": "kg",
          "packPrice": 3.6,
          "image": "https://prod-mercadona.imgix.net/images/e8def2c47d494dda5c777a09ad68ec64.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "23145",
          "name": "Chorizo sarta dulce extra de León Hacendado",
          "price": 12,
          "unit": "kg",
          "packPrice": 4.2,
          "image": "https://prod-mercadona.imgix.net/images/55f73ec8e2dc43d2b052f6caedde4caf.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "23146",
          "name": "Chorizo sarta picante extra de León Hacendado",
          "price": 12,
          "unit": "kg",
          "packPrice": 4.2,
          "image": "https://prod-mercadona.imgix.net/images/6fb54d37d3c626d7de58668ea3cac3cb.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "queso",
      "label": "Quesos",
      "share": 0.5,
      "options": [
        {
          "id": "51111",
          "name": "Queso curado y cheddar Hacendado en dados",
          "price": 9.2,
          "unit": "kg",
          "packPrice": 1.15,
          "image": "https://prod-mercadona.imgix.net/images/7219aeaaf255a484b871a06e9bbe1f85.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "50946",
          "name": "Queso semicurado mezcla Hacendado",
          "price": 9.41,
          "unit": "kg",
          "packPrice": 14.49,
          "image": "https://prod-mercadona.imgix.net/images/226430ffd0927fc4ab3c0f93831b5fe6.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "51630",
          "name": "Queso curado cheddar Hacendado",
          "price": 9.5,
          "unit": "kg",
          "packPrice": 2.85,
          "image": "https://prod-mercadona.imgix.net/images/c536cb9dab18824330d0a9958c08dd37.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "5774",
          "name": "Queso viejo intenso mezcla Hacendado",
          "price": 10,
          "unit": "kg",
          "packPrice": 15,
          "image": "https://prod-mercadona.imgix.net/images/aba568c145d8cae818512f099f908ac9.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "50968",
          "name": "Queso curado mezcla Hacendado",
          "price": 11.08,
          "unit": "kg",
          "packPrice": 18.06,
          "image": "https://prod-mercadona.imgix.net/images/1937043ae309b399e4cd49c262927674.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "50944",
          "name": "Queso semicurado mezcla Hacendado cortado en cuñitas",
          "price": 12.5,
          "unit": "kg",
          "packPrice": 4.25,
          "image": "https://prod-mercadona.imgix.net/images/0e7fc066a86aefbf2f47ae394c23d3cf.jpg?fit=crop&h=300&w=300"
        }
      ],
      "cat": "embutido"
    }
  ],
  "carne:nochebuena": [
    {
      "id": "cordero",
      "label": "Cordero / lechal",
      "share": 0.35,
      "options": [
        {
          "id": "21814",
          "name": "Trozos de cordero para guisar",
          "price": 12.5,
          "unit": "kg",
          "packPrice": 6.25,
          "image": "https://prod-mercadona.imgix.net/images/874e080c6030ece1445e23e9a57108aa.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2860",
          "name": "Filetes hígado de cordero",
          "price": 13,
          "unit": "kg",
          "packPrice": 4.42,
          "image": "https://prod-mercadona.imgix.net/images/d1cb99db6ba095cc639db66bc24e425a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21663",
          "name": "Garreta paletilla de cordero congelada",
          "price": 13.9,
          "unit": "kg",
          "packPrice": 6.67,
          "image": "https://prod-mercadona.imgix.net/images/b211700854706d94cb9705d8b38f4723.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "8839",
          "name": "Burger de cordero al romero",
          "price": 14.58,
          "unit": "kg",
          "packPrice": 3.5,
          "image": "https://prod-mercadona.imgix.net/images/ea1c49c71c2424324ad4ac73badbfedf.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "4073",
          "name": "Pierna de lechal entera congelada",
          "price": 16.9,
          "unit": "kg",
          "packPrice": 12.17,
          "image": "https://prod-mercadona.imgix.net/images/87f0b79255b638658bad75dce3139871.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "4361",
          "name": "Garretas brazuelo de cordero",
          "price": 16.95,
          "unit": "kg",
          "packPrice": 10.17,
          "image": "https://prod-mercadona.imgix.net/images/997eed5d60dad70322b642f9634bbde9.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "marisco",
      "label": "Marisco",
      "share": 0.35,
      "options": [
        {
          "id": "60874",
          "name": "Almeja Hacendado congelada",
          "price": 4,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/5077ee2d933dcad572b8a81e0ade8a2f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "85499",
          "name": "Mejillón mediterráneo",
          "price": 5.8,
          "unit": "kg",
          "packPrice": 5.8,
          "image": "https://prod-mercadona.imgix.net/images/6d35f871fd522a7138410fba1d291b1f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "35900",
          "name": "Salteado de gambas, espárragos verdes, ajos tiernos, champiñón y cebolla Hacendado ultracongelado",
          "price": 6.44,
          "unit": "kg",
          "packPrice": 2.9,
          "image": "https://prod-mercadona.imgix.net/images/77aaa4c3dcbd08ce70f4e5626000c420.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "62401",
          "name": "Mejillón de Chile entero cocido Hacendado ultracongelado",
          "price": 7.22,
          "unit": "kg",
          "packPrice": 3.25,
          "image": "https://prod-mercadona.imgix.net/images/b4e4b2663ea1d17228e8500f39b911d3.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "62396",
          "name": "Carne de mejillón de Chile cocido Hacendado ultracongelado",
          "price": 9.09,
          "unit": "kg",
          "packPrice": 2.5,
          "image": "https://prod-mercadona.imgix.net/images/0166a818db1acd99b8a10c4338f2f09e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "24712",
          "name": "Langostino crudo Hacendado ultracongelado",
          "price": 9.92,
          "unit": "kg",
          "packPrice": 5.95,
          "image": "https://prod-mercadona.imgix.net/images/c48b090bf241f8eb71d0d3aa2fc36bed.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "iberico_premium",
      "label": "Ibérico y solomillo",
      "share": 0.3,
      "options": [
        {
          "id": "13046",
          "name": "Secreto de cerdo",
          "price": 6.2,
          "unit": "kg",
          "packPrice": 4.28,
          "image": "https://prod-mercadona.imgix.net/images/3736924e8b6a3e6dd24a596cc3a0ece5.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "12793",
          "name": "Filetes secreto de cerdo",
          "price": 6.9,
          "unit": "kg",
          "packPrice": 3.24,
          "image": "https://prod-mercadona.imgix.net/images/149f82ef7720bdb5e5037e38dd57cb72.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "1564",
          "name": "Costilla de cerdo ibérico adobada",
          "price": 7.55,
          "unit": "kg",
          "packPrice": 3.78,
          "image": "https://prod-mercadona.imgix.net/images/af452ee749d0981858f5bfd393dccf15.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "25353",
          "name": "Solomillo de pavo marinado congelado",
          "price": 7.8,
          "unit": "kg",
          "packPrice": 3.12,
          "image": "https://prod-mercadona.imgix.net/images/5bb818d0e9762e82d926efb3ce16c8a9.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2228",
          "name": "Solomillo de cerdo marinado congelado",
          "price": 7.8,
          "unit": "kg",
          "packPrice": 6.24,
          "image": "https://prod-mercadona.imgix.net/images/ca9de27c3cc48047eb795200ae5f5a5f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "4570",
          "name": "Solomillo de cerdo",
          "price": 7.8,
          "unit": "kg",
          "packPrice": 4.29,
          "image": "https://prod-mercadona.imgix.net/images/0504638a2f1bac483d0b58a3017fb59e.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "ensalada:nochebuena": [
    {
      "id": "hoja",
      "label": "Ensalada festiva",
      "share": 0.4,
      "options": [
        {
          "id": "69706",
          "name": "Ensalada mezcla 4 estaciones lavada",
          "price": 3.4,
          "unit": "kg",
          "packPrice": 0.85,
          "image": "https://prod-mercadona.imgix.net/images/521b7ea477692d5b5ae5835f2aea842c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69670",
          "name": "Lechuga iceberg cortada y lavada",
          "price": 3.8,
          "unit": "kg",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/d4731916c523231e46eca0ff925913c7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3858",
          "name": "Aguacates",
          "price": 4.7,
          "unit": "kg",
          "packPrice": 3.43,
          "image": "https://prod-mercadona.imgix.net/images/3626a39afce23381b73d55fb7a4a3c7d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3830",
          "name": "Aguacate",
          "price": 5,
          "unit": "kg",
          "packPrice": 1.15,
          "image": "https://prod-mercadona.imgix.net/images/b1dee7e254871996d81c69a656fa4304.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69756",
          "name": "Ensalada de la casa",
          "price": 5.38,
          "unit": "kg",
          "packPrice": 2.15,
          "image": "https://prod-mercadona.imgix.net/images/eaf6f2fa935a7a3cfb2e68ffad1e6230.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69435",
          "name": "Lechuga romana cortada y lavada",
          "price": 5.75,
          "unit": "kg",
          "packPrice": 1.15,
          "image": "https://prod-mercadona.imgix.net/images/de27c05991934ccea736560b54d21694.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "marisco_entrante",
      "label": "Marisco para entrante",
      "share": 0.6,
      "options": [
        {
          "id": "24712",
          "name": "Langostino crudo Hacendado ultracongelado",
          "price": 9.92,
          "unit": "kg",
          "packPrice": 5.95,
          "image": "https://prod-mercadona.imgix.net/images/c48b090bf241f8eb71d0d3aa2fc36bed.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "63144",
          "name": "Langostino caballitos rebozados Hacendado ultracongelados",
          "price": 10.83,
          "unit": "kg",
          "packPrice": 3.25,
          "image": "https://prod-mercadona.imgix.net/images/c1311c0c6d0ca23b106986ff1efa861d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "83490",
          "name": "Langostino cocido",
          "price": 10.95,
          "unit": "kg",
          "packPrice": 1084.05,
          "image": "https://prod-mercadona.imgix.net/images/503eb7e89f381ca03a139660f538c741.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "24260",
          "name": "Gambón grande congelado",
          "price": 11.5,
          "unit": "kg",
          "packPrice": 23,
          "image": "https://prod-mercadona.imgix.net/images/9864551ce758918f786ed66e94fc8803.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "87789",
          "name": "Salpicón de marisco Hacendado",
          "price": 12.2,
          "unit": "kg",
          "packPrice": 4.88,
          "image": "https://prod-mercadona.imgix.net/images/4ca6c21639a4a29671afa6eb85b1e89f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "24147",
          "name": "Gambón congelado",
          "price": 12.95,
          "unit": "kg",
          "packPrice": 1282.05,
          "image": "https://prod-mercadona.imgix.net/images/8a6cce24488444736497d91a7a5ec404.jpg?fit=crop&h=300&w=300"
        }
      ],
      "cat": "entrante"
    },
    {
      "id": "tabla",
      "label": "Tabla de ibéricos y queso",
      "share": 0.5,
      "options": [
        {
          "id": "59218",
          "name": "Jamón de pavo Hacendado",
          "price": 5.7,
          "unit": "kg",
          "packPrice": 2.85,
          "image": "https://prod-mercadona.imgix.net/images/0a4b8f824e5ea4032abcee4e75a9092a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "16395",
          "name": "Jamón cocido Hacendado finas lonchas",
          "price": 7.44,
          "unit": "kg",
          "packPrice": 3.35,
          "image": "https://prod-mercadona.imgix.net/images/0f16e8abbab2f0b541b78637ef537886.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "13988",
          "name": "Jamón cocido sándwich Hacendado lonchas",
          "price": 7.8,
          "unit": "kg",
          "packPrice": 1.95,
          "image": "https://prod-mercadona.imgix.net/images/e6c15c62c66813c46d54d02f26fba2ea.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "16352",
          "name": "Jamón cocido jugoso Hacendado lonchas",
          "price": 7.8,
          "unit": "kg",
          "packPrice": 1.95,
          "image": "https://prod-mercadona.imgix.net/images/19ad97cd414b1842a50c9f72d1e8da99.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "56619",
          "name": "Jamón de pavo Hacendado finas lonchas",
          "price": 8.44,
          "unit": "kg",
          "packPrice": 1.9,
          "image": "https://prod-mercadona.imgix.net/images/b7691fb2718bc66ad695bb0454823efe.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "51111",
          "name": "Queso curado y cheddar Hacendado en dados",
          "price": 9.2,
          "unit": "kg",
          "packPrice": 1.15,
          "image": "https://prod-mercadona.imgix.net/images/7219aeaaf255a484b871a06e9bbe1f85.jpg?fit=crop&h=300&w=300"
        }
      ],
      "cat": "embutido"
    }
  ],
  "snacks:cumple": [
    {
      "id": "patatas_fritas",
      "label": "Patatas fritas y chips",
      "share": 0.4,
      "options": [
        {
          "id": "22245",
          "name": "Patatas fritas clásicas Hacendado",
          "price": 6,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/daa5379864f490d809e6272ea964a119.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33640",
          "name": "Nachos Hacendado",
          "price": 6,
          "unit": "kg",
          "packPrice": 0.9,
          "image": "https://prod-mercadona.imgix.net/images/5ea6209ff18125614b1c278484587d91.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "16387",
          "name": "Nachos Padrísimos Hacendado sabor guacamole",
          "price": 6.33,
          "unit": "kg",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/b8ef2dc650a5f2dd7f83fd1ba50493ec.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33641",
          "name": "Nachos tex-mex sabor queso Hacendado",
          "price": 6.33,
          "unit": "kg",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/b8c009cd61e6c9824fa9743f5515c872.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "15589",
          "name": "Patatas fritas corte ondulado Hacendado",
          "price": 7.33,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/edc2fc7f9b7e7a1447cce4255b0b66f2.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33624",
          "name": "Patatas fritas paja Hacendado",
          "price": 7.5,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/041e7b535d424e28406da126b2ef7656.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "palomitas",
      "label": "Palomitas y gusanitos",
      "share": 0.35,
      "options": [
        {
          "id": "14347",
          "name": "Maíz palomitas Hacendado",
          "price": 3.5,
          "unit": "kg",
          "packPrice": 1.05,
          "image": "https://prod-mercadona.imgix.net/images/49e0537f51ab71a7a023fa71695d6b94.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34822",
          "name": "Palomitas de maíz con sal Hacendado para microondas",
          "price": 4.07,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/8c805bca1beb58b91fccd2eba51e18e5.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34212",
          "name": "Palomitas de maíz sabor mantequilla Hacendado para microondas",
          "price": 4.44,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/f8ea8d436cfb80f7e563563cbe8b9316.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34811",
          "name": "Palomitas caramelo Hacendado",
          "price": 12.5,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/54f08a75c350854e471b9f2b73b92a5d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21927",
          "name": "Torreznillos Hacendado cortezas de cerdo fritas ahumadas",
          "price": 14,
          "unit": "kg",
          "packPrice": 1.4,
          "image": "https://prod-mercadona.imgix.net/images/6d8ab14d34ccb702f9174a302a060cd7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33436",
          "name": "Cortezas de cerdo fritas sabor barbacoa Hacendado",
          "price": 14,
          "unit": "kg",
          "packPrice": 1.4,
          "image": "https://prod-mercadona.imgix.net/images/08e4903c5a8ef889943ea30bb29a11a7.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "frutos_secos",
      "label": "Frutos secos",
      "share": 0.25,
      "options": [
        {
          "id": "34820",
          "name": "Cacahuete frito con sal Hacendado pelado",
          "price": 3.6,
          "unit": "kg",
          "packPrice": 0.9,
          "image": "https://prod-mercadona.imgix.net/images/621404b6085cae9938997dd3f360b029.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34031",
          "name": "Cacahuete tostado Hacendado 0% sal añadida",
          "price": 3.88,
          "unit": "kg",
          "packPrice": 1.55,
          "image": "https://prod-mercadona.imgix.net/images/09cec547e9ac6bbfa54ada3a03176248.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34016",
          "name": "Cacahuete tostado con sal Hacendado",
          "price": 4.13,
          "unit": "kg",
          "packPrice": 1.65,
          "image": "https://prod-mercadona.imgix.net/images/b335759dffb927abd3ea0b2c13deafa9.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34868",
          "name": "Cacahuete frito y salado Hacendado con piel",
          "price": 5.2,
          "unit": "kg",
          "packPrice": 1.3,
          "image": "https://prod-mercadona.imgix.net/images/9ba31472c3bc97cad3c8f6bce8181942.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "13451",
          "name": "Cacahuete tostado Hacendado pelado 0% sal añadida",
          "price": 5.25,
          "unit": "kg",
          "packPrice": 1.05,
          "image": "https://prod-mercadona.imgix.net/images/f5e73affd444299e58abcbc5e146cb93.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34143",
          "name": "Cacahuete frito con miel Hacendado",
          "price": 8.25,
          "unit": "kg",
          "packPrice": 1.65,
          "image": "https://prod-mercadona.imgix.net/images/20cdbdad2299b5137ae62ab0be42c1d5.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "snacks:nochebuena": [
    {
      "id": "frutos_secos",
      "label": "Frutos secos premium",
      "share": 0.4,
      "options": [
        {
          "id": "34606",
          "name": "Nuez natural Hacendado",
          "price": 6.17,
          "unit": "kg",
          "packPrice": 3.7,
          "image": "https://prod-mercadona.imgix.net/images/d1899ae163ff39ebd4f7f1896a0478a7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34865",
          "name": "Almendra natural Hacendado",
          "price": 11.5,
          "unit": "kg",
          "packPrice": 2.3,
          "image": "https://prod-mercadona.imgix.net/images/b0be61b365cd2b6090deafd0a6ad9e41.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "11960",
          "name": "Almendra tostada y salada Hacendado con piel",
          "price": 12,
          "unit": "kg",
          "packPrice": 2.4,
          "image": "https://prod-mercadona.imgix.net/images/43d5b21b2cbc97b548532678e85163c1.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "52667",
          "name": "Nuez troceada pelada Hacendado",
          "price": 12,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/223353d93f6722ac2d0e2cc02cf63627.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34024",
          "name": "Nuez natural Hacendado pelada",
          "price": 12.5,
          "unit": "kg",
          "packPrice": 2.5,
          "image": "https://prod-mercadona.imgix.net/images/de768af5358346867a912d57ec96b69c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "23365",
          "name": "Anacardo natural Hacendado",
          "price": 13.5,
          "unit": "kg",
          "packPrice": 2.7,
          "image": "https://prod-mercadona.imgix.net/images/2ae6ffebda4166b4a4a860bf81c47378.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "aceitunas",
      "label": "Aceitunas y encurtidos",
      "share": 0.3,
      "options": [
        {
          "id": "5480",
          "name": "Pepinillos agridulces Hacendado",
          "price": 2.24,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/b7077958ad551c3f823ac44034cd1f67.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33026",
          "name": "Mix de pepinillos y cebollitas Hacendado",
          "price": 2.76,
          "unit": "kg",
          "packPrice": 1.85,
          "image": "https://prod-mercadona.imgix.net/images/514932d49e6bf9d404520b71bb8b5267.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "22910",
          "name": "Aceitunas verdes rellenas de anchoa Hacendado",
          "price": 2.86,
          "unit": "kg",
          "packPrice": 3,
          "image": "https://prod-mercadona.imgix.net/images/a8be4414722e79192b356a7f3ababbc0.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "13422",
          "name": "Aceitunas verdes estilo casero Hacendado partidas aliñadas",
          "price": 2.91,
          "unit": "kg",
          "packPrice": 2.85,
          "image": "https://prod-mercadona.imgix.net/images/0b6b3e69cf64b9e6102907f8479405bc.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "80177",
          "name": "Aceitunas verdes Gazpacha Hacendado partidas",
          "price": 2.99,
          "unit": "kg",
          "packPrice": 2.5,
          "image": "https://prod-mercadona.imgix.net/images/2ca6159e86382b902ad76812992cf802.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "52734",
          "name": "Aceitunas negras sin hueso Hacendado",
          "price": 3,
          "unit": "kg",
          "packPrice": 1.05,
          "image": "https://prod-mercadona.imgix.net/images/8ea381beaef3459b5bc9a08d9eabf509.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "picos",
      "label": "Picos y regañás",
      "share": 0.3,
      "options": [
        {
          "id": "82287",
          "name": "Pan tostado classic Hacendado",
          "price": 3.09,
          "unit": "kg",
          "packPrice": 1.7,
          "image": "https://prod-mercadona.imgix.net/images/1d7a425e6f2f3c735d48c7c2393f0fbf.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "86008",
          "name": "Pan tostado 100% integral",
          "price": 3.27,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/5de413d561d2f5a1df428beaeb6746cb.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "83789",
          "name": "Pan tostado 100% integral bajo en sal y en azúcares Hacendado",
          "price": 4.07,
          "unit": "kg",
          "packPrice": 2.2,
          "image": "https://prod-mercadona.imgix.net/images/04649845ba2e5c3286480fb1c73d84f7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "82290",
          "name": "Pan tostado cereales y semillas Hacendado",
          "price": 4.09,
          "unit": "kg",
          "packPrice": 2.25,
          "image": "https://prod-mercadona.imgix.net/images/804d415f8f4701b031f6662c2ba6ae52.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "82842",
          "name": "Pan tostado 100% espelta integral Hacendado",
          "price": 6,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/72a54e7ef736024a01f13af1eb3e3f5b.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "82190",
          "name": "Pan tostado con tomate Hacendado",
          "price": 7.65,
          "unit": "kg",
          "packPrice": 1.3,
          "image": "https://prod-mercadona.imgix.net/images/6e9f47916f81a70709740fc6f61d703d.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "carne:barbacoa": [
    {
      "id": "embutido_bbq",
      "label": "Para la parrilla (chorizo, salchichas)",
      "share": 0.3,
      "options": [
        {
          "id": "6044",
          "name": "Butifarra fresca",
          "price": 5.4,
          "unit": "kg",
          "packPrice": 3.46,
          "image": "https://prod-mercadona.imgix.net/images/725678a552c6bc61ff7fc8ead5003d80.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "6043",
          "name": "Longaniza fresca sin tripa",
          "price": 5.63,
          "unit": "kg",
          "packPrice": 3.15,
          "image": "https://prod-mercadona.imgix.net/images/fe4d83378f79d9ad0509b46e5916226f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "6040",
          "name": "Longaniza magro fresca",
          "price": 6,
          "unit": "kg",
          "packPrice": 3.21,
          "image": "https://prod-mercadona.imgix.net/images/435b9b2aa7b8fcafab0c64763e5a5fe9.jpeg?fit=crop&h=300&w=300"
        },
        {
          "id": "6048",
          "name": "Chorizo oreado",
          "price": 6.9,
          "unit": "kg",
          "packPrice": 2.48,
          "image": "https://prod-mercadona.imgix.net/images/e57f9a3c9969167182a14b78559d511d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "6041",
          "name": "Longaniza fresca de pollo",
          "price": 7.25,
          "unit": "kg",
          "packPrice": 3.99,
          "image": "https://prod-mercadona.imgix.net/images/9509b9d588cb37aca8f104bac1f6c1c1.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "17554",
          "name": "Longaniza fresca corazón de chistorra",
          "price": 7.26,
          "unit": "kg",
          "packPrice": 2.25,
          "image": "https://prod-mercadona.imgix.net/images/c86ceff7b8c31ae6e34789358bc8220c.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "panceta",
      "label": "Panceta y secreto",
      "share": 0.2,
      "options": [
        {
          "id": "35286",
          "name": "Costilla de cerdo churrasco",
          "price": 5,
          "unit": "kg",
          "packPrice": 4.1,
          "image": "https://prod-mercadona.imgix.net/images/381b5c4827de021999445f0094d97092.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2815",
          "name": "Panceta de cerdo",
          "price": 5.5,
          "unit": "kg",
          "packPrice": 3.24,
          "image": "https://prod-mercadona.imgix.net/images/d3aebc50f3c2fdb3bbf81d728bc5c7e1.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "13046",
          "name": "Secreto de cerdo",
          "price": 6.2,
          "unit": "kg",
          "packPrice": 4.28,
          "image": "https://prod-mercadona.imgix.net/images/3736924e8b6a3e6dd24a596cc3a0ece5.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "8994",
          "name": "Panceta fina sin corteza corte fino",
          "price": 6.3,
          "unit": "kg",
          "packPrice": 3.15,
          "image": "https://prod-mercadona.imgix.net/images/08bf58abb7410ead517447e4f8d06a11.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "17458",
          "name": "Costillas de cerdo marinadas Smoke Honey",
          "price": 6.5,
          "unit": "kg",
          "packPrice": 5.85,
          "image": "https://prod-mercadona.imgix.net/images/45115582466db86abe80236f9e3b98a0.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "12793",
          "name": "Filetes secreto de cerdo",
          "price": 6.9,
          "unit": "kg",
          "packPrice": 3.24,
          "image": "https://prod-mercadona.imgix.net/images/149f82ef7720bdb5e5037e38dd57cb72.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "pollo_bbq",
      "label": "Pollo (alas, muslos)",
      "share": 0.25,
      "options": [
        {
          "id": "25183",
          "name": "Jamoncitos de pollo congelados",
          "price": 3.1,
          "unit": "kg",
          "packPrice": 3.1,
          "image": "https://prod-mercadona.imgix.net/images/bebaada78c49c64b7dda4cf6b5726cf0.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "25184",
          "name": "Alas de pollo congeladas",
          "price": 3.2,
          "unit": "kg",
          "packPrice": 3.2,
          "image": "https://prod-mercadona.imgix.net/images/c57822e42dafc3bcab953b8755a6a40f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2778",
          "name": "Jamoncitos de pollo",
          "price": 3.5,
          "unit": "kg",
          "packPrice": 3.22,
          "image": "https://prod-mercadona.imgix.net/images/bdb83c7c681de567327ae97747a5d2bf.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2784",
          "name": "Alas de pollo",
          "price": 4.15,
          "unit": "kg",
          "packPrice": 3.78,
          "image": "https://prod-mercadona.imgix.net/images/9de7c0c7e523b36a96341a167d63aaf7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2777",
          "name": "Contramuslos de pollo sin piel",
          "price": 4.2,
          "unit": "kg",
          "packPrice": 3.4,
          "image": "https://prod-mercadona.imgix.net/images/696ce36da90626d3a36ae59f056f32dc.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "52426",
          "name": "Alas de pollo barbacoa congeladas",
          "price": 4.93,
          "unit": "kg",
          "packPrice": 3.7,
          "image": "https://prod-mercadona.imgix.net/images/778aff71ecab4df9feea58e5b571d1c4.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "chuletas_bbq",
      "label": "Chuletas y cinta",
      "share": 0.25,
      "options": [
        {
          "id": "4590",
          "name": "Lomo de cerdo trozo",
          "price": 4.7,
          "unit": "kg",
          "packPrice": 4.56,
          "image": "https://prod-mercadona.imgix.net/images/ab6772608c4b8e26802aa494293ea5eb.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3554",
          "name": "Pieza cabeza lomo de cerdo",
          "price": 4.9,
          "unit": "kg",
          "packPrice": 5.63,
          "image": "https://prod-mercadona.imgix.net/images/c39c00367e195a300e334f9de7cff9b3.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "4900",
          "name": "Chuletas aguja de cerdo",
          "price": 5.15,
          "unit": "kg",
          "packPrice": 3.86,
          "image": "https://prod-mercadona.imgix.net/images/de21659e8cf73b2e5f49153bedcd394d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3395",
          "name": "Filetes lomo de cerdo familiar",
          "price": 6.3,
          "unit": "kg",
          "packPrice": 5.67,
          "image": "https://prod-mercadona.imgix.net/images/7865223a99982e513a1e44182bf0edd4.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2817",
          "name": "Filetes lomo de cerdo cabeza",
          "price": 6.3,
          "unit": "kg",
          "packPrice": 4.22,
          "image": "https://prod-mercadona.imgix.net/images/2b88a5d154cc77e60b79bf3265a31886.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "5046",
          "name": "Filetes lomo de cerdo adobado familiar",
          "price": 6.7,
          "unit": "kg",
          "packPrice": 6.5,
          "image": "https://prod-mercadona.imgix.net/images/55cc474c76c30984dc63a16c30fcbc67.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "bebida_sin": [
    {
      "id": "agua",
      "label": "Agua",
      "share": 0.4,
      "options": [
        {
          "id": "28060",
          "name": "Agua mineral grande Cortes",
          "price": 0.12,
          "unit": "L",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/a56c2febe9cc111eea5a2ac8e8a4ac5e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "28035",
          "name": "Agua mineral grande Bronchales",
          "price": 0.22,
          "unit": "L",
          "packPrice": 1.3,
          "image": "https://prod-mercadona.imgix.net/images/66cc0d02f8e7c1ae6820ce725f05e80d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "27366",
          "name": "Agua mineral con gas grande Cortes",
          "price": 0.28,
          "unit": "L",
          "packPrice": 2.52,
          "image": "https://prod-mercadona.imgix.net/images/fa7dcf7dc5c26c68c38732434a265307.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "28163",
          "name": "Agua mineral mediana Cortes",
          "price": 0.4,
          "unit": "L",
          "packPrice": 2.4,
          "image": "https://prod-mercadona.imgix.net/images/d3c27c809d17bdd7b014dad7367586d6.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "27099",
          "name": "Agua mineral grande Nestlé Aquarel",
          "price": 0.43,
          "unit": "L",
          "packPrice": 3.84,
          "image": "https://prod-mercadona.imgix.net/images/d02509f9e8333a2b1d8e4c7374cad7cc.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "27350",
          "name": "Agua mineral grande Font Vella",
          "price": 0.45,
          "unit": "L",
          "packPrice": 4.02,
          "image": "https://prod-mercadona.imgix.net/images/ea42298110c6953182756caa154348b4.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "cola",
      "label": "Refresco de cola",
      "share": 0.25,
      "options": [
        {
          "id": "21726",
          "name": "Refresco cola Hacendado",
          "price": 0.4,
          "unit": "L",
          "packPrice": 0.8,
          "image": "https://prod-mercadona.imgix.net/images/e697da36545134c5c50793be2cfced25.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21727",
          "name": "Refresco cola Hacendado Zero azúcar",
          "price": 0.4,
          "unit": "L",
          "packPrice": 0.8,
          "image": "https://prod-mercadona.imgix.net/images/e88849d77216b93600f223dca6787f5f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21728",
          "name": "Refresco cola Hacendado Zero azúcar Zero cafeína",
          "price": 0.4,
          "unit": "L",
          "packPrice": 0.8,
          "image": "https://prod-mercadona.imgix.net/images/f3ccc812d31b177eef706eee431b0f72.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "27348",
          "name": "Refresco Coca-Cola",
          "price": 0.95,
          "unit": "L",
          "packPrice": 3.8,
          "image": "https://prod-mercadona.imgix.net/images/1c6c9390743b38ad5042c4428763a88c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21717",
          "name": "Refresco cola Hacendado Zero Zero",
          "price": 1.06,
          "unit": "L",
          "packPrice": 0.35,
          "image": "https://prod-mercadona.imgix.net/images/f1cfcf378f222147d5581ac4fec9ba00.jpeg?fit=crop&h=300&w=300"
        },
        {
          "id": "27426",
          "name": "Refresco Coca-Cola Zero azúcar",
          "price": 2.82,
          "unit": "L",
          "packPrice": 11.16,
          "image": "https://prod-mercadona.imgix.net/images/0557fbb5328fa0b9a406c1e7e53942a2.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "naranja_limon",
      "label": "Refresco naranja / limón",
      "share": 0.2,
      "options": [
        {
          "id": "21733",
          "name": "Gaseosa grande Hacendado",
          "price": 0.37,
          "unit": "L",
          "packPrice": 0.55,
          "image": "https://prod-mercadona.imgix.net/images/24c4eeaae78fda9ffb5b645c2b7a86db.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21730",
          "name": "Refresco de naranja Hacendado zero fresh gas",
          "price": 0.45,
          "unit": "L",
          "packPrice": 0.9,
          "image": "https://prod-mercadona.imgix.net/images/fae53120acde5d1df2d940ad1602358a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "29077",
          "name": "Refresco de limón Hacendado fresh gas",
          "price": 0.48,
          "unit": "L",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/5980897555c596c0be6e8deb03b59448.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "29078",
          "name": "Refresco de limón Hacendado zero azúcar fresh gas",
          "price": 0.48,
          "unit": "L",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/2fc81aa7e37e64f63645de05330d3530.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21731",
          "name": "Refresco lima limón Hacendado fresh gas",
          "price": 0.48,
          "unit": "L",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/9f59c0b0c7041d1c46eae3c39c683eff.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21725",
          "name": "Refresco lima limón Hacendado zero azúcar fresh gas",
          "price": 0.48,
          "unit": "L",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/faec9ceb12f30801af0e4514d192ba01.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "zumo",
      "label": "Zumo",
      "share": 0.15,
      "options": [
        {
          "id": "39650",
          "name": "Bebida de zumo de naranja, mango y zanahoria La Verja sin azúcares añadidos",
          "price": 1.2,
          "unit": "L",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/9e831867eb7ecbe0e8516d377d919b33.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21784",
          "name": "Zumo maracuyá y chía Hacendado",
          "price": 6.6,
          "unit": "L",
          "packPrice": 1.65,
          "image": "https://prod-mercadona.imgix.net/images/a2a591a0b1f504dc9a7fd9cfacf5a147.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "bebida_con": [
    {
      "id": "cerveza",
      "label": "Cerveza",
      "share": 0.6,
      "options": [
        {
          "id": "66485",
          "name": "Cerveza Suave Steinburg",
          "price": 0.85,
          "unit": "L",
          "packPrice": 3.36,
          "image": "https://prod-mercadona.imgix.net/images/e566367824b8fe4185055aedb4d83593.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "66462",
          "name": "Cerveza Clásica Steinburg",
          "price": 0.91,
          "unit": "L",
          "packPrice": 3.6,
          "image": "https://prod-mercadona.imgix.net/images/edea0600aa5ac68f9de33f1b26988212.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "12033",
          "name": "Cerveza especial Steinburg",
          "price": 1.06,
          "unit": "L",
          "packPrice": 4.2,
          "image": "https://prod-mercadona.imgix.net/images/69ce79c6820a8d441d46eab8d1d72e45.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "66770",
          "name": "Cerveza Shandy Steinburg sabor limón",
          "price": 1.09,
          "unit": "L",
          "packPrice": 4.32,
          "image": "https://prod-mercadona.imgix.net/images/4a7e98cfb9de7424b7c74bd549577096.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21742",
          "name": "Cerveza Radler Steinburg con zumo natural de limón",
          "price": 1.24,
          "unit": "L",
          "packPrice": 3.69,
          "image": "https://prod-mercadona.imgix.net/images/9a403e55ff089dd8b4efe695cf263431.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "66026",
          "name": "Cerveza especial San Miguel",
          "price": 1.36,
          "unit": "L",
          "packPrice": 5.4,
          "image": "https://prod-mercadona.imgix.net/images/6a40d9f7a5b3633f5058967c22eefc30.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "vino",
      "label": "Vino",
      "share": 0.4,
      "options": [
        {
          "id": "66127",
          "name": "Vino blanco Casón Histórico",
          "price": 0.95,
          "unit": "L",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/cba9111659578a10cba501895fc1280a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "66211",
          "name": "Vino tinto Casón Histórico",
          "price": 1.15,
          "unit": "L",
          "packPrice": 1.15,
          "image": "https://prod-mercadona.imgix.net/images/56eed41e72e962baa1281e437e9b6ea8.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "37808",
          "name": "Vino tinto Dominio de Borgia",
          "price": 1.45,
          "unit": "L",
          "packPrice": 2.9,
          "image": "https://prod-mercadona.imgix.net/images/ba26a20b34811a8702d1d91134e4614f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "37802",
          "name": "Vino rosado Dominio de Borgia",
          "price": 1.5,
          "unit": "L",
          "packPrice": 3,
          "image": "https://prod-mercadona.imgix.net/images/b601a30f51db85458c981667c27a8e5c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "66105",
          "name": "Vino blanco Don Simón",
          "price": 1.7,
          "unit": "L",
          "packPrice": 1.7,
          "image": "https://prod-mercadona.imgix.net/images/b8af2033139edf4fa58547b2a9fadee4.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "66107",
          "name": "Vino tinto Don Simón",
          "price": 1.7,
          "unit": "L",
          "packPrice": 1.7,
          "image": "https://prod-mercadona.imgix.net/images/24909556ddfbd13df0eaf7b80cbada90.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "pan": [
    {
      "id": "pan",
      "label": "Pan",
      "share": 1,
      "options": [
        {
          "id": "83203.1",
          "name": "3 Barras de pan",
          "price": 1.59,
          "unit": "kg",
          "packPrice": 1.19,
          "image": "https://prod-mercadona.imgix.net/images/b2885ac23e9ad6ffc406882e24291809.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "83203.2",
          "name": "3 Barras de pan rebanadas",
          "price": 1.59,
          "unit": "kg",
          "packPrice": 1.19,
          "image": "https://prod-mercadona.imgix.net/images/63ccfde2421a1579e2ebd41ef601e7ac.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "83560",
          "name": "Barra de pan tradicional",
          "price": 1.83,
          "unit": "kg",
          "packPrice": 1.28,
          "image": "https://prod-mercadona.imgix.net/images/25c4bc7eecd7bb503f2339aac9059af4.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "83202.1",
          "name": "Barra de pan",
          "price": 2,
          "unit": "kg",
          "packPrice": 0.5,
          "image": "https://prod-mercadona.imgix.net/images/b0382f15d4c53669852e014255bdc714.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "23086.1",
          "name": "Barra pan de pueblo",
          "price": 2,
          "unit": "kg",
          "packPrice": 1.6,
          "image": "https://prod-mercadona.imgix.net/images/f2c461ca72260e92cd55bda23e266256.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "83202.2",
          "name": "Barra de pan rebanada",
          "price": 2,
          "unit": "kg",
          "packPrice": 0.5,
          "image": "https://prod-mercadona.imgix.net/images/7474dd2f93517278a47d86c77c7ab673.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "ensalada": [
    {
      "id": "hoja",
      "label": "Lechuga / bolsa de ensalada",
      "share": 0.45,
      "options": [
        {
          "id": "69706",
          "name": "Ensalada mezcla 4 estaciones lavada",
          "price": 3.4,
          "unit": "kg",
          "packPrice": 0.85,
          "image": "https://prod-mercadona.imgix.net/images/521b7ea477692d5b5ae5835f2aea842c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69670",
          "name": "Lechuga iceberg cortada y lavada",
          "price": 3.8,
          "unit": "kg",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/d4731916c523231e46eca0ff925913c7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69756",
          "name": "Ensalada de la casa",
          "price": 5.38,
          "unit": "kg",
          "packPrice": 2.15,
          "image": "https://prod-mercadona.imgix.net/images/eaf6f2fa935a7a3cfb2e68ffad1e6230.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69435",
          "name": "Lechuga romana cortada y lavada",
          "price": 5.75,
          "unit": "kg",
          "packPrice": 1.15,
          "image": "https://prod-mercadona.imgix.net/images/de27c05991934ccea736560b54d21694.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69741",
          "name": "Ensalada mezcla gourmet maxi lavada",
          "price": 6,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/2aa44688b2029f177fc8dd0de8767234.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69744",
          "name": "Ensalada mezcla gourmet lavada",
          "price": 6.29,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/ce7ab9785a4b5272bbe8893fb9a2ae3a.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "tomate",
      "label": "Tomate",
      "share": 0.3,
      "options": [
        {
          "id": "69912",
          "name": "Tomate pera",
          "price": 1.8,
          "unit": "kg",
          "packPrice": 0.25,
          "image": "https://prod-mercadona.imgix.net/images/29e2448e80d5a23e8fc907138e551748.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69975",
          "name": "Tomates pera",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 2,
          "image": "https://prod-mercadona.imgix.net/images/40027e42b9ec9f0693e8f6eb09e1e213.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69971",
          "name": "Tomates",
          "price": 2.1,
          "unit": "kg",
          "packPrice": 4.2,
          "image": "https://prod-mercadona.imgix.net/images/8d8b0344fdd594338795d6d4e7f496aa.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69968",
          "name": "Tomate canario",
          "price": 2.2,
          "unit": "kg",
          "packPrice": 0.44,
          "image": "https://prod-mercadona.imgix.net/images/74f33f458b7f5fa55cdb4490730cccd8.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69487",
          "name": "Rama de Tomates",
          "price": 2.2,
          "unit": "kg",
          "packPrice": 1.94,
          "image": "https://prod-mercadona.imgix.net/images/b865049658bc89eaf2131c967ee4d57e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "60369",
          "name": "Tomate ensalada",
          "price": 2.4,
          "unit": "kg",
          "packPrice": 0.62,
          "image": "https://prod-mercadona.imgix.net/images/b211c1fcb72ca3fcc0e6fcebe57d4082.jpeg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "crudites",
      "label": "Crudités (zanahoria, pepino, aguacate)",
      "share": 0.25,
      "options": [
        {
          "id": "69586",
          "name": "Zanahorias",
          "price": 1.2,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/b862d3c846b5dd18edc52e0913e9ecc3.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69584",
          "name": "Pepino",
          "price": 1.5,
          "unit": "kg",
          "packPrice": 0.36,
          "image": "https://prod-mercadona.imgix.net/images/a1e854648225054f10d2bac80ca7ca98.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69275",
          "name": "Apio verde",
          "price": 2,
          "unit": "kg",
          "packPrice": 1.32,
          "image": "https://prod-mercadona.imgix.net/images/a601293be34844dafbb636e4f79b307f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69310",
          "name": "Pimiento rojo",
          "price": 2.5,
          "unit": "kg",
          "packPrice": 0.75,
          "image": "https://prod-mercadona.imgix.net/images/6a280610f9bfadf9b78b2197c21acfae.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69320",
          "name": "Pimiento verde freír",
          "price": 2.5,
          "unit": "kg",
          "packPrice": 0.28,
          "image": "https://prod-mercadona.imgix.net/images/ace6cddb107859b9d019cdd773ffda00.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69964",
          "name": "Pepino holandés",
          "price": 2.65,
          "unit": "kg",
          "packPrice": 1.13,
          "image": "https://prod-mercadona.imgix.net/images/e691b00f83a443e975b76a9a7b591fd6.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "guarnicion": [
    {
      "id": "patata",
      "label": "Patatas",
      "share": 0.5,
      "options": [
        {
          "id": "61405",
          "name": "Patatas prefritas corte grueso Hacendado ultracongeladas",
          "price": 1.5,
          "unit": "kg",
          "packPrice": 3,
          "image": "https://prod-mercadona.imgix.net/images/5fe57720adc49ea7a458cf7db5148525.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69166",
          "name": "Patatas",
          "price": 1.55,
          "unit": "kg",
          "packPrice": 4.65,
          "image": "https://prod-mercadona.imgix.net/images/9a13af8fac3aa3f71d6b8098d7e9b176.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "61421",
          "name": "Patatas prefritas corte fino Hacendado ultracongeladas",
          "price": 1.85,
          "unit": "kg",
          "packPrice": 1.85,
          "image": "https://prod-mercadona.imgix.net/images/ec0f8aa82a38e94c28092bdefaa1f16e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69066",
          "name": "Patata",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 0.38,
          "image": "https://prod-mercadona.imgix.net/images/12ec1b808bbcbc2d5ad6b40d9021cf76.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69098",
          "name": "Patatas rojas",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 3.8,
          "image": "https://prod-mercadona.imgix.net/images/12962dac735b6d3c60e7448d339640a8.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69448",
          "name": "Patatas especial para freir",
          "price": 1.95,
          "unit": "kg",
          "packPrice": 3.9,
          "image": "https://prod-mercadona.imgix.net/images/9573ce3b902f86934b52cae8ccc3f484.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "pasta_arroz",
      "label": "Pasta y arroz",
      "share": 0.5,
      "options": [
        {
          "id": "5044",
          "name": "Arroz redondo Hacendado",
          "price": 1.2,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/0daf43fb5761b823ce83c985930c97c9.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "5063",
          "name": "Arroz largo Hacendado",
          "price": 1.2,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/801f924df0d429d82c0a136901dcb9b0.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "6250",
          "name": "Macarrón Hacendado",
          "price": 1.2,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/170f66fe00800bca697c8e19838bd6ae.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "6344",
          "name": "Hélices con vegetales Hacendado",
          "price": 1.45,
          "unit": "kg",
          "packPrice": 1.45,
          "image": "https://prod-mercadona.imgix.net/images/f7dbfba2c9e49e650e691a683dddab0e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "5020",
          "name": "Arroz vaporizado Hacendado",
          "price": 1.55,
          "unit": "kg",
          "packPrice": 1.55,
          "image": "https://prod-mercadona.imgix.net/images/1c5a40f534247a5a8b8e16737c809be8.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "5042",
          "name": "Arroz redondo J Sendra Hacendado",
          "price": 1.6,
          "unit": "kg",
          "packPrice": 1.6,
          "image": "https://prod-mercadona.imgix.net/images/44a0df1169e9ebdceb061ebea08b4d42.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "guarnicion:barbacoa": [
    {
      "id": "patata",
      "label": "Patatas para asar",
      "share": 0.6,
      "options": [
        {
          "id": "61405",
          "name": "Patatas prefritas corte grueso Hacendado ultracongeladas",
          "price": 1.5,
          "unit": "kg",
          "packPrice": 3,
          "image": "https://prod-mercadona.imgix.net/images/5fe57720adc49ea7a458cf7db5148525.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69166",
          "name": "Patatas",
          "price": 1.55,
          "unit": "kg",
          "packPrice": 4.65,
          "image": "https://prod-mercadona.imgix.net/images/9a13af8fac3aa3f71d6b8098d7e9b176.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "61421",
          "name": "Patatas prefritas corte fino Hacendado ultracongeladas",
          "price": 1.85,
          "unit": "kg",
          "packPrice": 1.85,
          "image": "https://prod-mercadona.imgix.net/images/ec0f8aa82a38e94c28092bdefaa1f16e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69066",
          "name": "Patata",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 0.38,
          "image": "https://prod-mercadona.imgix.net/images/12ec1b808bbcbc2d5ad6b40d9021cf76.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69098",
          "name": "Patatas rojas",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 3.8,
          "image": "https://prod-mercadona.imgix.net/images/12962dac735b6d3c60e7448d339640a8.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69448",
          "name": "Patatas especial para freir",
          "price": 1.95,
          "unit": "kg",
          "packPrice": 3.9,
          "image": "https://prod-mercadona.imgix.net/images/9573ce3b902f86934b52cae8ccc3f484.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "ensaladilla",
      "label": "Ensaladilla y guarnición",
      "share": 0.4,
      "options": [
        {
          "id": "61101",
          "name": "Ensaladilla Hacendado ultracongelada",
          "price": 1.1,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/2207791ea61f6613e34ad96bb909d9ab.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "52534",
          "name": "Menestra de verduras Hacendado ultracongelada",
          "price": 1.75,
          "unit": "kg",
          "packPrice": 1.75,
          "image": "https://prod-mercadona.imgix.net/images/cda982b20663598e095ee29141b906fc.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "61289",
          "name": "Maíz dulce Hacendado ultracongelado",
          "price": 3.1,
          "unit": "kg",
          "packPrice": 1.24,
          "image": "https://prod-mercadona.imgix.net/images/be6852af02a87787b9dad6356b8069aa.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "16712",
          "name": "Maíz dulce Hacendado",
          "price": 3.44,
          "unit": "kg",
          "packPrice": 1.55,
          "image": "https://prod-mercadona.imgix.net/images/e31eda506e9dd39ca6def9bc2e2356b7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69469",
          "name": "Maíz dulce en mazorca cocido",
          "price": 3.44,
          "unit": "kg",
          "packPrice": 1.55,
          "image": "https://prod-mercadona.imgix.net/images/f8edfb66c12c8e859c0bdb1a689e465d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "16757",
          "name": "Mazorquitas de maíz agridulce Hacendado",
          "price": 7.43,
          "unit": "kg",
          "packPrice": 2.6,
          "image": "https://prod-mercadona.imgix.net/images/2ebede8e519bda91716db94815679de5.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "guarnicion:cumple": [
    {
      "id": "patatas_fritas",
      "label": "Patatas fritas",
      "share": 0.6,
      "options": [
        {
          "id": "22245",
          "name": "Patatas fritas clásicas Hacendado",
          "price": 6,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/daa5379864f490d809e6272ea964a119.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "15589",
          "name": "Patatas fritas corte ondulado Hacendado",
          "price": 7.33,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/edc2fc7f9b7e7a1447cce4255b0b66f2.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33624",
          "name": "Patatas fritas paja Hacendado",
          "price": 7.5,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/041e7b535d424e28406da126b2ef7656.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "86145",
          "name": "Patatas fritas onduladas sabor jamón serrano Hacendado",
          "price": 8,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/e22f05059ea4f31ab20e1b230918879c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "8244",
          "name": "Patatas fritas sabor sal y vinagre Hacendado",
          "price": 8,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/d3f7142f4a8c9bd9db796a6387539ad5.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "8243",
          "name": "Patatas fritas sabor chili y lima Hacendado",
          "price": 8,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/6fc55c45a8752c7ff0273caef3d4ee17.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "palomitas",
      "label": "Palomitas y gusanitos",
      "share": 0.4,
      "options": [
        {
          "id": "14347",
          "name": "Maíz palomitas Hacendado",
          "price": 3.5,
          "unit": "kg",
          "packPrice": 1.05,
          "image": "https://prod-mercadona.imgix.net/images/49e0537f51ab71a7a023fa71695d6b94.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34822",
          "name": "Palomitas de maíz con sal Hacendado para microondas",
          "price": 4.07,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/8c805bca1beb58b91fccd2eba51e18e5.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34212",
          "name": "Palomitas de maíz sabor mantequilla Hacendado para microondas",
          "price": 4.44,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/f8ea8d436cfb80f7e563563cbe8b9316.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34811",
          "name": "Palomitas caramelo Hacendado",
          "price": 12.5,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/54f08a75c350854e471b9f2b73b92a5d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21927",
          "name": "Torreznillos Hacendado cortezas de cerdo fritas ahumadas",
          "price": 14,
          "unit": "kg",
          "packPrice": 1.4,
          "image": "https://prod-mercadona.imgix.net/images/6d8ab14d34ccb702f9174a302a060cd7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33436",
          "name": "Cortezas de cerdo fritas sabor barbacoa Hacendado",
          "price": 14,
          "unit": "kg",
          "packPrice": 1.4,
          "image": "https://prod-mercadona.imgix.net/images/08e4903c5a8ef889943ea30bb29a11a7.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "guarnicion:nochebuena": [
    {
      "id": "asar",
      "label": "Patatas panaderas / asar",
      "share": 0.6,
      "options": [
        {
          "id": "69166",
          "name": "Patatas",
          "price": 1.55,
          "unit": "kg",
          "packPrice": 4.65,
          "image": "https://prod-mercadona.imgix.net/images/9a13af8fac3aa3f71d6b8098d7e9b176.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69066",
          "name": "Patata",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 0.38,
          "image": "https://prod-mercadona.imgix.net/images/12ec1b808bbcbc2d5ad6b40d9021cf76.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69098",
          "name": "Patatas rojas",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 3.8,
          "image": "https://prod-mercadona.imgix.net/images/12962dac735b6d3c60e7448d339640a8.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69448",
          "name": "Patatas especial para freir",
          "price": 1.95,
          "unit": "kg",
          "packPrice": 3.9,
          "image": "https://prod-mercadona.imgix.net/images/9573ce3b902f86934b52cae8ccc3f484.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69386",
          "name": "Patatas guarnición",
          "price": 2.55,
          "unit": "kg",
          "packPrice": 2.55,
          "image": "https://prod-mercadona.imgix.net/images/df2dd24063ff1787bf0e643da4f9e9ed.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69484",
          "name": "Patatas para microondas",
          "price": 3.75,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/7e5af136d661fc6a8de8764b9d8859f4.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "guarnicion_festiva",
      "label": "Guarnición festiva",
      "share": 0.4,
      "options": [
        {
          "id": "52534",
          "name": "Menestra de verduras Hacendado ultracongelada",
          "price": 1.75,
          "unit": "kg",
          "packPrice": 1.75,
          "image": "https://prod-mercadona.imgix.net/images/cda982b20663598e095ee29141b906fc.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "61025",
          "name": "Salteado de setas Hacendado ultracongeladas",
          "price": 3.58,
          "unit": "kg",
          "packPrice": 1.61,
          "image": "https://prod-mercadona.imgix.net/images/a62440f5e0d22babc59dd602b87cfee2.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "22720",
          "name": "Risotto de setas para microondas Hacendado ultracongelado",
          "price": 5.71,
          "unit": "kg",
          "packPrice": 2,
          "image": "https://prod-mercadona.imgix.net/images/4eb44aeae5386d37310949b8b6909baf.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "35900",
          "name": "Salteado de gambas, espárragos verdes, ajos tiernos, champiñón y cebolla Hacendado ultracongelado",
          "price": 6.44,
          "unit": "kg",
          "packPrice": 2.9,
          "image": "https://prod-mercadona.imgix.net/images/77aaa4c3dcbd08ce70f4e5626000c420.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69653",
          "name": "Setas",
          "price": 8.2,
          "unit": "kg",
          "packPrice": 2.05,
          "image": "https://prod-mercadona.imgix.net/images/4a863c32a0a13bba83274ea6fb2092fa.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "61238",
          "name": "Espárrago verde troceado Hacendado ultracongelado",
          "price": 8.5,
          "unit": "kg",
          "packPrice": 2.55,
          "image": "https://prod-mercadona.imgix.net/images/c2686b829eeca97a18ea1f44a36fa022.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "postre": [
    {
      "id": "postre",
      "label": "Postre",
      "share": 1,
      "options": [
        {
          "id": "21061",
          "name": "Natillas con chocolate +Proteínas Hacendado 1,3 g MG 10 g proteínas",
          "price": 3.65,
          "unit": "kg",
          "packPrice": 1.75,
          "image": "https://prod-mercadona.imgix.net/images/a771655436d3ee8093d88e5e68b8a851.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "22311",
          "name": "Natillas sabor vainilla +Proteínas Hacendado 12 g proteínas",
          "price": 3.65,
          "unit": "kg",
          "packPrice": 1.75,
          "image": "https://prod-mercadona.imgix.net/images/403d8051a4c86676bfd5d8784a6cd76f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "68350",
          "name": "Mousse de chocolate Hacendado",
          "price": 4.8,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/e7a08771bc931ef70b85b25e45c72d50.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "9905",
          "name": "Mousse sabor chocolate +Proteínas Hacendado 10 g proteínas",
          "price": 6.38,
          "unit": "kg",
          "packPrice": 2.55,
          "image": "https://prod-mercadona.imgix.net/images/233cc1cd2532cdcd4a80f0e832c5d458.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "68170",
          "name": "Tiramisú Hacendado",
          "price": 7.5,
          "unit": "kg",
          "packPrice": 1.35,
          "image": "https://prod-mercadona.imgix.net/images/6271f659305063f66b0a337037852e8a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21366",
          "name": "Tarta de queso Hacendado",
          "price": 10.56,
          "unit": "kg",
          "packPrice": 1.9,
          "image": "https://prod-mercadona.imgix.net/images/d43749fd94bc72de6e831813abac534a.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "postre:barbacoa": [
    {
      "id": "fruta",
      "label": "Fruta de postre",
      "share": 0.5,
      "options": [
        {
          "id": "3529",
          "name": "Sandía baja en semillas",
          "price": 0.85,
          "unit": "kg",
          "packPrice": 5.24,
          "image": "https://prod-mercadona.imgix.net/images/5c34ac2535f19aa86b1fcdfe56d5c61c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3505.2",
          "name": "1/4 Sandía baja en semillas",
          "price": 1.25,
          "unit": "kg",
          "packPrice": 2.06,
          "image": "https://prod-mercadona.imgix.net/images/09182c8d0e75928bcd808fc4fb7d75d4.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3505.1",
          "name": "Media sandía baja en semillas",
          "price": 1.25,
          "unit": "kg",
          "packPrice": 3.79,
          "image": "https://prod-mercadona.imgix.net/images/3f5e582ec279d307ccc73ef5daa94586.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3506",
          "name": "Melón piel de sapo",
          "price": 1.5,
          "unit": "kg",
          "packPrice": 4.37,
          "image": "https://prod-mercadona.imgix.net/images/bd4459355f58bc265a2c6720b688e3c3.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3515",
          "name": "Medio melón piel de sapo",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 2.91,
          "image": "https://prod-mercadona.imgix.net/images/2d034c1b80642d033f7b5aecd3fb8269.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3076",
          "name": "Piña",
          "price": 2,
          "unit": "kg",
          "packPrice": 3.92,
          "image": "https://prod-mercadona.imgix.net/images/9dd42248e51d82317d3e48eaa166d56e.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "dulce",
      "label": "Tarta o helado",
      "share": 0.5,
      "options": [
        {
          "id": "68170",
          "name": "Tiramisú Hacendado",
          "price": 7.5,
          "unit": "kg",
          "packPrice": 1.35,
          "image": "https://prod-mercadona.imgix.net/images/6271f659305063f66b0a337037852e8a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21366",
          "name": "Tarta de queso Hacendado",
          "price": 10.56,
          "unit": "kg",
          "packPrice": 1.9,
          "image": "https://prod-mercadona.imgix.net/images/d43749fd94bc72de6e831813abac534a.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "postre:amigos": [
    {
      "id": "tarta_queso",
      "label": "Tarta de queso / tiramisú",
      "share": 0.6,
      "options": [
        {
          "id": "68350",
          "name": "Mousse de chocolate Hacendado",
          "price": 4.8,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/e7a08771bc931ef70b85b25e45c72d50.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "9905",
          "name": "Mousse sabor chocolate +Proteínas Hacendado 10 g proteínas",
          "price": 6.38,
          "unit": "kg",
          "packPrice": 2.55,
          "image": "https://prod-mercadona.imgix.net/images/233cc1cd2532cdcd4a80f0e832c5d458.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "68170",
          "name": "Tiramisú Hacendado",
          "price": 7.5,
          "unit": "kg",
          "packPrice": 1.35,
          "image": "https://prod-mercadona.imgix.net/images/6271f659305063f66b0a337037852e8a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21366",
          "name": "Tarta de queso Hacendado",
          "price": 10.56,
          "unit": "kg",
          "packPrice": 1.9,
          "image": "https://prod-mercadona.imgix.net/images/d43749fd94bc72de6e831813abac534a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "13053",
          "name": "Cheesecake con arándanos Hacendado",
          "price": 10.63,
          "unit": "kg",
          "packPrice": 1.7,
          "image": "https://prod-mercadona.imgix.net/images/d1f17ea49b16248dd97c551d7b91a611.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "fruta_dulce",
      "label": "Fruta y dulces",
      "share": 0.4,
      "options": [
        {
          "id": "3313",
          "name": "Uva blanca sin semillas",
          "price": 4.75,
          "unit": "kg",
          "packPrice": 2.85,
          "image": "https://prod-mercadona.imgix.net/images/386783ad8510e061d8ad0277b460a5f1.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3321",
          "name": "Uva roja sin semillas",
          "price": 4.75,
          "unit": "kg",
          "packPrice": 2.85,
          "image": "https://prod-mercadona.imgix.net/images/1d074082d78bd3883eece473526a79bb.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3651",
          "name": "Cerezas",
          "price": 5.5,
          "unit": "kg",
          "packPrice": 2.75,
          "image": "https://prod-mercadona.imgix.net/images/535d9ae6a182e9b2155de512ef98f590.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3723",
          "name": "Fresas",
          "price": 7.5,
          "unit": "kg",
          "packPrice": 3,
          "image": "https://prod-mercadona.imgix.net/images/12903514a5f76a5e5f5337bef5a11105.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "5501",
          "name": "Arándanos",
          "price": 14.67,
          "unit": "kg",
          "packPrice": 3.3,
          "image": "https://prod-mercadona.imgix.net/images/a5073f7984f7ca2b4cca209439afa9ef.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "5500",
          "name": "Frambuesas",
          "price": 15.5,
          "unit": "kg",
          "packPrice": 3.1,
          "image": "https://prod-mercadona.imgix.net/images/6745b8dda0a443232ff2b6f70ad1b88e.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "ensalada:barbacoa": [
    {
      "id": "hoja",
      "label": "Lechuga / bolsa de ensalada",
      "share": 0.5,
      "options": [
        {
          "id": "69706",
          "name": "Ensalada mezcla 4 estaciones lavada",
          "price": 3.4,
          "unit": "kg",
          "packPrice": 0.85,
          "image": "https://prod-mercadona.imgix.net/images/521b7ea477692d5b5ae5835f2aea842c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69670",
          "name": "Lechuga iceberg cortada y lavada",
          "price": 3.8,
          "unit": "kg",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/d4731916c523231e46eca0ff925913c7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69756",
          "name": "Ensalada de la casa",
          "price": 5.38,
          "unit": "kg",
          "packPrice": 2.15,
          "image": "https://prod-mercadona.imgix.net/images/eaf6f2fa935a7a3cfb2e68ffad1e6230.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69435",
          "name": "Lechuga romana cortada y lavada",
          "price": 5.75,
          "unit": "kg",
          "packPrice": 1.15,
          "image": "https://prod-mercadona.imgix.net/images/de27c05991934ccea736560b54d21694.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69741",
          "name": "Ensalada mezcla gourmet maxi lavada",
          "price": 6,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/2aa44688b2029f177fc8dd0de8767234.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69744",
          "name": "Ensalada mezcla gourmet lavada",
          "price": 6.29,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/ce7ab9785a4b5272bbe8893fb9a2ae3a.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "maiz_tomate",
      "label": "Tomate, maíz y aguacate",
      "share": 0.5,
      "options": [
        {
          "id": "69079",
          "name": "Cebollas",
          "price": 1.6,
          "unit": "kg",
          "packPrice": 3.2,
          "image": "https://prod-mercadona.imgix.net/images/c8d94c6563bfadc845df944fe483bfca.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69912",
          "name": "Tomate pera",
          "price": 1.8,
          "unit": "kg",
          "packPrice": 0.25,
          "image": "https://prod-mercadona.imgix.net/images/29e2448e80d5a23e8fc907138e551748.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69975",
          "name": "Tomates pera",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 2,
          "image": "https://prod-mercadona.imgix.net/images/40027e42b9ec9f0693e8f6eb09e1e213.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69971",
          "name": "Tomates",
          "price": 2.1,
          "unit": "kg",
          "packPrice": 4.2,
          "image": "https://prod-mercadona.imgix.net/images/8d8b0344fdd594338795d6d4e7f496aa.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69968",
          "name": "Tomate canario",
          "price": 2.2,
          "unit": "kg",
          "packPrice": 0.44,
          "image": "https://prod-mercadona.imgix.net/images/74f33f458b7f5fa55cdb4490730cccd8.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "69487",
          "name": "Rama de Tomates",
          "price": 2.2,
          "unit": "kg",
          "packPrice": 1.94,
          "image": "https://prod-mercadona.imgix.net/images/b865049658bc89eaf2131c967ee4d57e.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "postre:cumple": [
    {
      "id": "tarta",
      "label": "Tarta de cumpleaños",
      "share": 0.7,
      "options": [
        {
          "id": "21366",
          "name": "Tarta de queso Hacendado",
          "price": 10.56,
          "unit": "kg",
          "packPrice": 1.9,
          "image": "https://prod-mercadona.imgix.net/images/d43749fd94bc72de6e831813abac534a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "13053",
          "name": "Cheesecake con arándanos Hacendado",
          "price": 10.63,
          "unit": "kg",
          "packPrice": 1.7,
          "image": "https://prod-mercadona.imgix.net/images/d1f17ea49b16248dd97c551d7b91a611.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "dulces",
      "label": "Dulces y chuches",
      "share": 0.3,
      "options": [
        {
          "id": "68188",
          "name": "Panna Cotta con caramelo Hacendado",
          "price": 3,
          "unit": "kg",
          "packPrice": 1.2,
          "image": "https://prod-mercadona.imgix.net/images/6f459214f60aee6b530dcdb503f64ec5.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21584",
          "name": "Galletas saladas con semillas y orégano Hacendado",
          "price": 5.8,
          "unit": "kg",
          "packPrice": 1.45,
          "image": "https://prod-mercadona.imgix.net/images/eac514bda87748b8df0105d8cca09ff1.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "60400",
          "name": "Bolsita postre lácteo galleta Hacendado +8 meses",
          "price": 9,
          "unit": "kg",
          "packPrice": 0.9,
          "image": "https://prod-mercadona.imgix.net/images/af1a5a426c7786a08267baf0d6235a18.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34811",
          "name": "Palomitas caramelo Hacendado",
          "price": 12.5,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/54f08a75c350854e471b9f2b73b92a5d.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "snacks": [
    {
      "id": "patatas_fritas",
      "label": "Patatas fritas y chips",
      "share": 0.4,
      "options": [
        {
          "id": "22245",
          "name": "Patatas fritas clásicas Hacendado",
          "price": 6,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/daa5379864f490d809e6272ea964a119.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33640",
          "name": "Nachos Hacendado",
          "price": 6,
          "unit": "kg",
          "packPrice": 0.9,
          "image": "https://prod-mercadona.imgix.net/images/5ea6209ff18125614b1c278484587d91.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "16387",
          "name": "Nachos Padrísimos Hacendado sabor guacamole",
          "price": 6.33,
          "unit": "kg",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/b8ef2dc650a5f2dd7f83fd1ba50493ec.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33641",
          "name": "Nachos tex-mex sabor queso Hacendado",
          "price": 6.33,
          "unit": "kg",
          "packPrice": 0.95,
          "image": "https://prod-mercadona.imgix.net/images/b8c009cd61e6c9824fa9743f5515c872.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "15589",
          "name": "Patatas fritas corte ondulado Hacendado",
          "price": 7.33,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/edc2fc7f9b7e7a1447cce4255b0b66f2.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33624",
          "name": "Patatas fritas paja Hacendado",
          "price": 7.5,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/041e7b535d424e28406da126b2ef7656.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "aceitunas",
      "label": "Aceitunas y encurtidos",
      "share": 0.3,
      "options": [
        {
          "id": "5480",
          "name": "Pepinillos agridulces Hacendado",
          "price": 2.24,
          "unit": "kg",
          "packPrice": 1.5,
          "image": "https://prod-mercadona.imgix.net/images/b7077958ad551c3f823ac44034cd1f67.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "33026",
          "name": "Mix de pepinillos y cebollitas Hacendado",
          "price": 2.76,
          "unit": "kg",
          "packPrice": 1.85,
          "image": "https://prod-mercadona.imgix.net/images/514932d49e6bf9d404520b71bb8b5267.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "22910",
          "name": "Aceitunas verdes rellenas de anchoa Hacendado",
          "price": 2.86,
          "unit": "kg",
          "packPrice": 3,
          "image": "https://prod-mercadona.imgix.net/images/a8be4414722e79192b356a7f3ababbc0.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "13422",
          "name": "Aceitunas verdes estilo casero Hacendado partidas aliñadas",
          "price": 2.91,
          "unit": "kg",
          "packPrice": 2.85,
          "image": "https://prod-mercadona.imgix.net/images/0b6b3e69cf64b9e6102907f8479405bc.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "80177",
          "name": "Aceitunas verdes Gazpacha Hacendado partidas",
          "price": 2.99,
          "unit": "kg",
          "packPrice": 2.5,
          "image": "https://prod-mercadona.imgix.net/images/2ca6159e86382b902ad76812992cf802.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "52734",
          "name": "Aceitunas negras sin hueso Hacendado",
          "price": 3,
          "unit": "kg",
          "packPrice": 1.05,
          "image": "https://prod-mercadona.imgix.net/images/8ea381beaef3459b5bc9a08d9eabf509.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "frutos_secos",
      "label": "Frutos secos",
      "share": 0.3,
      "options": [
        {
          "id": "34820",
          "name": "Cacahuete frito con sal Hacendado pelado",
          "price": 3.6,
          "unit": "kg",
          "packPrice": 0.9,
          "image": "https://prod-mercadona.imgix.net/images/621404b6085cae9938997dd3f360b029.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34031",
          "name": "Cacahuete tostado Hacendado 0% sal añadida",
          "price": 3.88,
          "unit": "kg",
          "packPrice": 1.55,
          "image": "https://prod-mercadona.imgix.net/images/09cec547e9ac6bbfa54ada3a03176248.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34016",
          "name": "Cacahuete tostado con sal Hacendado",
          "price": 4.13,
          "unit": "kg",
          "packPrice": 1.65,
          "image": "https://prod-mercadona.imgix.net/images/b335759dffb927abd3ea0b2c13deafa9.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34868",
          "name": "Cacahuete frito y salado Hacendado con piel",
          "price": 5.2,
          "unit": "kg",
          "packPrice": 1.3,
          "image": "https://prod-mercadona.imgix.net/images/9ba31472c3bc97cad3c8f6bce8181942.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "13451",
          "name": "Cacahuete tostado Hacendado pelado 0% sal añadida",
          "price": 5.25,
          "unit": "kg",
          "packPrice": 1.05,
          "image": "https://prod-mercadona.imgix.net/images/f5e73affd444299e58abcbc5e146cb93.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "34143",
          "name": "Cacahuete frito con miel Hacendado",
          "price": 8.25,
          "unit": "kg",
          "packPrice": 1.65,
          "image": "https://prod-mercadona.imgix.net/images/20cdbdad2299b5137ae62ab0be42c1d5.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "lacteos": [
    {
      "id": "leche",
      "label": "Leche",
      "share": 0.6,
      "options": [
        {
          "id": "10383",
          "name": "Leche desnatada Hacendado",
          "price": 0.82,
          "unit": "L",
          "packPrice": 4.92,
          "image": "https://prod-mercadona.imgix.net/images/abc4cb0349cf8033da81c6045538345b.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "10381",
          "name": "Leche semidesnatada Hacendado",
          "price": 0.84,
          "unit": "L",
          "packPrice": 5.04,
          "image": "https://prod-mercadona.imgix.net/images/c15010ddd0e6fc881e5ef94446d43bef.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "10379",
          "name": "Leche entera Hacendado",
          "price": 0.96,
          "unit": "L",
          "packPrice": 5.76,
          "image": "https://prod-mercadona.imgix.net/images/e471e628a91aef1a7d6473da2cb904c6.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "10686",
          "name": "Leche desnatada calcio Hacendado",
          "price": 1.02,
          "unit": "L",
          "packPrice": 6.12,
          "image": "https://prod-mercadona.imgix.net/images/8f6e801952f0226f6e716b7e353c1f9e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "10683",
          "name": "Leche semidesnatada calcio Hacendado",
          "price": 1.05,
          "unit": "L",
          "packPrice": 6.3,
          "image": "https://prod-mercadona.imgix.net/images/cf197c52289c9349011966afbe4ca15c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "10516",
          "name": "Leche desnatada Asturiana",
          "price": 1.15,
          "unit": "L",
          "packPrice": 10.38,
          "image": "https://prod-mercadona.imgix.net/images/b24a6284dfa744beccfa97471e588858.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "yogur",
      "label": "Yogur",
      "share": 0.4,
      "options": [
        {
          "id": "20001",
          "name": "Yogur sabores Hacendado",
          "price": 1.2,
          "unit": "kg",
          "packPrice": 2.4,
          "image": "https://prod-mercadona.imgix.net/images/85b23a9a032693961d03270115cbefa3.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "15660",
          "name": "Yogur líquido piña y coco Hacendado 0% MG 0% azúcares añadidos",
          "price": 1.3,
          "unit": "kg",
          "packPrice": 1.3,
          "image": "https://prod-mercadona.imgix.net/images/041f59898296337aa8683c4d35b5f0d4.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "15661",
          "name": "Yogur líquido frutos silvestres Hacendado 0% MG 0% azúcares añadidos",
          "price": 1.3,
          "unit": "kg",
          "packPrice": 1.3,
          "image": "https://prod-mercadona.imgix.net/images/3a42f5d65b5f72e1c0a3409fb1d4b757.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "22313",
          "name": "Yogur natural Hacendado",
          "price": 1.33,
          "unit": "kg",
          "packPrice": 1,
          "image": "https://prod-mercadona.imgix.net/images/0689561ce98dba5c0b3ad43e69be0f5f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "20221",
          "name": "Yogur natural edulcorado Hacendado 0% MG 0% azúcares añadidos",
          "price": 1.4,
          "unit": "kg",
          "packPrice": 1.05,
          "image": "https://prod-mercadona.imgix.net/images/0894bc2be116a1d00a8b7a070a97cd62.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "20210",
          "name": "Yogur natural Hacendado 0% MG 0% azúcares añadidos",
          "price": 1.4,
          "unit": "kg",
          "packPrice": 1.05,
          "image": "https://prod-mercadona.imgix.net/images/099ff343424be9697224fa076e7b2c87.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "embutido": [
    {
      "id": "embutido",
      "label": "Jamón y embutido",
      "share": 0.6,
      "options": [
        {
          "id": "4590",
          "name": "Lomo de cerdo trozo",
          "price": 4.7,
          "unit": "kg",
          "packPrice": 4.56,
          "image": "https://prod-mercadona.imgix.net/images/ab6772608c4b8e26802aa494293ea5eb.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3554",
          "name": "Pieza cabeza lomo de cerdo",
          "price": 4.9,
          "unit": "kg",
          "packPrice": 5.63,
          "image": "https://prod-mercadona.imgix.net/images/c39c00367e195a300e334f9de7cff9b3.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3395",
          "name": "Filetes lomo de cerdo familiar",
          "price": 6.3,
          "unit": "kg",
          "packPrice": 5.67,
          "image": "https://prod-mercadona.imgix.net/images/7865223a99982e513a1e44182bf0edd4.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2817",
          "name": "Filetes lomo de cerdo cabeza",
          "price": 6.3,
          "unit": "kg",
          "packPrice": 4.22,
          "image": "https://prod-mercadona.imgix.net/images/2b88a5d154cc77e60b79bf3265a31886.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "21601",
          "name": "Lomo de cerdo cocido Hacendado finas lonchas",
          "price": 6.56,
          "unit": "kg",
          "packPrice": 2.95,
          "image": "https://prod-mercadona.imgix.net/images/85ce20b343d8ac0c237deae1ccf256c2.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "5046",
          "name": "Filetes lomo de cerdo adobado familiar",
          "price": 6.7,
          "unit": "kg",
          "packPrice": 6.5,
          "image": "https://prod-mercadona.imgix.net/images/55cc474c76c30984dc63a16c30fcbc67.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "queso",
      "label": "Queso",
      "share": 0.4,
      "options": [
        {
          "id": "51071",
          "name": "Queso fresco batido desnatado 0% MG Hacendado",
          "price": 2.2,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/d2f12f4f6b2de080b5aeebc8aa1a5e46.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "53100",
          "name": "Salchichas cocidas estilo Frankfurt con queso Hacendado de pollo y cerdo sabor ahumado",
          "price": 3.05,
          "unit": "kg",
          "packPrice": 1.95,
          "image": "https://prod-mercadona.imgix.net/images/be775f03eaaecbee74b87fd5206564dd.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "52406",
          "name": "Queso fresco Burgos natural Hacendado",
          "price": 4.1,
          "unit": "kg",
          "packPrice": 2.05,
          "image": "https://prod-mercadona.imgix.net/images/f720ac03cd3735edc5ec4647c7da94ec.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "51182",
          "name": "Queso lonchas fundido suave mezcla Hacendado",
          "price": 4.23,
          "unit": "kg",
          "packPrice": 2.35,
          "image": "https://prod-mercadona.imgix.net/images/d6d49f98b5ad0ebd7d7604ab48e47a8c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "53030",
          "name": "Salchichas cocidas estilo Viena con queso Hacendado de pollo y cerdo sabor ahumado",
          "price": 4.25,
          "unit": "kg",
          "packPrice": 1.7,
          "image": "https://prod-mercadona.imgix.net/images/866ff7ce472d2428ea28b52f90f2b823.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "52409",
          "name": "Queso fresco Burgos desnatado 0% MG Hacendado",
          "price": 4.6,
          "unit": "kg",
          "packPrice": 1.15,
          "image": "https://prod-mercadona.imgix.net/images/dcabfcce232c97690046b09ca74f58fd.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "desayuno": [
    {
      "id": "bolleria",
      "label": "Galletas y bollería",
      "share": 1,
      "options": [
        {
          "id": "60846",
          "name": "Magdalenas Hacendado",
          "price": 3.64,
          "unit": "kg",
          "packPrice": 2,
          "image": "https://prod-mercadona.imgix.net/images/7d86884645fb0122ac70cb84514e1f8c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "82699",
          "name": "Sobaos Hacendado",
          "price": 4.17,
          "unit": "kg",
          "packPrice": 2,
          "image": "https://prod-mercadona.imgix.net/images/da9142870ffe1a47746b2c3f02c71716.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "82931",
          "name": "Croissant Hacendado",
          "price": 4.3,
          "unit": "kg",
          "packPrice": 1.85,
          "image": "https://prod-mercadona.imgix.net/images/d586f3c22dacbfeee339548690651c36.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "83995",
          "name": "Bizcocho de yogur Hacendado",
          "price": 4.38,
          "unit": "kg",
          "packPrice": 3.5,
          "image": "https://prod-mercadona.imgix.net/images/0dc994fc90ab43ba3e9768c9f34d1daa.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "23372",
          "name": "Bizcochos de huevo Hacendado",
          "price": 4.5,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/56d1314642bdc0901cfaa35526b58af8.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "23373",
          "name": "Napolitanas con relleno de cacao Hacendado",
          "price": 4.86,
          "unit": "kg",
          "packPrice": 1.8,
          "image": "https://prod-mercadona.imgix.net/images/761e1310d9efe5ec24a4d022990904bb.jpeg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "fruta": [
    {
      "id": "melon_sandia",
      "label": "Melón / sandía",
      "share": 0.3,
      "options": [
        {
          "id": "3529",
          "name": "Sandía baja en semillas",
          "price": 0.85,
          "unit": "kg",
          "packPrice": 5.24,
          "image": "https://prod-mercadona.imgix.net/images/5c34ac2535f19aa86b1fcdfe56d5c61c.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3505.2",
          "name": "1/4 Sandía baja en semillas",
          "price": 1.25,
          "unit": "kg",
          "packPrice": 2.06,
          "image": "https://prod-mercadona.imgix.net/images/09182c8d0e75928bcd808fc4fb7d75d4.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3505.1",
          "name": "Media sandía baja en semillas",
          "price": 1.25,
          "unit": "kg",
          "packPrice": 3.79,
          "image": "https://prod-mercadona.imgix.net/images/3f5e582ec279d307ccc73ef5daa94586.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3506",
          "name": "Melón piel de sapo",
          "price": 1.5,
          "unit": "kg",
          "packPrice": 4.37,
          "image": "https://prod-mercadona.imgix.net/images/bd4459355f58bc265a2c6720b688e3c3.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3515",
          "name": "Medio melón piel de sapo",
          "price": 1.9,
          "unit": "kg",
          "packPrice": 2.91,
          "image": "https://prod-mercadona.imgix.net/images/2d034c1b80642d033f7b5aecd3fb8269.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3076",
          "name": "Piña",
          "price": 2,
          "unit": "kg",
          "packPrice": 3.92,
          "image": "https://prod-mercadona.imgix.net/images/9dd42248e51d82317d3e48eaa166d56e.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "manzana_pera",
      "label": "Manzana / pera",
      "share": 0.25,
      "options": [
        {
          "id": "3269",
          "name": "Manzanas Golden",
          "price": 2.2,
          "unit": "kg",
          "packPrice": 3.3,
          "image": "https://prod-mercadona.imgix.net/images/022fa8e1cd6c9d9ee18a41ed06d71c35.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3028",
          "name": "Manzana Golden",
          "price": 2.4,
          "unit": "kg",
          "packPrice": 0.48,
          "image": "https://prod-mercadona.imgix.net/images/12cc1ef38a5b781f364ca22e46a25ad7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "8280",
          "name": "Manzanas rojas dulces",
          "price": 2.4,
          "unit": "kg",
          "packPrice": 3.6,
          "image": "https://prod-mercadona.imgix.net/images/87f801433e34719ba9bdc226616e7511.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "14470",
          "name": "Peras Conferencia",
          "price": 2.5,
          "unit": "kg",
          "packPrice": 2.68,
          "image": "https://prod-mercadona.imgix.net/images/158b08c139cba5362b335f8b0a715cc8.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3021",
          "name": "Manzana Granny Smith",
          "price": 2.5,
          "unit": "kg",
          "packPrice": 0.43,
          "image": "https://prod-mercadona.imgix.net/images/fea3470bee0679f0e081916ec48c0b36.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "8268",
          "name": "Manzanas rojas acidulces",
          "price": 2.6,
          "unit": "kg",
          "packPrice": 4.21,
          "image": "https://prod-mercadona.imgix.net/images/e65f4165ef836b54f4cb49b719b269bd.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "platano",
      "label": "Plátano",
      "share": 0.2,
      "options": [
        {
          "id": "3824",
          "name": "Banana",
          "price": 1.55,
          "unit": "kg",
          "packPrice": 0.29,
          "image": "https://prod-mercadona.imgix.net/images/69edef3541bbf3f4b7173c9d617a5698.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3819",
          "name": "Plátano de Canarias IGP",
          "price": 2.9,
          "unit": "kg",
          "packPrice": 0.46,
          "image": "https://prod-mercadona.imgix.net/images/e4a37940916985bf5ca166e266580c37.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3132",
          "name": "Plátano macho",
          "price": 2.9,
          "unit": "kg",
          "packPrice": 0.84,
          "image": "https://prod-mercadona.imgix.net/images/c22baa2a17de06fbf8477ef25392b7ca.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "citricos_uva",
      "label": "Naranja, uva y otras",
      "share": 0.25,
      "options": [
        {
          "id": "3277",
          "name": "Naranjas",
          "price": 1.55,
          "unit": "kg",
          "packPrice": 4.65,
          "image": "https://prod-mercadona.imgix.net/images/45e9468a6928470c2fef4b286fab0ccd.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3235",
          "name": "Naranja de mesa",
          "price": 2.15,
          "unit": "kg",
          "packPrice": 0.67,
          "image": "https://prod-mercadona.imgix.net/images/e9ff28c3b115649df7138f0f51dd1f9f.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3832",
          "name": "Kiwis verdes",
          "price": 4.55,
          "unit": "kg",
          "packPrice": 4.87,
          "image": "https://prod-mercadona.imgix.net/images/e887a535440a80f19a036df7d70f124a.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3820",
          "name": "Kiwi verde",
          "price": 4.65,
          "unit": "kg",
          "packPrice": 0.51,
          "image": "https://prod-mercadona.imgix.net/images/49e3e74a455daf4169248dfb52ae9a6d.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3601",
          "name": "Ciruela roja",
          "price": 4.7,
          "unit": "kg",
          "packPrice": 0.47,
          "image": "https://prod-mercadona.imgix.net/images/36a090290d02a1b472d43794596e5f48.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "3313",
          "name": "Uva blanca sin semillas",
          "price": 4.75,
          "unit": "kg",
          "packPrice": 2.85,
          "image": "https://prod-mercadona.imgix.net/images/386783ad8510e061d8ad0277b460a5f1.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "carne:rural_easy": [
    {
      "id": "platos_listos",
      "label": "Platos listos (lasaña, canelones, pizza)",
      "share": 0.4,
      "options": [
        {
          "id": "86905",
          "name": "Arroz tres delicias Hacendado ultracongelado",
          "price": 2.85,
          "unit": "kg",
          "packPrice": 2.85,
          "image": "https://prod-mercadona.imgix.net/images/428728aa152dad6c0476a1c0ce694804.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "35767",
          "name": "Lasaña boloñesa familiar Hacendado ultracongelada",
          "price": 4.91,
          "unit": "kg",
          "packPrice": 5.4,
          "image": "https://prod-mercadona.imgix.net/images/d3aa6907a659d89fd40a5c7f195a56ce.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "86597",
          "name": "Lasaña a la boloñesa Hacendado ultracongelada",
          "price": 5,
          "unit": "kg",
          "packPrice": 3,
          "image": "https://prod-mercadona.imgix.net/images/48e415b4c7b108dba53576be1917ace9.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "86601",
          "name": "Canelones de carne Hacendado ultracongelados",
          "price": 5.27,
          "unit": "kg",
          "packPrice": 5.8,
          "image": "https://prod-mercadona.imgix.net/images/ef9d550d315fd697b4c8d117478a0fb0.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "86598",
          "name": "Lasaña de atún Hacendado ultracongelada",
          "price": 6.1,
          "unit": "kg",
          "packPrice": 3.66,
          "image": "https://prod-mercadona.imgix.net/images/0d9f43e80c095ffae34b75a073ee5c05.jpg?fit=crop&h=300&w=300"
        }
      ]
    },
    {
      "id": "empanados_listos",
      "label": "Empanados y fritos (solo calentar)",
      "share": 0.6,
      "options": [
        {
          "id": "63323",
          "name": "Nuggets de pollo Hacendado ultracongelados",
          "price": 5,
          "unit": "kg",
          "packPrice": 2.5,
          "image": "https://prod-mercadona.imgix.net/images/a83470c87a6d3342c96dd0a449237604.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "2871",
          "name": "Albóndigas de cerdo",
          "price": 5.42,
          "unit": "kg",
          "packPrice": 4.55,
          "image": "https://prod-mercadona.imgix.net/images/087eaf211a0fc38ef1ced35ff9b44a18.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "13496",
          "name": "Croquetas de cocido Hacendado ultracongeladas",
          "price": 5.57,
          "unit": "kg",
          "packPrice": 1.95,
          "image": "https://prod-mercadona.imgix.net/images/1528c21f212a7b7eb203724cba48cfe9.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "14298",
          "name": "San Jacobos de cerdo sin gluten",
          "price": 6.6,
          "unit": "kg",
          "packPrice": 2.64,
          "image": "https://prod-mercadona.imgix.net/images/496d5a9a9de7faa2cf2b14354963a567.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "23632",
          "name": "Albóndigas de pollo",
          "price": 6.9,
          "unit": "kg",
          "packPrice": 5.8,
          "image": "https://prod-mercadona.imgix.net/images/0591c4d2bdb7d3c9c067d97673a592b7.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "63007",
          "name": "Nuggets de pavo Hacendado ultracongelados",
          "price": 8.5,
          "unit": "kg",
          "packPrice": 3.4,
          "image": "https://prod-mercadona.imgix.net/images/2fdc9b83394eee29e89c2779fa919b6b.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ],
  "guarnicion:rural_easy": [
    {
      "id": "ensaladilla_prefritas",
      "label": "Ensaladilla y patatas listas",
      "share": 1,
      "options": [
        {
          "id": "61101",
          "name": "Ensaladilla Hacendado ultracongelada",
          "price": 1.1,
          "unit": "kg",
          "packPrice": 1.1,
          "image": "https://prod-mercadona.imgix.net/images/2207791ea61f6613e34ad96bb909d9ab.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "61405",
          "name": "Patatas prefritas corte grueso Hacendado ultracongeladas",
          "price": 1.5,
          "unit": "kg",
          "packPrice": 3,
          "image": "https://prod-mercadona.imgix.net/images/5fe57720adc49ea7a458cf7db5148525.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "61421",
          "name": "Patatas prefritas corte fino Hacendado ultracongeladas",
          "price": 1.85,
          "unit": "kg",
          "packPrice": 1.85,
          "image": "https://prod-mercadona.imgix.net/images/ec0f8aa82a38e94c28092bdefaa1f16e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "61416",
          "name": "Patatas prefritas gajo Hacendado ultracongeladas",
          "price": 2.2,
          "unit": "kg",
          "packPrice": 1.65,
          "image": "https://prod-mercadona.imgix.net/images/03cc22cb0e1921e0e5463c6252ca3dde.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "19904",
          "name": "Patatas prefritas Crispy Pops Hacendado congeladas",
          "price": 3.07,
          "unit": "kg",
          "packPrice": 2.3,
          "image": "https://prod-mercadona.imgix.net/images/6995ff390f9ff407e92696664513d73e.jpg?fit=crop&h=300&w=300"
        },
        {
          "id": "15286",
          "name": "Patatas prefritas Waffle con piel Hacendado ultracongeladas",
          "price": 3.5,
          "unit": "kg",
          "packPrice": 2.1,
          "image": "https://prod-mercadona.imgix.net/images/72cf2bc9606c032bf0666e60ab79f591.jpg?fit=crop&h=300&w=300"
        }
      ]
    }
  ]
};

export const SPECIAL: Record<string, ProductOption[]> = {
  "sin_gluten": [
    {
      "id": "35711",
      "name": "Pan de molde sin gluten blanco Hacendado",
      "price": 5.48,
      "unit": "kg",
      "packPrice": 2.74,
      "image": "https://prod-mercadona.imgix.net/images/4b2fd6f2a42c76ccb71db2be51fa7ec5.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "86750",
      "name": "Pan de molde cereales sin gluten Hacendado",
      "price": 5.83,
      "unit": "kg",
      "packPrice": 2.74,
      "image": "https://prod-mercadona.imgix.net/images/a8c90aab11776a9f62a00b0a10634ad7.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "35849",
      "name": "Pan redondo sin gluten Hacendado",
      "price": 12.06,
      "unit": "kg",
      "packPrice": 1.93,
      "image": "https://prod-mercadona.imgix.net/images/a3a8bd862ae9048c2fb1b2c56523bcad.jpg?fit=crop&h=300&w=300"
    }
  ],
  "legumbres": [
    {
      "id": "26019",
      "name": "Alubia cocida blanca Hacendado",
      "price": 1.32,
      "unit": "kg",
      "packPrice": 0.75,
      "image": "https://prod-mercadona.imgix.net/images/f3797bcd3c8ed58804490159df581279.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "26029",
      "name": "Garbanzo cocido Hacendado",
      "price": 1.4,
      "unit": "kg",
      "packPrice": 0.8,
      "image": "https://prod-mercadona.imgix.net/images/b8b807948038c4b64791632f799e9bd8.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "26033",
      "name": "Garbanzo cocido Pedrosillano Hacendado",
      "price": 1.58,
      "unit": "kg",
      "packPrice": 0.9,
      "image": "https://prod-mercadona.imgix.net/images/d3a3751f303595a3ff36d87de9730597.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "26030",
      "name": "Lenteja cocida Hacendado",
      "price": 1.58,
      "unit": "kg",
      "packPrice": 0.9,
      "image": "https://prod-mercadona.imgix.net/images/50b071c4bae7230b8de346b495a7981b.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "5330",
      "name": "Lenteja pardina Hacendado",
      "price": 1.95,
      "unit": "kg",
      "packPrice": 1.95,
      "image": "https://prod-mercadona.imgix.net/images/80c08ddcd236321ea41242268903726b.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "26000",
      "name": "Alubia cocida roja Hacendado",
      "price": 2.11,
      "unit": "kg",
      "packPrice": 1.2,
      "image": "https://prod-mercadona.imgix.net/images/231e70f1833a97babe9b0ecab3bfee2c.jpg?fit=crop&h=300&w=300"
    }
  ],
  "bebida_vegetal": [
    {
      "id": "14706",
      "name": "Bebida de soja con calcio y vitaminas sin azúcares añadidos Hacendado",
      "price": 0.65,
      "unit": "L",
      "packPrice": 3.9,
      "image": "https://prod-mercadona.imgix.net/images/35c4dba47482ff8310d7ea1b811a7d53.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "29322",
      "name": "Bebida de soja 0% azúcar Hacendado",
      "price": 0.75,
      "unit": "L",
      "packPrice": 4.5,
      "image": "https://prod-mercadona.imgix.net/images/78bb6c24a5d530445f7f3fbac945c0f5.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "52639",
      "name": "Bebida de avena Hacendado 0% azúcar",
      "price": 0.75,
      "unit": "L",
      "packPrice": 4.5,
      "image": "https://prod-mercadona.imgix.net/images/d37ca9bd4e181ab7c222ab18a0d579d4.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "23908",
      "name": "Bebida de avena Alitey",
      "price": 0.95,
      "unit": "L",
      "packPrice": 5.7,
      "image": "https://prod-mercadona.imgix.net/images/32186ccca22c37aad2a1bab07664e7a5.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "23048",
      "name": "Bebida de arroz sin azúcares añadidos Hacendado",
      "price": 1.05,
      "unit": "L",
      "packPrice": 6.3,
      "image": "https://prod-mercadona.imgix.net/images/dcfdebb7a1671e785c4b7b00108e2aee.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "15647",
      "name": "Bebida de almendras con calcio Hacendado",
      "price": 1.1,
      "unit": "L",
      "packPrice": 6.6,
      "image": "https://prod-mercadona.imgix.net/images/e4a083b607ffb5a2235cadc434a932d0.jpg?fit=crop&h=300&w=300"
    }
  ],
  "lacteos_sl": [
    {
      "id": "10730",
      "name": "Leche desnatada sin lactosa Hacendado",
      "price": 0.91,
      "unit": "L",
      "packPrice": 5.46,
      "image": "https://prod-mercadona.imgix.net/images/5ad409227bf0b1c151395585e63b169f.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "10721",
      "name": "Leche semidesnatada sin lactosa Hacendado",
      "price": 0.94,
      "unit": "L",
      "packPrice": 5.64,
      "image": "https://prod-mercadona.imgix.net/images/6b02e742d27be2ee2db0994bc431fe99.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "10698",
      "name": "Leche entera sin lactosa Hacendado",
      "price": 1.03,
      "unit": "L",
      "packPrice": 6.18,
      "image": "https://prod-mercadona.imgix.net/images/69bbee0688a23e31f488fc531273bfaa.jpg?fit=crop&h=300&w=300"
    }
  ],
  "embutido_pavo": [
    {
      "id": "59218",
      "name": "Jamón de pavo Hacendado",
      "price": 5.7,
      "unit": "kg",
      "packPrice": 2.85,
      "image": "https://prod-mercadona.imgix.net/images/0a4b8f824e5ea4032abcee4e75a9092a.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "22430",
      "name": "Maxi pavo Hacendado finas lonchas",
      "price": 7.63,
      "unit": "kg",
      "packPrice": 3.05,
      "image": "https://prod-mercadona.imgix.net/images/18d308abcd2a05dcec6ee3cc012d6e86.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "56619",
      "name": "Jamón de pavo Hacendado finas lonchas",
      "price": 8.44,
      "unit": "kg",
      "packPrice": 1.9,
      "image": "https://prod-mercadona.imgix.net/images/b7691fb2718bc66ad695bb0454823efe.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "86786",
      "name": "Pechuga de pavo reducido en sal Hacendado finas lonchas",
      "price": 9.88,
      "unit": "kg",
      "packPrice": 3.95,
      "image": "https://prod-mercadona.imgix.net/images/0743c4f754d2155a541a9363a5bf373c.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "67972",
      "name": "Pechuga de pavo Hacendado finas lonchas",
      "price": 9.88,
      "unit": "kg",
      "packPrice": 3.95,
      "image": "https://prod-mercadona.imgix.net/images/2458f24e9a065c2a16a09cae37257260.jpg?fit=crop&h=300&w=300"
    },
    {
      "id": "59283",
      "name": "Pechuga de pavo Noel lonchas muy finas",
      "price": 12.25,
      "unit": "kg",
      "packPrice": 2.45,
      "image": "https://prod-mercadona.imgix.net/images/918213955ad9fe95742e4abe7665f787.jpg?fit=crop&h=300&w=300"
    }
  ]
};

export const BASICS: Record<string, BasicProduct> = {
  "aceite": {
    "name": "Aceite de oliva virgen extra Hacendado",
    "price": 2.6,
    "image": "https://prod-mercadona.imgix.net/images/efb4b2c1a0e2cb8d9d522a815c295fa0.jpg?fit=crop&h=300&w=300"
  },
  "sal": {
    "name": "Sal fina Hacendado",
    "price": 0.4,
    "image": "https://prod-mercadona.imgix.net/images/5097b3d7450edab7c2d9586299f5f3b9.jpg?fit=crop&h=300&w=300"
  },
  "especias": {
    "name": "Orégano Hacendado",
    "price": 1,
    "image": "https://prod-mercadona.imgix.net/images/20a564cf97b2b9662bb7727d6008ed69.jpg?fit=crop&h=300&w=300"
  },
  "papel_cocina": {
    "name": "Papel cocina Gigante Absorbente Bosque Verde",
    "price": 2.95,
    "image": "https://prod-mercadona.imgix.net/images/1754c20c79fab74549f3b7f5a05bfb80.jpg?fit=crop&h=300&w=300"
  },
  "bolsas_basura": {
    "name": "Bolsas de basura 5L Bosque Verde perfumadas",
    "price": 1.4,
    "image": "https://prod-mercadona.imgix.net/images/d754e4599c7802287923bf3f49f28247.jpg?fit=crop&h=300&w=300"
  },
  "cafe": {
    "name": "Café molido natural Hacendado",
    "price": 2.5,
    "image": "https://prod-mercadona.imgix.net/images/0ba1b42865bf3024356d993498c041f1.jpg?fit=crop&h=300&w=300"
  },
  "azucar": {
    "name": "Azúcar blanco Hacendado",
    "price": 0.9,
    "image": "https://prod-mercadona.imgix.net/images/782bc97fd2960e24b4505e25b384a2d4.jpg?fit=crop&h=300&w=300"
  },
  "condimentos": {
    "name": "Salsa Miel y Mostaza Hacendado",
    "price": 1.45,
    "image": "https://prod-mercadona.imgix.net/images/bf1910aae611cceecb9f3f477905425b.jpg?fit=crop&h=300&w=300"
  },
  "huevos": {
    "name": "Huevos grandes L",
    "price": 1.8,
    "image": "https://prod-mercadona.imgix.net/images/f320cc362d58afd514c38aae399c6cec.jpg?fit=crop&h=300&w=300"
  }
};

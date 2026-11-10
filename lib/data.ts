export const STAY_TYPES = ['Hotels', 'Lodges', 'Camps', 'Villas', 'Guesthouses'] as const;
export type StayType = (typeof STAY_TYPES)[number];

export type RegionSlug =
  | 'volcanoes'
  | 'lake-kivu'
  | 'nyungwe'
  | 'akagera'
  | 'kigali'
  | 'twin-lakes';

export interface Region {
  slug: RegionSlug;
  name: string;
  place: string;
  tagline: string;
  image: string;
  highlights: string[];
  bestTime: string;
  altitude: string;
  intro: string;
  description: string[];
}

export interface Stay {
  slug: string;
  name: string;
  type: StayType;
  region: RegionSlug;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  capacity: number;
  beds: string;
  images: string[];
  tagline: string;
  description: string[];
  amenities: string[];
  nearby: { name: string; distance: string }[];
  host: string;
  hostNote: string;
  badge?: string;
}

export interface Experience {
  slug: string;
  name: string;
  region: RegionSlug;
  duration: string;
  price: number;
  groupSize: string;
  image: string;
  summary: string;
  description: string[];
  includes: string[];
  meetingPoint: string;
}

export const regions: Region[] = [
  {
    slug: 'volcanoes',
    name: 'Volcanoes',
    place: 'Musanze',
    tagline: 'Gorillas, mist and five volcanoes',
    image: '/images/destinations/volcanoes.jpg',
    highlights: ['Gorilla trekking', 'Volcano hikes', 'Twin lakes', 'Community walks'],
    bestTime: 'Jun – Sep · Dec – Feb',
    altitude: '1,850 m',
    intro: 'Bamboo forest, crater lakes and the Virunga volcanoes.',
    description: [
      'Musanze sits beneath the Virunga chain, where bamboo forest climbs the slopes of Bisoke, Muhabura and Sabyinyo. This is the only place on earth where you can spend a quiet hour with a habituated mountain gorilla family.',
      'Mornings arrive cold and clear, afternoons soften into rain and the smell of eucalyptus. Between treks there are volcanic caves, canoe mornings on Ruhondo, and cooperatives where your visit pays for school fees.',
    ],
  },
  {
    slug: 'lake-kivu',
    name: 'Lake Kivu',
    place: 'Rubavu & Karongi',
    tagline: 'Beaches, boats and slow sunsets',
    image: '/images/destinations/lake-kivu.jpg',
    highlights: ['Beach days', 'Kayaking', 'Coffee tours', 'Sunset cruises'],
    bestTime: 'May – Sep · Dec – Feb',
    altitude: '1,460 m',
    intro: "Rwanda's inland sea, ringed by green hills and fishing villages.",
    description: [
      'Lake Kivu runs along the western edge of Rwanda in a chain of bays and peninsulas. Rubavu (Gisenyi) is the lively north shore; Karongi (Kibuye) is quieter, with islands you can paddle to before breakfast.',
      'Swim off warm sand, sail at golden hour, and eat fresh sambaza by the water. Inland, coffee washing stations and breweries welcome visitors who want to understand what grows on these slopes.',
    ],
  },
  {
    slug: 'nyungwe',
    name: 'Nyungwe',
    place: 'Nyungwe Forest',
    tagline: 'Rainforest canopy and swinging bridges',
    image: '/images/destinations/nyungwe.jpg',
    highlights: ['Canopy walk', 'Chimpanzees', 'Birding', 'Tea estates'],
    bestTime: 'Jun – Aug · Dec – Feb',
    altitude: '2,100 m',
    intro: 'One of Africa’s oldest rainforests, just south of the tea belt.',
    description: [
      'Nyungwe is 1,000 square kilometres of ancient montane forest, home to chimpanzees, colobus monkeys and more than 300 bird species. Mist moves through the canopy like weather in a film.',
      'Walk the suspended canopy trail, follow the waterfall route, or simply sit at Uwinka and listen. The surrounding tea estates make a gentle contrast to the forest — bright green rows and cool air.',
    ],
  },
  {
    slug: 'akagera',
    name: 'Akagera',
    place: 'Eastern savannah',
    tagline: 'Big Five country on the eastern plains',
    image: '/images/destinations/akagera.jpg',
    highlights: ['Game drives', 'Boat safaris', 'Birding', 'Tented camps'],
    bestTime: 'Jun – Sep · Dec – Feb',
    altitude: '1,300 m',
    intro: 'Lakes, papyrus and open savannah along the Tanzanian border.',
    description: [
      'Akagera is Rwanda’s only big-game park: lion, rhino, elephant, buffalo and leopard move between open plains and a network of lakes. It is a remarkable conservation turnaround story, led by African Parks since 2010.',
      'Drive at dawn when the light is low and the grazers are out. In the afternoon, switch to a boat on Lake Ihema for hippos, crocodiles and fish eagles — the park feels completely different from the water.',
    ],
  },
  {
    slug: 'kigali',
    name: 'Kigali',
    place: 'The capital',
    tagline: 'Galleries, coffee and clean green streets',
    image: '/images/destinations/kigali.jpg',
    highlights: ['City tours', 'Coffee culture', 'Art & design', 'Nightlife'],
    bestTime: 'Year round',
    altitude: '1,567 m',
    intro: 'A calm, walkable capital built across a dozen hills.',
    description: [
      'Kigali is often the first and last stop of a Rwandan trip — a city of ridge-top views, small galleries and excellent coffee. The convention centre dome is an easy landmark; the real city lives in its neighbourhoods.',
      'Start at the Genocide Memorial, spend the afternoon in Kimironko market, and end with a tasting at one of the roasteries in Kiyovu. Distances are short and the streets are safe to walk in the evening.',
    ],
  },
  {
    slug: 'twin-lakes',
    name: 'Twin Lakes',
    place: 'Burera & Ruhondo',
    tagline: 'Canoes, cycling and five-volcano views',
    image: '/images/destinations/twin-lakes.jpg',
    highlights: ['Canoeing', 'Cycling', 'Hillside hikes', 'Birding'],
    bestTime: 'Jun – Sep · Dec – Feb',
    altitude: '1,800 m',
    intro: 'Two lakes tucked between the Virunga volcanoes.',
    description: [
      'Lakes Burera and Ruhondo sit in a green basin north of Musanze, with the volcanic chain reflected on still water. The loop between them is one of the country’s best half-day bike rides.',
      'Stay on a hillside lodge, paddle out with fishermen at sunrise, and eat lunch on a terrace with a view of five peaks. It is close to the gorilla park but feels like a separate, quieter country.',
    ],
  },
];

export const stays: Stay[] = [
  {
    slug: 'volcano-view-lodge',
    name: 'Volcano View Lodge',
    type: 'Lodges',
    region: 'volcanoes',
    location: 'Kinigi, Musanze',
    price: 210000,
    rating: 4.9,
    reviews: 128,
    capacity: 2,
    beds: '1 king bed',
    images: [
      '/images/stays/volcano-view-lodge-1.jpg',
      '/images/stays/volcano-view-lodge-2.jpg',
      '/images/stays/volcano-view-lodge-3.jpg',
    ],
    tagline: 'Wake to mist rolling off Bisoke.',
    description: [
      'Volcano View Lodge sits on a quiet ridge above Kinigi, where a lawn falls away toward the Virunga foothills. Rooms are warm and simple: eucalyptus beams, wool throws and windows framed on Mount Bisoke.',
      'The park briefing point is a ten-minute drive away, and the kitchen packs a hot breakfast for 5am starts. Evenings end around the fire pit with tea from the surrounding hills.',
    ],
    amenities: [
      'Mountain view',
      'Breakfast included',
      'Fireplace lounge',
      'Restaurant',
      'Wi-Fi',
      'Free parking',
      'Airport transfer',
      'Garden',
    ],
    nearby: [
      { name: 'Gorilla trek briefing, Kinigi', distance: '10 min drive' },
      { name: 'Musanze caves', distance: '15 min drive' },
      { name: 'Twin Lakes viewpoint', distance: '25 min drive' },
      { name: 'Kigali International Airport', distance: '2.5 h drive' },
    ],
    host: 'Claudine & Eric',
    hostNote:
      'We grew up in Kinigi and love sending guests to the community coffee washing station down the road.',
    badge: 'Guest favourite',
  },
  {
    slug: 'kivu-serenity-hotel',
    name: 'Kivu Serenity Hotel',
    type: 'Hotels',
    region: 'lake-kivu',
    location: 'Rubavu, Gisenyi',
    price: 145000,
    rating: 4.8,
    reviews: 214,
    capacity: 3,
    beds: '1 king + 1 sofa bed',
    images: [
      '/images/stays/kivu-serenity-hotel-1.jpg',
      '/images/stays/kivu-serenity-hotel-2.jpg',
      '/images/stays/kivu-serenity-hotel-3.jpg',
    ],
    tagline: "Slow mornings on Rwanda's inland sea.",
    description: [
      'A lakeside hotel with a private stretch of sand, Kivu Serenity is built for long breakfasts and late swims. The best rooms open straight onto the water; the rest look through palms to the same view.',
      'Borrow a kayak before the wind picks up, then take the lakeside path into town for brochettes and a cold drink. It is an easy, comfortable base for exploring the northern shore.',
    ],
    amenities: [
      'Lake view',
      'Pool',
      'Breakfast included',
      'Restaurant',
      'Bar',
      'Wi-Fi',
      'Free parking',
      'Airport transfer',
    ],
    nearby: [
      { name: 'Gisenyi waterfront', distance: '5 min walk' },
      { name: 'Rubavu thermal springs', distance: '10 min drive' },
      { name: 'Kayak jetty', distance: '2 min walk' },
      { name: 'Kigali International Airport', distance: '3 h drive' },
    ],
    host: 'Aline',
    hostNote:
      'Ask me for the fisherman’s path along the bay — it is the quietest walk in Rubavu at sunrise.',
  },
  {
    slug: 'canopy-eco-camp',
    name: 'Canopy Eco Camp',
    type: 'Camps',
    region: 'nyungwe',
    location: 'Nyungwe Forest',
    price: 180000,
    rating: 4.7,
    reviews: 96,
    capacity: 2,
    beds: '1 queen bed',
    images: [
      '/images/stays/canopy-eco-camp-1.jpg',
      '/images/stays/canopy-eco-camp-2.jpg',
      '/images/stays/canopy-eco-camp-3.jpg',
    ],
    tagline: 'Sleep inside the rainforest canopy.',
    description: [
      'The camp is built into a fold of the forest, with wooden cabins raised on stilts so the sounds of Nyungwe pass underneath. Wake to colobus monkeys moving through the trees above the bed.',
      'Uwinka visitor centre is a short forest drive away for the canopy walk, and guides lead night walks from camp to look for owls and bushbabies. Power is solar; hot water runs on clear days.',
    ],
    amenities: [
      'Forest view',
      'Guided walks',
      'Breakfast included',
      'Restaurant',
      'Fireplace',
      'Solar power',
      'Hot shower',
      'Wi-Fi in lounge',
    ],
    nearby: [
      { name: 'Uwinka canopy walk', distance: '25 min drive' },
      { name: 'Nyungwe waterfall trail', distance: '40 min drive' },
      { name: 'Gisovu tea estate', distance: '50 min drive' },
      { name: 'Kigali International Airport', distance: '5 h drive' },
    ],
    host: 'Jean-Bosco',
    hostNote:
      'I was a park guide for eleven years. The best birding is right at camp, before the mist lifts.',
  },
  {
    slug: 'savannah-tented-camp',
    name: 'Savannah Tented Camp',
    type: 'Camps',
    region: 'akagera',
    location: 'Akagera, Eastern Province',
    price: 260000,
    rating: 4.9,
    reviews: 173,
    capacity: 2,
    beds: '1 king bed',
    images: [
      '/images/stays/savannah-tented-camp-1.jpg',
      '/images/stays/savannah-tented-camp-2.jpg',
      '/images/stays/savannah-tented-camp-3.jpg',
    ],
    tagline: 'Canvas, cool water and the sounds of the bush.',
    description: [
      'Set just inside the southern gate, the camp puts you in position for dawn game drives without a long transfer. Tents are spacious, with proper beds, a small veranda and outdoor chairs facing the plains.',
      'Spend the middle of the day by the pool, then head out again for the golden hour. Dinner is served under lanterns, and the camp’s guides can arrange a boat safari on Lake Ihema for the following morning.',
    ],
    amenities: [
      'Savannah view',
      'Safari drives',
      'Pool',
      'Breakfast included',
      'Bar',
      'Wi-Fi in lounge',
      'Solar power',
      'Airport transfer',
    ],
    nearby: [
      { name: 'Akagera south gate', distance: '5 min drive' },
      { name: 'Lake Ihema boat jetty', distance: '30 min drive' },
      { name: 'Kigali International Airport', distance: '2.5 h drive' },
      { name: 'Karenge bush camp', distance: '1.5 h drive' },
    ],
    host: 'Joyce',
    hostNote:
      'We keep our sightings board updated every evening. Lions are most often seen on the northern loop at first light.',
    badge: 'Safari favourite',
  },
  {
    slug: 'hill-suites-kigali',
    name: 'Hill Suites Kigali',
    type: 'Hotels',
    region: 'kigali',
    location: 'Kiyovu, Kigali',
    price: 120000,
    rating: 4.6,
    reviews: 342,
    capacity: 2,
    beds: '1 queen bed',
    images: [
      '/images/stays/hill-suites-kigali-1.jpg',
      '/images/stays/hill-suites-kigali-2.jpg',
      '/images/stays/hill-suites-kigali-3.jpg',
    ],
    tagline: 'A calm, competent base in the middle of the city.',
    description: [
      'Hill Suites is the kind of city hotel that makes a trip easy: quick check-in, a decent pool, reliable Wi-Fi and breakfast that starts early. Rooms are quiet, with big windows and good desks.',
      'You are a short walk from Kiyovu coffee shops and a ten-minute drive from the convention centre. The rooftop terrace catches the evening breeze and a long view across the ridges.',
    ],
    amenities: [
      'City view',
      'Pool',
      'Breakfast included',
      'Gym',
      'Restaurant',
      'Wi-Fi',
      'Free parking',
      'Airport transfer',
    ],
    nearby: [
      { name: 'Kigali Convention Centre', distance: '10 min drive' },
      { name: 'Kimironko market', distance: '20 min drive' },
      { name: 'Kigali Genocide Memorial', distance: '15 min drive' },
      { name: 'Kigali International Airport', distance: '25 min drive' },
    ],
    host: 'Patrick',
    hostNote:
      'I keep a short list of independent coffee bars near the hotel — ask at reception, it changes monthly.',
  },
  {
    slug: 'lakeside-villa-kibuye',
    name: 'Lakeside Villa Kibuye',
    type: 'Villas',
    region: 'lake-kivu',
    location: 'Karongi, Kibuye',
    price: 175000,
    rating: 4.8,
    reviews: 87,
    capacity: 4,
    beds: '2 bedrooms · 2 king beds',
    images: [
      '/images/stays/lakeside-villa-kibuye-1.jpg',
      '/images/stays/lakeside-villa-kibuye-2.jpg',
      '/images/stays/lakeside-villa-kibuye-3.jpg',
    ],
    tagline: 'Your own deck, your own jetty, no schedule.',
    description: [
      'A two-bedroom villa on a quiet bay outside Karongi, with a long wooden deck that ends at the water. It is the sort of place where the day’s plan is breakfast, a swim, and a book in the shade.',
      'The kitchen is properly equipped if you want to cook; otherwise the team can arrange a cook for the evening. A small boat is available for island picnics and sunset paddles.',
    ],
    amenities: [
      'Lake view',
      'Private deck',
      'Boat dock',
      'Breakfast included',
      'Kitchen',
      'Wi-Fi',
      'Free parking',
      'Fireplace',
    ],
    nearby: [
      { name: 'Karongi town', distance: '12 min drive' },
      { name: 'Napoleon Island', distance: '20 min by boat' },
      { name: 'Kibuye memorial centre', distance: '15 min drive' },
      { name: 'Kigali International Airport', distance: '3.5 h drive' },
    ],
    host: 'Sandrine',
    hostNote:
      'There are two kayaks in the boathouse. The bay is calmest before 8am — take coffee with you.',
  },
  {
    slug: 'ibisi-garden-guesthouse',
    name: 'Ibisi Garden Guesthouse',
    type: 'Guesthouses',
    region: 'kigali',
    location: 'Kiyovu, Kigali',
    price: 65000,
    rating: 4.5,
    reviews: 156,
    capacity: 2,
    beds: '1 double bed',
    images: [
      '/images/stays/ibisi-garden-guesthouse-1.jpg',
      '/images/stays/ibisi-garden-guesthouse-2.jpg',
      '/images/stays/ibisi-garden-guesthouse-3.jpg',
    ],
    tagline: 'A small garden, good coffee and a family welcome.',
    description: [
      'Ibisi is a seven-room guesthouse behind a green gate in Kiyovu. The garden is the heart of it: papyrus, a mango tree, and tables where guests end up talking over breakfast longer than planned.',
      'Rooms are simple and spotless, with fans and mosquito nets. It is excellent value for a first night in Kigali, and the team can arrange airport pickups and city walks.',
    ],
    amenities: [
      'Garden',
      'Breakfast included',
      'Wi-Fi',
      'Free parking',
      'Restaurant',
      'Terrace',
      'Laundry',
      'Family rooms',
    ],
    nearby: [
      { name: 'Kigali Convention Centre', distance: '8 min drive' },
      { name: 'Café Kiyovu', distance: '5 min walk' },
      { name: 'Niyo Cultural Centre', distance: '12 min drive' },
      { name: 'Kigali International Airport', distance: '25 min drive' },
    ],
    host: 'Mireille',
    hostNote:
      'The guesthouse started as my grandmother’s home. Breakfast is still cooked in the same kitchen.',
  },
  {
    slug: 'bisate-ridge-retreat',
    name: 'Bisate Ridge Retreat',
    type: 'Lodges',
    region: 'volcanoes',
    location: 'Bisate, Musanze',
    price: 340000,
    rating: 5.0,
    reviews: 64,
    capacity: 2,
    beds: '1 king bed',
    images: [
      '/images/stays/bisate-ridge-retreat-1.jpg',
      '/images/stays/bisate-ridge-retreat-2.jpg',
      '/images/stays/bisate-ridge-retreat-3.jpg',
    ],
    tagline: 'A quiet, generous retreat facing the volcanoes.',
    description: [
      'High on a ridge near Bisate, this small retreat is all stone, timber and framed views of three peaks. The pace is deliberately slow: a fire in the lounge, a long bath, and a guide who plans your trek around the weather.',
      'The lodge works with a reforestation project on the surrounding hills and grows much of its own produce. It is the kind of stay you remember for the silence as much as the service.',
    ],
    amenities: [
      'Mountain view',
      'Spa',
      'Fireplace',
      'Restaurant',
      'Bar',
      'Guided walks',
      'Airport transfer',
      'Wi-Fi',
    ],
    nearby: [
      { name: 'Gorilla trek briefing, Kinigi', distance: '20 min drive' },
      { name: 'Bisate reforestation trail', distance: '5 min walk' },
      { name: 'Twin Lakes', distance: '30 min drive' },
      { name: 'Kigali International Airport', distance: '2.5 h drive' },
    ],
    host: 'Emmanuel',
    hostNote:
      'We plant a native tree for every guest stay. You are welcome to come and see the nursery.',
    badge: 'Signature stay',
  },
  {
    slug: 'rubavu-beach-villa',
    name: 'Rubavu Beach Villa',
    type: 'Villas',
    region: 'lake-kivu',
    location: 'Rubavu, Gisenyi',
    price: 230000,
    rating: 4.7,
    reviews: 71,
    capacity: 6,
    beds: '3 bedrooms · 3 king beds',
    images: [
      '/images/stays/rubavu-beach-villa-1.jpg',
      '/images/stays/rubavu-beach-villa-2.jpg',
      '/images/stays/rubavu-beach-villa-3.jpg',
    ],
    tagline: 'A family house right on the sand.',
    description: [
      'Three bedrooms, a wide lawn and a gate that opens directly onto the lake. Rubavu Beach Villa is built for groups who want space: grandparents on the veranda, children in the water, everyone together at dinner.',
      'The pool is set back from the beach for breezy afternoons, and the house comes with a cook on request. Boats can pick you up from the beach for a sunset cruise.',
    ],
    amenities: [
      'Private beach',
      'Pool',
      'Lake view',
      'Breakfast included',
      'Kitchen',
      'Boat dock',
      'Wi-Fi',
      'Free parking',
    ],
    nearby: [
      { name: 'Gisenyi town centre', distance: '10 min drive' },
      { name: 'Lake Kivu boat jetty', distance: '5 min walk' },
      { name: 'Rubavu thermal springs', distance: '15 min drive' },
      { name: 'Kigali International Airport', distance: '3 h drive' },
    ],
    host: 'Nadia',
    hostNote:
      'We can stock the kitchen before you arrive and arrange a cook for the week — just message ahead.',
  },
  {
    slug: 'nyarutarama-inn',
    name: 'Nyarutarama Inn',
    type: 'Guesthouses',
    region: 'kigali',
    location: 'Nyarutarama, Kigali',
    price: 90000,
    rating: 4.4,
    reviews: 203,
    capacity: 2,
    beds: '1 queen bed',
    images: [
      '/images/stays/nyarutarama-inn-1.jpg',
      '/images/stays/nyarutarama-inn-2.jpg',
      '/images/stays/nyarutarama-inn-3.jpg',
    ],
    tagline: 'Quiet residential Kigali, close to everything.',
    description: [
      'Tucked into a leafy street in Nyarutarama, this small inn is five minutes from the golf course and ten from the convention centre. Rooms have proper beds, good showers and blackout curtains for jet lag.',
      'Breakfast is served on a shaded terrace, and the neighbourhood is one of the nicest for an evening walk. It is a practical, friendly base rather than a resort — and priced accordingly.',
    ],
    amenities: [
      'Garden',
      'Breakfast included',
      'Wi-Fi',
      'Free parking',
      'Terrace',
      'Laundry',
      'Restaurant',
      'Airport transfer',
    ],
    nearby: [
      { name: 'Nyarutarama golf course', distance: '5 min walk' },
      { name: 'Kigali Convention Centre', distance: '10 min drive' },
      { name: 'Question Coffee', distance: '12 min drive' },
      { name: 'Kigali International Airport', distance: '20 min drive' },
    ],
    host: 'Diane',
    hostNote:
      'The terrace is the best spot for breakfast. Ask me about the running route around the lake.',
  },
  {
    slug: 'twin-lakes-retreat',
    name: 'Twin Lakes Retreat',
    type: 'Lodges',
    region: 'twin-lakes',
    location: 'Ruhondo, Burera',
    price: 195000,
    rating: 4.8,
    reviews: 59,
    capacity: 4,
    beds: '2 bedrooms · 2 queen beds',
    images: [
      '/images/stays/twin-lakes-retreat-1.jpg',
      '/images/stays/twin-lakes-retreat-2.jpg',
      '/images/stays/twin-lakes-retreat-3.jpg',
    ],
    tagline: 'Five volcanoes, two lakes, one quiet hillside.',
    description: [
      'The retreat sits high above Lake Ruhondo, with a view that takes in five Virunga peaks on a clear morning. Cottages are thatched and simple, each with a private terrace facing the water.',
      'Canoes wait at the jetty below, and the lodge can organise the Twin Lakes cycling loop with a picnic on the shore. It is close to the gorillas but feels like a different, slower country.',
    ],
    amenities: [
      'Lake view',
      'Canoeing',
      'Breakfast included',
      'Fireplace',
      'Restaurant',
      'Wi-Fi',
      'Free parking',
      'Guided walks',
    ],
    nearby: [
      { name: 'Lake Ruhondo jetty', distance: '5 min walk' },
      { name: 'Twin Lakes cycling loop', distance: 'At the gate' },
      { name: 'Gorilla trek briefing, Kinigi', distance: '40 min drive' },
      { name: 'Kigali International Airport', distance: '3 h drive' },
    ],
    host: 'Olivier',
    hostNote:
      'Sunrise is at 6:05. I will bring coffee to your terrace at ten to — the volcanoes are clearest then.',
  },
  {
    slug: 'gisovu-tea-lodge',
    name: 'Gisovu Tea Estate Lodge',
    type: 'Lodges',
    region: 'nyungwe',
    location: 'Gisovu, Western Province',
    price: 160000,
    rating: 4.6,
    reviews: 48,
    capacity: 2,
    beds: '1 queen bed',
    images: [
      '/images/stays/gisovu-tea-lodge-1.jpg',
      '/images/stays/gisovu-tea-lodge-2.jpg',
      '/images/stays/gisovu-tea-lodge-3.jpg',
    ],
    tagline: 'Tea-green hills between forest and lake.',
    description: [
      'On the edge of the Gisovu tea estate, this lodge looks out over some of the most photographed hills in Rwanda. The air is cool and bright, and the afternoons smell of cut tea.',
      'Walk with pickers in the morning, tour the factory, then take the forest road toward Nyungwe for the canopy walk. Dinner is simple Rwandan cooking, served at a long communal table.',
    ],
    amenities: [
      'Tea estate views',
      'Breakfast included',
      'Guided walks',
      'Fireplace',
      'Restaurant',
      'Wi-Fi',
      'Free parking',
      'Hot shower',
    ],
    nearby: [
      { name: 'Gisovu tea factory', distance: '10 min drive' },
      { name: 'Nyungwe canopy walk', distance: '1.5 h drive' },
      { name: 'Kivu lakeshore', distance: '40 min drive' },
      { name: 'Kigali International Airport', distance: '4.5 h drive' },
    ],
    host: 'Clémentine',
    hostNote:
      'My family has picked tea on this estate for three generations. The morning walk with the pickers is my favourite part of the day.',
  },
];

export const experiences: Experience[] = [
  {
    slug: 'gorilla-trekking',
    name: 'Gorilla trekking in the Virunga',
    region: 'volcanoes',
    duration: 'Half day · 3–6 hours',
    price: 1250000,
    groupSize: 'Max 8 guests',
    image: '/images/experiences/gorilla-trekking.jpg',
    summary:
      'Spend one quiet hour with a habituated mountain gorilla family in Volcanoes National Park.',
    description: [
      'Rangers track each family from the previous evening, so the morning is a guided walk through bamboo and open meadow rather than a search. You will be assigned to one family based on fitness and group size; porters carry bags and help on the steep sections.',
      'The hour with the gorillas is strictly protected and completely unhurried. Permits are limited, and proceeds fund conservation and community projects around the park.',
    ],
    includes: ['Gorilla permit', 'Park ranger and tracker', 'Porter', 'Bottled water'],
    meetingPoint: 'Kinigi park headquarters, Musanze',
  },
  {
    slug: 'golden-monkey-trekking',
    name: 'Golden monkey trek',
    region: 'volcanoes',
    duration: '3–4 hours',
    price: 250000,
    groupSize: 'Max 8 guests',
    image: '/images/experiences/golden-monkey-trekking.jpg',
    summary:
      'Follow troops of golden monkeys through the bamboo at the foot of the volcanoes.',
    description: [
      'Golden monkeys are quick, sociable and endlessly entertaining, moving through the bamboo in loose troops. The walk is usually shorter than gorilla trekking and often on gentler ground.',
      'Your guide will explain how the troops use the bamboo zone and how tourism income supports park-edge communities.',
    ],
    includes: ['Park permit', 'Guide', 'Porter', 'Bottled water'],
    meetingPoint: 'Kinigi park headquarters, Musanze',
  },
  {
    slug: 'kivu-boat-cruise',
    name: 'Sunset boat cruise on Lake Kivu',
    region: 'lake-kivu',
    duration: '2 hours',
    price: 65000,
    groupSize: 'Max 10 guests',
    image: '/images/experiences/kivu-boat-cruise.jpg',
    summary:
      'Leave the shore in the late afternoon for islands, fishing boats and a slow Kivu sunset.',
    description: [
      'A small boat, a local captain and the calm of the bay as the light drops. The route follows the shoreline past fishing villages and a couple of small islands, with time to stop for photographs.',
      'Drinks and snacks are on board. Bring a light layer — the lake cools quickly after sunset.',
    ],
    includes: ['Boat and captain', 'Life jackets', 'Drinks and snacks', 'Hotel pickup in Rubavu'],
    meetingPoint: 'Gisenyi waterfront jetty',
  },
  {
    slug: 'nyungwe-canopy-walk',
    name: 'Nyungwe canopy walk',
    region: 'nyungwe',
    duration: '3 hours',
    price: 60000,
    groupSize: 'Max 12 guests',
    image: '/images/experiences/nyungwe-canopy-walk.jpg',
    summary:
      'Cross a suspended bridge 50 metres above the rainforest floor.',
    description: [
      'The canopy walk is a short, well-built trail that ends on a 70-metre suspension bridge above the forest. Guides point out orchids, hornbills and the occasional blue monkey troop below.',
      'It is suitable for most fitness levels, though the bridge moves with the group. Morning slots tend to have the clearest views and the most bird activity.',
    ],
    includes: ['Canopy walk permit', 'Forest guide', 'Bottled water', 'Walking poles on request'],
    meetingPoint: 'Uwinka visitor centre, Nyungwe',
  },
  {
    slug: 'akagera-game-drive',
    name: 'Akagera game drive',
    region: 'akagera',
    duration: 'Full day',
    price: 180000,
    groupSize: 'Max 6 guests',
    image: '/images/experiences/akagera-game-drive.jpg',
    summary:
      'A full day across the savannah and lakes with a dedicated guide and 4x4.',
    description: [
      'Start before sunrise at the south gate and work north through the park, scanning open plains for zebra, giraffe, elephant and lion. The route is flexible and follows the previous day’s sightings.',
      'Lunch is a packed box under a fig tree, with a stop at one of the lake viewpoints. Binoculars and a field guide are in the vehicle.',
    ],
    includes: ['4x4 and guide', 'Park entry fees', 'Lunch box', 'Bottled water', 'Binoculars'],
    meetingPoint: 'Akagera south gate',
  },
  {
    slug: 'kigali-city-tour',
    name: 'Kigali city & coffee walk',
    region: 'kigali',
    duration: '4 hours',
    price: 85000,
    groupSize: 'Max 8 guests',
    image: '/images/experiences/kigali-city-tour.jpg',
    summary:
      'Ridges, markets, galleries and a proper Rwandan coffee tasting.',
    description: [
      'A half-day walk through the city with a local guide: the convention centre, a neighbourhood market, a small design studio and a coffee bar where you taste the difference between washed and natural beans.',
      'Transport between stops is included, but the best moments are on foot. Bring a hat and comfortable shoes.',
    ],
    includes: ['Local guide', 'Coffee tasting', 'Transport between stops', 'Bottled water'],
    meetingPoint: 'Kigali Convention Centre forecourt',
  },
  {
    slug: 'intore-cultural-village',
    name: 'Intore dance & community village',
    region: 'volcanoes',
    duration: '3 hours',
    price: 55000,
    groupSize: 'Max 20 guests',
    image: '/images/experiences/intore-cultural-village.jpg',
    summary:
      'Intore drumming, dance and a craft workshop with families near Kinigi.',
    description: [
      'Intore means “the chosen” and the dance is one of Rwanda’s most recognisable traditions: drums, leaps and the white headdress of the dancers. The performance is followed by a short workshop on basket weaving and pottery.',
      'Visits are arranged directly with the cooperative, so the fee goes to the families who host you. It is a warm, informal afternoon rather than a staged show.',
    ],
    includes: ['Dance performance', 'Craft workshop', 'Tea and snacks', 'Local guide'],
    meetingPoint: 'Kinigi community hall',
  },
  {
    slug: 'twin-lakes-cycling',
    name: 'Twin Lakes cycling loop',
    region: 'twin-lakes',
    duration: 'Half day',
    price: 70000,
    groupSize: 'Max 10 guests',
    image: '/images/experiences/twin-lakes-cycling.jpg',
    summary:
      'Ride the green ridge between Lakes Burera and Ruhondo with volcano views.',
    description: [
      'The loop between the lakes is roughly 30 kilometres of quiet dirt road, climbing gently between fishing villages and tea plots. Mountain bikes and helmets are provided, with a support vehicle following.',
      'A picnic lunch is set up on the shore of Lake Burera, facing the volcanoes. Fitness matters more than experience; the pace is relaxed and there are plenty of stops.',
    ],
    includes: ['Mountain bike and helmet', 'Cycling guide', 'Support vehicle', 'Picnic lunch', 'Water'],
    meetingPoint: 'Ruhondo lodge jetty, Burera',
  },
  {
    slug: 'tea-estate-walk',
    name: 'Gisovu tea estate walk',
    region: 'nyungwe',
    duration: '2–3 hours',
    price: 45000,
    groupSize: 'Max 12 guests',
    image: '/images/experiences/tea-estate-walk.jpg',
    summary:
      'Walk the pickers’ paths and see how Rwandan tea moves from bush to cup.',
    description: [
      'Tea has shaped these hills for decades. Walk out with a guide before the heat builds, learn how the top two leaves are picked, then follow the load to the Gisovu factory for a tour and tasting.',
      'The route is gentle and mostly on estate roads. Bring a long-sleeved layer — the bushes are scratchy when you get close.',
    ],
    includes: ['Estate guide', 'Factory tour', 'Tea tasting', 'Bottled water'],
    meetingPoint: 'Gisovu tea factory',
  },
  {
    slug: 'coffee-roastery',
    name: 'Kigali coffee roastery session',
    region: 'kigali',
    duration: '2 hours',
    price: 40000,
    groupSize: 'Max 10 guests',
    image: '/images/experiences/coffee-roastery.jpg',
    summary:
      'Roast, brew and taste your way through a small Kigali roastery.',
    description: [
      'Rwandan coffee is one of the country’s quiet success stories. In this hands-on session you will roast a small batch, learn the basics of cupping, and compare a high-grown Nyungwe bean with a lower-altitude lot.',
      'You leave with a 250g bag of the beans you roasted and a short list of cafés to try around the city.',
    ],
    includes: ['Roasting session', 'Cupping and tasting', '250g beans to take home', 'Guide'],
    meetingPoint: 'Kimironko, Kigali',
  },
];

export const regionMap = Object.fromEntries(regions.map((r) => [r.slug, r])) as Record<
  RegionSlug,
  Region
>;

export function getStay(slug: string) {
  return stays.find((s) => s.slug === slug);
}

export function getExperience(slug: string) {
  return experiences.find((e) => e.slug === slug);
}

export function staysInRegion(slug: RegionSlug) {
  return stays.filter((s) => s.region === slug);
}

export function experiencesInRegion(slug: RegionSlug) {
  return experiences.filter((e) => e.region === slug);
}

export function staysOfType(type: StayType) {
  return stays.filter((s) => s.type === type);
}

export const site = {
  name: 'Hamubere Travels',
  tagline: 'Stay and explore Rwanda.',
  email: 'hello@hamubere.com',
  phone: '+250 788 000 000',
  location: 'KG 7 Avenue, Kigali, Rwanda',
  greeting: 'Murakaza neza',
};

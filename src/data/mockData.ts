import { Item, Order } from '../types';

export const CATEGORIES = [
  'All',
  'Produits',
  'Services'
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    userEmail: 'admin@marketvibe.com',
    items: [], // Will be populated if needed, but for now just IDs or empty is fine for mock
    total: 125.00,
    status: 'delivered',
    createdAt: '2024-03-01T10:00:00Z',
    shippingAddress: '123 Rue de la Paix, Tunis'
  },
  {
    id: 'ORD-002',
    userId: '1',
    userEmail: 'admin@marketvibe.com',
    total: 45.00,
    items: [],
    status: 'processing',
    createdAt: '2024-03-04T15:30:00Z',
    shippingAddress: '456 Avenue Bourguiba, Sousse'
  }
];

export const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    name: { fr: 'Lampe de bureau minimaliste', ar: 'مصباح مكتب بسيط' },
    description: { 
      fr: 'Une lampe de bureau LED élégante et réglable avec commandes tactiles.',
      ar: 'مصباح مكتب LED أنيق وقابل للتعديل مع أدوات تحكم باللمس.'
    },
    price: 45.00,
    category: 'Produits',
    type: 'product',
    image: 'https://picsum.photos/seed/lamp/600/400',
    rating: 4.8,
    reviews: 124,
    features: {
      fr: ['LED haute performance', 'Commandes tactiles', 'Luminosité réglable', 'Design minimaliste'],
      ar: ['LED عالية الأداء', 'أدوات تحكم باللمس', 'سطوع قابل للتعديل', 'تصميم بسيط']
    },
    specifications: {
      fr: { 'Matériau': 'Aluminium', 'Puissance': '10W', 'Couleur': 'Noir mat' },
      ar: { 'المادة': 'ألومنيوم', 'الطاقة': '10 واط', 'اللون': 'أسود مطفي' }
    }
  },
  {
    id: '2',
    name: { fr: 'Consultation Design UI/UX', ar: 'استشارة تصميم واجهة المستخدم' },
    description: {
      fr: 'Examen professionnel d\'une heure de votre produit numérique.',
      ar: 'مراجعة احترافية لمدة ساعة لمنتجك الرقمي مع ملاحظات قابلة للتنفيذ.'
    },
    price: 150.00,
    category: 'Services',
    type: 'service',
    image: 'https://picsum.photos/seed/design/600/400',
    rating: 4.9,
    reviews: 56,
    features: {
      fr: ['Audit complet', 'Feedback actionnable', 'Session Q&A', 'Rapport détaillé'],
      ar: ['تدقيق شامل', 'ملاحظات قابلة للتنفيذ', 'جلسة أسئلة وأجوبة', 'تقرير مفصل']
    },
    specifications: {
      fr: { 'Durée': '60 minutes', 'Format': 'Visioconférence', 'Expertise': 'Senior UI/UX' },
      ar: { 'المدة': '60 دقيقة', 'النمط': 'فيديو مباشر', 'الخبرة': 'كبير مصممي واجهة المستخدم' }
    }
  },
  {
    id: '3',
    name: { fr: 'Casque sans fil à réduction de bruit', ar: 'سماعات لاسلكية عازلة للضوضاء' },
    description: {
      fr: 'Qualité sonore premium avec annulation active du bruit.',
      ar: 'جودة صوت ممتازة مع ميزة إلغاء الضوضاء النشطة وعمر بطارية طويل.'
    },
    price: 299.99,
    category: 'Produits',
    type: 'product',
    image: 'https://picsum.photos/seed/headphones/600/400',
    rating: 4.7,
    reviews: 892
  },
  {
    id: '4',
    name: { fr: 'Coaching Fitness Personnel', ar: 'تدريب لياقة بدنية شخصي' },
    description: {
      fr: 'Plans d\'entraînement personnalisés et sessions vidéo hebdomadaires.',
      ar: 'خطط تمارين مخصصة وجلسات فيديو أسبوعية مع مدرب معتمد.'
    },
    price: 80.00,
    category: 'Services',
    type: 'service',
    image: 'https://picsum.photos/seed/fitness/600/400',
    rating: 5.0,
    reviews: 32
  },
  {
    id: '5',
    name: { fr: 'T-shirt en coton bio', ar: 'قميص قطن عضوي' },
    description: {
      fr: 'T-shirt en coton durable et de haute qualité disponible en plusieurs tons.',
      ar: 'قميص قطني مستدام وعالي الجودة متوفر بألوان ترابية متعددة.'
    },
    price: 25.00,
    category: 'Produits',
    type: 'product',
    image: 'https://picsum.photos/seed/shirt/600/400',
    rating: 4.5,
    reviews: 210
  },
  {
    id: '6',
    name: { fr: 'Session de planification financière', ar: 'جلسة تخطيط مالي' },
    description: {
      fr: 'Conseils d\'experts sur le budget, les investissements et les objectifs.',
      ar: 'نصائح خبراء حول الميزانية والاستثمارات والأهداف المالية طويلة المدى.'
    },
    price: 200.00,
    category: 'Services',
    type: 'service',
    image: 'https://picsum.photos/seed/finance/600/400',
    rating: 4.8,
    reviews: 45
  },
  {
    id: '7',
    name: { fr: 'Montre intelligente Série X', ar: 'ساعة ذكية الفئة X' },
    description: {
      fr: 'Suivez votre santé, recevez des notifications et restez connecté.',
      ar: 'تتبع صحتك، واستقبل التنبيهات، وابقَ على اتصال دائم.'
    },
    price: 199.00,
    category: 'Produits',
    type: 'product',
    image: 'https://picsum.photos/seed/smartwatch/600/400',
    rating: 4.6,
    reviews: 450
  },
  {
    id: '8',
    name: { fr: 'Stratégie Médias Sociaux', ar: 'استراتيجية التواصل الاجتماعي' },
    description: {
      fr: 'Audit complet et plan de croissance pour votre marque.',
      ar: 'تدقيق شامل وخطة نمو لعلامتك التجارية عبر جميع المنصات الرئيسية.'
    },
    price: 500.00,
    category: 'Services',
    type: 'service',
    image: 'https://picsum.photos/seed/social/600/400',
    rating: 4.9,
    reviews: 18
  }
];

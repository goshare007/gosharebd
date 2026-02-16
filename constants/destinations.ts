import type { DestinationType } from '@/types/destination';

export const destinations: DestinationType[] = [
  {
    slug: 'dhaka',
    name: 'Dhaka',
    coverImage:
      'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=1920&h=800&fit=crop',
    region: 'Dhaka Division',
    description:
      'Experience the vibrant capital city of Bangladesh. Discover centuries of history, explore bustling markets, savor authentic street food, and immerse yourself in the rich cultural heritage of Dhaka.',
    highlights: [
      'Historic Monuments',
      'Local Markets',
      'Street Food Tours',
      'Cultural Sites',
      'River Cruise',
      'Museum Visits',
    ],
    totalPackages: 6,
    couplePackages: 4,
    packages: [
      {
        id: 1,
        slug: 'dhaka-heritage-walk',
        destination: 'Dhaka',
        destinationSlug: 'dhaka',
        title: 'Dhaka Heritage & Culture Walk',
        tagline: 'A journey through 400 years of Mughal and Colonial history',
        image:
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1582654117081-37d457492c73?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop',
        ],
        rating: 4.5,
        duration: '1 Day (8 hours)',
        groupSize: '15-25 people',
        pricePerPerson: 4500,
        originalPricePerPerson: 5500,
        couplePrice: null,
        isCouple: false,
        isBestseller: true,
        category: 'History & Heritage',
        description:
          "Uncover the soul of Old Dhaka. This immersive walking tour takes you through the labyrinthine alleys of the 17th-century Mughal capital. You'll explore majestic forts, iconic pink palaces, and vibrant spice markets while learning about the architectural brilliance and cultural shifts that shaped modern Bangladesh.",
        highlights: [
          'Mughal architecture at Lalbagh Fort',
          'Ahsan Manzil (The Pink Palace) tour',
          'Rickshaw ride through Shakhari Bazar',
          'Traditional wooden boat ride at Sadarghat',
          'Authentic Old Dhaka Biryani lunch',
          'Visit to the Star Mosque (Tara Masjid)',
        ],
        included: [
          'AC transportation for pickups',
          'English-speaking historian guide',
          'All monument entrance fees',
          'Traditional rickshaw fare',
          'Full lunch and bottled water',
          'Guided walking tour',
        ],
        notIncluded: [
          'Personal shopping',
          'Tips for guide and driver',
          'Travel insurance',
        ],
        itinerary: [
          {
            time: '8:30 AM',
            title: 'Hotel Pickup',
            description:
              'Meet your guide and travel to the historic center in an AC vehicle.',
          },
          {
            time: '10:00 AM',
            title: 'Lalbagh Fort',
            description:
              'Explore the 17th-century Mughal fortress and the tomb of Pari Bibi.',
          },
          {
            time: '12:00 PM',
            title: 'Shakhari Bazar',
            description:
              'A sensory walk through the colorful "Hindu Street" known for artisans.',
          },
          {
            time: '1:30 PM',
            title: 'Heritage Lunch',
            description:
              'Savor authentic Kacchi Biryani at a local legendary eatery.',
          },
          {
            time: '3:00 PM',
            title: 'Ahsan Manzil',
            description:
              'Visit the grand residence of the Nawabs overlooking the river.',
          },
          {
            time: '4:30 PM',
            title: 'Sadarghat River Port',
            description:
              'Witness the chaotic beauty of the river terminal from a wooden boat.',
          },
        ],
        availableDates: [
          { date: '2026-03-01', slots: 12 },
          { date: '2026-03-05', slots: 8 },
        ],
        tourGuide: {
          name: 'Tanvir Hossain',
          image:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          role: 'Heritage Specialist',
          experience: '10 years',
          languages: ['English', 'Bengali'],
          rating: 4.8,
          tours: 520,
        },
        reviews: [],
        policies: {
          cancellation: 'Free cancellation up to 48 hours before the tour.',
          weatherPolicy: 'Operates in most conditions; rain gear provided.',
          ageRestriction: 'Suitable for all ages.',
          groupSize: 'Maximum 25 people per shared group.',
        },
      },
      {
        id: 2,
        slug: 'dhaka-romantic-evening',
        destination: 'Dhaka',
        destinationSlug: 'dhaka',
        title: 'Dhaka Romantic Evening Tour',
        image:
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
        tagline: 'A perfect evening for couples exploring Dhaka',
        images: [
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=1200&h=800&fit=crop',
        ],
        rating: 4.8,
        duration: '1 Day (6 hours)',
        groupSize: 'Private (2 people)',
        pricePerPerson: 3500,
        originalPricePerPerson: 4500,
        couplePrice: 6500,
        originalCouplePrice: 8500,
        isCouple: true,
        isBestseller: false,
        category: 'Culture & Romance',
        description:
          "Experience the magic of Dhaka as the sun sets. This exclusive tour is designed for couples looking to explore the city's romantic side. Enjoy a private boat cruise on the Buriganga River, watch the sunset from the best viewpoints, and end with a candlelight dinner at a riverside restaurant.",
        highlights: [
          'Private rickshaw tour of Old Dhaka',
          'Sunset boat cruise on Buriganga River',
          'Visit to Ahsan Manzil (Pink Palace)',
          'Romantic dinner at riverside restaurant',
          'Professional photography service',
          'Complimentary flower bouquet',
        ],
        included: [
          'Private transportation',
          'Professional English-speaking guide',
          'All entrance fees',
          'Boat cruise tickets',
          'Romantic dinner for two',
          'Bottled water',
          'Photography service',
          'Flower bouquet',
        ],
        notIncluded: [
          'Personal expenses',
          'Tips and gratuities',
          'Travel insurance',
          'Additional food and drinks',
        ],
        itinerary: [
          {
            time: '4:00 PM',
            title: 'Pickup from Hotel',
            description:
              'Our guide will pick you up from your hotel in a private vehicle.',
          },
          {
            time: '4:30 PM',
            title: 'Old Dhaka Rickshaw Tour',
            description:
              'Explore the narrow streets of Old Dhaka on a decorated rickshaw.',
          },
          {
            time: '5:30 PM',
            title: 'Ahsan Manzil Visit',
            description:
              'Visit the iconic Pink Palace and learn about its rich history.',
          },
          {
            time: '6:30 PM',
            title: 'Sunset River Cruise',
            description:
              'Board a private boat for a romantic sunset cruise on the Buriganga River.',
          },
          {
            time: '7:30 PM',
            title: 'Romantic Dinner',
            description:
              'Enjoy a candlelight dinner at a premium riverside restaurant.',
          },
          {
            time: '9:00 PM',
            title: 'Drop-off at Hotel',
            description: 'Return to your hotel with wonderful memories.',
          },
        ],
        availableDates: [
          { date: '2026-02-20', slots: 3 },
          { date: '2026-02-21', slots: 5 },
        ],
        tourGuide: {
          name: 'Ahmed Rahman',
          image:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          role: 'Senior Tour Guide',
          experience: '8 years',
          languages: ['English', 'Bengali', 'Hindi'],
          rating: 4.9,
          tours: 450,
        },
        reviews: [
          {
            id: 1,
            name: 'Sarah & John',
            avatar:
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            rating: 5,
            date: 'January 2026',
            comment:
              'Absolutely magical evening! Ahmed was an excellent guide.',
            images: [
              'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=400&h=300&fit=crop',
            ],
          },
        ],
        policies: {
          cancellation:
            'Free cancellation up to 24 hours before the tour starts.',
          weatherPolicy: 'In case of bad weather, we will reschedule.',
          ageRestriction: 'Adults only. Children under 12 not permitted.',
          groupSize: 'Private tour for couples (2 people).',
        },
      },
      {
        id: 3,
        slug: 'dhaka-food-tour',
        destination: 'Dhaka',
        destinationSlug: 'dhaka',
        title: 'Dhaka Street Food Adventure',
        tagline: 'A culinary marathon through the flavors of Bangladesh',
        image:
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1567103472667-6898f3a99ee2?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1601050638917-3d84876d7bbd?w=1200&h=800&fit=crop',
        ],
        rating: 4.9,
        duration: '1 Day (5 hours)',
        groupSize: '10-15 people',
        pricePerPerson: 3000,
        originalPricePerPerson: 3800,
        couplePrice: 5500,
        originalCouplePrice: 7000,
        isCouple: true,
        isBestseller: true,
        category: 'Culinary & Food',
        description:
          'Dhaka is the street food capital of the world. From the Mughal-influenced kebabs of Nazira Bazar to the spicy Fuchka of TSC, this tour is a guided feast. We prioritize hygiene while ensuring you taste the most legendary dishes the city has to offer.',
        highlights: [
          'Tasting 10+ different street food items',
          'Famous Old Dhaka Kacchi Biryani',
          'Tea session with local street dwellers',
          'Visit to a century-old sweet shop',
          'Market walk through Kawran Bazar',
        ],
        included: [
          'Expert food guide',
          'All food and drink tastings',
          'Hand sanitizer and tissue kit',
          'Bottled water',
          'Local rickshaw/CNG transport',
        ],
        notIncluded: ['Main meals beyond tastings', 'Hotel transfers', 'Tips'],
        itinerary: [
          {
            time: '4:00 PM',
            title: 'University Area Start',
            description: 'Kick off with spicy Fuchka and Chotpoti at TSC.',
          },
          {
            time: '5:30 PM',
            title: 'Nazira Bazar Feast',
            description: 'Dive into Bakarkhani, kebabs, and flavored milk.',
          },
          {
            time: '7:30 PM',
            title: 'The Main Event',
            description:
              'Sit down for the legendary Hajir Biryani in Old Dhaka.',
          },
          {
            time: '8:30 PM',
            title: 'Sweet Ending',
            description: 'Sample Mishti Doi and Rasgulla at a heritage shop.',
          },
        ],
        availableDates: [
          { date: '2026-02-22', slots: 10 },
          { date: '2026-02-25', slots: 15 },
        ],
        tourGuide: {
          name: 'Nadia Islam',
          image:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
          role: 'Culinary Enthusiast',
          experience: '5 years',
          languages: ['English', 'Bengali'],
          rating: 5.0,
          tours: 310,
        },
        reviews: [],
        policies: {
          cancellation: 'Refundable up to 24 hours.',
          weatherPolicy: 'Tour continues unless there is severe flooding.',
          ageRestriction: 'All ages; please advise on food allergies.',
          groupSize: 'Small group experience (max 15).',
        },
      },
      {
        id: 4,
        slug: 'dhaka-museum-tour',
        destination: 'Dhaka',
        destinationSlug: 'dhaka',
        title: 'Dhaka Museum & Art Tour',
        tagline: 'Exploring the art, history, and resilience of a nation',
        image:
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1518998053502-517e205ae246?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=1200&h=800&fit=crop',
        ],
        rating: 4.6,
        duration: '1 Day (7 hours)',
        groupSize: '12-20 people',
        pricePerPerson: 3800,
        originalPricePerPerson: 4500,
        couplePrice: null,
        isCouple: false,
        isBestseller: false,
        category: 'Art & Education',
        description:
          "Perfect for history buffs and art lovers. This tour focuses on the National Museum's vast collection of artifacts and the moving Liberation War Museum. We end the day at private galleries showcasing contemporary Bangladeshi artists.",
        highlights: [
          'Bangladesh National Museum artifacts',
          'Liberation War Museum guided tour',
          'Contemporary art at Drik Gallery',
          'Sculpture garden visit',
          'Lunch at a museum-themed café',
        ],
        included: [
          'AC transport between sites',
          'Professional art historian guide',
          'All museum entrance fees',
          'Light lunch and beverages',
        ],
        notIncluded: ['Personal camera fees', 'Souvenirs', 'Tips'],
        itinerary: [
          {
            time: '10:00 AM',
            title: 'National Museum',
            description: 'Focus on Buddhist sculptures and terracotta art.',
          },
          {
            time: '1:00 PM',
            title: 'Bistro Lunch',
            description: 'Gourmet lunch at a local art-inspired café.',
          },
          {
            time: '2:30 PM',
            title: 'Liberation War Museum',
            description: 'A deep dive into the history of the 1971 war.',
          },
          {
            time: '4:30 PM',
            title: 'Private Gallery Tour',
            description:
              'Visit a rotating exhibition of modern photography or painting.',
          },
        ],
        availableDates: [{ date: '2026-03-10', slots: 15 }],
        tourGuide: {
          name: 'Dr. Zaman',
          image:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          role: 'Curator & Historian',
          experience: '15 years',
          languages: ['English', 'Bengali', 'French'],
          rating: 4.7,
          tours: 125,
        },
        reviews: [],
        policies: {
          cancellation: '72 hours notice for full refund.',
          weatherPolicy: 'Rainy day friendly (Indoor).',
          ageRestriction: 'Recommended for ages 10+.',
          groupSize: 'Standard group size (max 20).',
        },
      },
      {
        id: 5,
        slug: 'dhaka-weekend-getaway',
        destination: 'Dhaka',
        destinationSlug: 'dhaka',
        title: 'Dhaka Weekend Getaway',
        tagline: 'The ultimate 2-day capital staycation',
        image:
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=1200&h=800&fit=crop',
        ],
        rating: 4.7,
        duration: '2 Days 1 Night',
        groupSize: '8-12 people',
        pricePerPerson: 8500,
        originalPricePerPerson: 10000,
        couplePrice: 15500,
        originalCouplePrice: 18000,
        isCouple: true,
        isBestseller: false,
        category: 'Luxury & Staycation',
        description:
          "Escape the grind with a fully managed weekend in the city. Includes a night at a luxury 5-star hotel, gourmet dining, and a curated tour of Dhaka's best shopping and cultural hotspots.",
        highlights: [
          'Overnight stay at a 5-star hotel (InterContinental/Similar)',
          'Gourmet dinner and breakfast buffet',
          'Curated shopping tour at Aarong and malls',
          'Morning wellness/pool session',
          'Private car service for two days',
        ],
        included: [
          'Hotel accommodation (Twin share)',
          'Breakfast, Lunch, and Dinner',
          'Private AC car with driver',
          'Personal concierge guide',
          'All taxes and service charges',
        ],
        notIncluded: ['Laundry', 'Spa treatments', 'Alcoholic drinks'],
        itinerary: [
          {
            time: 'Day 1: 2:00 PM',
            title: 'Check-in',
            description: 'Luxury hotel check-in and welcome drink.',
          },
          {
            time: 'Day 1: 7:00 PM',
            title: 'Fine Dining',
            description: 'Multi-course dinner at a premium rooftop restaurant.',
          },
          {
            time: 'Day 2: 10:00 AM',
            title: 'Artisan Shopping',
            description: 'Visit the flagship Aarong for traditional crafts.',
          },
          {
            time: 'Day 2: 3:00 PM',
            title: 'Hatirjheel Ride',
            description: 'Leisurely evening drive and water taxi tour.',
          },
        ],
        availableDates: [{ date: '2026-02-27', slots: 4 }],
        tourGuide: {
          name: 'Safa Karim',
          image:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
          role: 'Lifestyle Guide',
          experience: '6 years',
          languages: ['English', 'Bengali'],
          rating: 4.9,
          tours: 90,
        },
        reviews: [],
        policies: {
          cancellation: 'Non-refundable if cancelled within 7 days.',
          weatherPolicy: 'Activities modified for weather.',
          ageRestriction: 'None.',
          groupSize: 'Small group or private.',
        },
      },
      {
        id: 6,
        slug: 'dhaka-photography-walk',
        destination: 'Dhaka',
        destinationSlug: 'dhaka',
        title: 'Dhaka Photography Walk',
        tagline: 'Capture the chaotic harmony of the megacity',
        image:
          'https://images.unsplash.com/photo-1523978591478-c753949ff840?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=800&fit=crop',
        ],
        rating: 4.8,
        duration: '1 Day (6 hours)',
        groupSize: '8-12 people',
        pricePerPerson: 4200,
        originalPricePerPerson: 5000,
        couplePrice: 7500,
        originalCouplePrice: 9000,
        isCouple: true,
        isBestseller: false,
        category: 'Workshop & Creative',
        description:
          "Led by an award-winning street photographer, this tour focuses on the most 'Instagrammable' and raw locations. We time our visits perfectly for the golden hour at the shipyards and river ports.",
        highlights: [
          'Portrait photography at Kawran Bazar',
          'Golden hour at Buriganga shipyards',
          'Street life at the Railway Station',
          'Post-walk photo review session',
          'Technical tips on light and composition',
        ],
        included: [
          'Professional photographer mentor',
          'Local transport & rickshaws',
          'Entry to gritty/exclusive locations',
          'Afternoon snacks and tea',
          'Bottled water',
        ],
        notIncluded: ['Camera equipment', 'Tripods', 'Lunch'],
        itinerary: [
          {
            time: '2:00 PM',
            title: 'Briefing',
            description: 'Technical overview and gear check.',
          },
          {
            time: '3:30 PM',
            title: 'Kawran Bazar',
            description: 'Street photography among the wholesalers.',
          },
          {
            time: '5:00 PM',
            title: 'Sadarghat Sunset',
            description: 'The ultimate river life photo session.',
          },
          {
            time: '7:30 PM',
            title: 'Review & Tea',
            description: 'Gather for tea and discuss the day’s captures.',
          },
        ],
        availableDates: [{ date: '2026-03-15', slots: 8 }],
        tourGuide: {
          name: 'Rashed Ahmed',
          image:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
          role: 'Lead Photographer',
          experience: '12 years',
          languages: ['English', 'Bengali'],
          rating: 4.9,
          tours: 180,
        },
        reviews: [],
        policies: {
          cancellation: 'Full refund up to 48 hours.',
          weatherPolicy: 'Rain photography workshop included if it rains.',
          ageRestriction: '12+ with adult supervision.',
          groupSize: 'Maximum 12 participants.',
        },
      },
    ],
  },
  {
    slug: 'sylhet',
    name: 'Sylhet',
    coverImage:
      'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80',
    region: 'Sylhet Division',
    description:
      'Explore the lush green tea gardens, stunning hills, and serene rivers of Sylhet. A perfect destination for nature lovers and those seeking tranquility.',
    highlights: [
      'Tea Gardens',
      'Ratargul Swamp Forest',
      'Jaflong',
      'Lalakhal',
      'Madhabkunda Waterfall',
    ],
    totalPackages: 4,
    couplePackages: 2,
    packages: [
      {
        id: 1,
        slug: 'sylhet-nature-tour',
        destination: 'Sylhet',
        destinationSlug: 'sylhet',
        title: 'Sylhet Nature Exploration',
        tagline: 'Embrace the emerald landscapes and crystal waters',
        image:
          'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1622215174246-0683693d2568?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1583253802999-4a04d9b4b9b0?w=1200&h=800&fit=crop',
        ],
        duration: '2 Days 1 Night',
        groupSize: '10-20 people',
        pricePerPerson: 7500,
        originalPricePerPerson: 8500,
        couplePrice: 14000,
        originalCouplePrice: 16000,
        rating: 4.8,
        category: 'Nature & Wildlife',
        isCouple: true,
        isBestseller: true,
        description:
          "Experience the iconic 'Green City' of Bangladesh. This tour takes you through the only swamp forest in the country, the crystal-clear Lalakhal, and the rolling tea estates that define the horizon of Sylhet.",
        highlights: [
          'Ratargul Swamp Forest Boat Safari',
          'Sunset Boat Trip at Lalakhal',
          'Tea Garden Photography',
          'Jaflong Zero Point and Stone Collection',
        ],
        included: [
          'AC Transport from Sylhet city',
          'Cottage Stay at Tea Garden Resort',
          'All Boat Rentals',
          'Breakfast and Lunch for 2 days',
          'Expert Nature Guide',
        ],
        notIncluded: [
          'Personal medicines',
          'Dinner on Day 1',
          'Travel Insurance',
        ],
        itinerary: [
          {
            time: 'Day 1: 9:00 AM',
            title: 'Ratargul Swamp Forest',
            description:
              'Navigate the submerged forest on a traditional wooden boat.',
          },
          {
            time: 'Day 1: 4:00 PM',
            title: 'Lalakhal Boat Trip',
            description:
              'Witness the blue waters change color during the sunset.',
          },
          {
            time: 'Day 2: 10:00 AM',
            title: 'Malnicherra Tea Garden',
            description: 'Explore the oldest tea garden in the subcontinent.',
          },
          {
            time: 'Day 2: 2:00 PM',
            title: 'Jaflong Zero Point',
            description:
              'Visit the India-Bangladesh border and the Dauki river.',
          },
        ],
        availableDates: [
          { date: '2026-03-12', slots: 10 },
          { date: '2026-03-15', slots: 6 },
        ],
        tourGuide: {
          name: 'Zakir Hossain',
          image:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          role: 'Nature Specialist',
          experience: '7 years',
          languages: ['English', 'Bengali', 'Sylheti'],
          rating: 4.9,
          tours: 320,
        },
        reviews: [],
        policies: {
          cancellation: 'Free cancellation 72 hours before departure.',
          weatherPolicy: 'Boat trips may be rescheduled for heavy rainfall.',
          ageRestriction: 'Suitable for all ages.',
          groupSize: 'Shared group tour.',
        },
      },
      {
        id: 2,
        slug: 'sylhet-adventure-trip',
        destination: 'Sylhet',
        destinationSlug: 'sylhet',
        title: 'Sylhet Adventure Trip',
        tagline: 'Hike, trek, and discover hidden waterfalls',
        image:
          'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1622215174246-0683693d2568?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1583253802999-4a04d9b4b9b0?w=1200&h=800&fit=crop',
        ],
        duration: '3 Days 2 Nights',
        groupSize: '8-15 people',
        pricePerPerson: 10500,
        originalPricePerPerson: 12000,
        couplePrice: null,
        rating: 4.7,
        category: 'Adventure & Trekking',
        isCouple: false,
        isBestseller: false,
        description:
          'For the thrill-seekers! This package moves beyond the tourists paths and into the deep hills. We will trek to hidden waterfalls, camp under the stars, and explore the rugged terrain of the Sreemangal and Sylhet borders.',
        highlights: [
          'Ham Ham Waterfall Trekking',
          'Hillside Camping Experience',
          'Off-road Jeep Safari',
          'Visit to Tribal Villages',
        ],
        included: [
          'Jeep (Chander Gari) transport',
          'Camping gear & Tents',
          'All Meals (BBQ Dinner included)',
          'Trekking poles & First Aid',
          'Local tribal guide',
        ],
        notIncluded: ['Personal trekking shoes', 'Tips', 'Porters'],
        itinerary: [
          {
            time: 'Day 1: 8:00 AM',
            title: 'Ham Ham Trek',
            description:
              'A challenging 4-hour trek through dense jungle to the waterfall.',
          },
          {
            time: 'Day 1: 8:00 PM',
            title: 'BBQ & Camping',
            description: 'Night stay in professional tents with a campfire.',
          },
          {
            time: 'Day 2: 10:00 AM',
            title: 'Madhabkunda Fall',
            description: 'Visit the highest waterfall in Bangladesh.',
          },
        ],
        availableDates: [{ date: '2026-04-01', slots: 8 }],
        tourGuide: {
          name: 'Adnan Sami',
          image:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
          role: 'Adventure Lead',
          experience: '5 years',
          languages: ['English', 'Bengali'],
          rating: 4.8,
          tours: 140,
        },
        reviews: [],
        policies: {
          cancellation: 'Non-refundable within 48 hours.',
          weatherPolicy: 'Trek may be canceled if flash flood warnings exist.',
          ageRestriction: '15-50 years (requires physical fitness).',
          groupSize: 'Small group adventure.',
        },
      },
      {
        id: 3,
        slug: 'sylhet-romantic-getaway',
        destination: 'Sylhet',
        destinationSlug: 'sylhet',
        title: 'Sylhet Romantic Getaway',
        tagline: 'Luxury, serenity, and love in the tea capital',
        image:
          'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1583253802999-4a04d9b4b9b0?w=1200&h=800&fit=crop',
        ],
        duration: '2 Days 1 Night',
        groupSize: 'Private (2 people)',
        pricePerPerson: 9500,
        originalPricePerPerson: 11000,
        couplePrice: 18000,
        originalCouplePrice: 21000,
        rating: 4.9,
        category: 'Romance & Luxury',
        isCouple: true,
        isBestseller: false,
        description:
          'An intimate escape designed exclusively for couples. Stay at a premium boutique resort nestled inside a tea garden. Enjoy private boat rides, candlelight dinners, and a personalized itinerary that respects your privacy.',
        highlights: [
          'Premium Resort Stay (Grand Sultan or similar)',
          'Private Candlelight Dinner under the stars',
          'Couples Spa Treatment',
          'Private boat cruise at Lalakhal',
        ],
        included: [
          'Private AC Car with chauffeur',
          'Luxury Suite accommodation',
          'All meals (Gourmet style)',
          'Decorated boat for private cruise',
          'Welcome flower bouquet',
        ],
        notIncluded: ['Tips', 'Additional room service', 'Laundry'],
        itinerary: [
          {
            time: '12:00 PM',
            title: 'VIP Check-in',
            description: 'Arrive at the luxury resort with a private welcome.',
          },
          {
            time: '4:00 PM',
            title: 'High Tea',
            description: 'Enjoy tea tasting in the middle of a private garden.',
          },
          {
            time: '8:00 PM',
            title: 'Candlelight Dinner',
            description: 'A 5-course meal in a secluded garden spot.',
          },
        ],
        availableDates: [
          { date: '2026-02-28', slots: 2 },
          { date: '2026-03-14', slots: 3 },
        ],
        tourGuide: {
          name: 'Farhana Ahmed',
          image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
          role: 'Guest Relations',
          experience: '4 years',
          languages: ['English', 'Bengali'],
          rating: 5.0,
          tours: 65,
        },
        reviews: [],
        policies: {
          cancellation: '100% refund up to 7 days before check-in.',
          weatherPolicy: 'Activities moved to indoor luxury lounges.',
          ageRestriction: 'Adults only.',
          groupSize: 'Strictly private (2 people).',
        },
      },
      {
        id: 4,
        slug: 'sylhet-photography-expedition',
        destination: 'Sylhet',
        destinationSlug: 'sylhet',
        title: 'Sylhet Photography Expedition',
        tagline: 'Master the art of landscape and light',
        image:
          'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop',
        ],
        duration: '2 Days',
        groupSize: '6-10 people',
        pricePerPerson: 8000,
        originalPricePerPerson: 9000,
        couplePrice: null,
        rating: 4.8,
        category: 'Educational & Creative',
        isCouple: false,
        isBestseller: true,
        description:
          'Led by a travel photography veteran, this expedition focuses on capturing the mist-covered tea gardens and the turquoise waters of Sylhet. We cover long-exposure techniques, portraiture of tribal tea workers, and post-processing.',
        highlights: [
          'Sunrise shoot at a private tea estate',
          'Macro photography workshop (flora)',
          'Tribal life portrait session',
          'Evening photo editing masterclass',
        ],
        included: [
          'Photography Mentor fees',
          'Transport to remote shoot locations',
          'Access permits for private estates',
          'Snacks and beverages',
          'Tripod rentals (on request)',
        ],
        notIncluded: ['Main camera gear', 'Accommodation', 'Lunch'],
        itinerary: [
          {
            time: '5:30 AM',
            title: 'Blue Hour Shoot',
            description: 'Capturing the fog over the tea hills.',
          },
          {
            time: '11:00 AM',
            title: 'Tribal Village',
            description: 'Portraits of the Khasi community workers.',
          },
          {
            time: '6:00 PM',
            title: 'Editing Suite',
            description: 'Post-processing workflow in Lightroom/Photoshop.',
          },
        ],
        availableDates: [{ date: '2026-03-20', slots: 5 }],
        tourGuide: {
          name: 'Imtiaz Alam',
          image:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          role: 'Visual Artist',
          experience: '11 years',
          languages: ['English', 'Bengali'],
          rating: 4.9,
          tours: 210,
        },
        reviews: [],
        policies: {
          cancellation: 'Full refund 5 days prior.',
          weatherPolicy: 'Rain photography techniques covered if wet.',
          ageRestriction: '12+ with equipment.',
          groupSize: 'Intimate workshop group.',
        },
      },
    ],
  },
  {
    slug: 'coxs-bazar',
    name: "Cox's Bazar",
    coverImage:
      'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1200&h=800&fit=crop',
    region: 'Chittagong Division',
    description: "World's longest natural sea beach with stunning sunsets",
    highlights: ['Beach Resort', 'Sunset Views', 'Water Sports', 'Seafood'],
    totalPackages: 4,
    couplePackages: 2,
    packages: [
      {
        id: 1,
        slug: 'coxs-bazar-beach-holiday',
        destination: "Cox's Bazar",
        destinationSlug: 'coxs-bazar',
        title: "Cox's Bazar Beach Holiday",
        tagline: "Sun, sand, and serenity at the world's longest natural beach",
        image:
          'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1200&h=800&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&h=800&fit=crop',
        ],
        rating: 4.9,
        duration: '3 Days 2 Nights',
        groupSize: '10-20 people',
        pricePerPerson: 9500,
        originalPricePerPerson: 11000,
        couplePrice: 18000,
        originalCouplePrice: 21000,
        isCouple: true,
        isBestseller: true,
        category: 'Beach & Leisure',
        description:
          "Unwind at the world's longest unbroken sea beach. This package combines the vibrant energy of Laboni Point with the tranquil, coral-strewn shores of Inani. Whether you want to witness a majestic sunset over the Bay of Bengal or cruise along the scenic Marine Drive, this holiday offers the perfect coastal escape.",
        highlights: [
          'Scenic drive on the 80km Marine Drive',
          'Visit to Himchari National Park & Waterfall',
          'Sunset views at Inani Coral Beach',
          'Traditional seafood dinner experience',
          'Shopping at the Burmese Market',
        ],
        included: [
          '3-star beachfront hotel accommodation',
          'Daily buffet breakfast',
          'AC transport for sightseeing',
          'Airport/Bus station transfers',
          'Professional local guide',
          'Entry fees for Himchari Park',
        ],
        notIncluded: [
          'Parasailing or Jet Ski rentals',
          'Lunch and Dinner (except welcome dinner)',
          'Personal shopping and tips',
        ],
        itinerary: [
          {
            time: 'Day 1: 10:00 AM',
            title: 'Arrival & Check-in',
            description:
              'Pick up from the airport/bus terminal and check into your beachfront resort.',
          },
          {
            time: 'Day 1: 5:00 PM',
            title: 'Sunset at Laboni',
            description:
              'Enjoy leisure time and the first sunset at the city’s most iconic beach point.',
          },
          {
            time: 'Day 2: 9:00 AM',
            title: 'Marine Drive Expedition',
            description:
              'A long drive between the sea and hills towards Himchari and Inani Beach.',
          },
          {
            time: 'Day 2: 1:00 PM',
            title: 'Inani Coral Exploration',
            description:
              'Walk among the unique coral stones and enjoy a fresh coconut by the sea.',
          },
          {
            time: 'Day 3: 10:00 AM',
            title: 'Burmese Market',
            description:
              'Visit the local market for pearls, traditional pickles, and handmade crafts.',
          },
        ],
        availableDates: [
          { date: '2026-03-01', slots: 15 },
          { date: '2026-03-10', slots: 12 },
        ],
        tourGuide: {
          name: 'Sagor Ahmed',
          image:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          role: 'Coastal Specialist',
          experience: '6 years',
          languages: ['English', 'Bengali', 'Hindi'],
          rating: 4.8,
          tours: 380,
        },
        reviews: [],
        policies: {
          cancellation: '80% refund if cancelled 7 days before the trip.',
          weatherPolicy:
            'Parasailing and boat trips are subject to tide and weather conditions.',
          ageRestriction: 'All ages welcome.',
          groupSize: 'Standard group (10-20) or Private options available.',
        },
      },
      {
        id: 2,
        slug: 'coxs-bazar-adventure-parasailing',
        destination: "Cox's Bazar",
        destinationSlug: 'coxs-bazar',
        title: 'Marine Drive Adventure & Parasailing',
        tagline: 'Soar above the waves and explore the hidden hills',
        image:
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1200&h=800&fit=crop',
        ],
        rating: 4.8,
        duration: '2 Days 1 Night',
        groupSize: '8-12 people',
        pricePerPerson: 12500,
        originalPricePerPerson: 15000,
        couplePrice: 22000,
        originalCouplePrice: 28000,
        isCouple: true,
        isBestseller: false,
        category: 'Adventure & Sport',
        description:
          "Experience Cox's Bazar from the sky and the rugged hills. This tour is designed for adrenaline seekers, featuring professional parasailing sessions at Reju Khal and a trekking expedition to the secret waterfalls of Himchari.",
        highlights: [
          'High-altitude Parasailing over the ocean',
          'Jet Ski racing at Kolatoli Point',
          'Trekking to the "Hidden Peak" of Himchari',
          'Moonlight Beach BBQ',
          'Open-jeep Marine Drive safari',
        ],
        included: [
          '1 Parasailing session (Standard)',
          'All adventure gear and life jackets',
          'AC Hotel accommodation',
          'Breakfast and BBQ Dinner',
          'Certified Adventure Guide',
        ],
        notIncluded: [
          'GoPro rental for footage',
          'Lunch',
          'Personal insurance',
        ],
        itinerary: [
          {
            time: 'Day 1: 11:00 AM',
            title: 'Jet Skiing & Surfing',
            description: 'Start with water sports at the main beach point.',
          },
          {
            time: 'Day 1: 3:00 PM',
            title: 'Sky High Parasailing',
            description: 'Fly 300ft above the Bay of Bengal at Reju Khal.',
          },
          {
            time: 'Day 2: 8:00 AM',
            title: 'Hill Trekking',
            description:
              'A 2-hour guided hike through the tropical forest of the national park.',
          },
        ],
        availableDates: [{ date: '2026-03-12', slots: 5 }],
        tourGuide: {
          name: 'Imran Khan',
          image:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          role: 'Adventure Instructor',
          experience: '4 years',
          languages: ['English', 'Bengali'],
          rating: 4.9,
          tours: 215,
        },
        reviews: [],
        policies: {
          cancellation: 'Refundable up to 48 hours before the flight.',
          weatherPolicy:
            'Parasailing is strictly weather-dependent; full refund if grounded.',
          ageRestriction: '12-60 years for adventure activities.',
          groupSize: 'Small group adventure.',
        },
      },
      {
        id: 3,
        slug: 'coxs-bazar-romantic-sunset-cruise',
        destination: "Cox's Bazar",
        destinationSlug: 'coxs-bazar',
        title: 'Romantic Sunset & Luxury Stay',
        tagline: 'A dreamy escape for couples by the turquoise waters',
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1200&h=800&fit=crop',
        ],
        rating: 5.0,
        duration: '3 Days 2 Nights',
        groupSize: 'Private (2 people)',
        pricePerPerson: 15500,
        originalPricePerPerson: 18000,
        couplePrice: 28500,
        originalCouplePrice: 35000,
        isCouple: true,
        isBestseller: true,
        category: 'Romance & Luxury',
        description:
          'Indulge in pure luxury with your partner. This package features a stay at a premium 5-star ocean-view suite, a private speed-boat cruise to Maheshkhali Island, and an intimate candlelight dinner right on the sands of Inani.',
        highlights: [
          'Ocean-view Luxury Suite',
          'Private Speedboat tour to Maheshkhali',
          'Candlelight Dinner at Inani Beach',
          'Couples Aromatherapy Spa',
          'Private Chauffeur for Marine Drive',
        ],
        included: [
          '5-Star Resort (Sayeman/Ocean Paradise)',
          'All gourmet meals',
          'Private Speedboat rental',
          'Spa voucher for two',
          'Welcome flower decoration',
        ],
        notIncluded: ['Alcoholic beverages', 'Laundry', 'Tips'],
        itinerary: [
          {
            time: 'Day 1: 2:00 PM',
            title: 'Royal Check-in',
            description:
              'Check into your suite with a panoramic view of the Bay.',
          },
          {
            time: 'Day 1: 7:30 PM',
            title: 'Beachfront Dinner',
            description:
              'A private table set on the sand with a personal waiter.',
          },
          {
            time: 'Day 2: 10:00 AM',
            title: 'Island Escape',
            description:
              'Private boat to the Adinath Temple on Maheshkhali Island.',
          },
        ],
        availableDates: [{ date: '2026-02-14', slots: 2 }],
        tourGuide: {
          name: 'Nilofer Yasmin',
          image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
          role: 'Concierge Manager',
          experience: '7 years',
          languages: ['English', 'Bengali'],
          rating: 5.0,
          tours: 110,
        },
        reviews: [],
        policies: {
          cancellation: 'Free cancellation 7 days before check-in.',
          weatherPolicy: 'Indoor dinner alternative available.',
          ageRestriction: 'Adults only.',
          groupSize: 'Strictly private.',
        },
      },
      {
        id: 4,
        slug: 'coxs-bazar-family-fun-tour',
        destination: "Cox's Bazar",
        destinationSlug: 'coxs-bazar',
        title: "Cox's Bazar Family Fun Package",
        tagline: 'Memories for every generation, from kids to elders',
        image:
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=1200&h=800&fit=crop',
        ],
        rating: 4.7,
        duration: '4 Days 3 Nights',
        groupSize: 'Family (4-8 people)',
        pricePerPerson: 8000,
        originalPricePerPerson: 9500,
        couplePrice: null,
        isCouple: false,
        isBestseller: false,
        category: 'Family & Group',
        description:
          'A stress-free family vacation. We handle everything from safe transport to kid-friendly meals. Visit the Radiant Fish World aquarium, enjoy a safe swimming zone at Sugandha Beach, and take a heritage tour to the Ramu Buddhist Temples.',
        highlights: [
          'Radiant Fish World (Large Aquarium) visit',
          'Ramu Buddhist Temple heritage tour',
          'Reserved family beach umbrella zone',
          'Evening cultural show and dinner',
          'Maheshkhali Island ferry ride',
        ],
        included: [
          'Interconnected Family Rooms',
          'Kid-friendly buffet meals',
          'Private Microbus for all 4 days',
          'Aquarium and Temple entry fees',
          'Dedicated family coordinator',
        ],
        notIncluded: [
          'Personal medicines',
          'Beach photography fees',
          'Shopping',
        ],
        itinerary: [
          {
            time: 'Day 1: 4:00 PM',
            title: 'Aquarium Visit',
            description: 'Explore the marine life at Radiant Fish World.',
          },
          {
            time: 'Day 2: 9:00 AM',
            title: 'Ramu Temple Tour',
            description:
              'Visit the 100ft reclining Buddha and local handicrafts.',
          },
          {
            time: 'Day 3: 11:00 AM',
            title: 'Beach Games',
            description: 'Organized family games at a private beach stretch.',
          },
        ],
        availableDates: [{ date: '2026-03-20', slots: 4 }],
        tourGuide: {
          name: 'Ariful Islam',
          image:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          role: 'Family Coordinator',
          experience: '9 years',
          languages: ['English', 'Bengali'],
          rating: 4.8,
          tours: 420,
        },
        reviews: [],
        policies: {
          cancellation: 'Full refund 5 days before.',
          weatherPolicy: 'Reschedule sightseeing if raining.',
          ageRestriction: 'None (Infant friendly).',
          groupSize: 'Private family group.',
        },
      },
    ],
  },
  {
    slug: 'sundarbans',
    name: 'Sundarbans',
    coverImage:
      'https://images.unsplash.com/photo-1551615577-1c7e180a77ac?w=800&h=600&fit=crop',
    region: 'Khulna Division',
    description:
      "World's largest mangrove forest and Royal Bengal Tiger habitat",
    highlights: [
      'Wildlife Safari',
      'Boat Tours',
      'Bird Watching',
      'Photography',
    ],
    totalPackages: 2,
    couplePackages: 1,
    packages: [
      {
        id: 1,
        slug: 'sundarbans-wildlife-safari',
        destination: 'Sundarbans',
        destinationSlug: 'sundarbans',
        title: 'Sundarbans Wildlife Safari',
        tagline:
          'A journey into the heart of the world’s largest mangrove forest',
        image:
          'https://images.unsplash.com/photo-1551615577-1c7e180a77ac?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1551615577-1c7e180a77ac?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1621871143132-721243926868?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1590424600271-f92590632df3?w=1200&h=800&fit=crop',
        ],
        rating: 4.8,
        duration: '3 Days 2 Nights',
        groupSize: '8-12 people',
        pricePerPerson: 15000,
        originalPricePerPerson: 17000,
        couplePrice: 28000,
        originalCouplePrice: 32000,
        isCouple: true,
        isBestseller: true,
        category: 'Wildlife & Adventure',
        description:
          'Embark on a life-changing expedition to the Sundarbans. This safari takes you through the narrow creeks of the mangrove forest on a luxury tourist vessel. From spotting the Royal Bengal Tiger to watching saltwater crocodiles sunbathe on the mudflats, every moment is an adventure in this UNESCO World Heritage site.',
        highlights: [
          'Silent boat trip through narrow narrow creeks',
          'Wildlife spotting at Kotka & Hiron Point',
          'Climb the Kotka Watchtower for panoramic views',
          'Visit the Karamjal Crocodile Breeding Center',
          'Evening cultural folk songs (Bonbibi Pala) by locals',
        ],
        included: [
          'Accommodation on a premium tourist vessel (Main cabin)',
          'All meals (B/L/D) including forest BBQ',
          'Forest Department entry fees and permits',
          'Armed Forest Guards for safety',
          'Expert naturalist and guide',
          'Pick & Drop from Khulna/Mongla',
        ],
        notIncluded: [
          'Personal camera fees (DSLR)',
          'Individual tips',
          'Travel insurance',
        ],
        itinerary: [
          {
            time: 'Day 1: 8:00 AM',
            title: 'Boarding at Mongla',
            description:
              'Begin your journey toward the deep forest. Breakfast served on board.',
          },
          {
            time: 'Day 1: 4:00 PM',
            title: 'Karamjal Exploration',
            description:
              'Introduction to the ecosystem and crocodile breeding center.',
          },
          {
            time: 'Day 2: 6:00 AM',
            title: 'Canal Cruising',
            description:
              'Quiet boat trip for morning birdwatching and tiger tracking.',
          },
          {
            time: 'Day 2: 2:00 PM',
            title: 'Kotka Beach Trek',
            description:
              'Walk through the forest to the beach and climb the watchtower.',
          },
          {
            time: 'Day 3: 10:00 AM',
            title: 'Harbaria Eco Tourism',
            description:
              'Walk along the wooden trail and look for tiger pugmarks.',
          },
        ],
        availableDates: [
          { date: '2026-03-05', slots: 6 },
          { date: '2026-03-20', slots: 10 },
        ],
        tourGuide: {
          name: 'Mitu Rahman',
          image:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
          role: 'Wildlife Naturalist',
          experience: '9 years',
          languages: ['English', 'Bengali'],
          rating: 4.9,
          tours: 280,
        },
        reviews: [],
        policies: {
          cancellation: 'Refundable up to 10 days before departure.',
          weatherPolicy:
            'Subject to tide and cyclone warnings. Full refund if canceled by forest authority.',
          ageRestriction: 'Recommended for 5 years and older.',
          groupSize: 'Standard cruise capacity (8-12 per cabin group).',
        },
      },
      {
        id: 2,
        slug: 'sundarbans-photography-expedition',
        destination: 'Sundarbans',
        destinationSlug: 'sundarbans',
        title: 'Sundarbans Deep Forest Expedition',
        tagline: 'Go deeper into the wild for the perfect shot',
        image:
          'https://images.unsplash.com/photo-1611002214172-792c1f90b59a?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1611002214172-792c1f90b59a?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1547466832-172cdd9c4ad8?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1551615577-1c7e180a77ac?w=800&h=600&fit=crop',
        ],
        rating: 4.9,
        duration: '4 Days 3 Nights',
        groupSize: '6-8 people',
        pricePerPerson: 18500,
        originalPricePerPerson: 21000,
        couplePrice: null,
        isCouple: false,
        isBestseller: false,
        category: 'Photography & Research',
        description:
          "Designed for photographers and wildlife enthusiasts. This longer trip reaches the remote 'Hiron Point' and 'Dublar Char' during the sunset. We use smaller, quieter boats to get as close as possible to the wildlife without disturbing the natural habitat.",
        highlights: [
          'Visit to Hiron Point (Nilkamal) Deep Forest',
          'Sunset photography at Dublar Char island',
          'Specialized "silent engine" boat for photography',
          'Professional wildlife photography mentor',
          'Exclusive night stay in a remote forest station',
        ],
        included: [
          'Premium AC cabin on a smaller, faster vessel',
          'Extended forest permits for remote zones',
          'All meals including seafood specials',
          'Photography mentor and forest guide',
          'High-zoom binoculars for guest use',
        ],
        notIncluded: ['Camera equipment', 'Tips', 'Porters'],
        itinerary: [
          {
            time: 'Day 1: 7:00 AM',
            title: 'Deep South Journey',
            description: 'Long cruise toward the southern tip of the forest.',
          },
          {
            time: 'Day 2: 5:30 AM',
            title: 'Tiger Point Trek',
            description: 'Early morning tracking session at Hiron Point.',
          },
          {
            time: 'Day 3: 4:00 PM',
            title: 'Fisherman Village',
            description:
              'Cultural photography at the seasonal fishing village of Dublar Char.',
          },
        ],
        availableDates: [{ date: '2026-04-10', slots: 4 }],
        tourGuide: {
          name: 'Tanvir Azad',
          image:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          role: 'Wildlife Photographer',
          experience: '12 years',
          languages: ['English', 'Bengali'],
          rating: 5.0,
          tours: 150,
        },
        reviews: [],
        policies: {
          cancellation:
            'Non-refundable within 7 days due to forest permit bookings.',
          weatherPolicy: 'Strict adherence to sea-state warnings.',
          ageRestriction: '12 years and above due to long treks.',
          groupSize: 'Small, quiet group (max 8).',
        },
      },
    ],
  },
  {
    slug: 'bandarban',
    name: 'Bandarban',
    coverImage:
      'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&h=600&fit=crop',
    region: 'Chittagong Division',
    description: 'Mountain peaks, tribal culture, and adventure trekking',
    highlights: ['Mountain Trekking', 'Tribal Villages', 'Camping', 'Hiking'],
    totalPackages: 3,
    couplePackages: 1,
    packages: [
      {
        id: 1,
        slug: 'bandarban-adventure-tour',
        destination: 'Bandarban',
        destinationSlug: 'bandarban',
        title: 'Bandarban Adventure Tour',
        tagline: 'Trek the highest peaks and sleep beside the clouds',
        image:
          'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1621871143132-721243926868?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1590424600271-f92590632df3?w=1200&h=800&fit=crop',
        ],
        rating: 4.7,
        duration: '4 Days 3 Nights',
        groupSize: '6-10 people',
        pricePerPerson: 12000,
        originalPricePerPerson: 14000,
        couplePrice: 22000,
        originalCouplePrice: 26000,
        isCouple: true,
        isBestseller: false,
        category: 'Adventure & Trekking',
        description:
          'Prepare for the ultimate challenge. This expedition takes you to Boga Lake, a mysterious lake on a hilltop, and continues with a trek to Keokradong, one of the highest peaks in Bangladesh. Experience authentic tribal hospitality and witness breathtaking landscapes that look like paintings.',
        highlights: [
          'Trek to Keokradong Peak (3,235 ft)',
          'Overnight stay at Boga Lake tribal village',
          'Off-road Chander Gari (Land Rover) safari',
          'Swimming in the crystal waters of Nafakhum',
          'Interaction with the Bawm and Marma tribes',
        ],
        included: [
          'Chander Gari (Open-jeep) for hill transport',
          'Indigenous homestays and resort stays',
          'All meals (Traditional hill-tract cuisine)',
          'Certified local hill guide',
          'Police & Army permits management',
          'Trekking poles and gear assistance',
        ],
        notIncluded: [
          'Personal trekking boots',
          'Porter charges for personal bags',
          'Snacks and dry fruits',
        ],
        itinerary: [
          {
            time: 'Day 1: 10:00 AM',
            title: 'Arrival at Bandarban Town',
            description:
              'Meet the team and start the jeep journey toward Ruma Bazar.',
          },
          {
            time: 'Day 1: 4:00 PM',
            title: 'Boga Lake Arrival',
            description:
              'Reach the mysterious lake and check into the tribal cottage.',
          },
          {
            time: 'Day 2: 7:00 AM',
            title: 'Keokradong Summit',
            description:
              'Begin the 3-hour trek to the peak for a panoramic view of the hills.',
          },
          {
            time: 'Day 3: 9:00 AM',
            title: 'Nafakhum Waterfall',
            description: 'Boat ride and trek to the "Niagara of Bangladesh".',
          },
          {
            time: 'Day 4: 11:00 AM',
            title: 'Nilgiri Viewpoint',
            description:
              'Visit the highest tourist spot reachable by car before departure.',
          },
        ],
        availableDates: [
          { date: '2026-03-15', slots: 8 },
          { date: '2026-03-25', slots: 10 },
        ],
        tourGuide: {
          name: 'Mong Thowai',
          image:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
          role: 'Head Mountaineer',
          experience: '11 years',
          languages: ['English', 'Bengali', 'Marma', 'Bawm'],
          rating: 4.9,
          tours: 340,
        },
        reviews: [],
        policies: {
          cancellation: 'Refundable up to 7 days before the trek.',
          weatherPolicy:
            'Trekking routes may change during heavy monsoon for safety.',
          ageRestriction: '12-55 years (Requires good physical health).',
          groupSize: 'Small, agile group for safety.',
        },
      },
      {
        id: 2,
        slug: 'bandarban-luxury-cloud-stay',
        destination: 'Bandarban',
        destinationSlug: 'bandarban',
        title: 'Cloud-Kissed Luxury Getaway',
        tagline: 'Wake up above the clouds in premium hilltop resorts',
        image:
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop',
        ],
        rating: 4.9,
        duration: '3 Days 2 Nights',
        groupSize: 'Private (2-4 people)',
        pricePerPerson: 18000,
        originalPricePerPerson: 21000,
        couplePrice: 34000,
        originalCouplePrice: 40000,
        isCouple: true,
        isBestseller: true,
        category: 'Luxury & Relaxation',
        description:
          'Experience the majestic beauty of the Chittagong Hill Tracts without the strenuous trekking. This luxury retreat focuses on the serene viewpoints of Nilgiri and Nilachal, offering premium accommodation where the clouds literally float into your balcony.',
        highlights: [
          'Stay at the famous Nilgiri Hill Resort',
          'Sunset views from the "Golden Temple" (Buddha Dhatu Jadi)',
          'Private Chander Gari for comfortable sightseeing',
          'Cultural evening with traditional bamboo-chicken dinner',
          'Leisurely walk through the Nilachal skywalk',
        ],
        included: [
          'Stay at high-end hilltop resorts',
          'Private AC vehicle for town transfers',
          'All premium meals included',
          'Private guide for local heritage sites',
          'Refreshments and coffee during travel',
        ],
        notIncluded: ['Personal shopping', 'Laundry', 'Tips'],
        itinerary: [
          {
            time: 'Day 1: 12:00 PM',
            title: 'Check-in at Nilgiri',
            description:
              'Arrive at the most scenic hilltop resort in Bangladesh.',
          },
          {
            time: 'Day 2: 10:00 AM',
            title: 'Golden Temple Visit',
            description:
              'Explore the stunning architecture of the Dhatu Jadi temple.',
          },
          {
            time: 'Day 3: 5:00 AM',
            title: 'The Cloud Show',
            description:
              'Watch the sunrise as the valley fills with clouds below you.',
          },
        ],
        availableDates: [{ date: '2026-03-10', slots: 2 }],
        tourGuide: {
          name: 'Farhan Kabir',
          image:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
          role: 'Luxury Concierge',
          experience: '6 years',
          languages: ['English', 'Bengali'],
          rating: 5.0,
          tours: 120,
        },
        reviews: [],
        policies: {
          cancellation: 'Full refund up to 10 days before arrival.',
          weatherPolicy:
            'Fog might limit visibility; indoor luxury activities provided.',
          ageRestriction: 'None (Elderly friendly).',
          groupSize: 'Private/Family only.',
        },
      },
    ],
  },
  {
    slug: 'chittagong',
    name: 'Chittagong Hill Tracts',
    coverImage:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    region: 'Chittagong Division',
    description: 'Scenic hills, indigenous communities, and natural beauty',
    highlights: ['Hill Stations', 'Waterfalls', 'Tribal Culture', 'Lakes'],
    totalPackages: 2,
    couplePackages: 1,
    packages: [
      {
        id: 1,
        slug: 'chittagong-hill-tracts-expedition',
        destination: 'Rangamati & Sajek',
        destinationSlug: 'cht-region',
        title: 'Chittagong Hill Tracts Expedition',
        tagline: 'From the peaks of Sajek to the depths of Kaptai Lake',
        image:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1624314138470-5a2f24623f10?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1596422846543-b5c64881fe53?w=1200&h=800&fit=crop',
        ],
        rating: 4.8,
        duration: '5 Days 4 Nights',
        groupSize: '8-12 people',
        pricePerPerson: 18000,
        originalPricePerPerson: 20000,
        couplePrice: 34000,
        originalCouplePrice: 38000,
        isCouple: true,
        isBestseller: true,
        category: 'Nature & Culture',
        description:
          "The ultimate journey through the hills of Bangladesh. This expedition starts in Rangamati, the lake city, where you'll cruise the vast Kaptai Lake and visit tribal villages. The journey then moves to Sajek Valley, known as the 'Queen of Hills', where you will stay in a boutique wooden cottage and watch the sun rise above a sea of clouds.",
        highlights: [
          'Overnight stay in a premium Sajek Valley cottage',
          'Full-day private boat cruise on Kaptai Lake',
          'Visit to the Hanging Bridge (Jhula Bridge) of Rangamati',
          'Helipad sunset viewing in Sajek',
          'Traditional bamboo-shoot lunch at a tribal home',
          "Visit to the Rajwada (King's Palace) in Rangamati",
        ],
        included: [
          'AC Transport from Chittagong/Dhaka',
          '4 nights accommodation (2 nights Sajek, 2 nights Rangamati)',
          'All meals (B/L/D) including tribal specialties',
          'Private boat for Kaptai Lake exploration',
          'Entry permits for CHT region',
          'Dedicated local guide and security coordination',
        ],
        notIncluded: [
          'Personal snacks and laundry',
          'Tips for guide and boatmen',
          'Activity fees like kayaking or zip-lining',
        ],
        itinerary: [
          {
            time: 'Day 1: 9:00 AM',
            title: 'Rangamati Arrival',
            description:
              'Arrive at the lake city and check into your lakeside resort.',
          },
          {
            time: 'Day 2: 10:00 AM',
            title: 'Kaptai Lake Cruise',
            description:
              'Visit Shuvolong Waterfall and tribal markets via private boat.',
          },
          {
            time: 'Day 3: 8:00 AM',
            title: 'Journey to Sajek',
            description:
              'Scenic drive through the winding mountain roads with army escort.',
          },
          {
            time: 'Day 4: 5:30 AM',
            title: 'Sunrise at Kanlak',
            description:
              'Short trek to the highest point in Sajek to see the cloud play.',
          },
          {
            time: 'Day 5: 11:00 AM',
            title: 'Heritage Walk',
            description:
              'Visit a Lusai tribal village before heading back toward the plains.',
          },
        ],
        availableDates: [
          { date: '2026-03-10', slots: 5 },
          { date: '2026-03-25', slots: 8 },
        ],
        tourGuide: {
          name: 'Joy Chakma',
          image:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          role: 'Regional Expert',
          experience: '8 years',
          languages: ['English', 'Bengali', 'Chakma'],
          rating: 4.9,
          tours: 290,
        },
        reviews: [],
        policies: {
          cancellation: 'Refundable up to 10 days before departure.',
          weatherPolicy:
            'Sajek transport is subject to army escort timings and weather clearance.',
          ageRestriction:
            'Suitable for all ages; infants must be carried carefully.',
          groupSize: 'Standard group expedition (max 12).',
        },
      },
    ],
  },
  {
    slug: 'kuakata',
    name: 'Kuakata',
    coverImage:
      'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=800&h=600&fit=crop',
    region: 'Barisal Division',
    description: 'Panoramic sea beach - see both sunrise and sunset',
    highlights: ['Sunrise & Sunset', 'Beach', 'Buddhist Temple', 'Fishing'],
    totalPackages: 2,
    couplePackages: 1,
    packages: [
      {
        id: 1,
        slug: 'kuakata-sunrise-sunset-tour',
        destination: 'Kuakata',
        destinationSlug: 'kuakata',
        title: 'Kuakata Sunrise & Sunset Tour',
        tagline:
          'Witness the rare beauty of the rising and setting sun on the same horizon',
        image:
          'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1665152038920-e3b63b660075?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1621217584100-348278ba0235?w=1200&h=800&fit=crop',
        ],
        rating: 4.6,
        duration: '2 Days 1 Night',
        groupSize: '10-15 people',
        pricePerPerson: 8000,
        originalPricePerPerson: 9000,
        couplePrice: 15000,
        originalCouplePrice: 17500,
        isCouple: true,
        isBestseller: false,
        category: 'Coastal & Cultural',
        description:
          "Known as the 'Daughter of the Sea', Kuakata is one of the rarest beaches in the world where you can stand in one spot and see the sun rise from the sea and set back into it. This tour combines this celestial spectacle with a journey through mangrove forests, ancient Buddhist temples, and the vibrant life of the Rakhine tribe.",
        highlights: [
          'Sunrise at Gangamati Reserved Forest',
          'Boat trip to Fatrar Char (a part of the Sundarbans)',
          'Explore the ancient Kuakata Buddhist Temple',
          'Sunset at Lebur Char with fresh sea-fish BBQ',
          'Visit the 100-year-old traditional wells of the Rakhine settlers',
        ],
        included: [
          'AC/Non-AC coach from Dhaka (Round trip)',
          'Standard beachfront hotel accommodation',
          'All meals (Breakfast, Lunch, Dinner)',
          'Boat rental for Fatrar Char & Gangamati',
          'Experienced local guide',
          'Bike rental for beach exploration',
        ],
        notIncluded: [
          'Personal photography services',
          'Beach chair/umbrella rentals',
          'Personal medications and snacks',
        ],
        itinerary: [
          {
            time: 'Day 1: 8:00 AM',
            title: 'Arrival & Check-in',
            description:
              'Arrive in Kuakata, check into the hotel, and have a fresh traditional breakfast.',
          },
          {
            time: 'Day 1: 3:00 PM',
            title: 'Fatrar Char Boat Trip',
            description:
              'Explore the dense mangrove forest across the river, often called the second Sundarbans.',
          },
          {
            time: 'Day 1: 5:30 PM',
            title: 'Sunset at Lebur Char',
            description:
              'Enjoy the golden hour and local sea-fish fry at the western end of the beach.',
          },
          {
            time: 'Day 2: 5:00 AM',
            title: 'The Gangamati Sunrise',
            description:
              'Early morning bike ride to the eastern edge to witness the sun rising from the Bay of Bengal.',
          },
          {
            time: 'Day 2: 10:00 AM',
            title: 'Cultural Heritage Tour',
            description:
              'Visit the Misripara Buddhist Temple and the historical Rakhine village.',
          },
        ],
        availableDates: [
          { date: '2026-03-05', slots: 12 },
          { date: '2026-03-18', slots: 15 },
        ],
        tourGuide: {
          name: 'Abidur Rahman',
          image:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
          role: 'Coastal Naturalist',
          experience: '5 years',
          languages: ['English', 'Bengali'],
          rating: 4.7,
          tours: 190,
        },
        reviews: [],
        policies: {
          cancellation: '75% refund if cancelled 3 days before departure.',
          weatherPolicy:
            'Boat trips depend on sea conditions; if restricted, alternative inland tours will be provided.',
          ageRestriction: 'Suitable for all ages.',
          groupSize: 'Ideal for 10-15 people (Standard group size).',
        },
      },
    ],
  },
  {
    slug: 'rangamati',
    name: 'Rangamati',
    coverImage:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    region: 'Chittagong Division',
    description: 'Beautiful lake district with islands and hanging bridge',
    highlights: ['Lake Cruise', 'Hanging Bridge', 'Islands', 'Tribal Life'],
    totalPackages: 2,
    couplePackages: 1,
    packages: [
      {
        id: 1,
        slug: 'rangamati-lake-cruise',
        destination: 'Rangamati',
        destinationSlug: 'rangamati',
        title: 'Rangamati Lake Cruise',
        tagline: 'Sail through the blue heart of the Hill Tracts',
        image:
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1624314138470-5a2f24623f10?w=1200&h=800&fit=crop',
          'https://images.unsplash.com/photo-1596422846543-b5c64881fe53?w=1200&h=800&fit=crop',
        ],
        rating: 4.7,
        duration: '2 Days 1 Night',
        groupSize: '12-18 people',
        pricePerPerson: 9000,
        originalPricePerPerson: 10000,
        couplePrice: 17000,
        originalCouplePrice: 20000,
        isCouple: true,
        isBestseller: true,
        category: 'Nature & Culture',
        description:
          "Explore the serene beauty of Kaptai Lake, the largest man-made lake in South Asia. This package offers a relaxing escape where you'll sail between emerald hills, visit the iconic Hanging Bridge, and enjoy a meal at a secluded island restaurant. It’s a perfect blend of natural tranquility and indigenous heritage.",
        highlights: [
          'Full-day cruise on a traditional wooden houseboat',
          'Visit to the 300ft high Shuvolong Waterfall',
          'Authentic lunch at Peda Ting Ting Island',
          'Walk across the iconic Rangamati Hanging Bridge',
          'Visit to Rajban Vihara, the largest Buddhist temple in the country',
        ],
        included: [
          'Round-trip AC Bus (Dhaka-Rangamati-Dhaka)',
          '1-night stay at a lakeside resort (Polwel or similar)',
          'All meals (Traditional Chakma & Marma dishes)',
          'Private motorboat for sightseeing',
          'Professional local guide',
          'Entry fees for all parks and bridges',
        ],
        notIncluded: [
          'Kayaking rentals at Kaptai',
          'Personal shopping for tribal handicrafts',
          'Laundry and tips',
        ],
        itinerary: [
          {
            time: 'Day 1: 08:00 AM',
            title: 'Arrival & Lakeside Check-in',
            description:
              'Arrive at the lake city and check into your resort with a panoramic view of Kaptai Lake.',
          },
          {
            time: 'Day 1: 11:00 AM',
            title: 'Kaptai Lake Expedition',
            description:
              'Board your private boat to visit Shuvolong Waterfall and the steep-sided gorges.',
          },
          {
            time: 'Day 1: 01:30 PM',
            title: 'Island Dining',
            description:
              'Enjoy an authentic lunch featuring Bamboo-Chicken at Peda Ting Ting Island.',
          },
          {
            time: 'Day 2: 09:00 AM',
            title: 'Cultural Heritage Tour',
            description:
              'Visit the Tribal Cultural Museum and the historical Chakma Rajbari.',
          },
          {
            time: 'Day 2: 04:00 PM',
            title: 'Sunset at Hanging Bridge',
            description:
              'A final walk across the landmark bridge during the golden hour before departure.',
          },
        ],
        availableDates: [
          { date: '2026-03-05', slots: 10 },
          { date: '2026-03-12', slots: 14 },
        ],
        tourGuide: {
          name: 'Mong Marma',
          image:
            'https://images.unsplash.com/photo-1540560714873-4b4142d936a5?w=200&h=200&fit=crop',
          role: 'Local Heritage Guide',
          experience: '7 years',
          languages: ['English', 'Bengali', 'Marma'],
          rating: 4.8,
          tours: 410,
        },
        reviews: [],
        policies: {
          cancellation: '70% refund if cancelled 5 days before the trip.',
          weatherPolicy:
            'Boat tours may be rescheduled or limited during high tide or heavy monsoon.',
          ageRestriction:
            'All ages welcome (Life vests provided for children).',
          groupSize: 'Standard group size (12-18 people).',
        },
      },
    ],
  },
];

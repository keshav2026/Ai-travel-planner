export const SelectTravellersList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A solo traveller in exploration',
    icon: '🧍',
    people: '1'
  },
  {
    id: 2,
    title: 'Couple',
    desc: 'Two travellers in tandem',
    icon: '👫',
    people: '2 People'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adventurers',
    icon: '👨‍👩‍👧',
    people: '3 to 5 People'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seeker buddies',
    icon: '🧑‍🤝‍🧑',
    people: '2 to 10 People'
  },
]


export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay on a budget without compromising on fun',
    icon: '💰',
    price: 'Under $500'
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Comfortable travel without breaking the bank',
    icon: '💵',
    price: '$500 - $1000'
  },
  {
    id: 3,
    title: 'Luxury',
    desc: 'Premium travel experience',
    icon: '💎',
    price: 'Over $1000'
  }
]

export const AI_PROMPT = `Generate a trip plan for {location} for {noOfDays} days for {traveller} with a {budget} budget.
Give me Hotels options list with HotelName, Hotel address, Price (in realistic USD per night, not INR — luxury should be $300-$800/night, moderate $80-$200/night, cheap $20-$60/night), hotel image url, geo coordinates, rating, description.
Also give me itinerary with placeName, placeDetails, place image url, geo coordinates, ticket pricing, time to travel, best time to visit.
JSON format only, no markdown.`
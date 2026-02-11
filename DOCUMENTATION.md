# FoodTinder - Project Documentation & Planning

## Project Overview

FoodTinder is a mobile-first web application that combines the swiping mechanics of Tinder with the vertical scrolling experience of social media reels. Users discover food orders through an engaging, gamified interface where they swipe through food images with prices, and the app learns their preferences to recommend personalized restaurants and orders.

**Core Principle: Simplicity First** - The app prioritizes a clean, simple design with an Instagram-like social experience. Users can interact with food orders through comments and likes, creating a community-driven food discovery platform.

## Core Concept

Users scroll through a feed of food order cards (similar to Instagram Reels or TikTok) displaying:
- Food image
- Order name (e.g., "Big Mac")
- Price

Users swipe left (dislike) or right (like) on each order. Over time, the app analyzes their preferences and recommends restaurants and specific orders that match their taste profile.

## Key Features

### 1. Swipe Interface
- **Vertical scrolling** with reel-like feel
- **Swipe gestures**: Left (dislike) / Right (like)
- **Smooth animations** for card transitions
- **Mobile-first design** optimized for touch interactions

### 2. Food Order Discovery
- Display food orders with:
  - Varied high-quality food images from Unsplash (different images for each food type for better immersion)
  - Order name/description
  - Price information
  - Delivery app availability badges (Careem 🚗, Talabat 🍽️, Uber Eats 🚕) shown on swipe cards
  - Optional: Restaurant name (initially hidden to avoid bias)

### 3. Preference Learning Algorithm
- Track user swipe patterns
- Identify common themes:
  - Cuisine types (burgers, pizza, sushi, etc.)
  - Price ranges
  - Food categories (fast food, healthy, vegetarian, etc.)
  - Flavor profiles (spicy, sweet, savory, etc.)

### 4. Personalized Recommendations
- After sufficient interaction data:
  - Recommend 3-5 restaurants
  - Show specific orders from those restaurants
  - Match recommendations to user's swipe history patterns
  - **Deep Linking**: Direct order buttons for Careem, Talabat, and Uber Eats
  - Click delivery app buttons to open the app and order directly

### 5. Instagram-like Social Features
- **Like orders**: Tap heart icon to like food orders (separate from swipe actions)
- **Comment on orders**: View and add comments on food orders
- **Social feed**: See what others are liking and commenting on
- **Simple, clean UI**: Instagram-inspired design with focus on content

### 6. User Profile
- View swipe history
- Saved/liked orders
- Recommended restaurants
- Preference insights
- Liked orders collection
- Comment history

## User Flow

### Initial Experience
1. User opens the app (no login required initially, or simple onboarding)
2. Presented with first food order card
3. Swipes through orders (left/right)
4. Cards stack and animate away based on swipe direction

### Recommendation Phase
1. **Recommendations Button Appears**:
   - After viewing **10 orders** (swipes)
   - And liking **at least 2 orders**
   - A prominent **"🎯 View Recommendations"** button appears at the bottom of the screen
   
2. **Viewing Recommendations**:
   - Click the recommendations button
   - App analyzes patterns:
     - Most liked categories
     - Price preferences
     - Cuisine types
   - Shows recommendation screen:
     - "Based on your preferences, we think you'd like..."
     - List of recommended restaurants (up to 5)
     - Specific orders from those restaurants (up to 10)
   
3. **Recommendation Display**:
   - Restaurants shown with name, cuisine type, rating, and delivery time
   - Orders shown with name, description, price, and category
   - User can close and return to swiping anytime

### Social Interaction
1. Tap on a food order card to view details
2. See like count and comments
3. Like the order (heart icon)
4. Add comments or view existing comments
5. Navigate back to continue swiping

### Ongoing Experience
1. Continue swiping through new orders
2. See delivery app availability badges on each order card
3. Recommendations update as preferences evolve
4. Access saved/liked orders anytime
5. Click delivery app buttons in recommendations to deep link into Careem, Talabat, or Uber Eats
6. View restaurant details and place orders directly through delivery apps
7. Engage with community through likes and comments

## Technical Architecture

### Frontend
- **Framework**: React (or Vue.js) for component-based UI
- **Styling**: CSS-in-JS or Tailwind CSS for mobile-first responsive design
- **Animations**: Framer Motion or React Spring for smooth swipe animations
- **State Management**: Context API or Redux for user preferences and swipe history
- **Touch Gestures**: react-swipeable or hammer.js for swipe detection

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Architecture**: RESTful API
- **Database**: 
  - MongoDB or PostgreSQL for:
    - User data
    - Food orders catalog
    - Restaurant information
    - Swipe history
    - Preference analytics

### Project Structure (Planned)
```
foodtinder/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Helper functions
│   │   └── services/      # API service layer
│   └── public/
├── server/                 # Backend Express application
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic
│   ├── models/            # Data models
│   ├── middleware/        # Express middleware
│   ├── utils/             # Server utilities
│   └── config/            # Configuration files
├── shared/                 # Shared types/utilities (optional)
└── docs/                   # Documentation
```

## Data Models

### User
```javascript
{
  id: String (UUID),
  createdAt: Date,
  preferences: {
    likedCategories: [String],
    priceRange: { min: Number, max: Number },
    cuisineTypes: [String]
  },
  swipeHistory: [SwipeAction]
}
```

### SwipeAction
```javascript
{
  userId: String,
  orderId: String,
  action: 'like' | 'dislike',
  timestamp: Date
}
```

### FoodOrder
```javascript
{
  id: String (UUID),
  name: String,
  description: String,
  imageUrl: String, // Unsplash image URL for varied food images
  price: Number,
  restaurantId: String,
  category: String,
  cuisineType: String,
  tags: [String], // e.g., ['spicy', 'vegetarian', 'fast-food']
  likes: Number, // Total like count
  likeUsers: [String], // Array of user IDs who liked
  comments: [Comment], // Array of comments
  deliveryApps: [String] // Array of delivery app names: ['careem', 'talabat', 'ubereats']
}
```

### Comment
```javascript
{
  id: String (UUID),
  orderId: String,
  userId: String,
  username: String, // Simple username or "Anonymous"
  text: String,
  createdAt: Date
}
```

### Like
```javascript
{
  id: String (UUID),
  orderId: String,
  userId: String,
  createdAt: Date
}
```

### Restaurant
```javascript
{
  id: String (UUID),
  name: String,
  description: String,
  imageUrl: String,
  cuisineType: String,
  location: {
    address: String,
    coordinates: { lat: Number, lng: Number }
  },
  orders: [FoodOrder]
}
```

## API Endpoints (Planned)

### Orders
- `GET /api/orders` - Get paginated list of food orders
- `GET /api/orders/:id` - Get specific order details
- `GET /api/orders/feed` - Get personalized feed based on user preferences

### Swipes
- `POST /api/swipes` - Record a swipe action (like/dislike)
- `GET /api/swipes/history` - Get user's swipe history
- `GET /api/swipes/stats` - Get swipe statistics for user

### Recommendations
- `GET /api/recommendations` - Get personalized restaurant and order recommendations
  - Returns restaurants and orders based on user's swipe history
  - Requires minimum 5 liked items for personalized results
  - Falls back to popular items if insufficient data

### Users
- `POST /api/users` - Create new user (or anonymous session)
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/preferences` - Get user preferences summary

### Restaurants
- `GET /api/restaurants` - Get list of restaurants
- `GET /api/restaurants/:id` - Get restaurant details with orders
- `GET /api/restaurants/recommended` - Get recommended restaurants for user

### Social Features (Instagram-like)
- `POST /api/orders/:id/like` - Like/unlike an order
- `GET /api/orders/:id/likes` - Get users who liked an order
- `POST /api/orders/:id/comments` - Add a comment to an order
- `GET /api/orders/:id/comments` - Get comments for an order
- `DELETE /api/comments/:id` - Delete a comment (if user owns it)

## Recommendation Algorithm

### How It Works

The recommendation engine uses a **scoring system** to rank restaurants and orders based on your preferences:

#### Restaurant Scoring (Ranked by Total Score)

1. **Restaurants You Liked Items From** (Highest Priority)
   - +10 points for each item you liked from that restaurant
   - Example: If you liked 2 items from McDonald's, it gets +20 points

2. **Matching Categories** (Medium Priority)
   - +3 points for each order in that restaurant matching your preferred categories
   - Example: If you like "Burgers" and a restaurant has 3 burger items, it gets +9 points

3. **Matching Cuisine Types** (Medium Priority)
   - +5 points if the restaurant's cuisine type matches your preferences
   - Example: If you like "Fast Food" restaurants, McDonald's gets +5 points

4. **Restaurant Rating** (Bonus)
   - Adds the restaurant's rating as bonus points
   - Example: A 4.5-star restaurant gets +4.5 points

**Final Ranking**: Restaurants are sorted by total score (highest first), then by rating if scores are equal.

#### Order Scoring (Ranked by Total Score)

1. **Already Liked Orders** (Very High Priority)
   - +100 points if you already liked this order
   - These appear first to show your favorites

2. **From Liked Restaurants** (High Priority)
   - +5 points for each item you liked from the same restaurant
   - Example: If you liked 2 items from McDonald's, all McDonald's orders get +10 points

3. **Matching Categories** (Medium Priority)
   - +3 points if the order's category matches your preferences

4. **Matching Cuisine Types** (Medium Priority)
   - +2 points if the order's cuisine type matches your preferences

5. **Order Popularity** (Small Bonus)
   - +0.1 points per like the order has received

**Final Ranking**: Orders are sorted by total score (highest first), prioritizing new items you haven't seen yet.

### Testing the Recommendations

1. **Swipe through at least 10 orders** and **like at least 2-5 items**
2. **Like items from different restaurants** to see variety in recommendations
3. **Like items from the same restaurant** to see that restaurant ranked higher
4. Click the **"🎯 View Recommendations"** button (appears after 10 swipes, 2 likes)

### Example

If you like:
- 2 items from McDonald's (Burgers, Fast Food)
- 2 items from Sushi Yoshi (Sushi, Japanese)
- 1 item from KFC (Chicken, Fast Food)

**Restaurant Rankings**:
1. **Sushi Yoshi** (20 points from likes + 4.6 rating = 24.6) - Highest rating
2. **McDonald's** (20 points from likes + 4.2 rating = 24.2)
3. **KFC** (10 points from likes + 4.3 rating = 14.3)
4. Other restaurants matching your categories

**Note**: The algorithm prioritizes restaurants you've actually liked items from, not just restaurants that match your categories.

## UI/UX Considerations

### Mobile-First Design
- **Touch-friendly**: Large swipe areas, easy thumb reach
- **Responsive**: Works on all screen sizes, optimized for mobile
- **Performance**: Fast loading, smooth animations (60fps)
- **Offline capability**: Cache orders for offline swiping (future)

### Visual Design
- **Card-based layout**: Full-screen or near-full-screen cards
- **High-quality images**: Food photography is key
- **Clear typography**: Readable prices and names
- **Minimal UI**: Focus on the food, not the interface (Instagram-inspired simplicity)
- **Smooth transitions**: Cards slide away naturally
- **Social elements**: Heart icon for likes, comment icon, like count display
- **Clean comment section**: Simple, readable comment threads

### User Feedback
- **Visual cues**: 
  - Green overlay on right swipe (like)
  - Red overlay on left swipe (dislike)
  - Subtle animations
- **Haptic feedback**: Vibration on swipe (mobile)
- **Progress indicators**: Show when recommendations are ready

## Implementation Phases

### Phase 1: MVP (Minimum Viable Product)
- [x] Basic swipe interface (vertical scrolling)
- [x] Food order cards with image, name, price
- [x] Swipe left/right functionality
- [x] Basic backend API for orders and swipes
- [x] Simple database schema with sample data
- [x] Mobile-responsive design
- [x] Like functionality (heart icon)
- [x] Comment display and add comment
- [x] Recommendations button (appears after 10 swipes, 2 likes)
- [x] Recommendations view with restaurants and orders

### Phase 2: Core Features
- [x] User session management (simplified)
- [x] Swipe history tracking
- [x] Basic recommendation algorithm
- [x] Recommendation display screen
- [x] Restaurant listing

### Phase 3: Enhancement
- [ ] Advanced preference learning
- [ ] Improved recommendation accuracy
- [ ] User profile page
- [ ] Saved/liked orders view
- [ ] Search functionality

### Phase 4: Polish & Scale
- [ ] Performance optimization
- [ ] Advanced animations
- [ ] Analytics dashboard
- [ ] Admin panel for managing orders/restaurants
- [ ] Integration with delivery services (future)

## Technology Stack

### Frontend
- **Framework**: React.js
- **Build Tool**: Vite or Create React App
- **Styling**: Tailwind CSS or Styled Components
- **Animations**: Framer Motion
- **HTTP Client**: Axios or Fetch API
- **Routing**: React Router

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose OR PostgreSQL with Sequelize/Prisma
- **Validation**: Joi or express-validator
- **Authentication**: JWT (for future user accounts)
- **CORS**: Enabled for frontend communication

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm or yarn
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library (future)

## Design Principles

### Simplicity First
- **Keep it simple**: Avoid over-engineering, focus on core features
- **Clean code**: Simple, readable implementation over complex patterns
- **Minimal UI**: Instagram-like simplicity - let content shine
- **Straightforward data models**: No unnecessary complexity
- **Clear user flows**: Easy to understand and navigate

### Code Quality
- **Simple & Readable**: Clear function names, well-commented code
- **Modular**: Separate concerns, reusable components
- **DRY**: Don't Repeat Yourself
- **SOLID Principles**: Especially Single Responsibility
- **Express.js simplicity**: Keep backend routes and controllers straightforward

### Backend Architecture
- **RESTful API**: Standard HTTP methods and status codes
- **Middleware**: Authentication, validation, error handling
- **Error Handling**: Consistent error responses
- **Logging**: Track important events and errors

### Frontend Architecture
- **Component-based**: Reusable, composable components
- **State Management**: Clear data flow
- **Performance**: Lazy loading, image optimization
- **Accessibility**: ARIA labels, keyboard navigation

## Future Enhancements (Post-MVP)

1. **User Accounts**: Registration, login, profiles
2. **Social Features**: Share favorites, friend recommendations
3. **Order Placement**: Integration with food delivery APIs
4. **Reviews & Ratings**: User reviews for restaurants and orders
5. **Location-based**: Show nearby restaurants
6. **Dietary Filters**: Vegetarian, vegan, gluten-free, etc.
7. **Price Filters**: Filter by price range
8. **Cuisine Filters**: Filter by cuisine type
9. **Analytics Dashboard**: For restaurants to see engagement
10. **Push Notifications**: New recommendations, deals

## Success Metrics

- **Engagement**: Average swipes per session
- **Retention**: Daily/weekly active users
- **Recommendation Accuracy**: Click-through rate on recommendations
- **User Satisfaction**: Feedback on recommendation relevance
- **Performance**: Page load time, animation smoothness

## Sample Database

A sample database with restaurants and orders (similar to Careem, Uber Eats, Talabat) is provided in `sample-database.json`. This includes:
- Popular restaurants from various cuisines
- Diverse food orders with realistic prices
- Categories and tags for recommendation matching
- Ready-to-use data for development and testing

See `sample-database.json` for the complete dataset.

## CMS Admin Panel

A comprehensive Content Management System is available at `http://localhost:3000/admin` for managing the database:

### Features
- **Tab-based Navigation**: Switch between Orders and Restaurants management
- **Add New Items**: Create new orders and restaurants with full forms
- **Edit Existing Items**: Update all fields including prices, tags, delivery apps, images
- **Delete Items**: Remove orders and restaurants (with safety checks)
- **Image Previews**: Real-time preview of images while editing
- **Search Functionality**: Filter orders and restaurants by name, description, or category
- **Delivery App Management**: Specify which delivery apps have each restaurant/order
- **Real-time Updates**: Changes save directly to database file

### Order Management
- Create, edit, delete orders
- Update: name, description, price, restaurant, category, cuisine type, tags, delivery apps, image URL
- Image preview shows food image in real-time

### Restaurant Management
- Create, edit, delete restaurants
- Update: name, description, cuisine type, rating, delivery time, delivery fee, address, delivery apps, image URL
- Image preview shows restaurant image in real-time
- Manage which delivery apps (Careem, Talabat, Uber Eats) have each restaurant

## Notes

- **Simplicity is key**: Start simple, iterate based on user feedback
- Focus on core swipe experience first
- Instagram-like social features should feel natural and unobtrusive
- Recommendation algorithm can be refined over time
- Mobile-first means test on real devices
- Food images quality is crucial for user engagement
- Keep the design clean and minimal - let the food be the star

---

**Status**: Planning Phase  
**Last Updated**: [Current Date]  
**Next Steps**: Begin Phase 1 MVP implementation

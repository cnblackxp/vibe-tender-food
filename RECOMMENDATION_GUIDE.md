# How to Test Recommendations Properly

## Quick Guide

The recommendation engine learns from your **swipe history**. Here's how to test it effectively:

### Step 1: Build Your Preferences
1. **Swipe through at least 10-15 orders**
2. **Like at least 5-7 items** (swipe right or click ♥)
3. **Like items from different restaurants** to see variety
4. **Like items from the same restaurant** to see it ranked higher

### Step 2: View Recommendations
- After 10 swipes and 2 likes, the **"🎯 View Recommendations"** button appears
- Click it to see personalized recommendations

### Step 3: Understand the Rankings

**Restaurants are ranked by:**
1. **How many items you liked from them** (most important)
2. **How well they match your preferred categories** (burgers, pizza, sushi, etc.)
3. **How well they match your preferred cuisine types** (Fast Food, Japanese, Italian, etc.)
4. **Restaurant rating** (bonus)

**Orders are ranked by:**
1. **If you already liked them** (shows your favorites)
2. **If they're from restaurants you liked items from**
3. **If they match your preferred categories/cuisines**

## Example Test Scenario

**Test 1: Like items from one restaurant**
- Like 3 items from McDonald's
- Like 2 items from KFC
- **Expected**: McDonald's should rank #1, KFC should rank #2

**Test 2: Like diverse items**
- Like 1 burger from McDonald's
- Like 1 pizza from Papa John's
- Like 1 sushi from Sushi Yoshi
- Like 1 chicken from KFC
- **Expected**: All 4 restaurants should appear, ranked by rating

**Test 3: Like items from same category**
- Like 3 burgers from different restaurants
- **Expected**: Burger restaurants should rank high, burger orders should appear first

## Important Notes

⚠️ **Server Restart Resets Data**: If you restart the server, your swipe history is lost (it's in-memory). You'll need to swipe again to build preferences.

💡 **More Likes = Better Recommendations**: The more items you like, the more accurate the recommendations become.

🎯 **Restaurants You Liked From Rank Higher**: The algorithm prioritizes restaurants you've actually liked items from, not just restaurants that match your categories.

## Troubleshooting

**"Why is McDonald's always first?"**
- If you liked items from McDonald's, it will rank high
- Try liking items from other restaurants to see variety
- The algorithm scores based on what you actually liked

**"Recommendations don't match my preferences"**
- Make sure you've liked at least 5 items
- Like items from different categories to see variety
- The algorithm learns from your actual likes, not just swipes

**"I don't see the recommendations button"**
- You need at least 10 swipes AND 2 likes
- Keep swiping and liking items

# 💬 Building a Comments System - Step-by-Step Guide

## 🎯 What We're Building

A comments system where users can:
- Add comments to videos
- See all comments on a video
- Like comments
- See comment timestamps
- Delete their own comments

---

## 📋 Step 1: Backend - Create Comment Model (15 minutes)

### What to do:
1. Create a new file: `backend/models/Comment.js`
2. Define the schema with these fields:
   - `text` (String, required) - The comment content
   - `video` (ObjectId, ref: 'Video', required) - Which video it belongs to
   - `user` (ObjectId, ref: 'User', required) - Who wrote it
   - `likes` (Array of ObjectIds, ref: 'User') - Users who liked it
   - `timestamps: true` - Auto-add createdAt/updatedAt

### 💡 Hints:
- Look at `backend/models/Video.js` for reference
- Use `mongoose.Schema` like the other models
- Remember to export it at the end

### ✅ Checkpoint:
```javascript
// You should have something like:
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // ... add the rest
}, { timestamps: true });
```

---

## 📋 Step 2: Backend - Create Comment Routes (30 minutes)

### What to do:
1. Create `backend/routes/comments.js`
2. Create these endpoints:

#### 2.1 GET `/api/comments/:videoId` - Get all comments for a video
- Find all comments where `video` matches `videoId`
- Populate the `user` field (username, avatar)
- Sort by newest first (`createdAt: -1`)
- Return formatted JSON (like videos route does)

#### 2.2 POST `/api/comments` - Create a new comment
- Use `authenticate` middleware (user must be logged in)
- Validate: `text` is required and not empty
- Create comment with: `text`, `video` (from body), `user` (from req.user)
- Populate user and return the comment

#### 2.3 DELETE `/api/comments/:id` - Delete a comment
- Use `authenticate` middleware
- Check if comment exists
- Check if user owns the comment (`comment.user.toString() === req.user._id.toString()`)
- Delete if authorized, return error if not

#### 2.4 POST `/api/comments/:id/like` - Like/Unlike a comment
- Use `authenticate` middleware
- Find the comment
- Check if user already liked it (in `likes` array)
- If liked: remove from array (unlike)
- If not liked: add to array (like)
- Return updated comment

### 💡 Hints:
- Look at `backend/routes/videos.js` for structure
- Use `authenticate` from `../middleware/auth.js`
- Use `validationResult` from `express-validator` for validation
- Format response like videos route (with `$id`, etc.)

### ✅ Checkpoint:
You should have 4 routes that handle:
- Getting comments
- Creating comments
- Deleting comments
- Liking comments

---

## 📋 Step 3: Backend - Register Comment Routes (5 minutes)

### What to do:
1. Open `backend/server.js`
2. Import your comments router
3. Add the route: `app.use('/api/comments', commentRoutes)`

### 💡 Hints:
- Look how other routes are registered (auth, videos, etc.)
- Make sure it's after `app.use(express.json())`

---

## 📋 Step 4: Frontend - API Functions (20 minutes)

### What to do:
1. Open `lib/api.js`
2. Add these functions:

#### 4.1 `getComments(videoId)`
- GET request to `/comments/${videoId}`
- Return the comments array

#### 4.2 `createComment(videoId, text)`
- POST request to `/comments`
- Body: `{ video: videoId, text: text }`
- Return the created comment

#### 4.3 `deleteComment(commentId)`
- DELETE request to `/comments/${commentId}`
- Return success

#### 4.4 `likeComment(commentId)`
- POST request to `/comments/${commentId}/like`
- Return updated comment

### 💡 Hints:
- Look at existing functions like `getVideos`, `createVideo`
- Use the `apiRequest` helper function
- Don't forget to export them!

### ✅ Checkpoint:
You should have 4 new exported functions in `lib/api.js`

---

## 📋 Step 5: Frontend - Create Comment Component (30 minutes)

### What to do:
1. Create `components/CommentItem.jsx`
2. Display:
   - User avatar (from comment.user.avatar)
   - Username (from comment.user.username)
   - Comment text
   - Timestamp (format: "2 hours ago" or date)
   - Like button with count
   - Delete button (only if user owns the comment)

### 💡 Hints:
- Use `useGlobalContext` to get current user
- Compare `comment.user.$id` with `user.$id` to show delete button
- Use `icons` for like/delete buttons
- Format timestamp: use `new Date(comment.$createdAt)` and format it nicely

### ✅ Checkpoint:
You should have a component that displays a single comment nicely

---

## 📋 Step 6: Frontend - Create Comments Section (30 minutes)

### What to do:
1. Open `app/video/[id].jsx`
2. Add state:
   - `comments` (array)
   - `loadingComments` (boolean)
   - `newComment` (string for input)
   - `submittingComment` (boolean)

3. Create function `fetchComments()`:
   - Set loading to true
   - Call `getComments(video.$id)`
   - Update comments state
   - Handle errors

4. Create function `handleSubmitComment()`:
   - Validate text is not empty
   - Set submitting to true
   - Call `createComment(video.$id, newComment)`
   - Add new comment to state
   - Clear input
   - Handle errors

5. Add UI:
   - Comments count header
   - Input field for new comment
   - Submit button
   - List of comments using `CommentItem`

### 💡 Hints:
- Use `useEffect` to fetch comments when video loads
- Use `FlatList` or `map` to render comments
- Show loading state while fetching
- Clear input after successful submit

### ✅ Checkpoint:
You should see comments on the video detail page!

---

## 📋 Step 7: Frontend - Add Like & Delete (20 minutes)

### What to do:
1. In `CommentItem.jsx`:
   - Add `handleLike` function that calls `likeComment`
   - Add `handleDelete` function that calls `deleteComment`
   - Update local state when liked/deleted
   - Show confirmation before deleting

2. In `app/video/[id].jsx`:
   - Pass callback to refresh comments after delete
   - Or update comments state directly

### 💡 Hints:
- Use `Alert.alert` for delete confirmation
- Optimistically update UI (update state immediately)
- Refresh comments if needed after delete

---

## 🎨 Step 8: Polish & Styling (15 minutes)

### What to do:
1. Style the comments section:
   - Nice spacing
   - Avatar circles
   - Input field styling
   - Comment bubbles
   - Like button with heart icon

2. Add empty state:
   - "No comments yet. Be the first!"

3. Add loading states:
   - Skeleton loader or spinner

### 💡 Hints:
- Use your existing design system (colors, fonts)
- Make it look consistent with the rest of the app
- Use `className` with Tailwind classes

---

## 🧪 Step 9: Testing (10 minutes)

### What to test:
1. ✅ Can you add a comment?
2. ✅ Do comments appear immediately?
3. ✅ Can you like a comment?
4. ✅ Can you delete your own comment?
5. ✅ Can you see other users' comments?
6. ✅ Does the timestamp show correctly?
7. ✅ Does it work when not logged in?

---

## 🐛 Common Issues & Solutions

### Issue: Comments not showing
- **Check**: Are you populating the `user` field in the backend?
- **Check**: Is the API returning the right format?

### Issue: Can't delete comment
- **Check**: Are you comparing user IDs correctly?
- **Check**: Is the authentication token being sent?

### Issue: Like not working
- **Check**: Are you updating the state after like?
- **Check**: Is the API returning the updated comment?

---

## 📚 Learning Points

### What you'll learn:
1. **Database Relationships**: How comments relate to videos and users
2. **CRUD Operations**: Create, Read, Update, Delete
3. **Authentication**: Protecting routes and actions
4. **State Management**: Managing comments in React
5. **API Design**: RESTful endpoints
6. **User Experience**: Real-time feel with optimistic updates

---

## 🎯 Next Steps After This

Once comments work, you can add:
- **Real-time updates** (WebSockets/Socket.io)
- **Nested replies** (comments on comments)
- **Comment editing**
- **Report/flag comments**
- **Comment notifications**

---

## 💪 You Got This!

Take it step by step. If you get stuck:
1. Check the error message
2. Look at similar code (videos route, etc.)
3. Console.log to debug
4. Ask for help on specific issues

Good luck! 🚀






# Notes Share

A modern, secure notes sharing platform built for friends to collaborate and organize their thoughts together.

![Notes Share](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

### Core Features
- **User Authentication**: Secure registration and login system with JWT tokens
- **Rich Note Editor**: Create and edit notes with rich text formatting (bold, italic, lists, links, etc.)
- **Note Organization**: Tag system for categorizing and organizing notes
- **Search & Filter**: Quickly find notes by content, tags, or starred status
- **Sharing**: Share notes with friends with customizable permissions (view/edit)
- **Comments**: Collaborate through comments on shared notes
- **Real-time Notifications**: Get instant updates when friends interact with your notes
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Export**: Download notes as PDF or text files

### Design Features
- Modern, minimalist interface with elegant typography
- Clean, card-based layout for notes
- Soft, pleasing color palette (Primary: #6366f1, Secondary: #8b5cf6)
- Smooth animations and transitions
- Fully responsive design (mobile, tablet, desktop)
- Custom color coding for notes
- Star/favorite system for important notes

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **React Quill** - Rich text editor
- **Socket.io Client** - Real-time notifications
- **Axios** - HTTP client
- **jsPDF** - PDF generation
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Sequelize** - ORM for database management
- **SQLite** - Database (easily upgradeable to PostgreSQL)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.io** - Real-time communication
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Input validation

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codex-test
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```
   This will install dependencies for both client and server.

3. **Configure environment variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   Edit `.env` and update the values:
   - `JWT_SECRET`: Change to a secure random string
   - Other variables as needed

4. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```
   This will start both the backend (port 5000) and frontend (port 5173).

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## Project Structure

```
codex-test/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS files
│   ├── index.html
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   ├── index.js          # Server entry point
│   └── package.json
│
├── package.json          # Root package.json
└── README.md
```

## Database Schema

### Users
- id (UUID, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password (String, Hashed)
- avatar (String, Optional)
- theme (Enum: 'light' | 'dark')
- createdAt, updatedAt

### Notes
- id (UUID, Primary Key)
- title (String)
- content (Text)
- isPrivate (Boolean)
- color (String)
- starred (Boolean)
- userId (UUID, Foreign Key)
- createdAt, updatedAt

### Tags
- id (UUID, Primary Key)
- name (String, Unique)
- color (String)
- createdAt, updatedAt

### Shares
- id (UUID, Primary Key)
- noteId (UUID, Foreign Key)
- senderId (UUID, Foreign Key)
- receiverId (UUID, Foreign Key)
- canEdit (Boolean)
- createdAt, updatedAt

### Comments
- id (UUID, Primary Key)
- content (Text)
- noteId (UUID, Foreign Key)
- userId (UUID, Foreign Key)
- createdAt, updatedAt

### Notifications
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- type (Enum: 'share' | 'comment' | 'mention')
- message (String)
- isRead (Boolean)
- relatedNoteId (UUID, Optional)
- fromUserId (UUID, Optional)
- createdAt, updatedAt

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users (friends list)

### Notes
- `GET /api/notes` - Get user's notes (with search/filter)
- `GET /api/notes/shared` - Get notes shared with user
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Shares
- `POST /api/shares` - Share a note
- `PUT /api/shares/:id` - Update share permissions
- `DELETE /api/shares/:id` - Remove share

### Comments
- `GET /api/comments/note/:noteId` - Get note comments
- `POST /api/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Tags
- `GET /api/tags` - Get all tags

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevent abuse and brute force attacks
- **Helmet** - Security headers
- **Input Validation** - Express validator for all inputs
- **XSS Protection** - HTML sanitization
- **CORS** - Configured for specific origins

## Features Walkthrough

### Creating a Note
1. Click "New Note" button
2. Enter title and content with rich text formatting
3. Add tags by typing and pressing Enter
4. Choose a color for the note
5. Set privacy (Private/Shared)
6. Click "Save Note"

### Sharing a Note
1. Open a note
2. Click "Share" button
3. Select a friend from the list
4. Choose permissions (view-only or can edit)
5. Click "Share"

### Commenting
1. Open a shared note
2. Scroll to the comments section
3. Type your comment
4. Press Enter or click Send

### Dark Mode
- Click the moon/sun icon in the navbar to toggle themes
- Preference is saved and persists across sessions

### Export
1. Open a note
2. Click "Export" button
3. Choose PDF or Text format
4. File downloads automatically

## Keyboard Shortcuts (Future Enhancement)

- `Ctrl/Cmd + N` - New note
- `Ctrl/Cmd + S` - Save note
- `Ctrl/Cmd + K` - Search notes
- `Ctrl/Cmd + /` - Toggle theme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspired by modern note-taking applications
- Built with love for seamless collaboration

---

**Happy Note Taking!** 📝

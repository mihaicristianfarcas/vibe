# Vibe 🎨

**Build something with Vibe** - Create apps and websites by chatting with AI

Vibe is an intelligent development platform that allows you to create web
applications and websites through natural language conversations with AI. Simply
describe what you want to build, and watch as AI generates working code,
complete with live previews.

## ✨ Features

- **🤖 AI-Powered Development**: Chat with AI to describe your ideas and
  generate working applications
- **📁 Project Management**: Organize and manage multiple projects in one place
- **🔍 Live Code Preview**: See your code in action with real-time previews and
  interactive demos
- **📝 File Explorer**: Browse and examine generated code files with syntax
  highlighting
- **🔐 User Authentication**: Secure user accounts powered by Clerk
- **☁️ Cloud Sandboxes**: Each project runs in isolated E2B sandboxes for safe
  execution
- **🎨 Modern UI**: Beautiful, responsive interface built with Next.js and
  Tailwind CSS
- **🌙 Dark Mode**: Full dark mode support with system preference detection

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI GPT-4.1 via Inngest Agent Kit
- **Code Execution**: E2B Code Interpreter sandboxes
- **API**: tRPC for type-safe API calls
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- Clerk account
- E2B account
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/vibe.git
   cd vibe
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables** Create a `.env.local` file in the root
   directory:

   ```env
   # Database
   DATABASE_URL="postgresql://..."

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...

   # E2B Sandboxes
   E2B_API_KEY=your_e2b_api_key

   # OpenAI
   OPENAI_API_KEY=sk-...

   # Next
   NEXT_PUBLIC_APP_URL='http://localhost:3000'
   NEXT_PUBLIC_CLERK_SIGN_UP_URL='/sign-up'
   NEXT_PUBLIC_CLERK_SIGN_IN_URL='/sign-in'
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL='/'
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL='/'
   ```

4. **Set up the database**

   ```bash
   pnpm prisma generate
   pnpm prisma migrate dev
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser** Visit [http://localhost:3000](http://localhost:3000) to
   start building with Vibe!

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (home)/            # Home page and auth
│   ├── projects/          # Project pages
│   └── api/               # API routes (tRPC, Inngest)
├── components/            # Reusable UI components
│   ├── ui/               # Radix UI components
│   └── ...               # Custom components
├── modules/              # Feature modules
│   ├── home/            # Project creation and listing
│   ├── projects/        # Project view and chat
│   └── messages/        # Message handling
├── inngest/             # AI agent functions
├── lib/                 # Utilities and database
└── trpc/               # API layer
```

## 🤖 How It Works

1. **Create a Project**: Start by creating a new project and describing what you
   want to build
2. **Chat with AI**: Engage in a conversation with the AI agent to refine your
   requirements
3. **Code Generation**: The AI generates working code using the E2B sandbox
   environment
4. **Live Preview**: See your application running in real-time with a live
   preview
5. **Code Exploration**: Browse through the generated files and understand the
   implementation
6. **Iterate**: Continue the conversation to modify, enhance, or fix your
   application

## 📦 Key Components

### AI Agent System

- Powered by OpenAI GPT-4.1 and Inngest Agent Kit
- Capable of running terminal commands, creating/updating files, and reading
  project files
- Operates in isolated E2B sandboxes for safe code execution

### Authentication

- Clerk integration for secure user management
- Support for multiple authentication providers
- Protected routes and user-specific projects

### Database Schema

- **Projects**: User projects with metadata
- **Messages**: Conversation history with role-based messages
- **Fragments**: Generated code artifacts with sandbox URLs

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm prisma:migrate` - Run database migrations

### Code Style

- ESLint configuration with Next.js rules
- Prettier for code formatting
- TypeScript for type safety
- Tailwind CSS for styling

## 🔮 Upcoming Features

- 💳 **Billing Integration**: Clerk-powered billing system (coming soon)
- 🚀 **Enhanced Templates**: More project templates and frameworks
- 🔄 **Version Control**: Git integration for project versioning
- 👥 **Collaboration**: Share and collaborate on projects
- 📊 **Analytics**: Usage metrics and project insights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major
changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- [E2B](https://e2b.dev) - Cloud sandboxes for AI agents
- [Clerk](https://clerk.com) - Authentication and user management
- [Inngest](https://inngest.com) - Durable functions and AI agent orchestration
- [Radix UI](https://radix-ui.com) - Accessible component primitives
- [shadcn/ui](https://ui.shadcn.com) - Beautiful component library

---

**Ready to build something amazing?** 🚀

Start your journey with Vibe and experience the future of AI-powered
development!

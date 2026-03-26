import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User from '@/models/User';
import { isMongoConfigured } from './mongodb';
import { demoUserFromEmail, upsertDemoUser } from './demoBackend';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const demoAdminEmail = (process.env.ADMIN_EMAIL || "admin@example.com").trim().toLowerCase();

export const authOptions: NextAuthOptions = {
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        // Demo mode: no MongoDB, but still allow local login.
        if (!isMongoConfigured()) {
          const email = credentials.email.trim().toLowerCase();
          const password = String(credentials.password);
          if (!password) throw new Error('Invalid password');

          const existing = demoUserFromEmail(email);
          const role = email === demoAdminEmail ? 'admin' : 'user';
          const user = upsertDemoUser({
            email,
            role,
            name: email.split('@')[0] ? email.split('@')[0] : 'User',
          });

          return {
            id: user.id,
            name: existing?.name ?? user.name,
            email: user.email,
            role: user.role,
            image: user.image,
          };
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user || !user.password) {
          throw new Error('No user found with this email');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Demo mode: just keep a demo user entry.
        if (!isMongoConfigured()) {
          const email = String(user.email || '').trim().toLowerCase();
          if (email) {
            upsertDemoUser({
              email,
              name: user.name || 'User',
              role: email === demoAdminEmail ? 'admin' : 'user',
              image: user.image ? String(user.image) : undefined,
            });
          }
          return true;
        }

        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name || 'User',
            email: user.email || '',
            image: user.image || undefined,
            provider: 'google',
            role: user.email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Demo mode: avoid DB calls.
        if (!isMongoConfigured()) {
          const u = user as unknown as Record<string, unknown>;
          token.id = typeof u.id === "string" ? u.id : String(u.id ?? "");
          token.role = typeof u.role === "string" ? u.role : "user";
          return token;
        }

        await dbConnect();
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id;
        (session.user as Record<string, unknown>).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  // Keep the app deployable even when NEXTAUTH_SECRET isn't set.
  secret: process.env.NEXTAUTH_SECRET || 'dev-nextauth-secret',
};

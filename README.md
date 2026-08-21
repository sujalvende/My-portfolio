# Sujal Vende — Portfolio

Personal portfolio website built to showcase my projects, skills, and approach to web development.

The goal of the portfolio is to keep the experience simple and professional while giving potential clients a clear idea of what I can build.

**Live:** https://sujalvende-portfolio.vercel.app

## Overview

This project is more than a static portfolio. It includes an interactive project showcase, responsive layouts, contact form, and a protected admin dashboard for managing inquiries.

The design follows a minimal and editorial approach with subtle animations rather than relying on excessive visual effects.

## Features

- Responsive portfolio for desktop, tablet, and mobile
- Editorial-style hero section
- GSAP and ScrollTrigger animations
- Interactive project showcase
- Live project links
- Contact/inquiry form
- Supabase PostgreSQL integration
- Supabase Authentication
- Protected admin dashboard
- Inquiry search and filtering
- Inquiry status management
- PostgreSQL Row Level Security (RLS)
- Vercel deployment

## Projects

### OSD Coaching Classes

A website built for a coaching institute with a focus on clear information, professional presentation, and responsive design.

Live: https://osd-couching-classes.vercel.app

### Skill Bridge

A prototype focused on connecting users with learning and skill-building opportunities through a clean and interactive interface.

Live: https://skill-bridge-prototype.vercel.app

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Animation

- GSAP
- ScrollTrigger

### Backend and Database

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security (RLS)

### Deployment

- Vercel

## Admin Dashboard

The portfolio includes a private dashboard for managing contact inquiries.

Authorized users can:

- View inquiries
- Search and filter inquiries
- Change inquiry status
- Delete inquiries
- View submission details

Inquiry statuses:

- New
- Contacted
- In Progress
- Closed

Admin access is protected using Supabase Authentication and database-level authorization.

## Project Structure

```text
src/
├── components/
│   ├── About
│   ├── Contact
│   ├── Footer
│   ├── Hero
│   ├── Intro
│   ├── Nav
│   ├── Process
│   ├── Services
│   ├── Skills
│   └── Work
│
├── pages/
│   ├── AdminLogin
│   └── AdminDashboard
│
├── lib/
│   ├── supabase
│   └── adminAuth
│
├── App.tsx
├── main.tsx
└── index.css

supabase/
public/

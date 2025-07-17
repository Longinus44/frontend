

## Event Coordinators Directory App

A responsive **Next.js** application for showcasing and exploring event coordinators. Users can search for coordinators, view their profiles, check availability and pricing, and toggle between light and dark themes.

## Features

- Real-time search by name or location
- Light/Dark theme toggle
- Optimized image rendering with `next/image`
- Fully responsive UI using Tailwind CSS
- Availability & pricing info per coordinator
- Optimized for mobile and desktop views
- Dynamic data fetching from a REST API

---

## Overview

This React-based app lists event coordinators and allows users to:

- Search coordinators
- View their location, bio, and availability
- See pricing information
- Switch between dark and light themes
- Book a coordinator 

## Setup Instructions

### ⚙️ Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or Yarn
- Code editor (VS Code recommended)

### 📥 Installation

1. **Clone the repository**
   git clone https://github.com/your-username/event-coordinators.git
   cd WEDDINGCOORD

2. # Install backend dependencies:
   cd backend
	- npm install 
	# or 
	yarn

3. # Install frontend dependencies:
	cd frontend
	npm install
	# or
	yarn

4. # Start the backend server first:
	cd backend
	npm run dev

5. # Start the frontend server:
	cd frontend
	npm run dev


This application fetches coordinator data from a live API hosted at:https://weddingcoord.onrender.com/api/coordinators/.
returns a JSON response containing an array of coordinator objects.
Each coordinator object is expected to include the following properties:

	+ `id`: unique identifier
	+ `name`: coordinator name
	+ `location`: coordinator location
	+ `bio`: coordinator bio
	+ `price`: coordinator price
	+ `availability`: array of available dates
	+ `profilephoto`: URL of the coordinator's profile photo

	# License
This project is licensed under the MIT License.


import axios from "axios";
import { NextResponse } from "next/server"

// This is a placeholder API route that will be replaced with actual implementation
export async function GET() {
  // Simulate API delay
 // await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Make a request to the backend API to fetch today's matches using Axios
    const response = await axios.get("http://localhost:3000/api/matches/todays-matches");

    // Return the fetched data as a response
    return NextResponse.json(response.data);
  } catch (error) {
    // Handle any errors during the Axios request
    console.error("Error fetching today's matches:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }


  

  // // Return mock data
  // return NextResponse.json([
  //   {
  //     id: 1,
  //     team1: { name: "Germany", flag: "🇩🇪" },
  //     team2: { name: "Argentina", flag: "🇦🇷" },
  //     date: "23rd Nov",
  //   },
  //   {
  //     id: 2,
  //     team1: { name: "Germany", flag: "🇩🇪" },
  //     team2: { name: "Argentina", flag: "🇦🇷" },
  //     date: "23rd Nov",
  //   },
  // ])
}


import { type NextRequest, NextResponse } from "next/server"
import { mockPatients, mockDoctors, mockNurses, mockAdmins, mockPharmacists, mockLabTechnicians } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const allUsers = [
      ...mockPatients,
      ...mockDoctors,
      ...mockNurses,
      ...mockAdmins,
      ...mockPharmacists,
      ...mockLabTechnicians,
    ]

    const user = allUsers.find((u) => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

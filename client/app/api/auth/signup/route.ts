import { type NextRequest, NextResponse } from "next/server"
import type { Patient } from "@/lib/types"

// Store new patients in memory (in production, use a database)
const newPatients: Patient[] = []

function generatePatientId(): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `P${timestamp}${randomStr}`.toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newPatient: Patient = {
      id: `pat_${Date.now()}`,
      role: "patient",
      username: data.username,
      password: data.password,
      name: data.name,
      age: Number.parseInt(data.age),
      sex: data.sex,
      phone: data.phone,
      occupation: data.occupation,
      address: data.address,
      patientId: generatePatientId(),
      createdAt: new Date().toISOString(),
    }

    newPatients.push(newPatient)

    // Return patient without password
    const { password: _, ...patientWithoutPassword } = newPatient
    return NextResponse.json(patientWithoutPassword)
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}

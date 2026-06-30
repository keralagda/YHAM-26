import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyMemberSession } from '@/lib/member-auth'

export async function GET() {
  try {
    const session = await verifyMemberSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch tasks assigned to 'all' or specifically to this member's designation
    const tasks = await db.cadreTask.findMany({
      where: {
        OR: [
          { assignedTo: 'all' },
          { assignedTo: session.designation }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    // Format tasks to include a boolean 'completed' field indicating if this user completed it
    const formatted = tasks.map(t => {
      let completedList: string[] = []
      try {
        completedList = JSON.parse(t.completedBy)
      } catch { completedList = [] }

      return {
        id: t.id,
        title: t.title,
        description: t.description,
        assignedTo: t.assignedTo,
        status: t.status,
        completed: completedList.includes(session.id),
        createdAt: t.createdAt
      }
    })

    return NextResponse.json(formatted)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve tasks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifyMemberSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { taskId } = await request.json()
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 })
    }

    const task = await db.cadreTask.findUnique({ where: { id: taskId } })
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    let completedList: string[] = []
    try {
      completedList = JSON.parse(task.completedBy)
    } catch { completedList = [] }

    if (completedList.includes(session.id)) {
      return NextResponse.json({ error: 'Task already completed' }, { status: 400 })
    }

    // Add user ID to completed list
    completedList.push(session.id)

    // Update task completion
    await db.cadreTask.update({
      where: { id: taskId },
      data: {
        completedBy: JSON.stringify(completedList)
      }
    })

    // Award KPI boost (+20 points) and increment event attendance
    const currentMember = await db.partyMember.findUnique({ where: { id: session.id } })
    if (currentMember) {
      await db.partyMember.update({
        where: { id: session.id },
        data: {
          kpiScore: currentMember.kpiScore + 20,
          eventsAttended: currentMember.eventsAttended + 1
        }
      })
    }

    return NextResponse.json({ success: true, pointsAwarded: 20 })
  } catch (error) {
    console.error('Task completion error:', error)
    return NextResponse.json({ error: 'Failed to record task completion' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, you'd use a database
const rooms = new Map();

export async function POST(request: NextRequest) {
  try {
    const { roomId, userId, userName } = await request.json();
    
    if (!roomId || !userId || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or update room
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        users: [],
        created: new Date().toISOString(),
      });
    }

    const room = rooms.get(roomId);
    
    // Add user if not already present
    const existingUser = room.users.find((u: any) => u.id === userId);
    if (!existingUser) {
      room.users.push({
        id: userId,
        name: userName,
        joinedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      room: {
        id: room.id,
        userCount: room.users.length,
        users: room.users,
      },
    });
  } catch (error) {
    console.error('Room API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID required' },
        { status: 400 }
      );
    }

    const room = rooms.get(roomId);
    
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      room: {
        id: room.id,
        userCount: room.users.length,
        users: room.users,
      },
    });
  } catch (error) {
    console.error('Room API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
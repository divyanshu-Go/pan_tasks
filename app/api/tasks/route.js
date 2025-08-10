// app/api/tasks/route.js
import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/task';
import User from '@/models/user';
import DbConnect from '@/lib/Db/DbConnect';

// GET - Fetch all tasks with optional filters
export async function GET(request) {
  try {
    await DbConnect();
    
    // Get filter parameters from URL
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    console.log('📋 Fetching tasks with filters:', { status, priority });
    
    // Build filter object
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    console.log('🔍 Applied filter:', filter);
    
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email') // Populate assigned user email
      .populate('createdBy', 'name email')  // Populate creator email
      .sort({ createdAt: -1 }); // Latest first
    
    console.log(`✅ Found ${tasks.length} tasks after filtering`);
    
    return NextResponse.json({
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      tasks: tasks,
      appliedFilters: { status, priority } // Include applied filters in response
    });
    
  } catch (error) {
    console.error('❌ Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST - Create a new task
export async function POST(request) {
  try {
    await DbConnect();
    
    const body = await request.json();
    console.log('📝 Creating new task:', body.title);
    
    // Basic validation
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Create new task
    const taskData = {
      title: body.title,
      description: body.description || '',
      status: body.status || 'pending',
      priority: body.priority || 'medium',
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      assignedTo: body.assignedTo || null,
      attachments: body.attachments || [], 
      createdBy: body.createdBy || null
    };
    
    const newTask = new Task(taskData);
    const savedTask = await newTask.save();
    
    // Populate the references for the response
    await savedTask.populate('assignedTo', 'email');
    await savedTask.populate('createdBy', 'email');
    
    console.log('✅ Task created successfully:', savedTask._id);
    
    return NextResponse.json({
      message: 'Task created successfully',
      task: savedTask
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
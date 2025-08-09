// app/api/tasks/[id]/route.js
import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/task';
import mongoose from 'mongoose';
import DbConnect from '@/lib/Db/DbConnect';

// GET - Fetch single task by ID
export async function GET(request, { params }) {
  try {
    await DbConnect();
    
    const { id } = params;
    console.log('📋 Fetching task:', id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    const task = await Task.findById(id)
      .populate('assignedTo', 'email')
      .populate('createdBy', 'email');
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Task found:', task.title);
    
    return NextResponse.json({
      message: 'Task retrieved successfully',
      task: task
    });
    
  } catch (error) {
    console.error('❌ Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT - Update task
export async function PUT(request, { params }) {
  try {
    await DbConnect();
    
    const { id } = params;
    const body = await request.json();
    
    console.log('✏️ Updating task:', id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo;
    if (body.attachments !== undefined) updateData.attachments = body.attachments;
    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'email')
    .populate('createdBy', 'email');
    
    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Task updated successfully:', updatedTask.title);
    
    return NextResponse.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
    
  } catch (error) {
    console.error('❌ Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE - Delete task
export async function DELETE(request, { params }) {
  try {
    await DbConnect();
    
    const { id } = params;
    console.log('🗑️ Deleting task:', id);
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    const deletedTask = await Task.findByIdAndDelete(id);
    
    if (!deletedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Task deleted successfully:', deletedTask.title);
    
    // Note: In a production app, you might want to also delete
    // associated files from Cloudinary here
    
    return NextResponse.json({
      message: 'Task deleted successfully',
      deletedTask: {
        id: deletedTask._id,
        title: deletedTask.title
      }
    });
    
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
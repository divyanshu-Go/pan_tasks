// app/api/tasks/create-with-files/route.js
import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/task';
import { validateFile } from '@/lib/uploadUtils';
import { uploadMultipleFiles } from '@/lib/cloudinaryUpload';
import DbConnect from '@/lib/Db/DbConnect';
import User from "@/models/user";
import { verifyToken } from '@/lib/auth/token';

// POST - Create task with file attachments in one request
export async function POST(request) {
  try {
    await DbConnect();
    
    
    const authCookie = request.cookies.get("auth_token");
    if (!authCookie) {
      return NextResponse.json({ user: null, message: "Not Authenticated" }, { status: 401 });
    }
    
    const token = authCookie.value;
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    
    const user = await User.findById(payload.user._id).select("-password ");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }


    
    const formData = await request.formData();
    // Extract task data from form
    const taskData = {
      title: formData.get('title') || 'untitle',
      description: formData.get('description') || '',
      status: formData.get('status') || 'pending',
      priority: formData.get('priority') || 'medium',
      dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate')) : null,
      assignedTo: formData.get('assignedTo') || null,
      createdBy: formData.get('createdBy') || user._id
    };
    
    console.log('📝 Creating task with files:', taskData.title);
    
    // Validate required task data
    if (!taskData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Get uploaded files
    const files = formData.getAll('files');
    let attachments = [];
    
    // If files are provided, upload them
    if (files && files.length > 0) {
      console.log(`📁 Processing ${files.length} files...`);
      
      // Validate file count
      if (files.length > 3) {
        return NextResponse.json(
          { error: 'Maximum 3 files allowed per task' },
          { status: 400 }
        );
      }
      
      // Validate each file
      const validFiles = [];
      for (const file of files) {
        const validation = validateFile({
          name: file.name,
          size: file.size,
          type: file.type,
          mimetype: file.type
        });
        
        if (!validation.isValid) {
          return NextResponse.json(
            { 
              error: 'File validation failed',
              validationErrors: validation.errors,
              fileName: file.name
            },
            { status: 400 }
          );
        }
        
        validFiles.push(file);
      }
      
      // Upload files to Cloudinary
      try {
        const uploadResult = await uploadMultipleFiles(validFiles);
        attachments = uploadResult.uploadedFiles;
        console.log(`✅ ${attachments.length} files uploaded successfully`);
      } catch (uploadError) {
        console.error('❌ File upload failed:', uploadError);
        return NextResponse.json(
          { error: `File upload failed: ${uploadError.message}` },
          { status: 500 }
        );
      }
    }
    
    // Create task with attachments
    const newTask = new Task({
      ...taskData,
      attachments: attachments
    });
    
    const savedTask = await newTask.save();
    
    // Populate references for response
    await savedTask.populate('assignedTo', 'email');
    await savedTask.populate('createdBy', 'email');
    
    console.log('✅ Task created with attachments:', savedTask._id);
    
    return NextResponse.json({
      message: 'Task created successfully with attachments',
      task: savedTask,
      attachmentsCount: attachments.length
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error creating task with files:', error);
    return NextResponse.json(
      { error: 'Failed to create task with files' },
      { status: 500 }
    );
  }
}
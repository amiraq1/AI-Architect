import { NextRequest, NextResponse } from 'next/server';

/**
 * 📤 Upload API Route
 * Handles secure file uploads with validation.
 * Currently uses "Mock Storage" pattern. Switch to S3/R2 client for production.
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) return NextResponse.json({ error: 'No file found' }, { status: 400 });

        // 1. 🛡️ SECURITY: Validate Size (Strict 5MB limit)
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File too large (Max 5MB)' }, { status: 413 });
        }

        // 2. 🛡️ SECURITY: Validate Type (Allowlist)
        const ALLOWED_TYPES = [
            'image/png', 'image/jpeg', 'image/webp',
            'application/pdf', 'text/plain', 'text/csv', 'application/json'
        ];

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Supported: Images, PDF, TXT, CSV.' }, { status: 415 });
        }

        // 3. 🛡️ SANITIZATION: Clean filename
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileId = crypto.randomUUID();
        const storageKey = `uploads/${fileId}-${cleanName}`;

        // 4. 💾 STORAGE: Mock Implementation
        // TODO: Replace this block with S3/R2 upload code
        /*
         await s3.send(new PutObjectCommand({
             Bucket: process.env.R2_BUCKET_NAME,
             Key: storageKey,
             Body: Buffer.from(await file.arrayBuffer()),
             ContentType: file.type
         }));
         const url = `${process.env.R2_PUBLIC_URL}/${storageKey}`;
        */

        // For now, return a fake URL that indicates success
        const mockUrl = `https://cdn.amiraq.online/${storageKey}`;

        console.log(`✅ [Upload Success] File: ${cleanName}, Size: ${file.size}, Type: ${file.type}`);

        return NextResponse.json({
            success: true,
            url: mockUrl,
            name: file.name,
            type: file.type,
            size: file.size,
            id: fileId
        });

    } catch (error: any) {
        console.error('❌ [Upload Error]', error);
        return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
    }
}

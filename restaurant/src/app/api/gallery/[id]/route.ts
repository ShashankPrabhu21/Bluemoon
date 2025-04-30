import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

// 1. Configure Cloudinary (using environment variables)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("Cloudinary credentials are not set in environment variables!");
    //  Don't throw here, because the API might be used for other things.  Handle it in the DELETE function.
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id;

        // 2. Validate the ID
        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ message: "Invalid ID. ID must be a number.", alert: false }, { status: 400 });
        }

        // 3. Get the item's details from the database (to get the Cloudinary URL)
        const dbResult = await pool.query("SELECT src FROM gallery WHERE id = $1", [id]);

        if (dbResult.rows.length === 0) {
            return NextResponse.json({ message: "Item not found in database.", alert: false }, { status: 404 });
        }

        const src = dbResult.rows[0].src;
        let publicId: string | undefined;
        let resourceType: string = 'image'; // Default to 'image'

        // 4. Extract the Public ID and Resource Type from the Cloudinary URL
        try {
            const urlParts = src.split('/');
            const filename = urlParts[urlParts.length - 1];
            const filenameParts = filename.split('.');
            publicId = filenameParts[0];

            if (urlParts.includes('video')) {
                resourceType = 'video';
            }

            if (!publicId) {
                return NextResponse.json({ message: "Could not extract public ID from URL.", alert: false }, { status: 500 });
            }
        } catch (error) {
            console.error("Error extracting public ID:", error);
            return NextResponse.json({ message: "Error extracting public ID from URL.", alert: false }, { status: 500 });
        }

        // 5. Delete the asset from Cloudinary
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            try {
                const destroyResult = await cloudinary.uploader.destroy(publicId, {
                    resource_type: resourceType, // Use the determined resource type
                });

                if (destroyResult.result !== 'ok') {
                    console.error("Cloudinary deletion failed:", destroyResult);
                    return NextResponse.json({ message: "Failed to delete from Cloudinary.  Database entry will remain.", alert: false }, { status: 500 }); //don't delete from db
                }
            } catch (cloudinaryError: any) {
                console.error("Cloudinary error:", cloudinaryError);
                return NextResponse.json({ message: "Cloudinary error: " + cloudinaryError.message, alert: false }, { status: 500 });
            }
        } else {
             console.warn("Cloudinary credentials not set, skipping Cloudinary deletion.");
        }


        // 6. Delete the record from the database
        const deleteDbResult = await pool.query("DELETE FROM gallery WHERE id = $1", [id]);
         if (deleteDbResult.rowCount === 0) {
            return NextResponse.json({ message: "Item not found in database.", alert: false }, { status: 404 });
        }

        return NextResponse.json({ message: "Item deleted successfully", alert: true }, { status: 200 });

    } catch (error: any) {
        console.error("DELETE error:", error);
        return NextResponse.json({ message: "Failed to delete item: " + error.message, alert: false }, { status: 500 });
    }
}

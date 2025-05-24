import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      status: "success",
      message: "Currency Detection API is running",
      timestamp: new Date().toISOString(),
      endpoints: {
        health: "/api/currency - GET",
        uploadImage: "/api/currency/upload - POST",
        modelInfo: "/api/currency/model-info - GET",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Server error",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        {
          status: "error",
          message: "No image file provided",
        },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid file type. Only JPEG, PNG, and WebP are allowed",
        },
        { status: 400 }
      );
    }

    // Validasi ukuran file (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          status: "error",
          message: "File size too large. Maximum 10MB allowed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Image uploaded successfully",
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
      note: "Image processing will be handled on client-side using TensorFlow.js",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to process upload",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PUT() {
  try {
    const modelInfo = {
      modelPath: "./model/model.json",
      supportedCurrencies: [
        "IDR 1.000",
        "IDR 2.000",
        "IDR 5.000",
        "IDR 10.000",
        "IDR 20.000",
        "IDR 50.000",
        "IDR 100.000",
      ],
      inputSize: {
        width: 224,
        height: 224,
        channels: 3,
      },
      framework: "TensorFlow.js",
      loadedOnClient: true,
      confidenceThreshold: 0.9,
      ensemblePredictions: 5,
    };

    return NextResponse.json({
      status: "success",
      modelInfo,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to get model info",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

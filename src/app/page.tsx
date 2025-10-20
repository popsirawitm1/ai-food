'use client';

import { useState } from "react";
import Image from "next/image";

interface PredictionResult {
  class: string;
  confidence: number;
}

interface ApiResponse {
  prediction: string | null;
  confidence: number;
  message?: string;
  not_in_database?: boolean;
  all_predictions: PredictionResult[];
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setPrediction(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      // แปลง base64 เป็น blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      // สร้าง FormData
      const formData = new FormData();
      formData.append('image', blob, 'image.jpg');

      // ใช้ API URL จาก environment variable หรือ localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // ส่งไปยัง API
      const apiResponse = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error('การทำนายล้มเหลว กรุณาลองใหม่อีกครั้ง');
      }

      const data: ApiResponse = await apiResponse.json();
      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🍜 ระบบทายชื่ออาหารไทย
          </h1>
          <p className="text-gray-600 text-lg">
            อัปโหลดรูปอาหารไทยแล้วให้ AI ทายชื่ออาหารให้คุณ
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Upload Section */}
          <div className="mb-8">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-3 border-dashed border-orange-300 rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              {selectedImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-16 h-16 mb-4 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-lg text-gray-700 font-semibold">
                    คลิกเพื่ือเลือกรูปภาพ
                  </p>
                  <p className="text-sm text-gray-500">
                    รองรับไฟล์ PNG, JPG หรือ JPEG
                  </p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handlePredict}
              disabled={!selectedImage || loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  กำลังทำนาย...
                </span>
              ) : (
                '🔮 ทายชื่ออาหาร'
              )}
            </button>
            {selectedImage && (
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setPrediction(null);
                  setError(null);
                }}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <p className="font-semibold">เกิดข้อผิดพลาด:</p>
              <p>{error}</p>
              <p className="text-sm mt-2">
                ⚠️ กรุณาตรวจสอบว่า Python API (api.py) กำลังทำงานที่ port 5000
              </p>
            </div>
          )}

          {/* Results */}
          {prediction && (
            <div className="space-y-6">
              {/* Not in Database Warning */}
              {prediction.not_in_database ? (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border-2 border-yellow-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-12 h-12 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        ⚠️ ไม่พบในฐานความรู้
                      </h2>
                      <p className="text-lg text-gray-700 mb-3">
                        {prediction.message || 'รูปภาพนี้ไม่ตรงกับอาหารไทยที่อยู่ในระบบ'}
                      </p>
                      <p className="text-sm text-gray-600">
                        ความมั่นใจสูงสุด: {(prediction.confidence * 100).toFixed(2)}% (ต่ำกว่าเกณฑ์ที่กำหนด)
                      </p>
                      <div className="mt-4 p-4 bg-white rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          📋 อาหารที่รองรับในระบบ:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>• ข้าวผัด</div>
                          <div>• แกงเขียวหวาน</div>
                          <div>• ข้าวซอย</div>
                          <div>• แกงมัสมั่น</div>
                          <div>• ผัดไทย</div>
                          <div>• พะแนง</div>
                          <div>• ผัดกะเพรา</div>
                          <div>• โรตี</div>
                          <div>• ต้มข่าไก่</div>
                          <div>• ต้มยำ</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Main Prediction - เมื่อพบในฐานความรู้ */
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    ผลการทำนาย
                  </h2>
                  <p className="text-4xl font-bold text-green-600 mb-2">
                    {prediction.prediction}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-lg font-semibold text-gray-700">
                      {(prediction.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}

              {/* All Predictions */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  ความเป็นไปได้ทั้งหมด (Top 5)
                </h3>
                <div className="space-y-3">
                  {prediction.all_predictions.map((pred, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {pred.class}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-orange-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${pred.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-16 text-right">
                            {(pred.confidence * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>พัฒนาด้วย Next.js + TensorFlow/Keras 🚀</p>
        </div>
      </div>
    </div>
  );
}

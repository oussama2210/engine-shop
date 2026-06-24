"use client";
import { FaUpload, FaFileArrowDown } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export default function BulkUploadPage() {
    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Bulk Upload</h1>
                <p className="text-sm text-gray-500 mt-1">Upload multiple products at once using a CSV file.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                {/* Template download */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Download CSV Template</p>
                        <p className="text-xs text-gray-400 mt-0.5">Use this template to format your products correctly</p>
                    </div>
                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-[#2a5b46] hover:underline">
                        <FaFileArrowDown />
                        Download
                    </button>
                </div>

                {/* Upload area */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Upload CSV</label>
                    <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                            <FaUpload className="text-2xl" />
                            <span className="text-sm">Click to select or drag & drop your CSV</span>
                            <span className="text-xs">Max 10 MB</span>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    className="rounded-full bg-[#2a5b46] text-white hover:bg-[#1e4433] px-8"
                >
                    Upload & Import
                </Button>
            </div>
        </div>
    );
}

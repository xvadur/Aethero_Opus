'use client';

export function MemoryExportButton() {
    const download = async () => {
        const res = await fetch('/api/diary/export');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aeth_mem_export.jsonl';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <button className="px-4 py-2 bg-green-500 text-white" onClick={download}>
            Export Memory Log
        </button>
    );
}

//# AETH: Allows user to download merged JSONL log via export API

"use client";

import * as XLSX from "xlsx";
import { useState } from "react";
import LoadedTable from "@/components/LoadedTable";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export type RowData = Array<number | string | null>;

export default function Page() {
    const [fileInfo, setFileInfo] = useState<File | null>(null);
    const [dataset, setDataset] = useState<RowData[] | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFileInfo(file);
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: null });
        const emptyRowIsRemoved = (json as RowData[]).filter((r: RowData) => !r.every((c) => c === null));
        console.log(emptyRowIsRemoved);
        setDataset(emptyRowIsRemoved);
      };
      reader.readAsArrayBuffer(file);
    
      e.target.value = "";
    };

    return (
      <main className="w-full flex flex-col items-center gap-10 h-screen py-20 px-10">
        <section className="self-start">
          <ul className="list-disc">
            <li>제목 행 필수</li>
            <li>숨긴 행은 업로드되지 않습니다.</li>
            <li>지원자 번호는 0번째 열에 있어야 합니다.</li>
            <li><span className="text-primary">Github 저장소 컬럼을 선택</span>하면 명령어가 생성됩니다.</li>
          </ul>
        </section>
        <div className="w-full">
          <Label
            htmlFor="fileInput"
            className="bg-primary w-50 p-4 my-0 mx-auto text-primary-foreground cursor-pointer hover:bg-primary/80 transition-colors flex items-center justify-center"
          >
            {fileInfo ? '다른 파일 업로드' : '파일 선택'}
          </Label>
          <input
            type="file"
            accept=".xlsx, .csv"
            id="fileInput"
            onChange={handleFile}
            className="hidden"
          />
          {fileInfo && <p className="text-center mt-6">{fileInfo.name}</p>}
        </div>
        {fileInfo && <Separator />}
        {dataset && <LoadedTable dataset={dataset} />}
      </main>
    );
}
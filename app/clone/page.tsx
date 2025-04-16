"use client";

import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import LoadedTable from "@/components/LoadedTable";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export type RowData = Array<number | string | null>;

export default function Page() {
    const [dataset, setDataset] = useState<RowData[] | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

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
    };

    return (
      <main className="w-full flex flex-col items-center gap-10 h-screen py-20 px-10">
        <section className="self-start">
          <ul className="list-disc">
            <li>숨긴 행은 업로드되지 않습니다.</li>
            <li>지원자 번호는 0번째 열에 있어야 합니다.</li>
            <li><span className="text-primary">Github 저장소 컬럼을 선택</span>하면 명령어가 생성됩니다.</li>
          </ul>
        </section>
        <div className="w-full">
          <Label htmlFor="fileInput" className="mb-4">파일 선택</Label>
          <Input type="file" accept=".xlsx, .csv" id="fileInput" onChange={handleFile} className="max-w-150" />
        </div>
        <Separator />
        {dataset && <LoadedTable dataset={dataset} />}
      </main>
    );
}